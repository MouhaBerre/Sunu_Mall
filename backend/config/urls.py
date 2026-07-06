"""
Routes principales de l'API SUNU MALL.
Chaque app expose ses propres routes dans son fichier urls.py —
on les inclut ici sous un préfixe clair.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("apps.users.urls")),
    path("api/catalog/", include("apps.catalog.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/ia/", include("apps.ia.urls")),
]
