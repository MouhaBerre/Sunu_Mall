from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SellerProfileViewSet

router = DefaultRouter()
router.register("", UserViewSet, basename="user")
router.register("sellers", SellerProfileViewSet, basename="seller-profile")

urlpatterns = router.urls
