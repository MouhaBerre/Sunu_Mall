"""
Fonctions d'agrégation partagées par les vues, les tâches Celery et les
méthodes compute_for_store() des modèles de statistiques.

Toutes les fonctions sont pures (queryset in, dict/list out) pour rester
testables sans dépendre de requêtes HTTP.
"""
from datetime import timedelta

from django.db.models import Avg, Count, F, Q, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone

from apps.catalog.models import Category, Product, Review, Store
from apps.orders.models import Order, OrderItem

from .models import PageView, SalesStatistic

# Une commande "validée" = paiement confirmé (au-delà de PENDING, pas annulée).
VALIDATED_ORDER_STATUSES = [
    Order.Status.PAID,
    Order.Status.PROCESSING,
    Order.Status.SHIPPED,
    Order.Status.DELIVERED,
]

PERIOD_CHOICES = ("today", "7d", "30d", "month", "year")


def resolve_period(request):
    """Lit ?period= ou ?date_from=&date_to= sur la requête. Défaut: 30 derniers jours."""
    today = timezone.now().date()
    date_from = request.query_params.get("date_from")
    date_to = request.query_params.get("date_to")
    if date_from and date_to:
        return date_from, date_to

    period = request.query_params.get("period", "30d")
    if period == "today":
        return today, today
    if period == "7d":
        return today - timedelta(days=6), today
    if period == "month":
        return today.replace(day=1), today
    if period == "year":
        return today.replace(month=1, day=1), today
    # défaut / "30d"
    return today - timedelta(days=29), today


def _validated_orders(store=None, date_from=None, date_to=None):
    qs = Order.objects.filter(status__in=VALIDATED_ORDER_STATUSES)
    if store is not None:
        qs = qs.filter(store=store)
    if date_from is not None:
        qs = qs.filter(created_at__date__gte=date_from)
    if date_to is not None:
        qs = qs.filter(created_at__date__lte=date_to)
    return qs


def sales_summary(store=None, date_from=None, date_to=None):
    orders = _validated_orders(store, date_from, date_to)
    aggregates = orders.aggregate(revenue=Sum("total_amount"), order_count=Count("id"))
    revenue = aggregates["revenue"] or 0
    order_count = aggregates["order_count"] or 0
    avg_order_value = (revenue / order_count) if order_count else 0

    visits = PageView.objects.filter(created_at__date__gte=date_from, created_at__date__lte=date_to)
    if store is not None:
        visits = visits.filter(store=store)
    visit_count = visits.count()
    conversion_rate = (order_count / visit_count * 100) if visit_count else 0

    return {
        "revenue": revenue,
        "order_count": order_count,
        "avg_order_value": avg_order_value,
        "conversion_rate": round(conversion_rate, 2),
    }


def revenue_by_category(store=None, date_from=None, date_to=None):
    items = OrderItem.objects.filter(order__status__in=VALIDATED_ORDER_STATUSES)
    if store is not None:
        items = items.filter(order__store=store)
    if date_from is not None:
        items = items.filter(order__created_at__date__gte=date_from)
    if date_to is not None:
        items = items.filter(order__created_at__date__lte=date_to)

    rows = (
        items
        .values(category_id=F("product_variant__product__category_id"), category_name=F("product_variant__product__category__name"))
        .annotate(revenue=Sum(F("unit_price") * F("quantity")), quantity=Sum("quantity"))
        .order_by("-revenue")
    )
    return list(rows)


def monthly_revenue_trend(store, months=12):
    """Lit le rollup quotidien SalesStatistic plutôt que de rescanner les commandes brutes."""
    since = timezone.now().date().replace(day=1) - timedelta(days=31 * months)
    rows = (
        SalesStatistic.objects
        .filter(store=store, date__gte=since)
        .annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(revenue=Sum("total_sales"), order_count=Sum("total_orders"))
        .order_by("month")
    )
    return list(rows)


def best_selling_products(store=None, date_from=None, date_to=None, limit=10):
    items = OrderItem.objects.filter(order__status__in=VALIDATED_ORDER_STATUSES)
    if store is not None:
        items = items.filter(order__store=store)
    if date_from is not None:
        items = items.filter(order__created_at__date__gte=date_from)
    if date_to is not None:
        items = items.filter(order__created_at__date__lte=date_to)

    rows = (
        items
        .values(product_id=F("product_variant__product_id"), product_name=F("product_variant__product__name"))
        .annotate(total_quantity=Sum("quantity"), total_revenue=Sum(F("unit_price") * F("quantity")))
        .order_by("-total_quantity")[:limit]
    )
    return list(rows)


def top_rated_products(store=None, min_reviews=1, limit=10):
    qs = Product.objects.annotate(avg_rating=Avg("reviews__rating"), review_count=Count("reviews"))
    if store is not None:
        qs = qs.filter(store=store)
    qs = qs.filter(review_count__gte=min_reviews).order_by("-avg_rating", "-review_count")[:limit]
    return [
        {
            "product_id": p.id,
            "product_name": p.name,
            "avg_rating": round(p.avg_rating or 0, 2),
            "review_count": p.review_count,
        }
        for p in qs
    ]


