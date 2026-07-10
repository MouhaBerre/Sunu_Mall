"""
Tests pour les agrégations analytics (PB-041 à PB-047).

Écrit après coup suite à un bug trouvé en vérification manuelle
(admin_overview() plantait : alias 'store_id' en conflit avec le champ
réel du modèle Order) — cette suite couvre désormais les chemins
d'agrégation réels sur base de données plutôt que de s'appuyer
uniquement sur les tests des autres apps.
"""
from datetime import date, timedelta
from unittest.mock import MagicMock

from django.test import TestCase
from django.utils import timezone

from apps.catalog.models import Category, Product, ProductVariant, Review, Store
from apps.orders.models import Order, OrderItem
from apps.users.models import User

from . import services
from .models import PageView


def _make_user(username):
    return User.objects.create_user(username=username, email=f"{username}@example.com", password="testpass123")


def _make_store(owner, name="Boutique"):
    return Store.objects.create(owner=owner, name=name, status=Store.Status.ACTIVE)


def _make_product(store, category=None, name="Produit"):
    return Product.objects.create(store=store, category=category, name=name, base_price=10, status=Product.Status.ACTIVE)


def _make_variant(product, sku, price=10):
    return ProductVariant.objects.create(product=product, sku=sku, price=price)


def _make_order(customer, store, status=Order.Status.PAID, total_amount=10, days_ago=0):
    order = Order.objects.create(customer=customer, store=store, status=status, total_amount=total_amount)
    if days_ago:
        Order.objects.filter(pk=order.pk).update(created_at=timezone.now() - timedelta(days=days_ago))
        order.refresh_from_db()
    return order


class SalesSummaryTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer1")
        self.store = _make_store(_make_user("owner1"))

    def test_sales_summary_counts_only_validated_orders(self):
        today = timezone.now().date()
        _make_order(self.customer, self.store, status=Order.Status.PAID, total_amount=100)
        _make_order(self.customer, self.store, status=Order.Status.DELIVERED, total_amount=50)
        _make_order(self.customer, self.store, status=Order.Status.CANCELLED, total_amount=999)
        _make_order(self.customer, self.store, status=Order.Status.PENDING, total_amount=999)

        summary = services.sales_summary(store=self.store, date_from=today, date_to=today)
        self.assertEqual(summary["revenue"], 150)
        self.assertEqual(summary["order_count"], 2)
        self.assertEqual(summary["avg_order_value"], 75)

    def test_sales_summary_conversion_rate_uses_page_views(self):
        today = timezone.now().date()
        _make_order(self.customer, self.store, status=Order.Status.PAID, total_amount=100)
        for _ in range(4):
            PageView.objects.create(store=self.store, path="/produit/1", session_key="s1")

        summary = services.sales_summary(store=self.store, date_from=today, date_to=today)
        self.assertEqual(summary["conversion_rate"], 25.0)

    def test_sales_summary_empty_period_returns_zeroes(self):
        today = timezone.now().date()
        summary = services.sales_summary(store=self.store, date_from=today, date_to=today)
        self.assertEqual(summary["revenue"], 0)
        self.assertEqual(summary["order_count"], 0)
        self.assertEqual(summary["avg_order_value"], 0)
        self.assertEqual(summary["conversion_rate"], 0)


class RevenueByCategoryTests(TestCase):
    def test_groups_revenue_by_category(self):
        customer = _make_user("customer2")
        store = _make_store(_make_user("owner2"))
        category = Category.objects.create(name="Mode")
        product = _make_product(store, category=category)
        variant = _make_variant(product, "SKU-1", price=20)
        order = _make_order(customer, store, status=Order.Status.PAID)
        OrderItem.objects.create(order=order, product_variant=variant, quantity=3, unit_price=20)

        today = timezone.now().date()
        rows = services.revenue_by_category(store=store, date_from=today, date_to=today)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["category_name"], "Mode")
        self.assertEqual(rows[0]["revenue"], 60)
        self.assertEqual(rows[0]["quantity"], 3)


class BestSellingProductsTests(TestCase):
    def test_orders_by_quantity_descending(self):
        customer = _make_user("customer3")
        store = _make_store(_make_user("owner3"))
        product_a = _make_product(store, name="A")
        product_b = _make_product(store, name="B")
        variant_a = _make_variant(product_a, "SKU-A")
        variant_b = _make_variant(product_b, "SKU-B")
        order = _make_order(customer, store, status=Order.Status.PAID)
        OrderItem.objects.create(order=order, product_variant=variant_a, quantity=5, unit_price=10)
        OrderItem.objects.create(order=order, product_variant=variant_b, quantity=2, unit_price=10)

        today = timezone.now().date()
        results = services.best_selling_products(store=store, date_from=today, date_to=today, limit=10)
        self.assertEqual(results[0]["product_name"], "A")
        self.assertEqual(results[0]["total_quantity"], 5)
        self.assertEqual(results[1]["product_name"], "B")


