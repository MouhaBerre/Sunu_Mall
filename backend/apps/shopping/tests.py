"""
Tests pour la wishlist (liste de souhaits).
"""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.models import Product, Store
from apps.users.models import Role, User, UserRole
from .models import Wishlist


def _create_user_with_role(email, role_name):
    user = User.objects.create_user(
        username=email.split('@')[0], email=email, password='testpass123',
        first_name='Test', last_name='User',
    )
    role, _ = Role.objects.get_or_create(name=role_name)
    UserRole.objects.create(user=user, role=role)
    return user


class WishlistTests(APITestCase):
    def setUp(self):
        self.client_user = _create_user_with_role('client-wishlist@example.com', Role.RoleName.CLIENT)
        self.other_client = _create_user_with_role('autre-wishlist@example.com', Role.RoleName.CLIENT)
        merchant = _create_user_with_role('marchand-wishlist@example.com', Role.RoleName.MERCHANT)
        store = Store.objects.create(owner=merchant, name="Boutique wishlist", status=Store.Status.ACTIVE)
        self.product = Product.objects.create(
            store=store, name="Produit désiré", base_price="5000.00", status=Product.Status.ACTIVE,
        )

    def test_anonymous_cannot_access_wishlist(self):
        response = self.client.get(reverse('wishlist'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wishlist_created_on_first_access(self):
        self.client.force_authenticate(self.client_user)
        response = self.client.get(reverse('wishlist'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'], [])
        self.assertTrue(Wishlist.objects.filter(user=self.client_user).exists())

    def test_add_product_to_wishlist(self):
        self.client.force_authenticate(self.client_user)
        response = self.client.post(reverse('wishlist'), {"product_id": str(self.product.id)})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['items'][0]['product']['id'], str(self.product.id))

    def test_adding_same_product_twice_is_idempotent(self):
        self.client.force_authenticate(self.client_user)
        self.client.post(reverse('wishlist'), {"product_id": str(self.product.id)})
        response = self.client.post(reverse('wishlist'), {"product_id": str(self.product.id)})
        self.assertEqual(len(response.data['items']), 1)

    def test_remove_product_from_wishlist(self):
        self.client.force_authenticate(self.client_user)
        self.client.post(reverse('wishlist'), {"product_id": str(self.product.id)})
        response = self.client.delete(reverse('wishlist-item', args=[self.product.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        wishlist = Wishlist.objects.get(user=self.client_user)
        self.assertEqual(wishlist.items.count(), 0)

    def test_wishlists_are_isolated_between_users(self):
        self.client.force_authenticate(self.client_user)
        self.client.post(reverse('wishlist'), {"product_id": str(self.product.id)})

        self.client.force_authenticate(self.other_client)
        response = self.client.get(reverse('wishlist'))
        self.assertEqual(response.data['items'], [])

    def test_add_nonexistent_product_returns_404(self):
        self.client.force_authenticate(self.client_user)
        response = self.client.post(reverse('wishlist'), {"product_id": "00000000-0000-0000-0000-000000000000"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
