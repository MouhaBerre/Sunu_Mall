from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Q
from django.utils import timezone
from .models import Brand, Category, Inventory, Product, ProductImage, ProductVariant, Store
from .serializers import (
    BrandSerializer, CategorySerializer, CategoryTreeSerializer, InventorySerializer,
    InventoryWriteSerializer, ProductImageSerializer, ProductSerializer,
    ProductVariantSerializer, ProductVariantWriteSerializer, StorePublicSerializer,
    StoreSerializer,
)
from .filters import ProductFilter
from .images import process_and_store_image, process_single_image
from apps.users.models import Role
from apps.users.permissions import IsAdmin, IsOwnerOrAdmin, IsStoreOwnerOrAdmin
from .permissions import CanCreateProduct, CanCreateStore
from apps.monetization.models import Notification, SponsoredProduct
from django.core.mail import send_mail
from django.conf import settings


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = []

    @action(detail=False, methods=["get"], url_path="tree")
    def tree(self, request):
        roots = Category.objects.filter(parent__isnull=True)
        return Response(CategoryTreeSerializer(roots, many=True).data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    Lecture publique limitée aux produits actifs ; un commerçant authentifié
    voit en plus ses propres produits quel que soit leur statut (brouillon
    compris). Écriture réservée aux commerçants sur leurs propres boutiques.
    """

    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description"]
    ordering_fields = ["base_price", "created_at"]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and (
            user.has_role(Role.RoleName.MERCHANT) or user.has_role(Role.RoleName.ADMIN)
        ):
            return Product.objects.filter(Q(status=Product.Status.ACTIVE) | Q(store__owner=user))
        return Product.objects.filter(status=Product.Status.ACTIVE)

    def get_permissions(self):
        if self.action in (
            "upload_image", "delete_image", "update", "partial_update",
            "destroy", "add_variant", "variant_detail", "variant_inventory",
        ):
            permission_classes = [permissions.IsAuthenticated, IsStoreOwnerOrAdmin]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated, CanCreateProduct]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        store = serializer.validated_data.get("store")
        user = self.request.user
        is_owner = store is not None and store.owner_id == user.id
        if not (user.has_role(Role.RoleName.ADMIN) or is_owner):
            raise PermissionDenied("Vous ne pouvez créer un produit que pour votre propre boutique.")
        serializer.save()

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

    @action(detail=True, methods=["post"], url_path="variants")
    def add_variant(self, request, pk=None):
        product = self.get_object()
        serializer = ProductVariantWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        variant = serializer.save(product=product)
        try:
            quantity = int(request.data.get("quantity", 0) or 0)
        except (TypeError, ValueError):
            quantity = 0
        Inventory.objects.create(variant=variant, quantity=quantity)
        return Response(ProductVariantSerializer(variant).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch", "delete"], url_path=r"variants/(?P<variant_id>[^/.]+)")
    def variant_detail(self, request, pk=None, variant_id=None):
        product = self.get_object()
        variant = product.variants.filter(id=variant_id).first()
        if not variant:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if request.method == "DELETE":
            variant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer = ProductVariantWriteSerializer(variant, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ProductVariantSerializer(variant).data)

    @action(detail=True, methods=["patch"], url_path=r"variants/(?P<variant_id>[^/.]+)/inventory")
    def variant_inventory(self, request, pk=None, variant_id=None):
        product = self.get_object()
        variant = product.variants.filter(id=variant_id).first()
        if not variant or not hasattr(variant, "inventory"):
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InventoryWriteSerializer(variant.inventory, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(InventorySerializer(variant.inventory).data)


class BrandViewSet(viewsets.ModelViewSet):
    """Marques : lecture publique, ajout/édition par un utilisateur authentifié."""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class StoreViewSet(viewsets.ModelViewSet):
    """
    Boutiques : lecture publique, création self-service par un commerçant
    (créée en statut 'inactive', en attente de validation admin via
    approve/reject), modification réservée au propriétaire ou à l'admin.
    """
    serializer_class = StoreSerializer

    def get_queryset(self):
        if self.action not in ("list", "retrieve"):
            return Store.objects.all()
        user = self.request.user
        if user and user.is_authenticated:
            if user.has_role(Role.RoleName.ADMIN):
                return Store.objects.all()
            # Lecture publique = boutiques actives, + les siennes pour qu'un
            # commerçant puisse suivre sa boutique en attente de validation.
            return Store.objects.filter(Q(status=Store.Status.ACTIVE) | Q(owner=user))
        return Store.objects.filter(status=Store.Status.ACTIVE)

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return StorePublicSerializer
        return StoreSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated, CanCreateStore]
        elif self.action in ("update", "partial_update", "destroy", "upload_logo", "upload_banner", "low_stock"):
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

    @action(detail=True, methods=["get"], url_path="low-stock")
    def low_stock(self, request, pk=None):
        store = self.get_object()
        variants = ProductVariant.objects.filter(product__store=store).select_related("inventory", "product")
        low_variants = [v for v in variants if hasattr(v, "inventory") and v.inventory.is_low_stock()]
        return Response(ProductVariantSerializer(low_variants, many=True).data)

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


class HomeAPIView(APIView):
    """Page d'accueil publique : blocs mis en avant, nouveautés, top notes, catégories."""
    permission_classes = [permissions.AllowAny]
    BLOCK_SIZE = 8

    def get(self, request):
        active_products = Product.objects.filter(status=Product.Status.ACTIVE)
        today = timezone.now().date()

        sponsored_product_ids = SponsoredProduct.objects.filter(
            status=SponsoredProduct.Status.ACTIVE,
            starts_at__lte=today,
            ends_at__gte=today,
        ).values_list("product_id", flat=True)
        featured = active_products.filter(id__in=sponsored_product_ids)[:self.BLOCK_SIZE]

        new_arrivals = active_products.order_by("-created_at")[:self.BLOCK_SIZE]

        top_rated = (
            active_products
            .annotate(avg_rating=Avg("reviews__rating"))
            .filter(avg_rating__isnull=False)
            .order_by("-avg_rating")[:self.BLOCK_SIZE]
        )

        categories = Category.objects.filter(parent__isnull=True)

        return Response({
            "featured": ProductSerializer(featured, many=True).data,
            "new_arrivals": ProductSerializer(new_arrivals, many=True).data,
            "top_rated": ProductSerializer(top_rated, many=True).data,
            "categories": CategoryTreeSerializer(categories, many=True).data,
        })