class TopRatedProductsTests(TestCase):
    def test_averages_ratings_and_filters_by_min_reviews(self):
        store = _make_store(_make_user("owner4"))
        product = _make_product(store, name="Bien noté")
        reviewer1 = _make_user("reviewer1")
        reviewer2 = _make_user("reviewer2")
        Review.objects.create(product=product, user=reviewer1, rating=5)
        Review.objects.create(product=product, user=reviewer2, rating=3)

        results = services.top_rated_products(store=store, min_reviews=1, limit=10)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["avg_rating"], 4.0)
        self.assertEqual(results[0]["review_count"], 2)

        results_filtered = services.top_rated_products(store=store, min_reviews=3, limit=10)
        self.assertEqual(results_filtered, [])


class TrendingTests(TestCase):
    def test_growth_pct_compares_to_previous_period(self):
        customer = _make_user("customer5")
        store = _make_store(_make_user("owner5"))
        category = Category.objects.create(name="Beauté")
        product = _make_product(store, category=category)
        variant = _make_variant(product, "SKU-T")

        today = timezone.now().date()
        # Avec date_from=date_to=today (span de 1 jour), la période précédente
        # comparée est exactement "hier".
        previous_order = _make_order(customer, store, status=Order.Status.PAID, days_ago=1)
        OrderItem.objects.create(order=previous_order, product_variant=variant, quantity=2, unit_price=10)

        current_order = _make_order(customer, store, status=Order.Status.PAID, days_ago=0)
        OrderItem.objects.create(order=current_order, product_variant=variant, quantity=6, unit_price=10)

        results = services.trending(dimension="category", date_from=today, date_to=today, limit=10)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["quantity"], 6)
        self.assertEqual(results[0]["previous_quantity"], 2)
        self.assertEqual(results[0]["growth_pct"], 200.0)


class TrafficSummaryTests(TestCase):
    def test_classifies_devices_and_sources(self):
        store = _make_store(_make_user("owner6"))
        today = timezone.now().date()
        PageView.objects.create(store=store, path="/", session_key="s1", user_agent="Mozilla Mobi Android", referrer="")
        PageView.objects.create(store=store, path="/produit", session_key="s1", user_agent="Mozilla Mobi Android", referrer="")
        PageView.objects.create(store=store, path="/", session_key="s2", user_agent="Mozilla Desktop", referrer="https://www.google.com/search")

        summary = services.traffic_summary(store=store, date_from=today, date_to=today)
        self.assertEqual(summary["visits"], 3)
        self.assertEqual(summary["unique_visitors"], 2)
        self.assertEqual(summary["device_breakdown"]["mobile"], 2)
        self.assertEqual(summary["device_breakdown"]["desktop"], 1)
        self.assertEqual(summary["traffic_sources"]["search"], 1)
        self.assertEqual(summary["traffic_sources"]["direct"], 2)


class AdminOverviewTests(TestCase):
    """Régression : admin_overview() plantait avec
    'ValueError: The annotation store_id conflicts with a field on the model.'"""

    def test_admin_overview_does_not_raise_and_lists_top_stores(self):
        customer = _make_user("customer7")
        store1 = _make_store(_make_user("owner7"), name="Boutique 1")
        store2 = _make_store(_make_user("owner8"), name="Boutique 2")
        _make_order(customer, store1, status=Order.Status.PAID, total_amount=100)
        _make_order(customer, store2, status=Order.Status.PAID, total_amount=50)

        today = timezone.now().date()
        overview = services.admin_overview(date_from=today, date_to=today)

        self.assertEqual(overview["revenue"], 150)
        self.assertEqual(overview["order_count"], 2)
        self.assertEqual(len(overview["top_stores"]), 2)
        top = overview["top_stores"][0]
        self.assertIn("store_id", top)
        self.assertEqual(top["store_name"], "Boutique 1")
        self.assertEqual(top["revenue"], 100)


class ResolvePeriodTests(TestCase):
    def _request(self, params):
        request = MagicMock()
        request.query_params = params
        return request

    def test_today(self):
        today = timezone.now().date()
        date_from, date_to = services.resolve_period(self._request({"period": "today"}))
        self.assertEqual(date_from, today)
        self.assertEqual(date_to, today)

    def test_explicit_date_range_takes_priority(self):
        date_from, date_to = services.resolve_period(
            self._request({"date_from": "2026-01-01", "date_to": "2026-01-31", "period": "today"})
        )
        self.assertEqual(date_from, "2026-01-01")
        self.assertEqual(date_to, "2026-01-31")

    def test_default_is_30_days(self):
        today = timezone.now().date()
        date_from, date_to = services.resolve_period(self._request({}))
        self.assertEqual(date_to, today)
        self.assertEqual((today - date_from).days, 29)
