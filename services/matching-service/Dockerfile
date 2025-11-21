FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/matching-service/package.json ./services/matching-service/

RUN pnpm install --frozen-lockfile

COPY services/matching-service ./services/matching-service

WORKDIR /app/services/matching-service
RUN pnpm run build

FROM base AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/matching-service/package.json ./services/matching-service/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/services/matching-service/dist ./services/matching-service/dist

WORKDIR /app/services/matching-service

EXPOSE 3004

ENV PORT=3004
CMD ["node", "dist/main.js"]
