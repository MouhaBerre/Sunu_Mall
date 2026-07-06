"""
Tests "fumée" (smoke tests) : juste vérifier que les pièces de base
fonctionnent. Chaque équipe ajoutera ses propres tests dans
apps/<son_app>/tests.py au fur et à mesure du backlog réel.
"""
import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_admin_accessible(client):
    response = client.get("/admin/login/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_products_list_is_public(client):
    """Le catalogue doit être consultable sans connexion (comme Amazon)."""
    response = client.get("/api/catalog/products/")
    assert response.status_code == 200
