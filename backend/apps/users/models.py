"""
Modèles liés aux utilisateurs de SUNU MALL.

On distingue deux rôles dès le départ, comme sur Amazon :
- un Acheteur (Buyer) qui consulte/achète, sur web et mobile
- un Vendeur (Seller) qui gère sa propre boutique

À adapter librement selon le backlog réel (le backlog peut par
exemple demander des rôles supplémentaires, des permissions fines,
etc.) — ceci est juste un point de départ cohérent.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Utilisateur de base. On étend le User Django plutôt que de le
    remplacer entièrement, pour garder la compatibilité avec
    l'admin Django et le système d'auth standard.
    """

    class Role(models.TextChoices):
        BUYER = "buyer", "Acheteur"
        SELLER = "seller", "Vendeur"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.BUYER)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class SellerProfile(models.Model):
    """
    Infos spécifiques à un vendeur : nom de boutique, etc.
    Séparé de User pour ne pas alourdir le modèle de base avec
    des champs qui ne concernent que les vendeurs.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="seller_profile")
    shop_name = models.CharField(max_length=255)
    shop_description = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.shop_name
