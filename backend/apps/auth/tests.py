"""
Tests unitaires pour l'application auth.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User, Role, UserRole
from apps.auth.utils import email_verification_token
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


class AuthTests(TestCase):
    def setUp(self):
        """
        Configuration initiale des tests.
        """
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.verify_email_url = reverse('auth_verify_email')
        self.resend_verification_url = reverse('auth_resend_verification')
        
        # Créer les rôles par défaut
        Role.objects.get_or_create(name=Role.RoleName.CLIENT)
        Role.objects.get_or_create(name=Role.RoleName.MERCHANT)
        Role.objects.get_or_create(name=Role.RoleName.DRIVER)
        Role.objects.get_or_create(name=Role.RoleName.ADMIN)

    def test_register_user_success(self):
        """
        Teste l'inscription réussie d'un utilisateur.
        """
        data = {
            'email': 'test@example.com',
            'password': 'testpassword123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+221771234567',
            'role_name': 'client'
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], data['email'])
        self.assertEqual(response.data['user']['roles'], ['client'])
        
        user = User.objects.get(email=data['email'])
        self.assertFalse(user.is_verified)
        self.assertTrue(user.check_password(data['password']))

    def test_register_user_missing_fields(self):
        """
        Teste l'inscription avec des champs manquants.
        """
        data = {
            'email': 'test@example.com',
            # Mot de passe manquant
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_user_unverified(self):
        """
        Teste la connexion avec un email non vérifié.
        """
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        role = Role.objects.get(name=Role.RoleName.CLIENT)
        UserRole.objects.create(user=user, role=role)
        
        data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)

    def test_login_user_verified(self):
        """
        Teste la connexion avec un email vérifié.
        """
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        user.is_verified = True
        user.save()
        
        role = Role.objects.get(name=Role.RoleName.CLIENT)
        UserRole.objects.create(user=user, role=role)
        
        data = {
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], data['email'])

    def test_login_invalid_credentials(self):
        """
        Teste la connexion avec des identifiants invalides.
        """
        data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_verify_email_success(self):
        """
        Teste la vérification d'email réussie.
        """
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)
        
        response = self.client.get(self.verify_email_url, {'uid': uid, 'token': token})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        
        user.refresh_from_db()
        self.assertTrue(user.is_verified)

    def test_verify_email_invalid_token(self):
        """
        Teste la vérification d'email avec un token invalide.
        """
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        invalid_token = 'invalidtoken123'
        
        response = self.client.get(self.verify_email_url, {'uid': uid, 'token': invalid_token})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        
        user.refresh_from_db()
        self.assertFalse(user.is_verified)

    def test_resend_verification_email(self):
        """
        Teste le renvoi de l'email de vérification.
        """
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
        data = {'email': 'test@example.com'}
        response = self.client.post(self.resend_verification_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_resend_verification_email_already_verified(self):
        """
        Teste le renvoi de l'email pour un utilisateur déjà vérifié.
        """
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        user.is_verified = True
        user.save()
        
        data = {'email': 'test@example.com'}
        response = self.client.post(self.resend_verification_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data)
