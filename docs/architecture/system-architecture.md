# System Architecture — FlowDineOS

## 1. High-Level Architecture Overview

FlowDineOS is architected as a modular, multi-tenant SaaS application running Next.js (App Router), TypeScript, Prisma ORM, and PostgreSQL. It delivers distinct entry portals for Platform Super Admin, Tenant Administrators, Public Storefront Visitors, Kitchen Staff, and Delivery Agents.

```mermaid
graph TD
    Client[Web & Mobile Browsers] --> Ingress[Reverse Proxy / Next.js Server]
    
    subgraph Routing & Portals
        Ingress --> SuperAdmin[Platform Super Admin: /super-admin]
        Ingress --> PublicStore[Dynamic Bakery Storefront: /[tenantSlug]]
        Ingress --> TenantAdmin[Tenant Console: /admin/[tenantSlug]]
        Ingress --> KitchenDisplay[Kitchen Display & Voice KOT: /kitchen/[tenantSlug]]
        Ingress --> DeliveryPortal[Delivery Agent Dashboard: /delivery/[tenantSlug]]
    end

    subgraph Core Services & Middleware
        Auth[Clerk / Session RBAC Guard]
        TenantResolver[Tenant Resolution & Isolation Middleware]
        OrderEngine[Order & KOT Lifecycle Service]
        Realtime[Socket.IO Real-time Broadcaster]
        OutboxWorker[WhatsApp Notification Outbox Engine]
    end

    TenantAdmin --> Auth
    KitchenDisplay --> Auth
    DeliveryPortal --> Auth
    SuperAdmin --> Auth

    Auth --> TenantResolver
    TenantResolver --> OrderEngine
    OrderEngine --> Realtime
    OrderEngine --> OutboxWorker

    subgraph Data & Storage
        DB[(Railway PostgreSQL: Prisma ORM)]
        ImageStorage[ImageKit CDN]
    end

    OrderEngine --> DB
    TenantResolver --> DB

    subgraph External Integrations
        OutboxWorker --> Interakt[Interakt WhatsApp API]
        Realtime --> LocalPrintAgent[FlowDineOS LAN Print Agent]
    end
```

---

## 2. Multi-Tenant Flow & Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    actor Chef
    actor DeliveryAgent
    participant Browser
    participant API as FlowDineOS Backend
    participant DB as PostgreSQL
    participant Outbox as Notification Queue
    participant Interakt as Interakt WhatsApp

    Customer->>Browser: Places Order on /[tenantSlug]
    Browser->>API: POST /api/v1/tenants/:slug/orders
    API->>DB: Validate prices, create Order & KOT (Status: NEW)
    API->>Browser: Order Confirmed #101

    Chef->>Browser: Marks KOT Status = READY
    Browser->>API: PATCH /api/v1/tenants/:slug/kitchen/tickets
    API->>DB: Update status to READY, identify delivery agent
    API->>Outbox: Enqueue Customer "Order Ready" WhatsApp
    API->>Browser: Bilingual Voice Announcement ("Order 101 Ready")
    Outbox->>Interakt: Send WhatsApp ("Your order #101 is ready!")

    DeliveryAgent->>Browser: Marks Status = PICKED_UP
    Browser->>API: PATCH /api/v1/tenants/:slug/delivery/orders/:id/pickup
    API->>DB: Verify driver assignment, update status to PICKED_UP
    API->>Outbox: Enqueue Customer "Order Picked Up" WhatsApp
    Outbox->>Interakt: Send WhatsApp ("Order #101 is out for delivery!")
```

---

## 3. Core Component Boundaries

### 3.1 Super Admin Module
- **Organization Provisioning**: Creates tenant records, initializes bakery profile, default website theme, and creates initial organization administrator.
- **Platform Health & Metrics**: Displays platform-wide tenant counts, order volumes, and system audit logs.

### 3.2 Dynamic Storefront Renderer
- Shared dynamic layout matching `/[tenantSlug]`.
- Reads `WebsiteSettings` and `BakeryProfile` to apply tenant-specific brand tokens dynamically (CSS variables for primary, secondary, card, background, text colors).
- Embeds a **Staff Login** action button leading to tenant role authentication.

### 3.3 Kitchen View & Voice Queue
- Displays real-time tickets with visual status progression (`NEW` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `COMPLETED`).
- Bilingual speech generation (English + Telugu) via Web Speech API with duplicate speech suppression.

### 3.4 Delivery-Agent Dashboard
- Dedicated, secure interface for delivery agents (`/delivery/[tenantSlug]`).
- Strictly isolated: drivers only view orders assigned to them or unassigned ready orders for pickup.
- One-click status triggers: `PICKED_UP` and `DELIVERED`.

### 3.5 Interakt WhatsApp Notification Subsystem
- Authoritative database operations succeed independently of external HTTP availability.
- Durable Outbox pattern stores notification jobs in PostgreSQL (`Notification` model) with retry tracking, template parameters, and error logs.
