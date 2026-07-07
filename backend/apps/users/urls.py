from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, RoleViewSet, PermissionViewSet,
    UserRoleViewSet, RolePermissionViewSet
)

router = DefaultRouter()
router.register("", UserViewSet, basename="user")
router.register("roles", RoleViewSet, basename="role")
router.register("permissions", PermissionViewSet, basename="permission")
router.register("user-roles", UserRoleViewSet, basename="userrole")
router.register("role-permissions", RolePermissionViewSet, basename="rolepermission")

urlpatterns = router.urls
