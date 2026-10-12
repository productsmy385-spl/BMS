# Interakt WhatsApp Integration Specification

## 1. Overview
Interakt handles official WhatsApp Business API messaging. BMS acts as the authoritative source of truth for all menu items, prices, orders, and statuses.

*Strict Note*: IVR and automated phone calls are strictly excluded.

## 2. Notification Templates
1. `order_confirmed`: Sent upon acceptance of counter or website order. Contains order number, item summary, and scheduled pickup/delivery time.
2. `order_ready`: Sent when kitchen marks ticket status as `READY`. Informs customer their order is packed and ready for collection.
3. `order_dispatched`: Sent when delivery driver picks up the package with driver details.

## 3. Inbound Customer Menu Inquiry Handling
- **Webhook Endpoint**: `POST /api/v1/webhooks/interakt`
- **Workflow**:
  1. Verify webhook signature against `INTERAKT_WEBHOOK_SECRET`.
  2. Parse customer message text.
  3. If user query matches keywords ("menu", "cake", "list", "order"):
     - Fetch current active bakery menu link (`https://bakeryms.com/{tenantSlug}`).
     - Trigger Interakt API call to send interactive menu message back to customer's WhatsApp number.
