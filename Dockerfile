# Base stage
FROM node:20-alpine as base

# Install stage
FROM base as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build stage
FROM base as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

COPY tsconfig.build.json ./tsconfig.json

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Runner stage / Production image
FROM base as runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 contactsapi
RUN apk add --no-cache curl

COPY --from=builder /app/dist .
COPY --from=deps /app/node_modules ./node_modules

RUN mkdir -p /app/dist/logs && chown -R contactsapi:nodejs /app/dist

USER contactsapi

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://${HOSTNAME}:${PORT}/health || exit 1

CMD ["node", "index.js"]
