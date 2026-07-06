"""
Modèles liés aux utilisateurs de SUNU MALL.
"""
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """
    Utilisateur de base. On étend le User Django plutôt que de le
    remplacer entièrement, pour garder la compatibilité avec
    l'admin Django et le système d'auth standard.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        ordering = ['-created_at']

    def check_password(self, raw_password):
        return super().check_password(raw_password)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def has_role(self, name):
        return self.roles.filter(name=name).exists()

    def __str__(self):
        return f"{self.email} ({self.get_full_name()})"


class Role(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Permission(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=100, unique=True)
    label = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.label}"


class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_users')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'role']


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permission_roles')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['role', 'permission']


class Session(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    refresh_token_hash = models.CharField(max_length=255)
    device_info = models.JSONField(default=dict)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def revoke(self):
        self.expires_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Session for {self.user.email}"


class Token(models.Model):
    class TokenType(models.TextChoices):
        EMAIL_VERIFICATION = 'email_verification', 'Email Verification'
        PASSWORD_RESET = 'password_reset', 'Password Reset'

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens')
    token = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=50, choices=TokenType.choices)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return not self.used_at and timezone.now() <= self.expires_at

    def mark_used(self):
        self.used_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.type} token for {self.user.email}"
