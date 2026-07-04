# SUNU MALL — Mobile (React Native / Expo)

App acheteur, miroir mobile de la boutique web (`frontend/`).

## Démarrer en local

```bash
cd mobile
npm install
npm start
```

Puis scanne le QR code avec l'app **Expo Go** (Android/iOS), ou lance un émulateur :

```bash
npm run android   # émulateur Android
npm run ios       # simulateur iOS (Mac uniquement)
```

## Configuration de l'API

Le mobile appelle le backend via `src/services/api.ts`. En local, ça pointe par défaut vers `http://localhost:8000/api` — si tu testes sur un vrai téléphone (pas un émulateur), remplace `localhost` par l'IP de ta machine sur le réseau local.

## Build pour les stores

Pas géré par le `Dockerfile` du repo (qui sert seulement à la CI). Les builds `.apk`/`.ipa` se feront via [Expo EAS Build](https://docs.expo.dev/build/introduction/) — à configurer quand l'équipe sera prête à publier.
