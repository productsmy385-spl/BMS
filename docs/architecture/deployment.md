# Deployment & Infrastructure Architecture

## 1. Target Infrastructure Model
The application is architected to run on cloud platforms supporting Node.js long-running processes (or containerized deployments such as Docker, Railway, Render, Fly.io, AWS ECS, or GCP Cloud Run with session affinity) because Socket.IO requires persistent WebSockets or long-polling HTTP connections.

---

## 2. Infrastructure Components

### 2.1 Compute (Web & Socket Server)
- **Container / VM Process**: Runs `node server.js` (or `tsx server.ts` in dev).
- **HTTP / HTTPS Proxy**: Caddy / Nginx / Cloudflare terminating SSL and forwarding WebSocket upgrades (`Upgrade: websocket`).
- **Real-Time Scaling**: Single-instance in standard setups; when scaling horizontally to multiple instances, Socket.IO is configured with `@socket.io/redis-adapter` so cross-instance rooms broadcast seamlessly.

### 2.2 Database (PostgreSQL)
- Managed PostgreSQL 15+ (e.g., Supabase, Neon, AWS RDS, Railway Postgres).
- SSL Mode enabled (`sslmode=require`).
- Connection pooling configured via Prisma Accelerate or PgBouncer with `connection_limit=20`.

### 2.3 Background Jobs & Notifications
- Outbox pattern via PostgreSQL: Failed WhatsApp notifications or print jobs are retried with exponential backoff via a lightweight background worker loop running inside the server process.

---

## 3. Production Environment Variables Checklist

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/bakery?sslmode=require` |
| `PORT` | Listening port for HTTP server | `3000` |
| `NEXT_PUBLIC_APP_URL` | Canonical public URL | `https://bakeryms.com` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key (if enabled) | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_...` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | `private_...` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit endpoint URL | `https://ik.imagekit.io/bms` |
| `INTERAKT_API_KEY` | Interakt WhatsApp API key | `api_key_...` |
| `INTERAKT_WEBHOOK_SECRET` | Interakt webhook signing secret | `whsec_...` |
