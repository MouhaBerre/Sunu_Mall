import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.prod")

# get_asgi_application() doit être appelé avant d'importer quoi que ce soit
# qui touche aux modèles (routing/consumers), pour que les apps Django
# soient chargées en premier.
django_asgi_app = get_asgi_application()

from apps.analytics.routing import websocket_urlpatterns as analytics_ws_urlpatterns  # noqa: E402
from apps.analytics.ws_auth import JWTAuthMiddleware  # noqa: E402
from apps.orders.routing import websocket_urlpatterns as orders_ws_urlpatterns  # noqa: E402

websocket_urlpatterns = analytics_ws_urlpatterns + orders_ws_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(URLRouter(websocket_urlpatterns)),
})
