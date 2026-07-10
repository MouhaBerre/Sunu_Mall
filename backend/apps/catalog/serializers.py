from rest_framework import serializers
from .models import Category, Product, ProductImage, Store


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "parent", "name", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "minio_path", "position", "created_at"]


class StoreSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Store
        fields = [
            "id", "owner", "owner_email", "category", "name", "description",
            "logo", "banner", "status", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "owner", "status", "created_at", "updated_at", "owner_email"]


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
