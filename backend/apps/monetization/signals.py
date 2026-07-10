"""
Bus d'événements (PB-048) : déclenche des notifications automatiquement
sur les transitions de statut Order/Payment, sans coupler orders/payments
à monetization — ces récepteurs vivent ici, connectés via
MonetizationConfig.ready(). orders/payments n'importent jamais ce module.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.orders.models import Order
from apps.payments.models import Payment

from .tasks import notify_order_event

_ORDER_EVENT_BY_STATUS = {
    Order.Status.SHIPPED: "order_shipped",
    Order.Status.DELIVERED: "order_delivered",
    Order.Status.CANCELLED: "order_cancelled",
}


@receiver(pre_save, sender=Order)
def _stash_previous_order_status(sender, instance, **kwargs):
    instance._previous_status = (
        Order.objects.filter(pk=instance.pk).values_list("status", flat=True).first() if instance.pk else None
    )


@receiver(post_save, sender=Order)
def _on_order_saved(sender, instance, created, **kwargs):
    if created:
        notify_order_event.delay(str(instance.pk), "order_created")
        return

    previous_status = getattr(instance, "_previous_status", None)
    if previous_status == instance.status:
        return
    if instance.status == Order.Status.PAID:
        # Géré par le signal Payment ci-dessous (payment_validated),
        # pour éviter d'envoyer deux fois la même information au client.
        return

    event_type = _ORDER_EVENT_BY_STATUS.get(instance.status, "order_status_changed")
    notify_order_event.delay(str(instance.pk), event_type)


@receiver(pre_save, sender=Payment)
def _stash_previous_payment_status(sender, instance, **kwargs):
    instance._previous_status = (
        Payment.objects.filter(pk=instance.pk).values_list("status", flat=True).first() if instance.pk else None
    )


@receiver(post_save, sender=Payment)
def _on_payment_saved(sender, instance, created, **kwargs):
    previous_status = getattr(instance, "_previous_status", None)
    if previous_status != instance.status and instance.status == Payment.Status.SUCCESS:
        notify_order_event.delay(str(instance.order_id), "payment_validated")
