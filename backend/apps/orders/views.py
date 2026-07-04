from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer


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
