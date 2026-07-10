from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from apps.catalog.models import Store
from apps.monetization.permissions import IsPremiumStoreOwner
from apps.users.models import Role
from apps.users.permissions import IsAdmin

from . import services
from .models import PageView
from .serializers import PageViewSerializer


def resolve_store_for_request(request, store_id=None):
    """
    Résout la boutique concernée par la requête.
    Retourne (store, is_global) — is_global=True signifie "toutes boutiques",
    réservé aux admins qui n'ont pas précisé store_id.
    """
    is_admin = request.user.has_role(Role.RoleName.ADMIN)
    if store_id:
        store = get_object_or_404(Store, pk=store_id)
        if not is_admin and store.owner_id != request.user.id:
            raise PermissionDenied("Vous n'avez pas accès à cette boutique.")
        return store, False

    if is_admin:
        return None, True

    store = Store.objects.filter(owner=request.user).first()
    if not store:
        raise PermissionDenied("Aucune boutique associée à ce compte.")
    return store, False


class SellerOverviewView(APIView):
    """PB-041 — Statistiques Premium."""

    permission_classes = [IsPremiumStoreOwner]

    def get(self, request):
        store_id = request.query_params.get("store_id")
        store = get_object_or_404(Store, pk=store_id) if store_id else Store.objects.filter(owner=request.user).first()
        if not store:
            return Response({"detail": "Aucune boutique associée à ce compte."}, status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request, store)

        date_from, date_to = services.resolve_period(request)
        summary = services.sales_summary(store=store, date_from=date_from, date_to=date_to)
        return Response({
            "store_id": store.id,
            "period": {"date_from": date_from, "date_to": date_to},
            **summary,
            "monthly_revenue": services.monthly_revenue_trend(store),
            "sales_by_category": services.revenue_by_category(store=store, date_from=date_from, date_to=date_to),
        })


class AdminOverviewView(APIView):
    """PB-042 — Tableau analytique admin."""

    permission_classes = [IsAdmin]

    def get(self, request):
        date_from, date_to = services.resolve_period(request)
        return Response({
            "period": {"date_from": date_from, "date_to": date_to},
            **services.admin_overview(date_from=date_from, date_to=date_to),
        })


class BestSellersView(APIView):
    """PB-043 — Produits les plus vendus."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        store, is_global = resolve_store_for_request(request, request.query_params.get("store_id"))
        date_from, date_to = services.resolve_period(request)
        limit = int(request.query_params.get("limit", 10))
        results = services.best_selling_products(store=store, date_from=date_from, date_to=date_to, limit=limit)
        return Response({"period": {"date_from": date_from, "date_to": date_to}, "results": results})


class TopRatedView(APIView):
    """PB-044 — Produits les mieux notés."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        store, is_global = resolve_store_for_request(request, request.query_params.get("store_id"))
        limit = int(request.query_params.get("limit", 10))
        min_reviews = int(request.query_params.get("min_reviews", 1))
        results = services.top_rated_products(store=store, min_reviews=min_reviews, limit=limit)
        return Response({"results": results})


class TrendsView(APIView):
    """PB-045 — Tendances."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        dimension = request.query_params.get("dimension", "category")
        if dimension not in ("category", "product", "store"):
            return Response({"detail": "dimension invalide."}, status=status.HTTP_400_BAD_REQUEST)
        date_from, date_to = services.resolve_period(request)
        limit = int(request.query_params.get("limit", 10))
        results = services.trending(dimension=dimension, date_from=date_from, date_to=date_to, limit=limit)
        return Response({"dimension": dimension, "period": {"date_from": date_from, "date_to": date_to}, "results": results})


class TrafficView(APIView):
    """PB-046 — Fréquentation."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        store, is_global = resolve_store_for_request(request, request.query_params.get("store_id"))
        date_from, date_to = services.resolve_period(request)
        return Response({
            "period": {"date_from": date_from, "date_to": date_to},
            **services.traffic_summary(store=store, date_from=date_from, date_to=date_to),
        })


class TrackPageViewThrottle(AnonRateThrottle):
    rate = "120/minute"


class TrackPageViewView(APIView):
    """PB-046 (ingestion) — enregistre une vue de page envoyée par le frontend."""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [TrackPageViewThrottle]

    def post(self, request):
        serializer = PageViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        PageView.objects.create(
            **serializer.validated_data,
            user=request.user if request.user.is_authenticated else None,
            referrer=request.META.get("HTTP_REFERER", ""),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response(status=status.HTTP_201_CREATED)


class LiveSalesSnapshotView(APIView):
    """PB-047 — instantané initial avant connexion WebSocket."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        store, is_global = resolve_store_for_request(request, request.query_params.get("store_id"))
        today = timezone.now().date()
        return Response(services.sales_summary(store=store, date_from=today, date_to=today))
