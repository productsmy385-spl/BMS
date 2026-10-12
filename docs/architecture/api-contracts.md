# API Contracts & Interface Specification

All REST endpoints follow standard JSON responses with predictable HTTP status codes:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "timestamp": "2026-10-11T19:00:00Z" }
}
```

---

## 1. Multi-Tenant Public Endpoints

### 1.1 Tenant Storefront Resolution
- `GET /api/v1/storefront/:slug`
  - Returns public bakery profile, opening hours, active categories, featured products, and `WebsiteSettings` (colors, typography, hero images).

### 1.2 Public Online Ordering
- `POST /api/v1/storefront/:slug/orders`
  - **Request Body**:
    ```json
    {
      "customerName": "Ramesh Rao",
      "customerPhone": "+919876543210",
      "deliveryType": "PICKUP", // or "DELIVERY"
      "scheduledTime": "2026-10-12T16:00:00Z",
      "deliveryAddress": "Flat 402, Green Meadows, Hyderabad",
      "items": [
        {
          "productId": "prod_123",
          "variantId": "var_456",
          "quantity": 1,
          "customizations": {
            "flavour": "Belgian Chocolate Truffle",
            "sponge": "Eggless Chocolate",
            "messageOnCake": "Happy 5th Birthday Aarav!",
            "shape": "Round",
            "photoUrl": "https://ik.imagekit.io/bms/ref-cake.jpg"
          }
        }
      ]
    }
    ```
  - **Behavior**: Backend validates item prices, availability, checks scheduled slots, creates Order in `NEW` status, triggers KOT creation, notifies kitchen via Socket.IO, and registers WhatsApp notification outbox job.

---

## 2. Bakery POS Endpoints (`/api/v1/tenants/:tenantId/pos/...`)

### 2.1 Catalog & Fast Search
- `GET /api/v1/tenants/:tenantId/pos/products?search=&category=`
  - Returns quick-catalog with stock quantities, barcode/SKU mappings, variants, and base prices.

### 2.2 Counter Order Checkout
- `POST /api/v1/tenants/:tenantId/pos/orders`
  - Creates POS order, records payment (`CASH`, `UPI`, `CARD`), decrements stock atomically, queues receipt printing, and dispatches KOT ticket.

---

## 3. Kitchen Display & KOT Endpoints (`/api/v1/tenants/:tenantId/kitchen/...`)

### 3.1 Active Ticket Queue
- `GET /api/v1/tenants/:tenantId/kitchen/tickets?status=ACTIVE`
  - Returns ordered list of active tickets prioritized by scheduled pickup time.

### 3.2 Ticket Status Transition
- `PATCH /api/v1/tenants/:tenantId/kitchen/tickets/:ticketId/status`
  - Body: `{ "status": "PREPARING" | "READY" | "COMPLETED" }`
  - Emits real-time event `kitchen:ticket_updated` and triggers voice queue announcement.

---

## 4. WhatsApp Webhook Endpoints (Interakt)

### 4.1 Inbound Messages & Menu Inquiries
- `POST /api/v1/webhooks/interakt`
  - Receives Interakt webhook payload for inbound customer messages.
  - Matches customer query ("menu", "order", "cakes", "rates").
  - Formats current active catalog link: `https://app.bakeryms.com/{tenantSlug}` and sends automated interactive list message.

### 4.2 Delivery Receipts
- `POST /api/v1/webhooks/interakt/status`
  - Updates delivery status (`SENT`, `DELIVERED`, `READ`, `FAILED`) in BMS `Notification` log.
