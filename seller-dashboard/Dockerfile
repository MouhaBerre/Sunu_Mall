# =========================================================
# SUNU MALL — Dashboard vendeur (React + Vite)
# Pas besoin de SSR ici (interface privée, pas de SEO à gérer).
# Build statique servi par nginx : image finale minuscule.
# =========================================================

# ---- Stage 1 : build ----
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2 : image finale, juste nginx + fichiers statiques ----
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
