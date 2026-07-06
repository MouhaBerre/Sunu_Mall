from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD basique sur les utilisateurs.
    À affiner selon le backlog : qui peut voir/modifier quoi
    (un acheteur ne devrait sans doute voir que son propre profil).
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
