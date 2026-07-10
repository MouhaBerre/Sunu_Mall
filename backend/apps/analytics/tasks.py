from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from apps.catalog.models import Store

from .models import SalesStatistic, TrafficStatistic


@shared_task
def rollup_daily_statistics():
    """
    Calcule les statistiques de la veille pour chaque boutique active et
    les enregistre dans SalesStatistic/TrafficStatistic (lecture rapide
    pour les tendances longues, sans rescanner les commandes brutes).
    """
    yesterday = timezone.now().date() - timedelta(days=1)
    for store in Store.objects.filter(status=Store.Status.ACTIVE):
        SalesStatistic.compute_for_store(store, yesterday)
        TrafficStatistic.compute_for_store(store, yesterday)
