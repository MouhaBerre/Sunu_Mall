"""
Alerte le commerçant par notification + email quand le stock d'un variant
passe sous son seuil d'alerte (Inventory.low_stock_threshold). On ne
notifie qu'au moment où le stock *passe* sous le seuil, pas à chaque
sauvegarde tant qu'il y reste, pour éviter de spammer.
"""
from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Inventory
from apps.monetization.models import Notification


@receiver(pre_save, sender=Inventory)
def _capture_previous_stock_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            previous = Inventory.objects.get(pk=instance.pk)
            instance._was_low_stock = previous.is_low_stock()
        except Inventory.DoesNotExist:
            instance._was_low_stock = False
    else:
        instance._was_low_stock = False


@receiver(post_save, sender=Inventory)
def _notify_on_low_stock_transition(sender, instance, created, **kwargs):
    was_low_stock = getattr(instance, '_was_low_stock', False)
    if instance.is_low_stock() and not was_low_stock:
        _send_low_stock_alert(instance)


def _send_low_stock_alert(inventory):
    variant = inventory.variant
    store = variant.product.store
    subject = f"Stock bas : {variant.product.name} ({variant.sku})"
    message = (
        f"Bonjour {store.owner.first_name},\n\n"
        f"Le stock du produit '{variant.product.name}' (SKU {variant.sku}) "
        f"est descendu à {inventory.available()} unité(s), sous le seuil "
        f"d'alerte de {inventory.low_stock_threshold}.\n\n"
        "Pensez à le réapprovisionner sur SUNU MALL."
    )
    Notification.objects.create(
        user=store.owner,
        channel=Notification.Channel.EMAIL,
        subject=subject,
        message=message,
        status=Notification.Status.PENDING,
        metadata={
            "variant_id": str(variant.id),
            "available": inventory.available(),
            "low_stock_threshold": inventory.low_stock_threshold,
        },
    )
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [store.owner.email],
            fail_silently=True,
        )
    except Exception:
        pass
