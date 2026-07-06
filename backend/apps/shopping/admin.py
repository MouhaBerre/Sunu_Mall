from django.contrib import admin
from .models import Wishlist, WishlistItem, Cart, CartItem


admin.site.register(Wishlist)
admin.site.register(WishlistItem)
admin.site.register(Cart)
admin.site.register(CartItem)
