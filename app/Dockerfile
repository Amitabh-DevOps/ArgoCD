# ── Stage 1: Install dependencies ──────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ── Stage 2: Final image ────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy deps from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY server.js ./
COPY public/ ./public/

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
