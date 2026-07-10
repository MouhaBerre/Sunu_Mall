"""
Tests pour le suivi de livraison : ETA/distance (PB-051), trajet (PB-052),
confirmation OTP (PB-053) et permissions (PB-049).
"""
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from apps.catalog.models import Store
from apps.users.models import Role, User, UserRole

from . import services
from .models import Address, Delivery, DeliveryConfirmation, DeliveryTracking, Driver, Order
from .permissions import IsAssignedDriver, IsDeliveryParticipant


def _make_user(username):
    return User.objects.create_user(username=username, email=f"{username}@example.com", password="testpass123")


def _make_driver(username):
    user = _make_user(username)
    role, _ = Role.objects.get_or_create(name=Role.RoleName.DRIVER)
    UserRole.objects.create(user=user, role=role)
    driver = Driver.objects.create(user=user, vehicle_type="moto", availability_status=Driver.AvailabilityStatus.AVAILABLE)
    return driver


def _make_store(owner, lat=None, lng=None):
    return Store.objects.create(owner=owner, name="Boutique test", status=Store.Status.ACTIVE, latitude=lat, longitude=lng)


class HaversineEtaTests(TestCase):
    def test_haversine_km_known_distance(self):
        # Dakar (~14.7167, -17.4677) -> Thiès (~14.7910, -16.9359) ~ 57km
        distance = services.haversine_km((14.7167, -17.4677), (14.7910, -16.9359))
        self.assertGreater(distance, 50)
        self.assertLess(distance, 65)

    def test_estimate_eta_minutes(self):
        with self.settings(DELIVERY_AVERAGE_SPEED_KMH=30):
            self.assertEqual(services.estimate_eta_minutes(15), 30.0)

    def test_estimate_eta_minutes_none_distance(self):
        self.assertIsNone(services.estimate_eta_minutes(None))


class DeliveryModelTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer1")
        self.owner = _make_user("owner1")
        self.store = _make_store(self.owner, lat=14.70, lng=-17.45)
        self.address = Address.objects.create(user=self.customer, label="Maison", latitude=14.72, longitude=-17.46)
        self.order = Order.objects.create(customer=self.customer, store=self.store, address=self.address, total_amount=10)
        self.delivery = Delivery.objects.create(order=self.order)

    def test_current_position_none_without_tracking(self):
        driver = _make_driver("driver1")
        self.delivery.assign_driver(driver)
        self.assertIsNone(driver.current_position())

    def test_current_position_returns_latest_tracking(self):
        driver = _make_driver("driver2")
        self.delivery.assign_driver(driver)
        with patch("channels.layers.get_channel_layer", return_value=None):
            DeliveryTracking.objects.create(delivery=self.delivery, latitude=14.71, longitude=-17.455)
            latest = DeliveryTracking.objects.create(delivery=self.delivery, latitude=14.715, longitude=-17.456)
        self.assertEqual(driver.current_position(), latest)

    def test_estimate_eta_for_delivery_without_driver(self):
        self.assertIsNone(services.estimate_eta_for_delivery(self.delivery))

    def test_estimate_eta_for_delivery_with_position(self):
        driver = _make_driver("driver3")
        self.delivery.assign_driver(driver)
        with patch("channels.layers.get_channel_layer", return_value=None):
            DeliveryTracking.objects.create(delivery=self.delivery, latitude=14.71, longitude=-17.455)
        eta = services.estimate_eta_for_delivery(self.delivery)
        self.assertIsNotNone(eta)
        self.assertGreater(eta, 0)


class RouteBuildingTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer2")
        self.owner = _make_user("owner2")
        self.store = _make_store(self.owner, lat=14.70, lng=-17.45)
        self.address = Address.objects.create(user=self.customer, label="Maison", latitude=14.72, longitude=-17.46)
        self.order = Order.objects.create(customer=self.customer, store=self.store, address=self.address, total_amount=10)
        self.delivery = Delivery.objects.create(order=self.order)
        self.driver = _make_driver("driver4")
        self.delivery.assign_driver(self.driver)
        with patch("channels.layers.get_channel_layer", return_value=None):
            DeliveryTracking.objects.create(delivery=self.delivery, latitude=14.71, longitude=-17.455)

    def test_route_falls_back_to_straight_line_when_osrm_unavailable(self):
        with patch("apps.orders.services.requests.get", side_effect=ConnectionError):
            route = services.build_route(self.delivery)
        self.assertIsNone(route["geometry"])
        self.assertIsNotNone(route["distance_km"])
        self.assertIn("store", route["points"])
        self.assertIn("driver", route["points"])
        self.assertIn("customer", route["points"])

    def test_route_missing_waypoints_returns_none_distance(self):
        self.store.latitude = None
        self.store.longitude = None
        self.store.save()
        self.address.latitude = None
        self.address.longitude = None
        self.address.save()
        route = services.build_route(self.delivery)
        self.assertIsNone(route["distance_km"])


class DeliveryOtpTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer3")
        self.owner = _make_user("owner3")
        self.store = _make_store(self.owner)
        self.order = Order.objects.create(customer=self.customer, store=self.store, total_amount=10)
        self.delivery = Delivery.objects.create(order=self.order)

    @patch("apps.monetization.notifications.notify")
    def test_generate_otp_creates_confirmation_and_notifies(self, mock_notify):
        confirmation = services.generate_delivery_otp(self.delivery)
        self.assertEqual(len(confirmation.code), 6)
        self.assertTrue(confirmation.code.isdigit())
        mock_notify.assert_called_once()

    @patch("apps.monetization.notifications.notify")
    def test_mark_picked_up_generates_otp(self, mock_notify):
        self.delivery.mark_picked_up()
        self.assertEqual(self.delivery.status, Delivery.Status.PICKED_UP)
        self.assertIsNotNone(self.delivery.picked_up_at)
        self.assertTrue(DeliveryConfirmation.objects.filter(delivery=self.delivery).exists())

    def test_confirmation_is_valid_rejects_wrong_code(self):
        confirmation = DeliveryConfirmation.objects.create(
            delivery=self.delivery, code="123456", expires_at=timezone.now() + timedelta(minutes=10)
        )
        self.assertFalse(confirmation.is_valid("000000"))
        self.assertTrue(confirmation.is_valid("123456"))

    def test_confirmation_is_valid_rejects_expired(self):
        confirmation = DeliveryConfirmation.objects.create(
            delivery=self.delivery, code="123456", expires_at=timezone.now() - timedelta(minutes=1)
        )
        self.assertFalse(confirmation.is_valid("123456"))

    def test_confirmation_is_valid_rejects_already_used(self):
        confirmation = DeliveryConfirmation.objects.create(
            delivery=self.delivery, code="123456", expires_at=timezone.now() + timedelta(minutes=10)
        )
        confirmation.mark_used()
        self.assertFalse(confirmation.is_valid("123456"))


