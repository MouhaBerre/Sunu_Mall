from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Product
from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistView(APIView):
    """Liste de souhaits du client connecté (créée à la volée si absente)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist).data)

    def post(self, request):
        product_id = request.data.get("product_id")
        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response({"detail": "Produit introuvable."}, status=status.HTTP_404_NOT_FOUND)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        wishlist.add_product(product)
        return Response(WishlistSerializer(wishlist).data, status=status.HTTP_201_CREATED)


class WishlistItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response(status=status.HTTP_404_NOT_FOUND)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        wishlist.remove_product(product)
        return Response(status=status.HTTP_204_NO_CONTENT)
