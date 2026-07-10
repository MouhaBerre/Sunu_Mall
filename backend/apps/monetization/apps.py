from django.apps import AppConfig

class MonetizationConfig(AppConfig):
    name = 'apps.monetization'

    def ready(self):
        from . import signals  # noqa: F401
