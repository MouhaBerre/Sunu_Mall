from django.urls import path
from .views import WishlistItemView, WishlistView

urlpatterns = [
    path("wishlist/", WishlistView.as_view(), name="wishlist"),
    path("wishlist/<uuid:product_id>/", WishlistItemView.as_view(), name="wishlist-item"),
]
