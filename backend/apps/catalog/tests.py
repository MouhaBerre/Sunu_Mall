"""
Tests pour les fonctionnalités boutique/catalogue (création, permissions).
"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User, Role, UserRole
from .models import Store


def _create_user_with_role(email, role_name, **extra):
    user = User.objects.create_user(
        username=email.split('@')[0],
        email=email,
        password='testpass123',
        first_name=extra.get('first_name', 'Test'),
        last_name=extra.get('last_name', 'User'),
    )
    role, _ = Role.objects.get_or_create(name=role_name)
    UserRole.objects.create(user=user, role=role)
    return user


class StoreCreationTests(APITestCase):
    """Un commerçant peut créer sa propre boutique en self-service."""

    def setUp(self):
        self.merchant = _create_user_with_role('marchand@example.com', Role.RoleName.MERCHANT)
        self.other_merchant = _create_user_with_role('autre@example.com', Role.RoleName.MERCHANT)
        self.client_user = _create_user_with_role('client@example.com', Role.RoleName.CLIENT)
        self.admin = _create_user_with_role('admin@example.com', Role.RoleName.ADMIN)
        self.list_url = reverse('store-list')

    def test_merchant_can_create_store_inactive_by_default(self):
        self.client.force_authenticate(self.merchant)
        response = self.client.post(self.list_url, {
            "name": "Ma boutique",
            "description": "Vente de vêtements",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        store = Store.objects.get(id=response.data['id'])
        self.assertEqual(store.owner, self.merchant)
        self.assertEqual(store.status, Store.Status.INACTIVE)

    def test_merchant_cannot_force_owner_or_status(self):
        self.client.force_authenticate(self.merchant)
        response = self.client.post(self.list_url, {
            "name": "Boutique triche",
            "owner": str(self.other_merchant.id),
            "status": Store.Status.ACTIVE,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        store = Store.objects.get(id=response.data['id'])
        self.assertEqual(store.owner, self.merchant)
        self.assertEqual(store.status, Store.Status.INACTIVE)

    def test_client_cannot_create_store(self):
        self.client.force_authenticate(self.client_user)
        response = self.client.post(self.list_url, {"name": "Boutique interdite"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_cannot_create_store(self):
        response = self.client.post(self.list_url, {"name": "Boutique anonyme"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_can_list_and_retrieve_stores(self):
        store = Store.objects.create(owner=self.merchant, name="Boutique publique", status=Store.Status.ACTIVE)
        list_response = self.client.get(self.list_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        detail_response = self.client.get(reverse('store-detail', args=[store.id]))
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)

    def test_owner_can_edit_own_store_but_not_others(self):
        store = Store.objects.create(owner=self.merchant, name="Ma boutique")
        detail_url = reverse('store-detail', args=[store.id])

        self.client.force_authenticate(self.other_merchant)
        response = self.client.patch(detail_url, {"description": "Piratage"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(self.merchant)
        response = self.client.patch(detail_url, {"description": "Nouvelle description"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        store.refresh_from_db()
        self.assertEqual(store.description, "Nouvelle description")

    def test_admin_can_edit_any_store(self):
        store = Store.objects.create(owner=self.merchant, name="Ma boutique")
        self.client.force_authenticate(self.admin)
        response = self.client.patch(reverse('store-detail', args=[store.id]), {"description": "Corrigé par admin"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
