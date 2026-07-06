from django.contrib import admin
from .models import (
    StoreCategory, Store, StoreEmployee, StoreSettings,
    Category, Brand, Product, ProductImage,
    ProductVariant, Inventory, Review
)


admin.site.register(StoreCategory)
admin.site.register(Store)
admin.site.register(StoreEmployee)
admin.site.register(StoreSettings)
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(ProductVariant)
admin.site.register(Inventory)
admin.site.register(Review)
