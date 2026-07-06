from rest_framework.routers import DefaultRouter
from .views import RecommendationViewSet

router = DefaultRouter()
router.register("recommendations", RecommendationViewSet, basename="recommendation")

urlpatterns = router.urls
