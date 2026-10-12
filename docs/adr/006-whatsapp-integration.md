# ADR 006: Interakt WhatsApp Integration

## Status
Accepted

## Context
Bakery customers expect instant WhatsApp confirmations for custom cake orders, order tracking links, and pickup readiness. Additionally, bakeries receive frequent WhatsApp messages asking for daily menus and price lists. IVR and automated phone calls are strictly excluded.

## Decision
1. **Provider**: Interakt (WhatsApp Business Solution Provider).
2. **Outbox Pattern**:
   - Order notifications write to `Notification` table with status `PENDING`.
   - Outbox dispatcher calls Interakt REST API using tenant's configured credentials.
   - Idempotency keys prevent duplicate WhatsApp message dispatches on network retries.
3. **Inbound Webhook Handling**:
   - Receives inbound user WhatsApp messages.
   - Detects intent (e.g. keywords "menu", "rates", "cakes", "catalogue").
   - Fetches live published menu for the bakery from BMS backend and replies with dynamic storefront link.
4. **Resilience**:
   - Webhook signatures are strictly verified.
   - Missing or invalid Interakt credentials log clear errors and do not block the order checkout workflow.
