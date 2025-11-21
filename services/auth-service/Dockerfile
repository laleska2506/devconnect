FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/auth-service/package.json ./services/auth-service/

RUN pnpm install --frozen-lockfile

COPY services/auth-service ./services/auth-service

WORKDIR /app/services/auth-service
RUN pnpm run build

FROM base AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/auth-service/package.json ./services/auth-service/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist

WORKDIR /app/services/auth-service

EXPOSE 3001

ENV PORT=3001
CMD ["node", "dist/main.js"]

