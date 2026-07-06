"""
Configuration de l'app Celery. Toutes les tâches asynchrones
(traitement IA en arrière-plan, envoi d'emails, jobs planifiés
via Celery Beat...) passent par ici.
"""
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

app = Celery("sunu_mall")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
