from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import services
from .models import Delivery, DeliveryTracking, Order
from .permissions import IsAssignedDriver, IsDeliveryParticipant
from .serializers import (
    ConfirmDeliverySerializer,
    DeliverySerializer,
    DeliveryTrackingSerializer,
    LocationInputSerializer,
    OrderSerializer,
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    Un acheteur ne devrait voir que ses propres commandes, un vendeur
    devrait voir les commandes contenant ses produits — à affiner
    avec un queryset filtré selon request.user une fois le backlog
    précis disponible. Pour l'instant : authentification requise.
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


class DeliveryViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Suivi de livraison : position GPS, ETA, trajet, cycle de vie, confirmation OTP."""

    queryset = Delivery.objects.select_related("order", "order__store", "order__address", "driver", "driver__user")
    serializer_class = DeliverySerializer

    DRIVER_ONLY_ACTIONS = ("accept", "decline", "status_update", "confirm")

    def get_permissions(self):
        if self.action in self.DRIVER_ONLY_ACTIONS:
            return [permissions.IsAuthenticated(), IsAssignedDriver()]
        if self.action == "location" and self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsAssignedDriver()]
        if self.action == "mine":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsDeliveryParticipant()]

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False)
    def mine(self, request):
        driver = getattr(request.user, "driver_profile", None)
        if not driver:
            return Response({"detail": "Aucun profil livreur."}, status=status.HTTP_403_FORBIDDEN)
        deliveries = Delivery.objects.filter(driver=driver).exclude(status=Delivery.Status.DELIVERED)
        return Response(DeliverySerializer(deliveries, many=True).data)

    @action(detail=True, methods=["get", "post"])
    def location(self, request, pk=None):
        delivery = self.get_object()

        if request.method == "POST":
            serializer = LocationInputSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            tracking = DeliveryTracking.objects.create(delivery=delivery, **serializer.validated_data)
            tracking.broadcast()
            return Response(DeliveryTrackingSerializer(tracking).data, status=status.HTTP_201_CREATED)

        tracking = delivery.trackings.first()
        if not tracking:
            return Response({"detail": "Aucune position enregistrée."}, status=status.HTTP_404_NOT_FOUND)
        return Response(DeliveryTrackingSerializer(tracking).data)

    @action(detail=True)
    def eta(self, request, pk=None):
        delivery = self.get_object()
        return Response({"eta_minutes": services.estimate_eta_for_delivery(delivery)})

    @action(detail=True)
    def route(self, request, pk=None):
        delivery = self.get_object()
        return Response(services.build_route(delivery))

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        # La livraison est déjà ASSIGNED par assign_driver() ; ceci confirme
        # simplement que le livreur a bien vu/accepté la mission.
        delivery = self.get_object()
        return Response(DeliverySerializer(delivery).data)

    @action(detail=True, methods=["post"])
    def decline(self, request, pk=None):
        delivery = self.get_object()
        delivery.driver = None
        delivery.status = Delivery.Status.PENDING
        delivery.save()
        return Response(DeliverySerializer(delivery).data)

    @action(detail=True, methods=["post"], url_path="status")
    def status_update(self, request, pk=None):
        delivery = self.get_object()
        new_status = request.data.get("status")
        if new_status == Delivery.Status.PICKED_UP:
            delivery.mark_picked_up()
        elif new_status == Delivery.Status.CANCELLED:
            delivery.status = Delivery.Status.CANCELLED
            delivery.save()
        else:
            return Response({"detail": "Statut invalide."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(DeliverySerializer(delivery).data)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        delivery = self.get_object()
        serializer = ConfirmDeliverySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        confirmation = getattr(delivery, "confirmation", None)
        if not confirmation or not confirmation.is_valid(serializer.validated_data["code"]):
            return Response({"detail": "Code invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

        confirmation.mark_used()
        delivery.mark_delivered()
        delivery.order.change_status(Order.Status.DELIVERED)
        return Response(DeliverySerializer(delivery).data)
