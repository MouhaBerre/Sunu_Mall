"""
Tests unitaires pour le RBAC de l'application users.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User, Role, Permission, UserRole, RolePermission


class RBACModelTests(TestCase):
    """Tests pour les modèles RBAC."""

    def setUp(self):
        self.client = APIClient()
        # Créer les rôles et permissions via le signal (simulé ou direct)
        self.admin_role, _ = Role.objects.get_or_create(name=Role.RoleName.ADMIN)
        self.merchant_role, _ = Role.objects.get_or_create(name=Role.RoleName.MERCHANT)
        self.client_role, _ = Role.objects.get_or_create(name=Role.RoleName.CLIENT)
        self.driver_role, _ = Role.objects.get_or_create(name=Role.RoleName.DRIVER)

        # Créer une permission de test
        self.perm_view_product, _ = Permission.objects.get_or_create(
            code='view_product',
            defaults={'label': 'Voir les produits'}
        )

        # Créer des utilisateurs de test
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            first_name='Admin',
            last_name='User'
        )
        UserRole.objects.create(user=self.admin_user, role=self.admin_role)

        self.merchant_user = User.objects.create_user(
            username='merchant',
            email='merchant@example.com',
            password='testpass123',
            first_name='Merchant',
            last_name='User'
        )
        UserRole.objects.create(user=self.merchant_user, role=self.merchant_role)

        self.client_user = User.objects.create_user(
            username='client',
            email='client@example.com',
            password='testpass123',
            first_name='Client',
            last_name='User'
        )
        UserRole.objects.create(user=self.client_user, role=self.client_role)

        self.driver_user = User.objects.create_user(
            username='driver',
            email='driver@example.com',
            password='testpass123',
            first_name='Driver',
            last_name='User'
        )
        UserRole.objects.create(user=self.driver_user, role=self.driver_role)

    def test_user_has_role(self):
        """Vérifie que la méthode has_role fonctionne."""
        self.assertTrue(self.admin_user.has_role(Role.RoleName.ADMIN))
        self.assertFalse(self.admin_user.has_role(Role.RoleName.MERCHANT))
        self.assertTrue(self.merchant_user.has_role(Role.RoleName.MERCHANT))
        self.assertTrue(self.client_user.has_role(Role.RoleName.CLIENT))
        self.assertTrue(self.driver_user.has_role(Role.RoleName.DRIVER))

    def test_admin_has_all_permissions(self):
        """Vérifie que l'admin a toutes les permissions."""
        self.assertTrue(self.admin_user.has_permission('view_product'))
        self.assertTrue(self.admin_user.has_permission('create_product'))
        self.assertTrue(self.admin_user.has_permission('any_permission_that_doesnt_exist'))  # Admin a tout

    def test_user_has_permission(self):
        """Vérifie que la méthode has_permission fonctionne."""
        # Assigner une permission au rôle merchant
        RolePermission.objects.create(role=self.merchant_role, permission=self.perm_view_product)
        
        self.assertTrue(self.merchant_user.has_permission('view_product'))
        self.assertFalse(self.client_user.has_permission('view_product'))

    def test_get_permissions(self):
        """Vérifie que la méthode get_permissions fonctionne."""
        RolePermission.objects.create(role=self.merchant_role, permission=self.perm_view_product)
        
        merchant_perms = self.merchant_user.get_permissions()
        self.assertIn(self.perm_view_product, merchant_perms)
        
        admin_perms = self.admin_user.get_permissions()
        self.assertGreater(len(admin_perms), 0)


class RBACAPITests(TestCase):
    """Tests pour les API RBAC."""

    def setUp(self):
        self.client = APIClient()
        # Créer les rôles
        self.admin_role, _ = Role.objects.get_or_create(name=Role.RoleName.ADMIN)
        self.merchant_role, _ = Role.objects.get_or_create(name=Role.RoleName.MERCHANT)

        # Créer des utilisateurs
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            is_verified=True
        )
        UserRole.objects.create(user=self.admin_user, role=self.admin_role)

        self.merchant_user = User.objects.create_user(
            username='merchant',
            email='merchant@example.com',
            password='testpass123',
            is_verified=True
        )
        UserRole.objects.create(user=self.merchant_user, role=self.merchant_role)

    def test_admin_can_access_roles_api(self):
        """Vérifie que seul l'admin peut accéder à l'API des rôles."""
        # Admin connecté
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('role-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Merchant connecté
        self.client.force_authenticate(user=self.merchant_user)
        response = self.client.get(reverse('role-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Non connecté
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('role-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_access_permissions_api(self):
        """Vérifie que seul l'admin peut accéder à l'API des permissions."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('permission-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.merchant_user)
        response = self.client.get(reverse('permission-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_serializer_includes_roles_and_permissions(self):
        """Vérifie que le serializer User inclut les rôles et permissions."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('user-detail', args=[self.admin_user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('roles', response.data)
        self.assertIn('permissions', response.data)
        self.assertIn('admin', response.data['roles'])
