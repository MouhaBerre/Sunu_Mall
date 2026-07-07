"""Settings pour le développement local. Importé par défaut via manage.py."""
from .base import *  # noqa: F401,F403

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Retirer debug toolbar pour éviter les erreurs temporaires
# INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405
# MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa: F405

# INTERNAL_IPS = ["127.0.0.1"]

# Utiliser SQLite pour développement sans Docker
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
