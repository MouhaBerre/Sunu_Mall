from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import RecommendationLog
from .serializers import RecommendationLogSerializer
from .tasks import generate_recommendations


class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lecture des recommandations déjà générées. La génération elle-même
    se fait en tâche de fond (voir l'action `trigger` ci-dessous),
    jamais en synchrone dans la requête.
    """

    queryset = RecommendationLog.objects.all()
    serializer_class = RecommendationLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["post"])
    def trigger(self, request):
        """
        POST /api/ia/recommendations/trigger/
        Lance la génération en arrière-plan (Celery) et répond
        immédiatement, sans attendre le résultat.
        """
        user_id = request.user.id
        generate_recommendations.delay(user_id)
        return Response({"status": "started"}, status=202)
