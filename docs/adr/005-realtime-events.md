# ADR 005: Real-Time Event Architecture for Kitchen and Order Updates

## Status
Accepted

## Context
Bakery kitchens require instant notification when an order is placed online or at the counter POS. Similarly, delivery agents and front counter staff need immediate visibility when a chef finishes preparing an order and marks it READY.

## Decision
1. **Hybrid Socket.IO and Resilient Polling**:
   - Primary real-time communication is powered by Socket.IO on custom Node.js server (`server.ts`).
   - Every client also runs a fallback polling interval (3–5 seconds) to guarantee consistency across reconnects or network interruptions.
2. **Tenant Channel Scoping**:
   - Real-time rooms are segmented strictly by tenant (`tenant:${tenantId}:kitchen`, `tenant:${tenantId}:delivery`).
   - Unauthenticated or cross-tenant clients cannot subscribe to other bakeries' event rooms.
3. **Database as Source of Truth**:
   - The database transaction commits first. Socket events are emitted as side effects with full persisted entity payloads.
   - If a client disconnects and reconnects, it retrieves authoritative current state from the database via REST API.

## Consequences
- Zero missed orders in noisy kitchen environments.
- High-efficiency WebSocket delivery with guaranteed REST fallback.
