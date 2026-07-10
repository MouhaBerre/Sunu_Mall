"""
Tests pour l'infrastructure de notifications (PB-026) et le bus
d'événements (PB-048).
"""
from unittest.mock import patch

from django.core import mail
from django.test import TestCase

from apps.catalog.models import Store
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.users.models import User

from .models import Notification, PushDevice
from .notifications import notify
from .tasks import _dispatch_notification


def _make_user(username, phone=""):
    return User.objects.create_user(username=username, email=f"{username}@example.com", password="testpass123", phone=phone)


def _make_store(owner):
    return Store.objects.create(owner=owner, name="Boutique test", status=Store.Status.ACTIVE)


class OrderEventSignalTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer1")
        self.store = _make_store(_make_user("owner1"))

    @patch("apps.monetization.signals.notify_order_event")
    def test_order_creation_triggers_order_created(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.delay.assert_called_once_with(str(order.pk), "order_created")

    @patch("apps.monetization.signals.notify_order_event")
    def test_status_change_to_shipped_triggers_order_shipped(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.reset_mock()
        order.change_status(Order.Status.SHIPPED)
        mock_task.delay.assert_called_once_with(str(order.pk), "order_shipped")

    @patch("apps.monetization.signals.notify_order_event")
    def test_status_change_to_delivered_triggers_order_delivered(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.reset_mock()
        order.change_status(Order.Status.DELIVERED)
        mock_task.delay.assert_called_once_with(str(order.pk), "order_delivered")

    @patch("apps.monetization.signals.notify_order_event")
    def test_status_change_to_cancelled_triggers_order_cancelled(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.reset_mock()
        order.change_status(Order.Status.CANCELLED)
        mock_task.delay.assert_called_once_with(str(order.pk), "order_cancelled")

    @patch("apps.monetization.signals.notify_order_event")
    def test_status_change_to_paid_is_skipped_in_favor_of_payment_signal(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.reset_mock()
        order.change_status(Order.Status.PAID)
        mock_task.delay.assert_not_called()

    @patch("apps.monetization.signals.notify_order_event")
    def test_other_status_change_triggers_generic_event(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.reset_mock()
        order.change_status(Order.Status.PROCESSING)
        mock_task.delay.assert_called_once_with(str(order.pk), "order_status_changed")

    @patch("apps.monetization.signals.notify_order_event")
    def test_save_without_status_change_does_not_retrigger(self, mock_task):
        order = Order.objects.create(customer=self.customer, store=self.store, total_amount=100)
        mock_task.reset_mock()
        order.save()
        mock_task.delay.assert_not_called()


class PaymentEventSignalTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer2")
        self.store = _make_store(_make_user("owner2"))
        # Le patch des méthodes de test ne couvre pas setUp() : on l'isole ici
        # pour ne pas publier une vraie tâche Celery "order_created" au passage.
        with patch("apps.monetization.signals.notify_order_event"):
            self.order = Order.objects.create(customer=self.customer, store=self.store, total_amount=50)

    @patch("apps.monetization.signals.notify_order_event")
    def test_payment_success_triggers_payment_validated(self, mock_task):
        payment = Payment.objects.create(order=self.order, amount=50, method="card")
        mock_task.reset_mock()
        payment.status = Payment.Status.SUCCESS
        payment.save()
        mock_task.delay.assert_called_once_with(str(self.order.pk), "payment_validated")

    @patch("apps.monetization.signals.notify_order_event")
    def test_payment_failure_does_not_trigger_payment_validated(self, mock_task):
        payment = Payment.objects.create(order=self.order, amount=50, method="card")
        mock_task.reset_mock()
        payment.status = Payment.Status.FAILED
        payment.save()
        mock_task.delay.assert_not_called()


class NotifyServiceTests(TestCase):
    def setUp(self):
        self.user_with_phone = _make_user("withphone", phone="+221700000000")
        self.user_no_phone = _make_user("nophone")

    @patch("apps.monetization.tasks.send_notification")
    def test_notify_creates_email_by_default(self, mock_task):
        created = notify(self.user_no_phone, "order_created", "Sujet", "Message")
        self.assertEqual(len(created), 1)
        self.assertEqual(created[0].channel, Notification.Channel.EMAIL)
        mock_task.delay.assert_called_once_with(str(created[0].id))

    @patch("apps.monetization.tasks.send_notification")
    def test_notify_skips_sms_without_phone(self, mock_task):
        created = notify(self.user_no_phone, "custom", "S", "M", channels=[Notification.Channel.SMS])
        self.assertEqual(created, [])
        mock_task.delay.assert_not_called()

    @patch("apps.monetization.tasks.send_notification")
    def test_notify_sends_sms_with_phone(self, mock_task):
        created = notify(self.user_with_phone, "custom", "S", "M", channels=[Notification.Channel.SMS])
        self.assertEqual(len(created), 1)

    @patch("apps.monetization.tasks.send_notification")
    def test_notify_skips_push_without_device(self, mock_task):
        created = notify(self.user_with_phone, "custom", "S", "M", channels=[Notification.Channel.PUSH])
        self.assertEqual(created, [])

    @patch("apps.monetization.tasks.send_notification")
    def test_notify_sends_push_with_registered_device(self, mock_task):
        PushDevice.objects.create(user=self.user_with_phone, token="tok-123", platform=PushDevice.Platform.ANDROID)
        created = notify(self.user_with_phone, "custom", "S", "M", channels=[Notification.Channel.PUSH])
        self.assertEqual(len(created), 1)


class ChannelDispatchTests(TestCase):
    def test_email_channel_sends_via_django_mail(self):
        user = _make_user("emailuser")
        notification = Notification.objects.create(
            user=user, channel=Notification.Channel.EMAIL, subject="Bonjour", message="Contenu"
        )
        notification.send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [user.email])

    def test_sms_console_backend_raises_without_phone(self):
        user = _make_user("smsnophone")
        notification = Notification.objects.create(user=user, channel=Notification.Channel.SMS, subject="S", message="M")
        with self.assertRaises(ValueError):
            notification.send()

    def test_sms_console_backend_ok_with_phone(self):
        user = _make_user("smswithphone", phone="+221701234567")
        notification = Notification.objects.create(user=user, channel=Notification.Channel.SMS, subject="S", message="M")
        notification.send()  # ne doit pas lever

    def test_push_console_backend_raises_without_device(self):
        user = _make_user("pushnodevice")
        notification = Notification.objects.create(user=user, channel=Notification.Channel.PUSH, subject="S", message="M")
        with self.assertRaises(ValueError):
            notification.send()


class SendNotificationTaskTests(TestCase):
    def test_dispatch_marks_notification_sent(self):
        user = _make_user("tasksent")
        notification = Notification.objects.create(user=user, channel=Notification.Channel.EMAIL, subject="S", message="M")
        _dispatch_notification(str(notification.id))
        notification.refresh_from_db()
        self.assertEqual(notification.status, Notification.Status.SENT)
        self.assertIsNotNone(notification.sent_at)

    def test_dispatch_marks_notification_failed_on_error(self):
        user = _make_user("taskfailed")  # pas de téléphone
        notification = Notification.objects.create(user=user, channel=Notification.Channel.SMS, subject="S", message="M")
        with self.assertRaises(ValueError):
            _dispatch_notification(str(notification.id))
        notification.refresh_from_db()
        self.assertEqual(notification.status, Notification.Status.FAILED)
