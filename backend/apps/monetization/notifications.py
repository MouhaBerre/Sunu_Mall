"""
Service de notification : crée les enregistrements Notification par
canal demandé puis enqueue leur envoi asynchrone (voir tasks.py).
"""
from .models import Notification, PushDevice

DEFAULT_CHANNELS_BY_EVENT = {
    "order_created": (Notification.Channel.EMAIL,),
    "payment_validated": (Notification.Channel.EMAIL,),
    "order_shipped": (Notification.Channel.EMAIL,),
    "order_delivered": (Notification.Channel.EMAIL,),
    "order_cancelled": (Notification.Channel.EMAIL,),
    "order_status_changed": (Notification.Channel.EMAIL,),
}


def notify(user, event_type, subject, message, channels=None, metadata=None):
    """
    Crée une Notification par canal demandé (en sautant les canaux sans
    coordonnées disponibles) et enqueue son envoi. Retourne les
    Notification créées.
    """
    from .tasks import send_notification

    channels = channels or DEFAULT_CHANNELS_BY_EVENT.get(event_type, (Notification.Channel.EMAIL,))
    metadata = metadata or {}

    created = []
    for channel in channels:
        if channel == Notification.Channel.SMS and not user.phone:
            continue
        if channel == Notification.Channel.PUSH and not PushDevice.objects.filter(user=user).exists():
            continue

        notification = Notification.objects.create(
            user=user,
            channel=channel,
            event_type=event_type,
            subject=subject,
            message=message,
            metadata=metadata,
        )
        send_notification.delay(str(notification.id))
        created.append(notification)

    return created
