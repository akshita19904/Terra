# 13. Deployment & Infrastructure

This document details the containerization, Docker Compose configuration, and production deployment pipeline for Terra and Waypoint.

---

## 1. Local Development Docker Setup (`docker-compose.yml`)

Running `docker-compose up -d` spins up the following local infrastructure services:

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    container_name: terra_postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: terra_user
      POSTGRES_PASSWORD: terra_pass
      POSTGRES_DB: terra_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: terra_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

---

## 2. Production Docker Compose Setup (`docker-compose.prod.yml`)

The production Compose file orchestrates 4 multi-stage services:
1. **`web`**: Vite + React static build served via NGINX on port `80`.
2. **`api`**: Fastify Node.js production container on port `4000`.
3. **`postgres`**: PostgreSQL 16 + PostGIS spatial database on port `5432`.
4. **`redis`**: Redis 7 cache and telemetry store on port `6379`.

---

## 3. Environment Variables Specification

```env
# Database Connections
DATABASE_URL="postgresql://terra_user:terra_pass@postgres:5432/terra_db?schema=public"

# Redis Cache & Telemetry
REDIS_URL="redis://redis:6379"

# Security Secrets
JWT_SECRET="terra_prod_hmac_sha256_secret_key_2026"
BCRYPT_SALT_ROUNDS=12

# Runtime Ports
PORT=4000
HOST="0.0.0.0"
NODE_ENV="production"
```

---

## 4. Honest Production Gaps & What is Missing

While this repository is fully containerized and production-ready for single-node deployment, an enterprise scale deployment would additionally require:

1. **SSL/TLS Certificates**: NGINX reverse proxy configured with Let's Encrypt / Certbot for HTTPS and WSS (secure WebSockets).
2. **Managed Database Service**: Moving PostgreSQL off Docker Compose to AWS RDS PostgreSQL / Aurora with multi-AZ automatic failover.
3. **Managed Redis Cluster**: Moving Redis off Docker Compose to AWS ElastiCache for Redis.
4. **CI/CD Pipeline**: GitHub Actions workflow running `vitest`, `tsc --noEmit`, and building Docker images to AWS ECR.
5. **Observability Stack**: Prometheus metrics scraper + Grafana dashboards for monitoring Fastify event loop lag, HTTP error rates, and PostGIS query times.
