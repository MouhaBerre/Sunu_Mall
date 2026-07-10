"""
Résolution de l'abonnement actif d'une boutique.

Subscription.subscriber_type / subscriber_id ne sont pas de vraies FK
(pas de GenericForeignKey) — on centralise ici la convention
"subscriber_type='store'" plutôt que de la disperser dans les vues.
"""
from django.utils import timezone
from .models import Subscription

STORE_SUBSCRIBER_TYPE = 'store'


def get_active_subscription_for_store(store):
    today = timezone.now().date()
    return (
        Subscription.objects
        .filter(
            subscriber_type=STORE_SUBSCRIBER_TYPE,
            subscriber_id=store.id,
            status=Subscription.Status.ACTIVE,
            starts_at__lte=today,
            ends_at__gte=today,
        )
        .select_related('plan')
        .order_by('-starts_at')
        .first()
    )


def is_store_premium(store):
    subscription = get_active_subscription_for_store(store)
    return bool(subscription and subscription.plan.is_premium())
