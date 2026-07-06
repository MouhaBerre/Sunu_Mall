"""
Catalogue : catégories et produits.
Chaque vendeur (SellerProfile) gère ses propres produits et catégories,
exactement comme tu l'as décrit : "les vendeurs gèrent eux-mêmes
leur boutique, catégories, commandes".
"""
from django.db import models
from apps.users.models import SellerProfile


class Category(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ["seller", "slug"]

    def __str__(self):
        return self.name


class Product(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """
    Stockée via MinIO (voir DEFAULT_FILE_STORAGE dans settings/base.py).
    """

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    is_primary = models.BooleanField(default=False)
