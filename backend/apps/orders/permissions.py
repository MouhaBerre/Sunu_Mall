"""
Permissions liées au suivi de livraison.
"""
from rest_framework import permissions
from apps.users.models import Role


class IsAssignedDriver(permissions.BasePermission):
    """Autorise uniquement le livreur assigné à la livraison (ou l'admin)."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.has_role(Role.RoleName.DRIVER) or request.user.has_role(Role.RoleName.ADMIN))
        )

    def has_object_permission(self, request, view, obj):
        if request.user.has_role(Role.RoleName.ADMIN):
            return True
        return bool(obj.driver and obj.driver.user_id == request.user.id)


class IsDeliveryParticipant(permissions.BasePermission):
    """
    Autorise le client de la commande, le livreur assigné, le propriétaire
    de la boutique, ou l'admin — accès en lecture au suivi d'une livraison.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.has_role(Role.RoleName.ADMIN):
            return True
        if obj.order.customer_id == user.id:
            return True
        if obj.driver and obj.driver.user_id == user.id:
            return True
        if obj.order.store.owner_id == user.id:
            return True
        return False
