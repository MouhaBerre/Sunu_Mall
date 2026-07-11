"""
Traitement des images uploadées (produits, logos/bannières de boutique) :
redimensionnement via Pillow puis stockage via le backend de fichiers
Django par défaut (MinIO/S3 en prod, voir settings.DEFAULT_FILE_STORAGE).
"""
import io
import uuid

from PIL import Image
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

THUMBNAIL_SIZE = (300, 300)
MAX_ORIGINAL_SIZE = (1600, 1600)


def _load_rgb_image(file):
    image = Image.open(file)
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image


def _save_image(image, path):
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=85)
    buffer.seek(0)
    return default_storage.save(path, ContentFile(buffer.read()))


def process_and_store_image(file, base_path):
    """
    Génère une version 'originale' (plafonnée) et une miniature pour une
    image de galerie produit. Retourne (original_path, thumbnail_path).
    """
    image = _load_rgb_image(file)
    unique = uuid.uuid4().hex

    original = image.copy()
    original.thumbnail(MAX_ORIGINAL_SIZE)
    original_path = _save_image(original, f"{base_path}/{unique}.jpg")

    thumbnail = image.copy()
    thumbnail.thumbnail(THUMBNAIL_SIZE)
    thumbnail_path = _save_image(thumbnail, f"{base_path}/{unique}_thumb.jpg")

    return original_path, thumbnail_path


def process_single_image(file, base_path, max_size=(800, 800)):
    """
    Redimensionne une image unique (logo/bannière de boutique, pas de
    galerie) et la stocke. Retourne le chemin stocké.
    """
    image = _load_rgb_image(file)
    image.thumbnail(max_size)
    unique = uuid.uuid4().hex
    return _save_image(image, f"{base_path}/{unique}.jpg")
