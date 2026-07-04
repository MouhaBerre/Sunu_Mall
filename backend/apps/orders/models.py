"""
Commandes passées par les acheteurs.
Une commande peut contenir des produits de plusieurs vendeurs
(comme sur Amazon), donc OrderItem garde une référence au vendeur
pour faciliter le filtrage côté dashboard vendeur.
"""
from django.db import models
from apps.users.models import User
from apps.catalog.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "En attente"
        PAID = "paid", "Payée"
        SHIPPED = "shipped", "Expédiée"
        DELIVERED = "delivered", "Livrée"
        CANCELLED = "cancelled", "Annulée"

    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Commande #{self.id} — {self.buyer.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product}"
