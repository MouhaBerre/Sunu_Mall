from rest_framework import viewsets, permissions
from .models import User, SellerProfile
from .serializers import UserSerializer, SellerProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD basique sur les utilisateurs.
    À affiner selon le backlog : qui peut voir/modifier quoi
    (un acheteur ne devrait sans doute voir que son propre profil).
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class SellerProfileViewSet(viewsets.ModelViewSet):
    queryset = SellerProfile.objects.all()
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
