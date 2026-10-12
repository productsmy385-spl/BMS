# ADR 003: Role-Based Access Control & Strict Tenant Scoping

## Status
Accepted

## Context
FlowDineOS serves diverse user types across multiple bakeries: Platform Super Admins, Bakery Owners, Store Managers, Kitchen Chefs, and Delivery Drivers. Without strict server-side boundary checks, unauthorized users could tamper with URLs or parameters to access another bakery's data, manipulate staff rosters, or access financial records.

## Decision
1. **Separation of Authentication and Authorization**:
   - Authentication verifies user identity (via Clerk or session).
   - Authorization checks organization membership and role permissions per request.
2. **Strict Scopes**:
   - **Chef**: Restricted strictly to the Kitchen Display (`/kitchen/[tenantSlug]`). Cannot access staff, billing, settings, or delivery agents.
   - **Delivery Agent**: Restricted strictly to the Delivery Portal (`/delivery/[tenantSlug]`). Cannot access menu administration, kitchen settings, or financial reports.
3. **Server-Side Enforcement**:
   - Every protected API Route Handler verifies that the caller's session possesses the required permission.
   - Frontend route guards provide UX redirects, but backend guards act as the authoritative gate.

## Consequences
- Guaranteed cross-tenant isolation and role segregation.
- Automated security integration tests verify that a chef calling a staff API or a driver querying menu management is blocked with HTTP 403 Forbidden.
