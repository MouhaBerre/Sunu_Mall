#!/bin/bash
# =========================================================
# SUNU MALL — Script d'application des migrations
# =========================================================

set -e

echo "📊 Application des migrations Django..."

docker compose -f ../docker-compose.dev.yml exec backend python manage.py makemigrations
docker compose -f ../docker-compose.dev.yml exec backend python manage.py migrate

echo "✅ Migrations terminées !"
