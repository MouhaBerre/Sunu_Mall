from django.contrib import admin
from .models import (
    StoreCategory, Store, StoreEmployee, StoreSettings,
    Category, Brand, Product, ProductImage,
    ProductVariant, Inventory, Review
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class InventoryInline(admin.StackedInline):
    model = Inventory
    max_num = 1
    can_delete = False


class StoreCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'category')
    search_fields = ('name', 'owner__email', 'owner__first_name', 'owner__last_name')
    autocomplete_fields = ('owner', 'category')


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'category', 'brand', 'status', 'base_price', 'created_at')
    list_filter = ('status', 'created_at', 'category', 'brand', 'store')
    search_fields = ('name', 'description')
    autocomplete_fields = ('store', 'category', 'brand')
    inlines = [ProductImageInline, ProductVariantInline]


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'created_at', 'updated_at')
    list_filter = ('parent', 'created_at')
    search_fields = ('name',)
    autocomplete_fields = ('parent',)


class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment',)
    autocomplete_fields = ('product', 'user')


admin.site.register(StoreCategory, StoreCategoryAdmin)
admin.site.register(Store, StoreAdmin)
admin.site.register(StoreEmployee)
admin.site.register(StoreSettings)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
admin.site.register(ProductVariant)
admin.site.register(Inventory)
admin.site.register(Review, ReviewAdmin)
