from rest_framework import mixins, permissions, viewsets

from .models import Notification, PushDevice
from .serializers import NotificationSerializer, PushDeviceSerializer


class NotificationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Notifications de l'utilisateur connecté (lecture seule)."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class PushDeviceViewSet(viewsets.ModelViewSet):
    """Enregistrement des tokens push par l'app mobile (PB-026)."""

    serializer_class = PushDeviceSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return PushDevice.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
