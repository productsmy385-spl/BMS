# API reference

## `GET /api/menu`
Returns menu items with category relations. Only active categories are included.

## `POST /api/menu`
Creates a menu item. Body: `{ name, categoryId, basePrice, description?, imagekitUrl?, imagekitFileId?, preparationTimeMinutes? }`. **Staff authorization is not implemented in this starter. Do not expose publicly.**

## `GET /api/orders`
Returns the latest 100 orders and line items. **Must be staff-authenticated before production exposure.**

## `POST /api/orders`
Creates a customer order. Body: `{ customerName, customerPhone, deliveryAddress?, items: [{ menuItemId, quantity, specialInstructions? }] }`. Server re-fetches current prices and stock; client-supplied prices are ignored.

## `PATCH /api/orders/:id/status`
Body: `{ status }`. Validates enum value and broadcasts `orders:updated`. **Must be protected by Clerk RBAC and enforce allowed state transitions before production exposure.**

## Socket.IO events
`orders:new`, `orders:updated`, `menu:updated`, and connection status `realtime:connected`.
