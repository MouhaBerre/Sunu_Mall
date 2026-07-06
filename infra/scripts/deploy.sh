#!/bin/bash
# =========================================================
# SUNU MALL — Script de déploiement
# =========================================================

set -e

echo "🚀 Début du déploiement SUNU MALL..."

# Pull les dernières modifications du repo
echo "📥 Mise à jour du code..."
git pull origin main

# Arrêter les services en cours
echo "🛑 Arrêt des services..."
docker compose -f ../docker-compose.prod.yml down

# Build les nouvelles images
echo "🔨 Build des images Docker..."
docker compose -f ../docker-compose.prod.yml build

# Lancer les services
echo "🚀 Lancement des services..."
docker compose -f ../docker-compose.prod.yml up -d

# Attendre que les services soient prêts
echo "⏳ Attente des services..."
sleep 10

# Lancer les migrations
echo "📊 Application des migrations..."
docker compose -f ../docker-compose.prod.yml exec backend python manage.py migrate

echo "✅ Déploiement terminé avec succès !"
