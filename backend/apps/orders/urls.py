from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet, OrderViewSet

router = DefaultRouter()
router.register("deliveries", DeliveryViewSet, basename="delivery")
router.register("", OrderViewSet, basename="order")

urlpatterns = router.urls
