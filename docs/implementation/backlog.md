# Detailed Implementation Backlog

## Phase 1: Foundation & Data Architecture
- [x] **Slice 1.1**: Initialize project, TypeScript strict config, Tailwind CSS & styling.
- [ ] **Slice 1.2**: Comprehensive multi-tenant Prisma schema with all 22 required entities.
- [ ] **Slice 1.3**: Database migration & rich multi-tenant development seed script.
- [ ] **Slice 1.4**: Core utilities (Prisma client, error handling, tenant scoping helpers).

## Phase 2: Tenant Management & Super Admin
- [ ] **Slice 2.1**: Super Admin API & UI to provision bakeries and manage tenants.
- [ ] **Slice 2.2**: Tenant resolution middleware and server-side RBAC authorization guards.
- [ ] **Slice 2.3**: Automated tenant isolation test suite.

## Phase 3: Product Catalog & Customized Cakes
- [ ] **Slice 3.1**: Category & Product management APIs with ImageKit upload integration.
- [ ] **Slice 3.2**: Configurable customized cake options (flavour, sponge, tiers, cream, custom message).
- [ ] **Slice 3.3**: Bakery Admin Catalog management UI.

## Phase 4: Public Website & Dynamic Color Theme Engine
- [ ] **Slice 4.1**: Dynamic storefront route (`/[tenantSlug]`) rendering bakery catalog.
- [ ] **Slice 4.2**: Theme customizer with persistent DB storage (primary, secondary, background, buttons, text colors).
- [ ] **Slice 4.3**: Online order cart & custom cake ordering wizard with server-side price validation.

## Phase 5: Counter POS & Order Management
- [ ] **Slice 5.1**: High-speed touch-friendly Counter POS UI with category filters & cart.
- [ ] **Slice 5.2**: Order creation service handling both POS and Web channels.
- [ ] **Slice 5.3**: Order management dashboard with status pipeline.

## Phase 6: Inventory Management
- [ ] **Slice 6.1**: Real-time stock decrement transactions.
- [ ] **Slice 6.2**: Stock adjustments with mandatory reason logging.
- [ ] **Slice 6.3**: Low-stock alerts and inventory movement audit views.

## Phase 7: Kitchen Order Tickets (KOT)
- [ ] **Slice 7.1**: KOT service generating tickets from orders.
- [ ] **Slice 7.2**: Real-time Kitchen display with Socket.IO live updates.
- [ ] **Slice 7.3**: Kitchen staff ticket progress workflow (NEW -> PREPARING -> READY -> COMPLETED).

## Phase 8: Voice Order Queue
- [ ] **Slice 8.1**: Web Speech API audio announcer supporting English & Telugu speech.
- [ ] **Slice 8.2**: Duplicate audio announcement suppression & mute controls.

## Phase 9: Payments & Receipts
- [ ] **Slice 9.1**: Payment records (Cash, UPI, Card, Store Credit) with partial/balance tracking.
- [ ] **Slice 9.2**: Printable thermal receipts (80mm/58mm) and built-in print preview emulator.

## Phase 10: WhatsApp Integration (Interakt)
- [ ] **Slice 10.1**: Transactional notification outbox dispatcher for order status alerts.
- [ ] **Slice 10.2**: Inbound webhook for customer menu inquiries.

## Phase 11: Delivery Operations
- [ ] **Slice 11.1**: Delivery assignment and status progression workflow.

## Phase 12: Dashboards, Reports & Audit
- [ ] **Slice 12.1**: Role-based dashboards (Super Admin, Bakery Owner, POS).
- [ ] **Slice 12.2**: Sales, payments, and product sales reports.
- [ ] **Slice 12.3**: Security audit log inspection.

## Phase 13: Hardening & Testing
- [ ] **Slice 13.1**: Automated test suite (unit, integration, tenant isolation).
- [ ] **Slice 13.2**: Production build verification.
