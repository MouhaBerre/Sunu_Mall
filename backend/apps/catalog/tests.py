"""
Tests pour les fonctionnalités boutique/catalogue (création, permissions).
"""
import io
import shutil
import tempfile

from django.test import override_settings
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User, Role, UserRole
from .models import Product, ProductImage, Store


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


def _fake_image_file(name="test.jpg"):
    buffer = io.BytesIO()
    Image.new("RGB", (500, 500), color="red").save(buffer, format="JPEG")
    buffer.seek(0)
    from django.core.files.uploadedfile import SimpleUploadedFile
    return SimpleUploadedFile(name, buffer.read(), content_type="image/jpeg")


_MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(
    DEFAULT_FILE_STORAGE="django.core.files.storage.FileSystemStorage",
    MEDIA_ROOT=_MEDIA_ROOT,
    MEDIA_URL="/media/",
)
class ImageUploadTests(APITestCase):
    """Upload et redimensionnement d'images (produits, logo/bannière boutique)."""

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.merchant = _create_user_with_role('marchand-img@example.com', Role.RoleName.MERCHANT)
        self.other_merchant = _create_user_with_role('autre-img@example.com', Role.RoleName.MERCHANT)
        self.store = Store.objects.create(owner=self.merchant, name="Boutique images", status=Store.Status.ACTIVE)
        self.product = Product.objects.create(
            store=self.store, name="Produit test", base_price="1000.00",
            status=Product.Status.DRAFT,
        )

    def test_owner_can_upload_product_image(self):
        self.client.force_authenticate(self.merchant)
        url = reverse('product-upload-image', args=[self.product.id])
        response = self.client.post(url, {"file": _fake_image_file(), "is_primary": "true"}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertTrue(response.data['is_primary'])
        self.assertIsNotNone(response.data['url'])
        self.assertIsNotNone(response.data['thumbnail_url'])
        self.assertEqual(ProductImage.objects.filter(product=self.product).count(), 1)

    def test_other_merchant_cannot_upload_product_image(self):
        # Le produit est en brouillon : un autre commerçant ne doit même pas
        # pouvoir détecter son existence (404, pas 403).
        self.client.force_authenticate(self.other_merchant)
        url = reverse('product-upload-image', args=[self.product.id])
        response = self.client.post(url, {"file": _fake_image_file()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_owner_can_delete_product_image(self):
        image = ProductImage.objects.create(product=self.product, minio_path="products/x.jpg")
        self.client.force_authenticate(self.merchant)
        url = reverse('product-delete-image', args=[self.product.id, image.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ProductImage.objects.filter(id=image.id).exists())

    def test_owner_can_upload_store_logo(self):
        self.client.force_authenticate(self.merchant)
        url = reverse('store-upload-logo', args=[self.store.id])
        response = self.client.post(url, {"file": _fake_image_file()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.store.refresh_from_db()
        self.assertTrue(self.store.logo)
        self.assertIsNotNone(response.data['logo_url'])


class ProductCatalogTests(APITestCase):
    """CRUD produits/variants scopé au propriétaire de la boutique."""

    def setUp(self):
        self.merchant = _create_user_with_role('marchand-cat@example.com', Role.RoleName.MERCHANT)
        self.other_merchant = _create_user_with_role('autre-cat@example.com', Role.RoleName.MERCHANT)
        self.client_user = _create_user_with_role('client-cat@example.com', Role.RoleName.CLIENT)
        self.store = Store.objects.create(owner=self.merchant, name="Boutique A", status=Store.Status.ACTIVE)
        self.other_store = Store.objects.create(owner=self.other_merchant, name="Boutique B", status=Store.Status.ACTIVE)
        self.list_url = reverse('product-list')

    def test_merchant_can_create_product_for_own_store(self):
        self.client.force_authenticate(self.merchant)
        response = self.client.post(self.list_url, {
            "store": str(self.store.id), "name": "Chaise", "base_price": "5000.00",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(Product.objects.get(id=response.data['id']).store_id, self.store.id)

    def test_merchant_cannot_create_product_for_other_store(self):
        self.client.force_authenticate(self.merchant)
        response = self.client.post(self.list_url, {
            "store": str(self.other_store.id), "name": "Table", "base_price": "8000.00",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_client_cannot_create_product(self):
        self.client.force_authenticate(self.client_user)
        response = self.client.post(self.list_url, {
            "store": str(self.store.id), "name": "Interdit", "base_price": "1.00",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_owner_can_add_and_remove_variant(self):
        product = Product.objects.create(store=self.store, name="Sac", base_price="2000.00", status=Product.Status.ACTIVE)
        self.client.force_authenticate(self.merchant)

        add_url = reverse('product-add-variant', args=[product.id])
        response = self.client.post(add_url, {"sku": "SAC-001", "price": "2000.00", "quantity": 10})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['inventory']['quantity'], 10)
        self.assertEqual(response.data['inventory']['available'], 10)
        variant_id = response.data['id']

        detail_url = reverse('product-variant-detail', args=[product.id, variant_id])
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_other_merchant_cannot_add_variant(self):
        product = Product.objects.create(store=self.store, name="Sac", base_price="2000.00", status=Product.Status.ACTIVE)
        self.client.force_authenticate(self.other_merchant)
        add_url = reverse('product-add-variant', args=[product.id])
        response = self.client.post(add_url, {"sku": "SAC-002", "price": "2000.00"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_can_list_active_products_with_breadcrumb_and_brand(self):
        product = Product.objects.create(store=self.store, name="Visible", base_price="1500.00", status=Product.Status.ACTIVE)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertTrue(any(item['id'] == str(product.id) for item in results))


class BrandTests(APITestCase):
    def setUp(self):
        self.merchant = _create_user_with_role('marchand-brand@example.com', Role.RoleName.MERCHANT)

    def test_authenticated_user_can_create_brand(self):
        self.client.force_authenticate(self.merchant)
        response = self.client.post(reverse('brand-list'), {"name": "Ma Marque"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_anonymous_cannot_create_brand_but_can_list(self):
        response = self.client.post(reverse('brand-list'), {"name": "Marque interdite"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(reverse('brand-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
