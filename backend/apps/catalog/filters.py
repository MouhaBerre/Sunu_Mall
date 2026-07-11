"""
Filtres de recherche produit : mot-clé (SearchFilter DRF, voir views.py),
catégorie, boutique et fourchette de prix.
"""
import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="base_price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="base_price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["store", "category", "status", "min_price", "max_price"]
