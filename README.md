# DevConnect - Freelancer Tech Marketplace

A microservices-based marketplace connecting tech freelancers with companies.

## Architecture

- **Frontend**: React + Vite + TypeScript
- **Backend Services**: Node.js + NestJS + TypeScript
  - auth-service: Authentication and user management
  - profiles-service: User profiles management
  - projects-service: Projects and proposals
  - matching-service: Search and matching
  - payments-service: Payment processing (mock)
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Kubernetes, GitHub Actions CI/CD

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL (or use docker-compose)

### Installation

```bash
pnpm install
```

### Development

```bash
# Start all services with Docker Compose
docker-compose up

# Or run services individually
cd services/auth-service && pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific service
cd services/auth-service && pnpm test
```

### Building

```bash
# Build all services
pnpm build
```

## Services

- Frontend: http://localhost:3000
- Auth Service: http://localhost:3001
- Profiles Service: http://localhost:3002
- Projects Service: http://localhost:3003
- Matching Service: http://localhost:3004
- Payments Service: http://localhost:3005

## Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## License

MIT

