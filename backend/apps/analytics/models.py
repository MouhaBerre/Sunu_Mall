"""
Rapports et statistiques.
"""
import uuid
from django.db import models
from django.utils import timezone
from apps.users.models import User
from apps.catalog.models import Store


class Report(models.Model):
    class Type(models.TextChoices):
        SALES = 'sales', 'Sales'
        TRAFFIC = 'traffic', 'Traffic'
        INVENTORY = 'inventory', 'Inventory'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reports')
    type = models.CharField(max_length=50, choices=Type.choices)
    period_start = models.DateField()
    period_end = models.DateField()
    minio_path = models.CharField(max_length=255, blank=True)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @staticmethod
    def generate():
        # Implement report generation logic here
        pass

    def get_download_url(self):
        # Implement signed URL logic here
        return self.minio_path

    def __str__(self):
        return f"Report {self.id} - {self.type}"


class TrafficStatistic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='traffic_stats')
    date = models.DateField()
    visits = models.IntegerField(default=0)
    unique_visitors = models.IntegerField(default=0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['store', 'date']
        ordering = ['-date']

    @staticmethod
    def compute_for_store(store, date):
        from . import services

        traffic = services.traffic_summary(store=store, date_from=date, date_to=date)
        sales = services.sales_summary(store=store, date_from=date, date_to=date)
        obj, _ = TrafficStatistic.objects.update_or_create(
            store=store,
            date=date,
            defaults={
                "visits": traffic["visits"],
                "unique_visitors": traffic["unique_visitors"],
                "conversion_rate": sales["conversion_rate"],
            },
        )
        return obj

    def __str__(self):
        return f"Traffic {self.store.name} - {self.date}"


class SalesStatistic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='sales_stats')
    date = models.DateField()
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_orders = models.IntegerField(default=0)
    avg_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['store', 'date']
        ordering = ['-date']

    @staticmethod
    def compute_for_store(store, date):
        from . import services

        summary = services.sales_summary(store=store, date_from=date, date_to=date)
        obj, _ = SalesStatistic.objects.update_or_create(
            store=store,
            date=date,
            defaults={
                "total_sales": summary["revenue"],
                "total_orders": summary["order_count"],
                "avg_order_value": summary["avg_order_value"],
            },
        )
        return obj

    def __str__(self):
        return f"Sales {self.store.name} - {self.date}"


class PageView(models.Model):
    """Vue de page brute, utilisée pour calculer la fréquentation (PB-046)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, null=True, blank=True, related_name='page_views')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='page_views')
    path = models.CharField(max_length=500)
    session_key = models.CharField(max_length=100, db_index=True)
    referrer = models.CharField(max_length=500, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['store', 'created_at'])]

    def __str__(self):
        return f"PageView {self.path} ({self.session_key})"
