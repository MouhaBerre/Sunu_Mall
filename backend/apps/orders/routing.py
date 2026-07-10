from django.urls import re_path
from .consumers import DeliveryConsumer

websocket_urlpatterns = [
    re_path(r"^ws/orders/delivery/(?P<delivery_id>[0-9a-f-]+)/$", DeliveryConsumer.as_asgi()),
]
