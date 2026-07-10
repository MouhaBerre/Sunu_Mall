from django.core.files.storage import default_storage
from rest_framework import serializers
from .models import Category, Product, ProductImage, Store


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


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "store", "category", "brand", "name", "description",
            "base_price", "status", "images",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
