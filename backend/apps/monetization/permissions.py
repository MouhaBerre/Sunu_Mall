"""
Permissions liées à la monétisation (abonnements Premium).
"""
from rest_framework import permissions
from apps.users.models import Role
from .services import is_store_premium


class IsPremiumStoreOwner(permissions.BasePermission):
    """
    Autorise l'admin, ou le propriétaire de la boutique si celle-ci
    a un abonnement Premium/Premium+ actif.
    L'objet doit avoir un attribut 'store' ou en être une instance.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.has_role(Role.RoleName.ADMIN) or request.user.has_role(Role.RoleName.MERCHANT))
        )

    def has_object_permission(self, request, view, obj):
        if request.user.has_role(Role.RoleName.ADMIN):
            return True

        store = obj if obj.__class__.__name__ == 'Store' else getattr(obj, 'store', None)
        if not store or store.owner != request.user:
            return False
        return is_store_premium(store)
