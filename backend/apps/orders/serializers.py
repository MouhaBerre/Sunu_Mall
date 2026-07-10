from rest_framework import serializers
from .models import Delivery, DeliveryTracking, Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product_variant", "quantity", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_id = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "customer", "status", "total_amount", "items", "delivery_id", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_delivery_id(self, obj):
        delivery = getattr(obj, "delivery", None)
        return delivery.id if delivery else None


class DeliveryTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryTracking
        fields = ["id", "latitude", "longitude", "recorded_at"]
        read_only_fields = ["id", "recorded_at"]


class LocationInputSerializer(serializers.Serializer):
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ["id", "order", "driver", "status", "picked_up_at", "delivered_at", "created_at"]
        read_only_fields = fields


class ConfirmDeliverySerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, min_length=6)
