from django.urls import re_path
from .consumers import SalesConsumer

websocket_urlpatterns = [
    re_path(r"^ws/analytics/sales/admin/$", SalesConsumer.as_asgi()),
    re_path(r"^ws/analytics/sales/(?P<store_id>[0-9a-f-]+)/$", SalesConsumer.as_asgi()),
]
