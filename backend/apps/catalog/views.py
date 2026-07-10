from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Store
from .serializers import CategorySerializer, ProductSerializer, StoreSerializer
from apps.users.permissions import IsAdmin, IsOwnerOrAdmin
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
    Lecture publique (un acheteur doit pouvoir parcourir le catalogue
    sans être connecté), écriture réservée aux utilisateurs authentifiés
    (à affiner : un vendeur ne devrait modifier que ses propres produits).
    """

    queryset = Product.objects.filter(status=Product.Status.ACTIVE)
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["store", "category", "status"]
    search_fields = ["name", "description"]

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
        elif self.action in ("update", "partial_update", "destroy"):
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        elif self.action in ("approve", "reject"):
            permission_classes = [permissions.IsAuthenticated, IsAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status=Store.Status.INACTIVE)

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
