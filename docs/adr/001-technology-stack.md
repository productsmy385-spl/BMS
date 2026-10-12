# ADR 001: Technology Stack Selection

## Status
Accepted

## Context
The Bakery Management System (BMS) requires high developer velocity, full-stack TypeScript safety, fast page loads for public storefronts, reactive state for POS and Kitchen KOT, and multi-tenant flexibility.

## Decision
We select:
1. **Next.js 15 App Router + React 19**: Combines server-side rendering for tenant storefront SEO with client components for interactive POS and KOT displays.
2. **TypeScript with Strict Mode**: Enforces compile-time guarantees across domain models, Prisma queries, and API contracts.
3. **Tailwind CSS + shadcn/ui**: Modern, accessible UI design system allowing dynamic CSS variable injection for tenant-customized website colors.
4. **PostgreSQL + Prisma ORM**: Relational ACID integrity, schema migrations, and type-safe query generation.
5. **Node.js HTTP Server + Socket.IO**: Integrated custom server (`server.ts`) hosting both Next.js request handling and real-time WebSocket communication within a single deployment unit.

## Consequences
- Requires a Node.js-capable runtime rather than serverless-only (Vercel serverless lacks persistent WebSockets).
- Unified codebase simplifies development and testing.
