# SUNU MALL

Marketplace sénégalaise — boutique en ligne où chaque vendeur gère sa propre boutique (catégories, produits, commandes), accessible sur web et mobile.

## Équipe

| Personne | Rôle |
|---|---|
| Toi (CTO) | Backend, Infra/DevOps |
| Bouba | Backend |
| Ngoné | Frontend (boutique web + dashboard vendeur) |
| Sokhna | Mobile / IA |
| PAF | Mobile / IA, Infra/DevOps |

## Structure du repo

C'est un **mono-repo** : un seul repo Git, un dossier par service. On a choisi cette structure parce qu'à 4 personnes, la coordination entre repos séparés coûte plus cher que les inconvénients d'un seul repo. Voir `docs/architecture.md` pour le détail du raisonnement.

```
sunu-mall/
├── backend/            Django + DRF + Celery + app IA (intégrée pour l'instant)
├── frontend/           Next.js — boutique publique (web), acheteurs
├── seller-dashboard/    React + Vite — espace vendeur (gestion boutique/commandes)
├── mobile/             React Native (Expo) — app acheteur
├── infra/              docker-compose, nginx, monitoring (Prometheus/Grafana)
└── docs/               Documentation d'architecture et de décisions
```

Chaque service a son propre `Dockerfile`, pensé pour rester léger (build multi-stage : pas de compilateurs ni de `node_modules` de dev dans l'image finale).

## Démarrer en local

Prérequis : Docker + Docker Compose installés.

```bash
# 1. Copier les fichiers d'environnement d'exemple
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp seller-dashboard/.env.example seller-dashboard/.env.local

# 2. Lancer tous les services
docker compose -f infra/docker-compose.yml up --build
```

Une fois lancé :
- Boutique web : http://localhost:3000
- Espace vendeur : http://localhost:3001
- API backend : http://localhost:8000/api
- Admin Django : http://localhost:8000/admin
- Console MinIO : http://localhost:9001
- Grafana : http://localhost:3030
- Prometheus : http://localhost:9090

Pour le mobile, voir `mobile/README.md` (Expo Go, émulateur, etc.).

## Workflow Git et contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour : convention de branches, format des commits, et comment ouvrir une Pull Request.

## Backlog et issues

Les tickets de travail viennent de la gestion de projet (peu importe l'outil utilisé) et sont transformés en issues GitHub via les templates dans `.github/ISSUE_TEMPLATE/` (Feature / Bug / Tâche technique). Chaque issue est étiquetée par zone (`zone:backend`, `zone:frontend`, etc.) pour que chacun retrouve facilement ce qui le concerne.
