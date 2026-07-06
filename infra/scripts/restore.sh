#!/bin/bash
# =========================================================
# SUNU MALL — Script de restauration d'une sauvegarde
# =========================================================

set -e

BACKUP_DIR="./backups"

if [ -z "$1" ]; then
    echo "❌ Erreur : Veuillez spécifier le timestamp de la sauvegarde à restaurer"
    echo "Utilisation : $0 YYYYMMDD_HHMMSS"
    exit 1
fi

TIMESTAMP=$1
POSTGRES_BACKUP="$BACKUP_DIR/postgres_$TIMESTAMP.sql"
MEDIA_BACKUP="$BACKUP_DIR/media_$TIMESTAMP.tar.gz"

if [ ! -f "$POSTGRES_BACKUP" ]; then
    echo "❌ Erreur : Sauvegarde PostgreSQL $POSTGRES_BACKUP introuvable"
    exit 1
fi

if [ ! -f "$MEDIA_BACKUP" ]; then
    echo "❌ Erreur : Sauvegarde Media $MEDIA_BACKUP introuvable"
    exit 1
fi

echo "🔄 Restauration de la sauvegarde du $TIMESTAMP..."

# Restaurer PostgreSQL
echo "💾 Restauration PostgreSQL..."
docker compose -f ../docker-compose.prod.yml exec -T db psql -U $POSTGRES_USER -d $POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker compose -f ../docker-compose.prod.yml exec -T db psql -U $POSTGRES_USER -d $POSTGRES_DB < $POSTGRES_BACKUP

# Restaurer Media
echo "💾 Restauration des fichiers media..."
rm -rf ../volumes/media/*
tar -xzf $MEDIA_BACKUP -C ../volumes/media

echo "✅ Restauration terminée avec succès !"
