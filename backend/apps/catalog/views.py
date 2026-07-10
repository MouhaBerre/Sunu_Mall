from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Product, ProductImage, Store
from .serializers import CategorySerializer, ProductImageSerializer, ProductSerializer, StoreSerializer
from .images import process_and_store_image, process_single_image
from apps.users.models import Role
from apps.users.permissions import IsAdmin, IsOwnerOrAdmin, IsStoreOwnerOrAdmin
from .permissions import CanCreateStore
from apps.monetization.models import Notification
from django.core.mail import send_mail
from django.conf import settings


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = []


class ProductViewSet(viewsets.ModelViewSet):
    """
    Lecture publique limitée aux produits actifs ; un commerçant authentifié
    voit en plus ses propres produits quel que soit leur statut (brouillon
    compris). Écriture réservée aux commerçants sur leurs propres boutiques.
    """

    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["store", "category", "status"]
    search_fields = ["name", "description"]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and (
            user.has_role(Role.RoleName.MERCHANT) or user.has_role(Role.RoleName.ADMIN)
        ):
            return Product.objects.filter(Q(status=Product.Status.ACTIVE) | Q(store__owner=user))
        return Product.objects.filter(status=Product.Status.ACTIVE)

    def get_permissions(self):
        if self.action in ("upload_image", "delete_image"):
            permission_classes = [permissions.IsAuthenticated, IsStoreOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    @action(
        detail=True, methods=["post"], url_path="images",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, pk=None):
        product = self.get_object()
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "Fichier 'file' requis."}, status=status.HTTP_400_BAD_REQUEST)

        original_path, thumbnail_path = process_and_store_image(file, f"products/{product.id}")
        is_primary = str(request.data.get("is_primary", "false")).lower() == "true"
        if is_primary:
            product.images.update(is_primary=False)

        image = ProductImage.objects.create(
            product=product,
            minio_path=original_path,
            thumbnail_path=thumbnail_path,
            is_primary=is_primary,
            position=product.images.count(),
        )
        return Response(ProductImageSerializer(image).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path=r"images/(?P<image_id>[^/.]+)")
    def delete_image(self, request, pk=None, image_id=None):
        product = self.get_object()
        image = product.images.filter(id=image_id).first()
        if not image:
            return Response(status=status.HTTP_404_NOT_FOUND)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StoreViewSet(viewsets.ModelViewSet):
    """
    Boutiques : lecture publique, création self-service par un commerçant
    (créée en statut 'inactive', en attente de validation admin via
    approve/reject), modification réservée au propriétaire ou à l'admin.
    """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated, CanCreateStore]
        elif self.action in ("update", "partial_update", "destroy", "upload_logo", "upload_banner"):
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        elif self.action in ("approve", "reject"):
            permission_classes = [permissions.IsAuthenticated, IsAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status=Store.Status.INACTIVE)

    @action(
        detail=True, methods=["post"], url_path="logo",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_logo(self, request, pk=None):
        store = self.get_object()
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "Fichier 'file' requis."}, status=status.HTTP_400_BAD_REQUEST)
        store.logo = process_single_image(file, f"stores/{store.id}/logo")
        store.save(update_fields=["logo"])
        return Response(self.get_serializer(store).data)

    @action(
        detail=True, methods=["post"], url_path="banner",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_banner(self, request, pk=None):
        store = self.get_object()
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "Fichier 'file' requis."}, status=status.HTTP_400_BAD_REQUEST)
        store.banner = process_single_image(file, f"stores/{store.id}/banner", max_size=(1600, 500))
        store.save(update_fields=["banner"])
        return Response(self.get_serializer(store).data)

    def _notify_owner(self, store, subject, message):
        Notification.objects.create(
            user=store.owner,
            channel=Notification.Channel.EMAIL,
            subject=subject,
            message=message,
            status=Notification.Status.PENDING,
            metadata={"store_id": str(store.id), "store_status": store.status}
        )
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [store.owner.email],
                fail_silently=True,
            )
        except Exception:
            pass

    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        store = self.get_object()
        store.status = Store.Status.ACTIVE
        store.save()
        subject = f"Boutique '{store.name}' approuvée"
        message = (
            f"Bonjour {store.owner.first_name},\n\n"
            f"Votre boutique '{store.name}' a été approuvée et est maintenant active sur SUNU MALL.\n\n"
            "Merci pour votre patience."
        )
        self._notify_owner(store, subject, message)
        serializer = self.get_serializer(store)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        store = self.get_object()
        reason = request.data.get("reason", "Votre boutique n'a pas été validée.")
        store.status = Store.Status.SUSPENDED
        store.save()
        subject = f"Boutique '{store.name}' rejetée"
        message = (
            f"Bonjour {store.owner.first_name},\n\n"
            f"Votre boutique '{store.name}' a été rejetée.\n"
            f"Raison : {reason}\n\n"
            "Merci de corriger les informations et de soumettre à nouveau."
        )
        self._notify_owner(store, subject, message)
        serializer = self.get_serializer(store)
        return Response(serializer.data, status=status.HTTP_200_OK)
