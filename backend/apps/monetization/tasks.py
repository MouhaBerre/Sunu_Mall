"""
Tâches Celery : envoi effectif d'une notification (avec retry) et
construction des messages pour les événements du cycle de vie d'une
commande, déclenchées par les signaux (voir signals.py).
"""
from celery import shared_task

from .models import Notification

ORDER_EVENT_MESSAGES = {
    "order_created": lambda order: (
        "Commande reçue",
        f"Votre commande #{order.id} a bien été enregistrée pour un montant de {order.total_amount} FCFA.",
    ),
    "payment_validated": lambda order: (
        "Paiement confirmé",
        f"Le paiement de votre commande #{order.id} a été confirmé.",
    ),
    "order_shipped": lambda order: (
        "Commande expédiée",
        f"Votre commande #{order.id} a été expédiée.",
    ),
    "order_delivered": lambda order: (
        "Commande livrée",
        f"Votre commande #{order.id} a été livrée. Merci pour votre confiance !",
    ),
    "order_cancelled": lambda order: (
        "Commande annulée",
        f"Votre commande #{order.id} a été annulée.",
    ),
    "order_status_changed": lambda order: (
        "Mise à jour de votre commande",
        f"Le statut de votre commande #{order.id} est désormais : {order.get_status_display()}.",
    ),
}


def _dispatch_notification(notification_id):
    """Logique pure, testable sans passer par le mécanisme de retry Celery."""
    notification = Notification.objects.select_related("user").get(pk=notification_id)
    try:
        notification.send()
    except Exception:
        notification.mark_failed()
        raise
    else:
        notification.mark_sent()


@shared_task(bind=True, autoretry_for=(Exception,), max_retries=3)
def send_notification(self, notification_id):
    _dispatch_notification(notification_id)


@shared_task
def notify_order_event(order_id, event_type):
    from apps.orders.models import Order

    from .notifications import notify

    order = Order.objects.select_related("customer").get(pk=order_id)
    subject, message = ORDER_EVENT_MESSAGES[event_type](order)
    notify(order.customer, event_type, subject, message, metadata={"order_id": str(order.id)})
