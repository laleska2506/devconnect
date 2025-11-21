FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/payments-service/package.json ./services/payments-service/

RUN pnpm install --frozen-lockfile

COPY services/payments-service ./services/payments-service

WORKDIR /app/services/payments-service
RUN pnpm run build

FROM base AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/payments-service/package.json ./services/payments-service/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/services/payments-service/dist ./services/payments-service/dist

WORKDIR /app/services/payments-service

EXPOSE 3005

ENV PORT=3005
CMD ["node", "dist/main.js"]
