FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/profiles-service/package.json ./services/profiles-service/

RUN pnpm install --frozen-lockfile

COPY services/profiles-service ./services/profiles-service

WORKDIR /app/services/profiles-service
RUN pnpm run build

FROM base AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/profiles-service/package.json ./services/profiles-service/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/services/profiles-service/dist ./services/profiles-service/dist

WORKDIR /app/services/profiles-service

EXPOSE 3002

ENV PORT=3002
CMD ["node", "dist/main.js"]
