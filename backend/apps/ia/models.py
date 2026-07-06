"""
App IA — intégrée dans le backend Django pour l'instant (décision actuelle),
mais conçue pour pouvoir être extraite en service à part plus tard si besoin
(voir docs/architecture.md, section "App IA").

Règle d'or pour cette app : ne jamais faire d'appel IA lourd directement
dans une vue HTTP (ça bloquerait la requête). Passer par une tâche Celery
(voir tasks.py) qui tourne en arrière-plan, et notifier le résultat ensuite.

Exemple de cas d'usage possible (à adapter selon le vrai backlog) :
- recommandations de produits personnalisées
- détection de fraude sur les commandes
- modération automatique des descriptions produits
"""
from django.db import models
from apps.users.models import User


class RecommendationLog(models.Model):
    """
    Exemple de modèle : on garde une trace de chaque recommandation
    générée pour un utilisateur, utile pour mesurer la pertinence
    du modèle dans le temps. À remplacer/compléter selon le backlog réel.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recommendation_logs")
    payload = models.JSONField(help_text="Résultat brut renvoyé par le modèle IA")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommandation pour {self.user.username} — {self.created_at:%Y-%m-%d}"
