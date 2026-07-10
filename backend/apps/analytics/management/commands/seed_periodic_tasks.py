"""
Enregistre les tâches planifiées de l'app analytics dans django_celery_beat.
À exécuter une fois après migration (idempotent, get_or_create partout).
"""
from django_celery_beat.models import CrontabSchedule, PeriodicTask
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Enregistre les tâches Celery Beat de l'app analytics."

    def handle(self, *args, **options):
        schedule, _ = CrontabSchedule.objects.get_or_create(
            minute="10", hour="0", day_of_week="*", day_of_month="*", month_of_year="*",
        )
        task, created = PeriodicTask.objects.get_or_create(
            task="apps.analytics.tasks.rollup_daily_statistics",
            defaults={
                "name": "Rollup quotidien des statistiques (analytics)",
                "crontab": schedule,
            },
        )
        if not created:
            task.crontab = schedule
            task.enabled = True
            task.save()

        self.stdout.write(self.style.SUCCESS("Tâche périodique 'rollup_daily_statistics' enregistrée (00:10 chaque jour)."))
