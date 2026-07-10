# =========================================================
# SUNU MALL — Frontend boutique (Next.js 15 + Bun)
# Build multi-stage : l'image finale ne contient que le build
# de production standalone, pas les node_modules de dev.
# =========================================================

# ---- Stage 1 : installation des dépendances ----
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Stage 2 : build ----
FROM oven/bun:1 AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- Stage 3 : image finale, légère ----
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next.js "standalone output" : ne copie que le strict nécessaire
# pour faire tourner l'app (voir next.config.ts : output: 'standalone')
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]