class PermissionTests(TestCase):
    def setUp(self):
        self.customer = _make_user("customer4")
        self.owner = _make_user("owner4")
        self.other_driver = _make_driver("otherdriver")
        self.driver = _make_driver("assigneddriver")
        self.store = _make_store(self.owner)
        self.order = Order.objects.create(customer=self.customer, store=self.store, total_amount=10)
        self.delivery = Delivery.objects.create(order=self.order)
        self.delivery.assign_driver(self.driver)

    def test_is_assigned_driver_allows_assigned_driver_only(self):
        class FakeRequest:
            user = self.driver.user
        perm = IsAssignedDriver()
        self.assertTrue(perm.has_object_permission(FakeRequest(), None, self.delivery))

    def test_is_assigned_driver_rejects_other_driver(self):
        class FakeRequest:
            user = self.other_driver.user
        perm = IsAssignedDriver()
        self.assertFalse(perm.has_object_permission(FakeRequest(), None, self.delivery))

    def test_is_delivery_participant_allows_customer_driver_owner(self):
        perm = IsDeliveryParticipant()

        class FakeRequest:
            def __init__(self, user):
                self.user = user

        self.assertTrue(perm.has_object_permission(FakeRequest(self.customer), None, self.delivery))
        self.assertTrue(perm.has_object_permission(FakeRequest(self.driver.user), None, self.delivery))
        self.assertTrue(perm.has_object_permission(FakeRequest(self.owner), None, self.delivery))

    def test_is_delivery_participant_rejects_stranger(self):
        stranger = _make_user("stranger")

        class FakeRequest:
            user = stranger
        perm = IsDeliveryParticipant()
        self.assertFalse(perm.has_object_permission(FakeRequest(), None, self.delivery))


class DeliveryApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = _make_user("apicustomer")
        self.owner = _make_user("apiowner")
        self.driver = _make_driver("apidriver")
        self.other_driver = _make_driver("apiotherdriver")
        self.store = _make_store(self.owner, lat=14.70, lng=-17.45)
        self.address = Address.objects.create(user=self.customer, label="Maison", latitude=14.72, longitude=-17.46)
        self.order = Order.objects.create(customer=self.customer, store=self.store, address=self.address, total_amount=10)
        self.delivery = Delivery.objects.create(order=self.order)
        self.delivery.assign_driver(self.driver)

    def test_driver_can_post_location(self):
        self.client.force_authenticate(user=self.driver.user)
        url = reverse("delivery-location", args=[self.delivery.id])
        with patch("channels.layers.get_channel_layer", return_value=None):
            response = self.client.post(url, {"latitude": "14.71", "longitude": "-17.455"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DeliveryTracking.objects.filter(delivery=self.delivery).count(), 1)

    def test_other_driver_cannot_post_location(self):
        self.client.force_authenticate(user=self.other_driver.user)
        url = reverse("delivery-location", args=[self.delivery.id])
        response = self.client.post(url, {"latitude": "14.71", "longitude": "-17.455"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_customer_can_read_location(self):
        with patch("channels.layers.get_channel_layer", return_value=None):
            DeliveryTracking.objects.create(delivery=self.delivery, latitude=14.71, longitude=-17.455)
        self.client.force_authenticate(user=self.customer)
        url = reverse("delivery-location", args=[self.delivery.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_stranger_cannot_read_location(self):
        stranger = _make_user("apistranger")
        self.client.force_authenticate(user=stranger)
        url = reverse("delivery-location", args=[self.delivery.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("apps.monetization.notifications.notify")
    def test_full_confirmation_flow_marks_order_delivered(self, mock_notify):
        self.client.force_authenticate(user=self.driver.user)

        status_url = reverse("delivery-status-update", args=[self.delivery.id])
        response = self.client.post(status_url, {"status": Delivery.Status.PICKED_UP}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        confirmation = DeliveryConfirmation.objects.get(delivery=self.delivery)

        confirm_url = reverse("delivery-confirm", args=[self.delivery.id])
        bad_response = self.client.post(confirm_url, {"code": "000000"}, format="json")
        self.assertEqual(bad_response.status_code, status.HTTP_400_BAD_REQUEST)

        good_response = self.client.post(confirm_url, {"code": confirmation.code}, format="json")
        self.assertEqual(good_response.status_code, status.HTTP_200_OK)

        self.delivery.refresh_from_db()
        self.order.refresh_from_db()
        self.assertEqual(self.delivery.status, Delivery.Status.DELIVERED)
        self.assertEqual(self.order.status, Order.Status.DELIVERED)

    def test_mine_lists_only_assigned_active_deliveries(self):
        self.client.force_authenticate(user=self.driver.user)
        url = reverse("delivery-mine")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], str(self.delivery.id))
