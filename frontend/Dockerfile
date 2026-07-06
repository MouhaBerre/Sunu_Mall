# =========================================================
# SUNU MALL — Frontend boutique (Next.js)
# Build multi-stage : l'image finale ne contient que le build
# de production, pas node_modules de dev ni le code source brut.
# =========================================================

# ---- Stage 1 : installation des dépendances ----
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Stage 2 : build ----
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage 3 : image finale, légère ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next.js "standalone output" : ne copie que le strict nécessaire
# pour faire tourner l'app (voir next.config.js : output: 'standalone')
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
