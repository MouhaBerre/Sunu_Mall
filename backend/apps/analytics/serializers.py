from rest_framework import serializers
from .models import Report, TrafficStatistic, SalesStatistic


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = [
            "id", "generated_by", "type", "period_start",
            "period_end", "minio_path", "data", "created_at"
        ]
        read_only_fields = ["id", "created_at"]


class TrafficStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficStatistic
        fields = [
            "id", "store", "date", "visits",
            "unique_visitors", "conversion_rate", "created_at"
        ]
        read_only_fields = ["id", "created_at"]


class SalesStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesStatistic
        fields = [
            "id", "store", "date", "total_sales",
            "total_orders", "avg_order_value", "created_at"
        ]
        read_only_fields = ["id", "created_at"]
