from rest_framework import serializers
from .models import User, SellerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone_number", "created_at"]
        read_only_fields = ["id", "created_at"]


class SellerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SellerProfile
        fields = ["id", "user", "shop_name", "shop_description", "is_verified"]
