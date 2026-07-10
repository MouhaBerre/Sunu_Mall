"""
Canaux d'envoi de notifications (email/SMS/push).

Email est envoyé directement via Django (send_mail), déjà éprouvé par
apps/auth/utils.py. SMS et Push n'ont aucun fournisseur configuré dans
ce projet : ils passent par un backend "console" par défaut (logge au
lieu d'envoyer réellement), swappable via les settings
NOTIFICATION_SMS_BACKEND / NOTIFICATION_PUSH_BACKEND — même principe
que EMAIL_BACKEND de Django. Pour brancher un vrai fournisseur (Twilio,
Africa's Talking, Firebase Cloud Messaging...), il suffit d'écrire une
classe avec la même interface `send(notification)` et de pointer le
setting correspondant vers son chemin d'import.
"""
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.module_loading import import_string

logger = logging.getLogger(__name__)


class EmailChannel:
    def send(self, notification):
        context = {"subject": notification.subject, "message": notification.message, **notification.metadata}
        text_body = render_to_string("emails/notifications/generic.txt", context)
        html_body = render_to_string("emails/notifications/generic.html", context)
        send_mail(
            subject=notification.subject,
            message=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[notification.user.email],
            html_message=html_body,
            fail_silently=False,
        )


class ConsoleSmsBackend:
    """Backend par défaut : logge le SMS au lieu de l'envoyer. Aucun fournisseur configuré."""

    def send(self, notification):
        if not notification.user.phone:
            raise ValueError("Impossible d'envoyer un SMS : l'utilisateur n'a pas de numéro de téléphone.")
        logger.info("[SMS console] to=%s subject=%s message=%s", notification.user.phone, notification.subject, notification.message)


class ConsolePushBackend:
    """Backend par défaut : logge le push au lieu de l'envoyer. Aucun fournisseur configuré."""

    def send(self, notification):
        devices = list(notification.user.push_devices.all())
        if not devices:
            raise ValueError("Impossible d'envoyer un push : aucun appareil enregistré pour cet utilisateur.")
        for device in devices:
            logger.info("[Push console] token=%s subject=%s message=%s", device.token, notification.subject, notification.message)


_CHANNEL_REGISTRY = None


def get_channel(channel_name):
    global _CHANNEL_REGISTRY
    if _CHANNEL_REGISTRY is None:
        _CHANNEL_REGISTRY = {
            "email": EmailChannel(),
            "sms": import_string(settings.NOTIFICATION_SMS_BACKEND)(),
            "push": import_string(settings.NOTIFICATION_PUSH_BACKEND)(),
        }
    return _CHANNEL_REGISTRY[channel_name]
