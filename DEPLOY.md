# Alpha Empire Logistics — Deployment Guide

## Overview

This monorepo contains three deployable services:
- **web** (`apps/web`) — React 18 + Vite static frontend served via nginx
- **api** (`apps/api`) — Express 5 Node.js REST API
- **pocketbase** (`apps/pocketbase`) — PocketBase binary server with SQLite persistence

---

## 1. Railway (Recommended)

Railway runs each service as a separate deployment from the monorepo root.

### Prerequisites
- [Railway CLI](https://docs.railway.app/develop/cli): `npm install -g @railway/cli`
- Login: `railway login`

### Setup — 3 Services

Create a new Railway project and add three services, each pointing to this repository:

#### PocketBase Service
- **Root Directory**: `/` (monorepo root)
- **Config file**: `apps/pocketbase/railway.toml` (auto-detected)
- **Volume**: Attach a persistent volume mounted at `/pb/data` — **required** to persist SQLite data across deploys
- **Port**: `8090`

Environment variables (none required beyond defaults).

#### API Service
- **Root Directory**: `/` (monorepo root)
- **Config file**: `apps/api/railway.toml` (auto-detected)
- **Port**: `3001`

Environment variables to set in Railway dashboard:
```
NODE_ENV=production
POCKETBASE_URL=https://<your-pocketbase-service>.railway.app
CORS_ORIGIN=https://<your-web-service>.railway.app
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=<strong-password>
ANTHROPIC_API_KEY=<your-key>
```

#### Web Service
- **Root Directory**: `/` (monorepo root)
- **Config file**: `apps/web/railway.toml` (auto-detected)
- **Port**: `80`

Build arguments (set in Railway dashboard under Build Variables):
```
VITE_API_BASE_URL=/api
VITE_POCKETBASE_URL=https://<your-pocketbase-service>.railway.app
```

### Custom Domain
In Railway dashboard → your web service → Settings → Domains, add your custom domain and update DNS records accordingly.

### Health Check
Once deployed, verify all services:
```
curl https://<api-service>.railway.app/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

## 2. VPS with Docker Compose

### Prerequisites
- Ubuntu 22.04+ VPS with Docker and Docker Compose installed
- Domain name pointing to your VPS IP

### Install Docker (if needed)
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Deploy

```bash
# Clone the repository
git clone <your-repo-url> /srv/alphaempire
cd /srv/alphaempire

# Set up environment
cp .env.example .env
nano .env  # Fill in production values (see .env.example comments)

# Build and start all services
docker compose up -d --build

# Check status
docker compose ps
docker compose logs -f
```

Key values to set in `.env` for Docker Compose:
```
NODE_ENV=production
POCKETBASE_URL=http://pocketbase:8090   # container name — already set in compose
CORS_ORIGIN=https://your-domain.com
PB_ADMIN_EMAIL=admin@your-domain.com
PB_ADMIN_PASSWORD=<strong-password>
ANTHROPIC_API_KEY=<your-key>
```

### SSL with Let's Encrypt / Certbot

The `web` service in docker-compose exposes port 443. To enable HTTPS:

```bash
# Install certbot on the host
sudo apt install certbot

# Stop web container temporarily
docker compose stop web

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Mount certs into the nginx container by editing docker-compose.yml:
# volumes:
#   - /etc/letsencrypt:/etc/letsencrypt:ro
# Then update nginx.conf to listen on 443 with ssl_certificate paths.

docker compose up -d web
```

Alternatively, use [Caddy](https://caddyserver.com/) as a reverse proxy in front of the stack — it handles SSL automatically.

### Updating

```bash
git pull
docker compose up -d --build
```

---

## 3. Post-Deploy Checklist

After deploying for the first time, run the setup scripts to initialize PocketBase collections and create the admin user.

### On Railway
Use Railway's shell/exec feature or run locally pointing at your deployed PocketBase URL:

```bash
POCKETBASE_URL=https://<your-pocketbase>.railway.app \
PB_ADMIN_EMAIL=admin@example.com \
PB_ADMIN_PASSWORD=<password> \
node tools/setup.js

node tools/create-admin.js
```

### On VPS (Docker Compose)
```bash
# Run inside the api container
docker compose exec api node tools/setup.js
docker compose exec api node tools/create-admin.js
```

### Test Health Endpoint
```bash
# API health
curl https://your-domain.com/api/health
# Expected: {"status":"ok","timestamp":"2025-..."}

# PocketBase health
curl https://your-pocketbase-url/api/health
```

### Smoke Test
- Visit your domain — the React app should load
- Log in with your admin credentials
- Verify articles/insights/leads collections exist in PocketBase at `/_/` admin UI

---

## File Reference

| File | Purpose |
|------|---------|
| `apps/api/Dockerfile` | Builds the Express API container |
| `apps/web/Dockerfile` | Multi-stage: builds Vite app, serves via nginx |
| `apps/web/nginx.conf` | nginx config: SPA routing + `/api/` proxy |
| `apps/pocketbase/Dockerfile` | Downloads and runs PocketBase binary |
| `docker-compose.yml` | Orchestrates all 3 services for VPS deployment |
| `apps/api/railway.toml` | Railway build/deploy config for API |
| `apps/web/railway.toml` | Railway build/deploy config for Web |
| `apps/pocketbase/railway.toml` | Railway build/deploy config for PocketBase |
| `apps/web/.env.production` | Vite env for production builds |
