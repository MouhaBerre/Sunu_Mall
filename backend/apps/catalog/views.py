from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


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