def _period_span(date_from, date_to):
    from datetime import date as date_cls

    if isinstance(date_from, str):
        date_from = date_cls.fromisoformat(date_from)
    if isinstance(date_to, str):
        date_to = date_cls.fromisoformat(date_to)
    span = (date_to - date_from).days + 1
    previous_to = date_from - timedelta(days=1)
    previous_from = previous_to - timedelta(days=span - 1)
    return previous_from, previous_to


def trending(dimension="category", date_from=None, date_to=None, limit=10):
    """Compare la période demandée à la période précédente de même durée."""
    previous_from, previous_to = _period_span(date_from, date_to)

    if dimension == "product":
        group_field = "product_variant__product_id"
        name_field = "product_variant__product__name"
    elif dimension == "store":
        group_field = "order__store_id"
        name_field = "order__store__name"
    else:  # category
        group_field = "product_variant__product__category_id"
        name_field = "product_variant__product__category__name"

    def counts_for(d_from, d_to):
        items = OrderItem.objects.filter(
            order__status__in=VALIDATED_ORDER_STATUSES,
            order__created_at__date__gte=d_from,
            order__created_at__date__lte=d_to,
        )
        rows = items.values(key=F(group_field), label=F(name_field)).annotate(quantity=Sum("quantity"))
        return {row["key"]: row for row in rows}

    current = counts_for(date_from, date_to)
    previous = counts_for(previous_from, previous_to)

    results = []
    for key, row in current.items():
        prev_qty = previous.get(key, {}).get("quantity", 0)
        current_qty = row["quantity"]
        growth_pct = ((current_qty - prev_qty) / prev_qty * 100) if prev_qty else 100.0
        results.append({
            "id": key,
            "label": row["label"],
            "quantity": current_qty,
            "previous_quantity": prev_qty,
            "growth_pct": round(growth_pct, 2),
        })

    results.sort(key=lambda r: r["growth_pct"], reverse=True)
    return results[:limit]


def _classify_device(user_agent):
    ua = (user_agent or "").lower()
    if "tablet" in ua or "ipad" in ua:
        return "tablet"
    if "mobi" in ua:
        return "mobile"
    return "desktop"


def _classify_source(referrer):
    ref = (referrer or "").lower()
    if not ref:
        return "direct"
    if any(s in ref for s in ("google", "bing", "yahoo", "duckduckgo")):
        return "search"
    if any(s in ref for s in ("facebook", "instagram", "tiktok", "twitter", "x.com")):
        return "social"
    return "referral"


def traffic_summary(store=None, date_from=None, date_to=None):
    views = PageView.objects.filter(created_at__date__gte=date_from, created_at__date__lte=date_to)
    if store is not None:
        views = views.filter(store=store)

    visits = views.count()
    unique_visitors = views.values("session_key").distinct().count()

    device_breakdown = {"mobile": 0, "tablet": 0, "desktop": 0}
    source_breakdown = {"direct": 0, "search": 0, "social": 0, "referral": 0}
    for view in views.only("user_agent", "referrer"):
        device_breakdown[_classify_device(view.user_agent)] += 1
        source_breakdown[_classify_source(view.referrer)] += 1

    top_pages = list(
        views.values("path").annotate(views=Count("id")).order_by("-views")[:10]
    )

    return {
        "visits": visits,
        "unique_visitors": unique_visitors,
        "sessions": unique_visitors,
        "device_breakdown": device_breakdown,
        "traffic_sources": source_breakdown,
        "top_pages": top_pages,
    }


def admin_overview(date_from=None, date_to=None):
    from apps.users.models import User

    summary = sales_summary(store=None, date_from=date_from, date_to=date_to)

    top_stores = (
        _validated_orders(store=None, date_from=date_from, date_to=date_to)
        .values("store_id", store_name=F("store__name"))
        .annotate(revenue=Sum("total_amount"), order_count=Count("id"))
        .order_by("-revenue")[:10]
    )

    return {
        **summary,
        "total_products": Product.objects.filter(status=Product.Status.ACTIVE).count(),
        "total_users": User.objects.count(),
        "total_stores": Store.objects.filter(status=Store.Status.ACTIVE).count(),
        "top_stores": list(top_stores),
    }


def broadcast_sale(payment):
    """Pousse un instantané des ventes du jour aux groupes WebSocket concernés."""
    from asgiref.sync import async_to_sync
    from channels.layers import get_channel_layer

    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    store = payment.order.store
    today = timezone.now().date()
    snapshot = sales_summary(store=store, date_from=today, date_to=today)
    payload = {
        "type": "sales.update",
        "store_id": str(store.id),
        "order_id": str(payment.order.id),
        "amount": str(payment.amount),
        "today": snapshot,
    }

    async_to_sync(channel_layer.group_send)(f"sales_store_{store.id}", payload)
    async_to_sync(channel_layer.group_send)("sales_admin", payload)
