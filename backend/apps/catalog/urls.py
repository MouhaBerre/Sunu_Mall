from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CategoryViewSet, HomeAPIView, ProductViewSet, StoreViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("brands", BrandViewSet, basename="brand")
router.register("products", ProductViewSet, basename="product")
router.register("stores", StoreViewSet, basename="store")

urlpatterns = [
    path("home/", HomeAPIView.as_view(), name="home"),
] + router.urls
