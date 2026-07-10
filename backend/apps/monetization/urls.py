from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, PushDeviceViewSet

router = DefaultRouter()
router.register("notifications", NotificationViewSet, basename="notification")
router.register("devices", PushDeviceViewSet, basename="push-device")

urlpatterns = router.urls
