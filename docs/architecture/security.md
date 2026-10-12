# Security & Multi-Tenant Isolation Architecture

## 1. Multi-Tenant Logical Isolation Principles
1. **Never Trust Client Tenant Identifiers**: The client may pass a tenant ID or slug in the request, but server-side authorization must verify that the authenticated user possesses an active `TenantMembership` for that specific `tenantId`.
2. **Prisma Query Scoping**: All database queries for tenant data MUST include `where: { tenantId }`. No raw queries without parameterization.
3. **Cross-Tenant Access Defense**: Unit & integration tests explicitly test that User A belonging to Tenant A receives a `403 Forbidden` or `404 Not Found` when requesting resources belonging to Tenant B.

---

## 2. Authentication & Authorization Model
- **Authentication**: Dual-support architecture:
  - Clerk Auth for enterprise production deployments with OAuth / OTP.
  - Built-in session/JWT authentication provider for self-contained / on-premise deployments and development testing.
- **Role-Based Access Control (RBAC)**:
  - `SUPER_ADMIN`: Access to tenant management, billing, global audit logs.
  - `BAKERY_ADMIN`: Full access to bakery catalog, staff, theme settings, integrations, reports.
  - `POS_STAFF`: Limited to POS catalog, checkout, payment recording, order queries.
  - `KITCHEN_STAFF`: Limited to KOT screens, ticket status progression, voice queue alerts.
  - `DELIVERY_STAFF`: Limited to assigned delivery dispatches and status updates.

---

## 3. Secret Protection & Integration Security
1. **Third-Party Keys**: ImageKit private keys, Interakt API tokens, and webhook secrets are stored strictly on the server in encrypted environment variables or database-level encrypted integration settings. They are never exposed to browser bundles.
2. **ImageKit Upload Security**: Images uploaded from clients use time-limited HMAC-SHA1 signature tokens generated on the server via `GET /api/v1/integrations/imagekit/auth`.
3. **Webhook Verification**: Inbound Interakt webhooks are validated with signature verification headers.
4. **Audit Trails**: All mutations (price adjustments, inventory stock overrides, order cancellations, refund issuances) write immutable records to `AuditLog`.
