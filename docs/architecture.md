# Décisions d'architecture

Ce document explique le **pourquoi** des choix structurants du repo, pour que toute l'équipe comprenne la logique (et puisse la remettre en question si le contexte change).

## Mono-repo plutôt que multi-repo

À 4 personnes avec un backend et une IA fortement couplés (Celery, Redis, Postgres partagés), le coût de coordination entre plusieurs repos (PR synchronisées, contrats d'API à dupliquer) dépasse les bénéfices du multi-repo (permissions isolées, CI ultra-simple). Le mono-repo permet une seule PR pour une feature qui touche backend + frontend, un seul historique, un seul `docker-compose` pour tout lancer en local.

**Quand reconsidérer ce choix** : si l'équipe grossit fortement (10+ devs), ou qu'un service (ex: l'IA) devient un produit à part avec sa propre équipe et son propre rythme de release. Migrer un dossier mono-repo vers un repo séparé est une opération standard (`git filter-repo`) — l'inverse est plus coûteux, donc partir en mono-repo n'est pas un choix qui enferme.

## App IA intégrée au backend Django (pour l'instant)

L'IA vit dans `backend/apps/ia/`, comme une app Django normale, plutôt que dans un service séparé. Pour que cette décision reste réversible facilement :

- Les dépendances IA sont isolées dans `backend/requirements/ia.txt`, séparées de `base.txt`. Si l'app IA finit par avoir besoin de torch/transformers/etc., le reste du backend n'a pas à porter ce poids.
- Tout traitement IA potentiellement lent passe par une tâche Celery (`apps/ia/tasks.py`), jamais directement dans une vue HTTP — ça évite de bloquer une requête web pendant une inférence.

**Signal qu'il est temps d'extraire l'IA en service à part** : si l'image Docker du backend devient lourde (plusieurs Go) à cause des libs IA, ou si l'IA a besoin d'un cycle de déploiement complètement différent du reste du backend (ex: GPU dédié).

## Next.js pour la boutique, React/Vite pour le dashboard vendeur

Deux interfaces web, deux besoins différents :

- **`frontend/` (boutique, Next.js)** : page publique consultée par des acheteurs venant souvent de Google. Le SSR (rendu côté serveur) aide au référencement et accélère le premier affichage — important sur des connexions mobiles parfois lentes.
- **`seller-dashboard/` (React + Vite)** : interface privée, jamais indexée par un moteur de recherche. Pas besoin de SSR — un simple build statique servi par nginx suffit, et c'est plus simple à maintenir.

## Pourquoi un Dockerfile multi-stage par service

Chaque `Dockerfile` du repo suit le même principe : une étape de build (avec compilateurs, outils, dépendances complètes) puis une étape finale qui ne copie que le strict nécessaire à l'exécution. Concrètement :

- Le backend n'embarque pas `build-essential` dans son image finale (utile seulement pour compiler `psycopg2`, par exemple).
- Le frontend Next.js n'embarque pas son code source ni les dépendances de développement, seulement le build `standalone`.
- Le dashboard vendeur n'embarque même pas Node.js dans l'image finale — juste nginx + les fichiers statiques générés.

Ça réduit la taille des images, accélère les déploiements, et réduit la surface d'attaque (moins d'outils inutiles présents en prod).

## Pourquoi les CI sont scindées par dossier (`paths:`)

Chaque workflow GitHub Actions (`backend.yml`, `frontend.yml`, etc.) ne se déclenche que si son dossier a changé. Ça évite de relancer tout le pipeline Django quand seul le mobile a bougé — gain de temps et de lisibilité (chacun voit directement quelle CI le concerne sur sa PR).
