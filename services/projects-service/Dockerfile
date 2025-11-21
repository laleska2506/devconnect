FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/projects-service/package.json ./services/projects-service/

RUN pnpm install --frozen-lockfile

COPY services/projects-service ./services/projects-service

WORKDIR /app/services/projects-service
RUN pnpm run build

FROM base AS runtime

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY services/projects-service/package.json ./services/projects-service/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/services/projects-service/dist ./services/projects-service/dist

WORKDIR /app/services/projects-service

EXPOSE 3003

ENV PORT=3003
CMD ["node", "dist/main.js"]
