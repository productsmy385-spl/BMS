# ADR 003: Authentication and Authorization Strategy

## Status
Accepted

## Context
Bakery owners need quick access without complex setup, while production deployments may require enterprise identity providers like Clerk. Crucially, authentication (identity) must be decoupled from tenant authorization (membership & permissions).

## Decision
1. Decoupled Identity: The authentication layer verifies the user's identity (e.g., Clerk or internal session).
2. BMS Authorization Engine: The backend resolves user permissions via `TenantMembership` entity.
3. Super Admin Flag: Explicit system-level role for platform operators.
4. Role Hierarchy:
   - `SUPER_ADMIN`: Cross-tenant system administration.
   - `BAKERY_ADMIN`: All operations within a specific tenant.
   - `POS_STAFF`: Checkout, cart, payments, receipt printing.
   - `KITCHEN_STAFF`: KOT management, kitchen updates, voice queue.
   - `DELIVERY_STAFF`: Delivery dispatches and status updates.

Frontend navigation restrictions are never treated as security boundaries; all API routes and server actions strictly enforce authorization on the backend.
