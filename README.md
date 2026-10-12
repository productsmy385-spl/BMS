# FlowDineOS — Complete Multi-Tenant Bakery Management SaaS Platform

**FlowDineOS** is a multi-tenant cloud-native Bakery Management SaaS platform built from scratch with Next.js (App Router), TypeScript strict mode, Prisma ORM, PostgreSQL, Socket.IO, Web Speech API, and Interakt WhatsApp integration.

---

## 1. Core Operating Model
The platform owner is the **FlowDineOS Super Admin**. The Super Admin provisions and activates multiple independent bakery organizations. Each organization automatically receives:
- **Dynamic Public Website (`/[tenantSlug]`)**: Dynamically rendered with tenant brand kit colors, customized cake designer, menu categories, operating hours, and a prominent **Staff Login** button.
- **Tenant Console (`/admin/[tenantSlug]`)**: Operational dashboard, inventory control, staff management, custom roles, sales reports, data import/export, and brand kit customization.
- **Counter Touch POS (`/pos/[tenantSlug]`)**: High-speed cashier terminal with cash/UPI/card split payments, receipt printing, and atomic stock decrements.
- **Kitchen View & Voice KOT (`/kitchen/[tenantSlug]`)**: Real-time kitchen tickets with state progression (`NEW` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `COMPLETED`) and bilingual speech queue (**English & Telugu**) via Web Speech API.
- **Delivery-Agent Dashboard (`/delivery/[tenantSlug]`)**: Role-scoped driver portal showing assigned deliveries, customer address/notes, and pickup/delivery actions.
- **Interakt WhatsApp Engine**: Durable outbox pattern triggering automated customer notifications on Chef `READY` and Driver `PICKED_UP`.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Persona | Scope | Access Points | Strict Restrictions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Platform-wide | `/super-admin`, all organizations | Cannot tamper with tenant data arbitrarily |
| **Bakery Admin** | Tenant-wide | `/admin/[tenantSlug]`, `/pos/*`, `/kitchen/*`, `/delivery/*` | Cannot access other bakery organizations |
| **Order Manager** | Tenant-wide | `/admin/[tenantSlug]`, `/pos/*`, `/kitchen/*`, `/delivery/*` | Cannot alter staff permissions or billing |
| **Chef / Kitchen** | Tenant-scoped | `/kitchen/[tenantSlug]` | **BLOCKED** from staff, financials, settings, other tenants |
| **Delivery Agent** | Tenant-scoped | `/delivery/[tenantSlug]` | **BLOCKED** from admin, menu, financials, other tenants |
| **POS Staff** | Tenant-scoped | `/pos/[tenantSlug]` | **BLOCKED** from staff, settings, financials |

---

## 3. Workflow Pipelines

### 3.1 Kitchen-to-Delivery & WhatsApp Notification Flow
```text
Chef marks READY ──► Order status = READY_FOR_PICKUP
                 ──► Delivery assignment initialized / driver notified
                 ──► Customer WhatsApp queued via Interakt outbox:
                     "Your order #X is ready. We will update you when it is picked up."

Driver marks PICKED_UP ──► Order status = OUT_FOR_DELIVERY
                       ──► Customer WhatsApp queued via Interakt outbox:
                           "Your order #X has been picked up by our driver and is on its way."

Driver marks DELIVERED ──► Order status = DELIVERED & archived
```

### 3.2 Dynamic Public Storefront Staff Login Flow
```text
Public Storefront (/[tenantSlug]) ──► Clicks "Staff Login"
                                  ──► Selects Employee Profile (Admin, Chef, Driver, Cashier)
                                  ──► Membership verified on server
                                  ──► Chef routed to /kitchen/[tenantSlug]
                                  ──► Driver routed to /delivery/[tenantSlug]
                                  ──► Admin routed to /admin/[tenantSlug]
                                  ──► Unauthorized / Cross-tenant access BLOCKED
```

---

## 4. Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` / `POST` | `/api/v1/tenants` | List all organizations or provision new bakery tenant |
| `GET` / `POST` | `/api/v1/tenants/:id/orders` | List orders or place new validated public/POS order |
| `GET` / `PATCH` | `/api/v1/tenants/:id/kitchen/tickets` | Polling and state updates for KOT tickets |
| `GET` / `PATCH` | `/api/v1/tenants/:id/delivery/assignments` | Driver portal assignment queries and status updates |
| `GET` / `POST` | `/api/v1/tenants/:id/staff` | Staff directory and team member invitation |
| `GET` / `POST` | `/api/v1/tenants/:id/roles` | Custom roles and granular permission assignments |
| `GET` / `POST` | `/api/v1/tenants/:id/data` | Tenant-isolated CSV/JSON data export & catalog import |
| `GET` / `POST` | `/api/v1/tenants/:id/notifications` | WhatsApp outbox queue inspection and manual retries |

---

## 5. Verification & Testing

To execute the automated test suite:
```bash
npm test
```
All 20 tests pass across 8 test suites:
1. BMS Pricing & Calculation Engine
2. BMS Bilingual Voice Announcement Queue (English & Telugu)
3. BMS Thermal ESC/POS Printer Formatter (80mm & 58mm)
4. BMS Interakt WhatsApp Integration & Menu Inquiries
5. BMS Multi-Tenant Logical Isolation
6. Kitchen-to-Delivery and WhatsApp Notification Workflow
7. Role-Based Authorization & Scope Restriction Enforcement
8. Staff Directory & Custom Roles Management

To verify strict TypeScript typing:
```bash
npx tsc --noEmit
```
Exits with **0 errors**.

---

## 6. Railway Production Deployment
1. Set Railway environment variables:
   - `DATABASE_URL`: Managed Railway PostgreSQL connection string with SSL
   - `PORT`: `3000` (or Railway assigned port)
   - `NEXT_PUBLIC_APP_URL`: Production origin URL
2. Run database migration in Railway pre-deploy step:
   ```bash
   npx prisma migrate deploy
   ```
3. Build & start application:
   - Build: `npm run build`
   - Start: `npm start`
