# ADR 002: Multi-Tenant Architecture & Data Isolation

## Status
Accepted

## Context
BMS is a SaaS catering to multiple independent bakeries. We evaluated three architectural patterns:
1. Database-per-tenant
2. Schema-per-tenant
3. Shared database with tenant ID discriminator (Row-level isolation)

## Decision
We adopt **Shared Database with Tenant ID Discriminator** (Row-level isolation).

### Rationale
- High operational efficiency: Single migration cycle across all tenants.
- Cost effective: Resource-efficient pooling with PostgreSQL.
- Fast onboarding: Provisioning a new bakery requires inserting a row into `Tenant` and related configuration tables, not provisioning infrastructure or migrating separate databases.

### Enforcement Strategy
- Every domain entity has `tenantId String`.
- Application service layer requires `tenantId` in all data retrieval and mutation methods.
- URLs resolve tenant via `/[tenantSlug]` for public stores or session context for dashboard/POS.
- Automated integration tests verify that cross-tenant requests fail with 403/404.
