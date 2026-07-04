from rest_framework import serializers
from .models import RecommendationLog


class RecommendationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationLog
        fields = ["id", "user", "payload", "created_at"]
        read_only_fields = ["id", "created_at"]
