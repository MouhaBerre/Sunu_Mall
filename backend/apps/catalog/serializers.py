from django.core.files.storage import default_storage
from rest_framework import serializers
from .models import Brand, Category, Inventory, Product, ProductImage, ProductVariant, Store


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "parent", "name", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "url", "thumbnail_url", "is_primary", "position", "created_at"]
        read_only_fields = fields

    def get_url(self, obj):
        return obj.get_signed_url()

    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()


class StoreSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    logo_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            "id", "owner", "owner_email", "category", "name", "description",
            "logo", "logo_url", "banner", "banner_url", "status", "created_at", "updated_at"
        ]
        read_only_fields = [
            "id", "owner", "status", "logo", "banner",
            "created_at", "updated_at", "owner_email",
        ]

    def get_logo_url(self, obj):
        return default_storage.url(obj.logo) if obj.logo else None

    def get_banner_url(self, obj):
        return default_storage.url(obj.banner) if obj.banner else None


class StorePublicSerializer(serializers.ModelSerializer):
    """
    Vue boutique publique : pas d'e-mail ni d'identité du propriétaire.
    Les produits de la boutique se consultent via
    GET /api/catalog/products/?store=<id>.
    """
    logo_url = serializers.SerializerMethodField()
    banner_url = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            "id", "category", "name", "description",
            "logo_url", "banner_url", "rating", "product_count", "created_at",
        ]
        read_only_fields = fields

    def get_logo_url(self, obj):
        return default_storage.url(obj.logo) if obj.logo else None

    def get_banner_url(self, obj):
        return default_storage.url(obj.banner) if obj.banner else None

    def get_rating(self, obj):
        return obj.calculate_rating()

    def get_product_count(self, obj):
        return obj.get_active_products().count()


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "logo_url", "created_at"]
        read_only_fields = ["id", "created_at"]


class InventorySerializer(serializers.ModelSerializer):
    available = serializers.SerializerMethodField()
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = ["id", "quantity", "reserved_quantity", "low_stock_threshold", "available", "is_low_stock"]
        read_only_fields = fields

    def get_available(self, obj):
        return obj.available()

    def get_is_low_stock(self, obj):
        return obj.is_low_stock()


class InventoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ["quantity", "low_stock_threshold"]


class ProductVariantSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ["id", "sku", "attributes", "price", "inventory", "created_at", "updated_at"]
        read_only_fields = ["id", "inventory", "created_at", "updated_at"]


class ProductVariantWriteSerializer(serializers.ModelSerializer):
    """Écriture directe (sku/attributes/price) — le produit est fixé par la vue."""

    class Meta:
        model = ProductVariant
        fields = ["sku", "attributes", "price"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, default=None)
    category_breadcrumb = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "store", "category", "category_breadcrumb", "brand", "brand_name",
            "name", "description", "base_price", "status", "images", "variants",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_category_breadcrumb(self, obj):
        if not obj.category:
            return []
        return [category.name for category in obj.category.get_breadcrumb()]
