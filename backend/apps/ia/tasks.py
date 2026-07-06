"""
Tâches Celery pour l'app IA. Tout traitement IA potentiellement lent
(inférence, entraînement, batch...) doit passer par ici plutôt que
dans une vue Django classique, pour ne pas bloquer la requête HTTP.
"""
from celery import shared_task
from .models import RecommendationLog


@shared_task
def generate_recommendations(user_id: int):
    """
    Exemple de tâche asynchrone. Remplace ce corps par le vrai appel
    au modèle IA une fois le backlog précis (quel modèle, quelles
    données en entrée...).
    """
    # TODO: appeler le vrai modèle IA ici
    fake_result = {"recommended_product_ids": []}

    RecommendationLog.objects.create(user_id=user_id, payload=fake_result)
    return fake_result
