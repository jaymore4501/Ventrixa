# 🐳 Ventrixa — Project Deployment & Operations Manual

This guide describes how to configure, run, compile, test, deploy, and maintain **Ventrixa** in local development and production environments.

---

## 1. Local Development Setup

### 1.1 Local System Requirements
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Web Browser**: Chrome, Safari, or Firefox (for Visual Workspace compatibility)

### 1.2 Installation Steps
1. Navigate to the project root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server with Next.js Turbopack:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000).

---

## 2. Environment Configuration

To ensure platform-independent runs, variables are read from `.env.local` (local) or process environment variables (production).

```env
# ==========================================
# MongoDB Database Configuration
# ==========================================
# Optional for local runs. If left empty, Ventrixa
# falls back to write-to-file mock mode (src/data/mockDb.json)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# ==========================================
# NextAuth Session Authentication Settings
# ==========================================
# Secret key used to encrypt cookie tokens. Generate one using: openssl rand -base64 32
NEXTAUTH_SECRET=ventrixa-secret-key-dev-only
# Server base URL address
NEXTAUTH_URL=http://localhost:3000

# ==========================================
# AI Compilation Engine Configurations
# ==========================================
# OpenAI API Key (Required for remote ChatGPT models generation)
OPENAI_API_KEY=sk-proj-xxxx...
# Gateway URL. Change to target a local Ollama API server: http://127.0.0.1:11434/v1
OPENAI_API_BASE_URL=http://127.0.0.1:11434/v1
# Active text compilation model name
AI_MODEL=gpt-4o-mini
```

---

## 3. Database Configurations & Migration

### 3.1 Dual-Database Modes
- **File Mock Database (Development Mode)**: If no `MONGODB_URI` is supplied in the environment, the database operations layer (`src/lib/db.ts`) reads and writes documents directly to a local JSON file (`src/data/mockDb.json`).
  - *No migration required*.
  - To clear or reset all data, delete the `src/data/mockDb.json` file. The application will regenerate an empty initial schema on the next request.
- **MongoDB Atlas Mode (Production Mode)**: When `MONGODB_URI` is configured, Mongoose establishes a pooled connection connection to the MongoDB Atlas cluster.
  - The database name is configured as `ventrixa` inside `src/lib/mongodb.ts`.

### 3.2 Indexes & Collection Initialization
Mongoose automatically initializes collections and creates indexes defined in the schema models upon first database connection:
- `User` collection: Unique index on the `email` field.
- `Website` collection: Unique index on the `subdomain` field.
- `Project` collection: Index on the `userId` field to speed up dashboard listings.
- `Page` collection: Index on the `websiteId` field.
- `Section` collection: Index on the `pageId` field.

---

## 4. Build & Testing Procedures

### 4.1 Production Compile Build
To compile the Next.js application, build client bundles, optimize CSS variables, and verify TypeScript types:
```bash
npm run build
```
The compiled output is written to the `.next/` directory.

### 4.2 Start Production Bundle
After a successful build run, launch the production server:
```bash
npm run start
```

### 4.3 Validation & Code Quality checks
Verify that the codebase complies with strict compilation guidelines:
```bash
# Execute ESLint validations
npm run lint

# Validate TypeScript type consistency
npx tsc --noEmit
```

---

## 5. Production Deployment Guide

### 5.1 Dockerization (Container Deployment)
To package Ventrixa into an isolated, platform-independent Docker container:

Create a multi-stage `Dockerfile` in the project root:

```dockerfile
# --- Stage 1: Build Environment ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 2: Runtime Environment ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]
```

Build the container image:
```bash
docker build -t ventrixa:0.1.0 .
```

Run the container, exposing port 3000:
```bash
docker run -d -p 3000:3000 --env-file .env.production ventrixa:0.1.0
```

### 5.2 Server Deployment using PM2
For virtual machines (VMs) or bare-metal servers, use **PM2** to run the app as a background process:
1. Compile the build on the target machine:
   ```bash
   npm run build
   ```
2. Start the process using PM2:
   ```bash
   pm2 start npm --name "ventrixa" -- start
   ```
3. Save the PM2 list and configure startup scripts:
   ```bash
   pm2 save
   pm2 startup
   ```

---

## 6. Infrastructure & Operations Management

### 6.1 Security Configurations
- **Session Tokens**: Use secure JWT tokens. In production, NextAuth requires HTTPS; verify that `NEXTAUTH_URL` begins with `https://`.
- **API Inputs**: API routes validate parameters before making database queries.
- **Node Modules Hygiene**: Always use `npm ci` in CI pipelines to install exact package locks and prevent supply-chain drift.

### 6.2 Monitoring & Observability Setup
- **Health Checks**: Configure `/api/health` probes on load balancers (e.g. AWS ALB or NGINX) to verify application uptime.
- **Database Logs**: Monitor slow queries, read/write latency, and concurrent connections on the MongoDB Atlas dashboard.
- **Server Logs**: Aggregate PM2 logs (`~/.pm2/logs/`) or Docker container stdout streams into logging solutions like Datadog, Grafana Loki, or Elasticsearch.

### 6.3 Backup and Recovery Procedures
- **Database Backup**: Enable automated, point-in-time recovery (PITR) backups in the MongoDB Atlas console (under Cluster Backup Settings).
- **Subdomain Configurations**: In the event of server failures, redeploying containers with the correct environment variables will immediately resume subdomain operations, as site metadata is loaded dynamically from the database.
