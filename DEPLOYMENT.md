# FlowDineOS — Railway Production Deployment Guide

This guide details the exact steps for deploying FlowDineOS to **Railway** using Railway's dashboard settings, managed PostgreSQL, and native Node.js runtime environment.

> [!IMPORTANT]
> **No Configuration Files Required**: FlowDineOS adheres strictly to container environment variable standards. Do not create or commit `railway.json` or `railway.toml`. Railway automatically configures the Node.js environment from `package.json`.

---

## 1. Railway Architecture Overview

FlowDineOS operates as a dual-service architecture on Railway:

1. **Managed PostgreSQL Service**: Persistent relational database powering multi-tenant organizations, catalogs, orders, inventory, staff, and audit ledgers.
2. **Web Application Service (Next.js + Socket.IO Server)**: Custom HTTP server (`server.ts`) hosting Next.js 15 SSR/APIs and the Socket.IO real-time event pipeline on a single persistent port.

```mermaid
graph TD
    Client["Browser / Kitchen Tablet / POS / Mobile"] -->|"HTTPS / WSS"| RailwayRouter["Railway Ingress & Load Balancer"]
    RailwayRouter -->|"Proxy to :$PORT"| FlowDineServer["FlowDineOS Node Server (server.ts)"]
    FlowDineServer -->|"Next.js App Router"| NextApp["Pages, Storefronts, API Handlers"]
    FlowDineServer -->|"Socket.IO Engine"| RealtimeHub["KOT & Kitchen Voice Dispatch"]
    NextApp -->|"Prisma Client"| RailwayPostgres[("Railway Managed PostgreSQL")]
```

---

## 2. Environment Variables Checklist

Configure these variables within the **Variables** tab of the FlowDineOS service on the Railway Dashboard:

| Variable Name | Required | Description | Example / Recommended Value |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Railway PostgreSQL connection string with SSL mode. In Railway, reference via template variable: `${{Postgres.DATABASE_URL}}`. | `postgresql://user:pass@host:5432/railway?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Public domain of the deployed application used for WebSocket CORS origin and WhatsApp links. | `https://flowdineos-production.up.railway.app` |
| `PORT` | **Automatic** | Provided by Railway runtime dynamically. Binds to `0.0.0.0`. | Railway sets automatically (e.g. `3000` or dynamic port) |
| `NODE_ENV` | **Yes** | Node environment mode. | `production` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Clerk authentication public key for user auth. | `pk_test_...` |
| `CLERK_SECRET_KEY` | Optional | Clerk private API secret key (kept server-side only). | `sk_test_...` |
| `INTERAKT_API_KEY` | Optional | Interakt WhatsApp Business API key for customer notifications. | `Bearer <your_interakt_key>` |
| `INTERAKT_WEBHOOK_SECRET` | Optional | Secret token for validating inbound Interakt webhooks. | `<webhook_secret>` |
| `IMAGEKIT_PUBLIC_KEY` | Optional | ImageKit public key for cake photo uploads. | `public_...` |
| `IMAGEKIT_PRIVATE_KEY` | Optional | ImageKit secret key (kept server-side only). | `private_...` |
| `IMAGEKIT_URL_ENDPOINT` | Optional | ImageKit CDN domain URL. | `https://ik.imagekit.io/flowdine/` |

---

## 3. Deployment Commands Configuration

In the Railway Service Settings, configure the following commands:

* **Build Command**:
  ```bash
  npm run build
  ```
  *(Executes `prisma generate && next build`)*

* **Pre-Deploy Command** (under Service Settings > Deploy):
  ```bash
  npx prisma migrate deploy
  ```
  *(Applies pending migrations idempotently to the PostgreSQL database without dropping tables)*

* **Start Command**:
  ```bash
  npm start
  ```
  *(Executes `NODE_ENV=production tsx server.ts`, launching the combined Next.js + Socket.IO server on `0.0.0.0:$PORT`)*

* **Health Check Path**:
  ```text
  /api/health
  ```
  *(Returns HTTP 200 `{ status: "ok", service: "flowdineos-bms", uptime: ... }`)*

---

## 4. Initial Database Seeding (First-Time Setup)

When deploying to a brand new PostgreSQL database for the first time:

1. Open the Railway dashboard for the service.
2. Click **CLI / Shell** (or connect via Railway CLI with `railway run`).
3. Run the seed script:
   ```bash
   npm run db:seed
   ```
4. This populates initial demo organizations (`sweet-delights`, `crumb-crust`), starter menu items, inventory ingredients, packages, and staff members.

---

## 5. WebSockets & Real-Time Voice KOT on Railway

* FlowDineOS uses `server.ts` to attach Socket.IO directly to the Node.js HTTP server.
* Railway provides native WebSocket proxying over HTTPS (`wss://`).
* Ensure `NEXT_PUBLIC_APP_URL` matches your custom domain or `*.up.railway.app` so that Socket.IO CORS accepts connections from client devices.
* In a single-instance Railway deployment, the in-memory room dispatcher routes real-time events immediately. If scaling horizontally across multiple Railway replicas, attach the Redis Socket.IO adapter using Railway Redis.

---

## 6. Post-Deployment Smoke Verification

After deployment succeeds:

1. **Verify Health Check**: Visit `https://your-domain.up.railway.app/api/health` -> verify `status: "ok"`.
2. **Verify Public SaaS Website**: Visit `https://your-domain.up.railway.app/` -> verify marketing page, pricing matrix, and demo lead capture.
3. **Verify Demo Lead Submission**: Submit the form at `/book-demo` -> verify status is stored.
4. **Verify Super Admin**: Visit `/super-admin` -> verify organization listing and package matrix.
5. **Verify Tenant Storefront**: Visit `/sweet-delights` -> verify brand kit, custom cake studio, manual UPI instructions, and Staff Login button. Ensure zero Super Admin links appear.
6. **Verify Kitchen Screen**: Visit `/kitchen/sweet-delights` -> verify KOT cards and click to enable voice announcement audio.
