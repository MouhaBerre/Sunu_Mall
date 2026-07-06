#!/bin/bash
# =========================================================
# SUNU MALL — Script de sauvegarde
# =========================================================

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

echo "🔄 Début de la sauvegarde à $TIMESTAMP..."

# Sauvegarde PostgreSQL
echo "💾 Sauvegarde de PostgreSQL..."
docker compose -f ../docker-compose.prod.yml exec -T db pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/postgres_$TIMESTAMP.sql

# Sauvegarde Media (MinIO ou volumes)
echo "💾 Sauvegarde des fichiers media..."
tar -czf $BACKUP_DIR/media_$TIMESTAMP.tar.gz -C ../volumes/media .

echo "✅ Sauvegarde terminée avec succès !"
echo "📦 Fichiers sauvegardés dans $BACKUP_DIR/"
