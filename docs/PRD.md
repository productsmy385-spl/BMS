# Product Requirements Document (PRD)
## FlowDineOS — Complete Multi-Tenant Bakery Management SaaS Platform

---

## 1. Executive Summary
**FlowDineOS** is a multi-tenant cloud SaaS platform built from scratch for bakery enterprises, artisanal patisseries, and custom cake studios.

The platform is architected around **three strictly separated application experiences**:
1. **Experience A: Public FlowDineOS SaaS Website (`/`)**: High-converting marketing landing page, product feature breakdowns, bilingual voice KOT explanation, tiered pricing packages matrix, Terms & Conditions (`/terms`), Privacy Policy (`/privacy`), and a live Book a Demo portal (`/book-demo`). Completely public; no private tenant data or Super Admin links.
2. **Experience B: Private Super Admin Panel (`/super-admin`)**: Secured platform owner console for provisioning organizations, assigning packages and feature entitlements, tracking platform metrics, updating demo request leads, and inspecting immutable audit logs.
3. **Experience C: Tenant Applications**:
   - **Dynamic Public Bakery Storefront (`/[tenantSlug]`)**: Dynamically branded customer portal with daily menu, custom cake studio, manual UPI payment with QR code, and **Staff Login** button. **STRICT RULE**: No Super Admin links or buttons appear on any tenant's public website.
   - **Private Tenant Operations Console (`/admin/[tenantSlug]`)**: Full back-office suite including Orders with **"Share to Voice KOT"**, Kitchen KOT, Delivery Dashboard, Menu, Inventory, UPI Reconciliation & Manual Verification, Customers, Staff & Roles, Brand Kit, Reports, and Data Import/Export.

*Explicitly Excluded*: IVR, phone call-routing, and automated voice calling.

---

## 2. Architecture & Ownership Paradigm
- **Three Strictly Separated Experiences**: The SaaS marketing presence, platform super admin, and tenant-scoped operational consoles maintain distinct route namespaces, navigation systems, and access controls.
- **Super Admin Platform Owner**: Directly provisions bakery organizations with custom branding, package assignments (`Starter`, `Growth`, `Enterprise`), website presets, and initial admin accounts.
- **Tenant Isolation**: Bakery A and Bakery B data are strictly isolated. No cross-tenant data leakage is permitted via URL tampering, API parameters, or database queries.
- **Manual UPI Payment Reconciliation**: Direct customer-to-merchant UPI flow. The customer scans the bakery's QR code or uses the UPI ID, inputs their 12-digit UTR reference, and the order is marked `PENDING_VERIFICATION` until verified by cashier staff.
- **Voice KOT Announcements (Not Auto-Printing)**: Incoming orders and manual cashier selections are queued for bilingual voice announcements (English and Telugu) in the kitchen.
- **Authoritative Database**: PostgreSQL/Prisma is the single source of truth. WhatsApp notifications, real-time events, and printer jobs are asynchronous side effects that never compromise database transactions.

---

## 3. Core Personas & Role Matrix

| Role | Scope | Permitted Access | Restricted From |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Platform-wide | Organization creation, tenant activation, global audit logs, platform settings | Ordinary tenant data mixing |
| **Organization Admin** | Tenant-wide | All operational modules: Menu, Orders, Kitchen, Delivery, Staff, Roles, Website, Brand Kit, Inventory, Reports, Settings | Other tenant data, Super Admin platform settings |
| **Manager** | Tenant-wide | Operations, POS, Orders, Kitchen, Delivery, Inventory, Reports | Staff permission elevation, Billing |
| **Chef / Kitchen Staff** | Tenant-scoped | Kitchen View (`/kitchen/[tenantSlug]`), KOT status progression (`NEW` -> `ACCEPTED` -> `PREPARING` -> `READY`), voice KOT controls | Staff management, roles, financial reports, website settings, other tenants |
| **Delivery Agent** | Tenant-scoped | Delivery Dashboard (`/delivery/[tenantSlug]`), assigned orders, customer delivery address/notes, pickup & delivery status updates (`PICKED_UP` -> `OUT_FOR_DELIVERY` -> `DELIVERED`) | Admin console, menu editing, financial reports, other delivery agents' private records, other tenants |
| **Customer** | Public storefront | Storefront menu browsing, customized cake builder, cart, order placement, WhatsApp status receipts | Tenant console, backend administration |

---

## 4. Key Functional Modules

### 4.1 Super Admin Organization Provisioning
- Fast organization creation form: Name, unique slug, contact phone, email, address, operating hours, currency, timezone, logo URL, brand color palette.
- Dynamic route provisioning: Immediately activates `/[tenantSlug]`.
- Initial admin user provisioning with secure credentials.

### 4.2 Dynamic Public Storefront (`/[tenantSlug]`)
- Shared renderer driven by database records.
- Configurable sections: Header, Hero banner, Logo, Main Menu, Published Today, Customized Cakes, About, Operating Hours, Contact, WhatsApp button, and **Staff Login** button.
- Live Brand Kit styling: dynamically applies primary, secondary, card, background, button, and text colors.

### 4.3 Staff Login & Cross-Tenant Security
- Public storefront features a dedicated **Staff Login** button.
- Authenticates staff and resolves organization membership and role permissions.
- Automatically routes user:
  - Chef -> Kitchen View
  - Delivery Agent -> Delivery Dashboard
  - Manager / Admin -> Tenant Console
- Server-side RBAC guards block cross-tenant URL manipulation.

### 4.4 Customized Cake Builder
- Configurable made-to-order cake studio: Cake type, flavour, sponge, frosting/cream, shape, tiers/layers, message on cake, reference photo URL, delivery/pickup date-time.
- Authoritative server-side price validation preventing tampering.

### 4.5 Kitchen Order Tickets (KOT) & Bilingual Voice Announcements
- Order pipeline: `NEW` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `COMPLETED`.
- Bilingual audio announcements in **English** and **Telugu** via Web Speech API.
- Live Socket.IO synchronization + resilient polling fallback.

### 4.6 Delivery-Agent Dashboard & Workflow
- Dedicated portal at `/delivery/[tenantSlug]`.
- Displays orders assigned to the authenticated driver.
- Status workflow: `KITCHEN READY` -> `DELIVERY AGENT NOTIFIED` -> `ASSIGNED` -> `PICKED_UP` -> `OUT_FOR_DELIVERY` -> `DELIVERED`.

### 4.7 WhatsApp Notification Workflow (Interakt)
- **Chef marks READY**: Order and KOT persist to `READY` -> delivery agent notified in-app -> customer WhatsApp message queued: *"Your order #X is ready. We will update you when it is picked up for delivery."*
- **Delivery Agent marks PICKED_UP**: Status persisted to `PICKED_UP` -> customer WhatsApp message queued: *"Your order #X has been picked up by our delivery agent and is on its way."*
- Durable outbox pattern with retry mechanism, idempotency keys, and failure logging.

### 4.8 Thermal Printing Architecture
- 80mm & 58mm ESC/POS formatters for customer receipts and kitchen tickets.
- Print queue with status tracking (`PENDING`, `PRINTED`, `FAILED`).
- Built-in interactive thermal receipt emulator.

### 4.9 Data Management & Import/Export
- Tenant-scoped CSV/JSON export for orders, inventory, products, and sales.
- Tenant-scoped CSV/JSON import with validation and row-level error reporting.

### 4.10 Audit Logs & System Settings
- Comprehensive immutable audit trail logging actor, action, entity, tenant, and timestamp.
- Fine-grained organization and integration settings (Interakt, ImageKit, ESC/POS printer IP).
