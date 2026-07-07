from rest_framework import viewsets, permissions
from .models import User, Role, Permission, UserRole, RolePermission
from .serializers import (
    UserSerializer, RoleSerializer, PermissionSerializer,
    UserRoleSerializer, RolePermissionSerializer
)
from .permissions import IsAdmin


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD sur les utilisateurs. Seul l'admin peut modifier/supprimer.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lecture seule des rôles. Seul l'admin peut accéder.
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdmin]


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lecture seule des permissions. Seul l'admin peut accéder.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAdmin]


class UserRoleViewSet(viewsets.ModelViewSet):
    """
    Gestion des rôles des utilisateurs. Seul l'admin peut accéder.
    """
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAdmin]


class RolePermissionViewSet(viewsets.ModelViewSet):
    """
    Gestion des permissions des rôles. Seul l'admin peut accéder.
    """
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAdmin]
