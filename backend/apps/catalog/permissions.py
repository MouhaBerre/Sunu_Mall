"""
Permissions spécifiques au catalogue, basées sur les codes de permission
RBAC déjà seedés (voir apps.users.models post_migrate).
"""
from apps.users.permissions import HasPermission


class CanCreateStore(HasPermission):
    required_permission = 'create_store'


class CanCreateProduct(HasPermission):
    required_permission = 'create_product'
    message = "Vous n'avez pas la permission de créer un produit."


class CanManageInventory(HasPermission):
    required_permission = 'manage_inventory'
