# Production deployment checklist

1. Provision managed PostgreSQL and set `DATABASE_URL` only in server environment variables.
2. Deploy on a persistent Node.js host supporting WebSocket upgrades. Configure `npm run build`, `npm start`, and pre-deploy `npx prisma migrate deploy`.
3. Set `NEXT_PUBLIC_APP_URL` to the exact public app origin. Test Socket.IO connections through TLS/proxy.
4. Before launch, protect menu mutations and order status changes with Clerk server-side authentication and local permission checks. Do not rely only on middleware/client route hiding.
5. Add per-IP/customer rate limiting to checkout and input abuse protections; add idempotency for order submission.
6. Add transaction/outbox strategy for reliable event delivery. If scaling to multiple instances, configure Redis adapter; the included in-memory Socket.IO server is single-instance only.
7. Add automated tests for order pricing, stock races, state transitions, validation, and unauthorized access.
8. Configure backups, restore drills, logs/alerts, health checks, and retention policy.
9. Set integration credentials only when implementing the corresponding integration. Keep private tokens server-side and rotate exposed credentials immediately.
10. Test on a physical Android device and the kitchen display browser; ensure audio is enabled via a user gesture.
