# =========================================================
# SUNU MALL — Mobile (React Native)
#
# Ce Dockerfile n'est PAS utilisé pour faire tourner l'app sur un
# téléphone (impossible — un conteneur Docker ne remplace pas un
# device/émulateur). Il sert à :
#   - lancer le lint et les tests en CI dans un environnement propre
#   - éventuellement builder le bundle JS (Metro) de façon reproductible
#
# Les builds natifs (.apk/.ipa) se font via Expo EAS Build ou un
# pipeline natif dédié, pas via ce conteneur.
# =========================================================

FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Pas de CMD de "lancement" pertinent ici : ce conteneur sert
# d'environnement CI (voir .github/workflows/mobile.yml), pas de runtime.
CMD ["npm", "test"]
