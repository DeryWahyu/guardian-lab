# Stage 1: Dependencies
FROM oven/bun:1-alpine AS deps
WORKDIR /app
ENV HUSKY=0

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Next/Turbopack needs native Node resolution for hashed external-package links.
FROM node:22-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0
COPY --from=deps /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s bun /usr/local/bin/bunx && \
    apk add --no-cache openjdk17-jre-headless openssl && chown node:node /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
USER node
COPY --chown=node:node . .
RUN bun run apk:setup && \
    DATABASE_URL=mysql://guardian:guardian_dev@db:3306/guardian_lab bunx prisma generate
EXPOSE 3000
CMD ["sh", "docker/app/dev-entrypoint.sh"]

# Stage 2: Builder
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run apk:setup && bunx prisma generate && bun run build

# Stage 3: Runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root user for security
RUN apk add --no-cache openjdk17-jre-headless && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "server.js"]
