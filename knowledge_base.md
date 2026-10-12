# Bakery Management System (BMS) --- Knowledge Base

**Document type:** Product and technical knowledge base\
**Status:** Proposed implementation baseline\
**Primary stack:** Next.js App Router, TypeScript, Tailwind CSS,
shadcn/ui, PostgreSQL, Prisma, Redis, Socket.IO\
**Identity:** Clerk\
**Images:** ImageKit\
**Messaging:** Meta WhatsApp Cloud API\
**Telephony:** Twilio or Exotel\
**Maps / delivery ETA:** Google Maps Routes API or Distance Matrix API
(confirm product availability and current API version before
implementation)

------------------------------------------------------------------------

## 1. Product overview

The Bakery Management System connects the bakery's public catalog and
ordering website to staff operations:

1.  The owner/admin publishes menu categories and products, including
    prices, images, availability, and ordering rules.
2.  Customers browse only published, active, in-stock items and place
    online orders.
3.  The backend validates prices and stock, persists the order, and
    broadcasts it to the Kitchen Order Ticket (KOT) dashboard.
4.  The KOT dashboard announces new orders through the browser's Web
    Speech API. A staff member can also click a button to send a
    formatted order summary to the configured WhatsApp staff group,
    where supported by the chosen WhatsApp integration.
5.  When the chef marks an order ready, the backend notifies the
    assigned delivery workflow and sends the customer a WhatsApp utility
    template.
6.  When the driver marks an order picked up / on the way, the backend
    computes an ETA and sends another WhatsApp utility template.
7.  Admin manages staff invitations, built-in and custom roles,
    permissions, menu, orders, settings, and audit logs.
8.  Four support agents share one official WhatsApp Business number
    through a common inbox, with conversation claiming/assignment.
9.  Inbound telephone calls can ring four agent phone numbers
    simultaneously using a telephony provider's hunt-group/parallel-dial
    feature. The first answered leg bridges the call and the other
    ringing legs are cancelled by the provider.

### Scope for the first implementation milestone

-   Public published catalog
-   Customer online checkout and order creation
-   PostgreSQL persistence with Prisma
-   Real-time order updates to KOT
-   KOT order state transitions
-   Voice announcements in English and Telugu where browser voices are
    installed
-   Manual "Send to WhatsApp staff" action with an honest integration
    status
-   Admin menu and order management foundations

### Subsequent milestones

-   Clerk authentication and backend authorization
-   Role/permission administration and staff onboarding
-   Meta WhatsApp customer templates and webhook handling
-   Driver portal and ETA dispatch
-   Shared four-agent WhatsApp support inbox
-   Twilio/Exotel parallel ringing and missed-call fallback
-   Production observability, audit coverage, security hardening, and
    end-to-end tests

> **Production rule:** Do not present an integration as live until its
> provider credentials, webhook configuration, templates, sender
> identities, and end-to-end tests have been configured. Use a visible
> "Demo / not connected" state for simulated integrations.

------------------------------------------------------------------------

## 2. User roles and access model

Use Clerk for authentication and session management. Store
application-specific staff profiles, role definitions, permissions, and
tenant/bakery access in PostgreSQL. Clerk identity alone does not grant
application permissions.

### Built-in roles

  -----------------------------------------------------------------------
  Role                                Intended access
  ----------------------------------- -----------------------------------
  Admin / Owner                       Full bakery configuration, staff
                                      invitations, custom roles, menu,
                                      orders, reports, support settings,
                                      integration settings, and audit
                                      logs

  Store Manager                       Menu/catalog edits, stock changes,
                                      order management and permitted
                                      overrides

  Chef                                KOT dashboard, preparation stages,
                                      stock toggle if granted,
                                      ready-for-pickup action

  Delivery Boy                        Only assigned delivery tasks,
                                      pickup/on-the-way and delivered
                                      actions

  Support Agent                       Shared WhatsApp inbox,
                                      claiming/assignment, replying, and
                                      permitted call logs

  Custom role                         Admin-selected granular
                                      permissions, constrained by bakery
                                      membership and explicit permission
                                      grants
  -----------------------------------------------------------------------

### Route families

-   Public: `/`, `/menu`, `/cart`, `/checkout`,
    `/order/[publicTrackingToken]`
-   Admin: `/admin/*`
-   Manager: `/manager/*`
-   Kitchen: `/kitchen/kot`
-   Delivery: `/delivery/tasks`
-   Support: `/support/inbox`, `/support/calls`
-   Integration webhooks: `/api/whatsapp/webhook`, `/api/telephony/*`

### Authorization requirements

-   Protect internal pages with Clerk middleware for session presence;
    enforce resource-level permissions again in every server action/API
    route.
-   Never rely on hidden navigation or client-side checks as
    authorization.
-   Derive the staff profile from the verified Clerk user ID on the
    server.
-   Check `is_active`, bakery/tenant membership, and required permission
    for every protected operation.
-   Prevent a chef or delivery driver from accessing another dashboard
    by directly requesting its URL or API.
-   Use deny-by-default permission checks.
-   Only Admin/Owner may invite staff, assign privileged permissions, or
    change roles.
-   Prevent an admin from accidentally removing the last active
    owner/admin; require a deliberate transfer workflow.
-   Verify webhook signatures/tokens independently of Clerk.
-   Record sensitive role, staff, menu, stock, and order overrides in an
    audit log.

### Suggested permission identifiers

-   `dashboard:admin:read`
-   `staff:read`, `staff:invite`, `staff:deactivate`,
    `staff:role_assign`
-   `roles:read`, `roles:create`, `roles:update`, `roles:delete`
-   `catalog:read`, `catalog:create`, `catalog:update`,
    `catalog:publish`, `catalog:stock_toggle`
-   `orders:read`, `orders:create`, `orders:update`, `orders:cancel`,
    `orders:override`
-   `kot:read`, `kot:status_update`, `kot:whatsapp_broadcast`
-   `delivery:read_assigned`, `delivery:pickup`, `delivery:complete`,
    `delivery:reassign`
-   `support:read`, `support:claim`, `support:assign`, `support:reply`
-   `calls:read`
-   `reports:read`, `audit:read`
-   `integrations:read`, `integrations:manage`

Permission keys are application-owned identifiers. A role can grant only
known permissions; never accept arbitrary permission strings without
server-side validation.

------------------------------------------------------------------------

## 3. End-to-end workflows

### 3.1 Catalog publishing and customer ordering

1.  Admin creates or edits a category and menu item.
2.  Item fields include name, description, price, image, preparation
    time, stock status, and publication status.
3.  Customer-facing queries return only published categories/items that
    are active and orderable.
4.  Checkout submits item IDs, quantities, customer details,
    delivery/pickup choice, address if applicable, and optional special
    instructions.
5.  Server reloads current product prices and stock from PostgreSQL.
    Ignore client-submitted prices and totals.
6.  In a database transaction, validate stock/order rules, create the
    order and immutable order-item snapshots, and compute the total.
7.  After commit, publish `orders:new` through the real-time event
    layer. Use a transactional outbox for reliable event delivery in
    production.
8.  KOT receives the event and announces the order if the kitchen shift
    has been unlocked.
9.  Duplicate checkout submissions must be handled with an idempotency
    key so network retries do not create duplicate orders.

### 3.2 Kitchen KOT and voice announcements

Suggested order states:

`PLACED → ACCEPTED → KITCHEN_PREPARING → READY_FOR_PICKUP`

Possible terminal/alternate states: `CANCELLED`, `REJECTED`. For
bakeries that need detailed production stages, add `BAKING`,
`DECORATING`, and `PACKING` and define legal transitions explicitly.

-   KOT displays current active orders with order number, age, items,
    quantities, notes, fulfilment type, and status.
-   The first visit shows a "Start Kitchen Shift / Enable Voice" action.
    A user gesture enables audio/voice where the browser allows it.
-   Use `window.speechSynthesis` to speak a short order summary. Browser
    voices vary by device; Telugu speech depends on the device/browser
    having a Telugu voice installed.
-   Do not assume a WebSocket event is delivered exactly once.
    De-duplicate announcements by order/event ID and avoid repeating on
    reconnect.
-   Persist status changes through the server API; emit the updated
    order only after the database commit.
-   Provide visual and optional audible fallback if speech synthesis is
    unavailable or muted.

Example announcement:

> "New order number 104. Two chocolate cupcakes, one custom cake. Pickup
> at 4 PM."

### 3.3 Send order to WhatsApp staff group

-   KOT button: "Send to WhatsApp Staff".
-   The click calls a server endpoint, which validates the user's
    `kot:whatsapp_broadcast` permission and formats the order.
-   Log the send attempt and provider response.
-   Show success only after a real provider response confirms
    acceptance; otherwise show the integration error or "Not connected".

**Important provider constraint:** The standard WhatsApp Business
Platform Cloud API does not generally provide an ordinary endpoint for
sending arbitrary messages to a regular WhatsApp group chat. Do not
assume a group ID or a group-send API exists. Confirm current Meta
product eligibility and supported group messaging capabilities for the
specific business account. If unsupported, use an approved alternative
such as sending individual messages to opted-in staff, an internal
operations inbox, or a provider-supported business group product. Do not
automate WhatsApp Web or use unofficial libraries for production.

### 3.4 Ready for pickup and delivery assignment

1.  Chef selects "Mark Ready".
2.  Server verifies legal state transition and saves `READY_FOR_PICKUP`.
3.  If delivery is required, notify the delivery queue and assign or
    allow an authorized manager to assign a driver.
4.  Send customer template `order_ready` after checking consent, phone
    format, template approval, and provider credentials.
5.  Notify the assigned driver in the delivery portal; use push
    notifications only after a push provider/service worker is
    configured.
6.  Record notification attempts and provider message IDs.

### 3.5 Driver pickup and ETA

1.  Driver sees only active tasks assigned to their staff profile.
2.  Driver selects "Picked Up / On The Way".
3.  Server verifies assignment and legal transition, records
    `picked_up_at`, and changes status to `OUT_FOR_DELIVERY`.
4.  Server uses stored bakery origin and customer destination
    coordinates to request a road ETA from the configured maps provider.
5.  Save the ETA and its calculation timestamp. If the maps API fails,
    use a clearly labelled fallback estimate or "ETA unavailable"; never
    invent a precise provider ETA.
6.  Send `order_dispatched_with_eta` utility template with customer
    name, order number, driver name, and ETA minutes.
7.  Driver selects "Delivered"; server records `delivered_at`, changes
    status to `DELIVERED`, and sends a final delivery confirmation
    template if configured.

GPS permissions must be requested transparently. A driver's current GPS
location is optional for a basic route ETA; the bakery origin and
customer destination are the minimum inputs.

### 3.6 Shared four-agent WhatsApp support inbox

-   One official WhatsApp Business number connects to a single Meta
    app/business configuration.
-   Inbound webhooks persist messages and associate them with a
    conversation keyed by normalized customer phone / WhatsApp ID.
-   All authorized agents can view the same inbox in real time.
-   Agents can claim a conversation, assign it, set status, add internal
    notes, and reply through the official number.
-   Use database transactions or atomic updates to prevent two agents
    from simultaneously claiming a conversation if exclusive claims are
    required.
-   Persist provider message IDs, timestamps, delivery/read status when
    supplied, error codes, and webhook deduplication IDs.
-   Agents must respect Meta's current customer-service window and
    approved-template rules for business-initiated messages.
-   Media should be downloaded through authenticated provider APIs,
    checked for type/size, and stored securely; do not expose access
    tokens in the browser.

### 3.7 Simultaneous inbound telephone ringing

Using Twilio Programmable Voice or a suitable Exotel feature, configure
a virtual business number and parallel hunt group for four agent phone
numbers.

-   Inbound webhook generates the provider-specific dial/bridge
    response.
-   All configured agent endpoints ring concurrently.
-   First answered agent bridges with the caller; the provider cancels
    other ringing legs.
-   Set a 25-second ring timeout if supported by the selected provider
    and plan.
-   On no answer, busy, or failure, persist a call log and trigger a
    WhatsApp fallback only where the caller's WhatsApp identity is known
    and messaging is permitted.
-   Store provider call IDs, call status, timestamps, duration, and the
    answered agent mapping.
-   Configure webhook signature validation and idempotency.

Twilio TwiML and Exotel call-flow XML/configuration are not
interchangeable. Implement and test the exact response format for the
selected provider. Number availability, call recording, local regulatory
obligations, and pricing depend on country/provider/account.

------------------------------------------------------------------------

## 4. Proposed architecture

``` text
Customer browser ─┐
                  ├── Next.js application/API ─── PostgreSQL (Prisma)
Admin / Manager ──┤             │
Chef KOT ─────────┤             ├── Redis / Socket.IO event layer
Driver portal ────┤             ├── Clerk identity and invitations
Support inbox ────┘             ├── ImageKit media CDN
                                ├── Meta WhatsApp Cloud API + webhooks
                                ├── Twilio / Exotel voice webhooks
                                └── Google Maps ETA API
```

### Deployment guidance

-   Deploy the Next.js application to a Node.js-capable host.
-   If using Socket.IO, deploy a persistent custom Node.js server or a
    separate real-time service. Confirm that the host supports WebSocket
    upgrades and long-running processes.
-   Use managed PostgreSQL with backups, connection pooling, TLS, and
    migration automation.
-   Use managed Redis for cross-instance pub/sub, rate limiting, and job
    coordination.
-   For multi-instance production, do not rely on process-local memory
    for orders, event state, or support conversations.
-   Use a background worker/queue for WhatsApp sends, retryable
    notifications, image cleanup, and outbox processing.
-   Configure staging and production separately with distinct
    credentials, domains, webhook URLs, and template testing.
-   Apply database migrations as a release step; do not run destructive
    schema changes automatically on every app startup.

------------------------------------------------------------------------

## 5. PostgreSQL / Prisma data model

The following schema is a baseline and should be implemented in
`prisma/schema.prisma`. It includes tenant/bakery ownership even if the
first deployment has only one bakery, so future multi-bakery support
does not require an unsafe retrofit.

### 5.1 Core entities

#### `Bakery`

-   `id` UUID primary key
-   `name`
-   `slug` unique
-   `phone`
-   `whatsapp_phone_number_id` optional provider identifier
-   `address`
-   `latitude`, `longitude`
-   `timezone`
-   `currency` (default `INR`)
-   `created_at`, `updated_at`

#### `Permission`

-   `id` stable permission key, primary key
-   `module`
-   `description`

#### `Role`

-   `id` UUID primary key
-   `bakery_id` foreign key
-   `name`
-   `description`
-   `is_system_role`
-   `created_at`, `updated_at`
-   Unique `(bakery_id, name)`

#### `RolePermission`

-   `role_id` foreign key
-   `permission_id` foreign key
-   Composite primary key `(role_id, permission_id)`

#### `StaffProfile`

-   `id` UUID primary key
-   `bakery_id` foreign key
-   `clerk_user_id` unique (or unique with bakery membership design)
-   `full_name`, `email`, `phone_number`
-   `role_id` foreign key
-   `is_active`
-   `created_at`, `updated_at`

#### `Category`

-   `id` UUID primary key
-   `bakery_id` foreign key
-   `name`, `slug`
-   `sort_order`
-   `is_active`
-   `is_published`
-   `created_at`, `updated_at`
-   Unique `(bakery_id, slug)`

#### `MenuItem`

-   `id` UUID primary key
-   `bakery_id` foreign key
-   `category_id` foreign key
-   `name`, `slug`, `description`
-   `base_price` Decimal(10,2)
-   `imagekit_file_id`, `imagekit_url`
-   `is_in_stock`
-   `is_active`, `is_published`
-   `preparation_time_minutes`
-   `created_at`, `updated_at`
-   Unique `(bakery_id, slug)`

#### `Order`

-   `id` UUID primary key
-   `bakery_id` foreign key
-   `order_number` unique per bakery (use a safe sequence/counter
    strategy)
-   `public_tracking_token` unique random token; do not expose
    sequential IDs as authorization
-   `customer_name`, `customer_phone`
-   `fulfillment_type`: `PICKUP` or `DELIVERY`
-   `delivery_address`, `delivery_latitude`, `delivery_longitude`
-   `total_amount` Decimal(10,2)
-   `status` enum
-   `assigned_delivery_user_id` nullable foreign key to `StaffProfile`
-   `estimated_delivery_minutes` nullable integer
-   `eta_calculated_at` nullable timestamp
-   `picked_up_at`, `delivered_at`, `created_at`, `updated_at`
-   Optional `idempotency_key` unique per checkout scope

#### `OrderItem`

-   `id` UUID primary key
-   `order_id` foreign key with cascade delete
-   `menu_item_id` nullable foreign key (preserve snapshots if menu item
    is deleted)
-   `item_name` immutable snapshot
-   `quantity` positive integer
-   `unit_price` Decimal(10,2) snapshot
-   `special_instructions`
-   `customization_json` for cake message, size, flavour, theme, pickup
    date/time, etc.

#### `OrderStatusHistory`

-   `id` UUID primary key
-   `order_id` foreign key
-   `from_status`, `to_status`
-   `changed_by_staff_id` nullable
-   `note`
-   `created_at`

#### `AuditLog`

-   `id` UUID primary key
-   `bakery_id`
-   `actor_clerk_user_id` nullable
-   `action`, `entity_type`, `entity_id`
-   `metadata` JSONB (exclude secrets and unnecessary personal data)
-   `ip_hash` / request context only if justified by privacy policy
-   `created_at`

### 5.2 Integration and support entities

#### `SupportConversation`

-   `id` UUID primary key
-   `bakery_id`
-   `customer_wa_id` / normalized customer phone
-   `status`: `OPEN`, `PENDING`, `RESOLVED`
-   `assigned_staff_id` nullable
-   `claimed_by_staff_id` nullable
-   `last_message_at`
-   `created_at`, `updated_at`

#### `SupportMessage`

-   `id` UUID primary key
-   `conversation_id` foreign key
-   `sender_type`: `CUSTOMER`, `AGENT`, `SYSTEM`
-   `sender_staff_id` nullable
-   `message_text` nullable for media-only messages
-   `media_type`, `media_storage_url` nullable
-   `meta_message_id` unique nullable
-   `delivery_status`
-   `provider_timestamp`
-   `created_at`

#### `TelephonyCallLog`

-   `id` UUID primary key
-   `bakery_id`
-   `provider_call_id` unique
-   `customer_phone`
-   `answered_by_staff_id` nullable
-   `status`: `RINGING`, `ANSWERED`, `MISSED`, `BUSY`, `FAILED`
-   `call_duration_seconds`
-   `started_at`, `answered_at`, `ended_at`, `created_at`

#### `IntegrationMessageLog`

-   `id` UUID primary key
-   `bakery_id`
-   `provider`: `META_WHATSAPP`, `TWILIO`, `EXOTEL`, `MAPS`
-   `purpose`, `recipient`
-   `provider_message_id` nullable
-   `status`: `QUEUED`, `SENT`, `DELIVERED`, `FAILED`
-   `request_reference` / safe metadata JSONB
-   `error_code`, `error_message` (sanitized)
-   `created_at`, `updated_at`

#### `WebhookEvent`

-   `id` UUID primary key
-   `provider`
-   `provider_event_id` unique where available
-   `event_type`
-   `received_at`
-   `processed_at`
-   `status`, `error_summary`
-   `payload_hash` (avoid storing raw sensitive payloads unless there is
    a documented need)

### 5.3 Database rules and indexes

-   Use `Decimal` for money; never floating-point arithmetic for prices.
-   Store timestamps in UTC and render them in the bakery's configured
    timezone.
-   Normalize phone numbers to E.164 where possible; validate before
    sending messages.
-   Add indexes for `(bakery_id, status, created_at)`, `(order_id)`,
    `(conversation_id, created_at)`, `(assigned_staff_id, status)`, and
    foreign keys used in joins.
-   Add checks for positive quantity, nonnegative price, and valid
    coordinate ranges.
-   Enforce bakery scoping on every query.
-   Keep order item snapshots so menu edits do not alter historical
    receipts.
-   Use transaction-safe order numbering; a global PostgreSQL `SERIAL`
    is not automatically a per-bakery order number.
-   Define data retention rules for customer phone/address, support
    messages, and call logs.

------------------------------------------------------------------------

## 6. API and event contracts

All internal API routes require Clerk session validation plus
server-side permission checks where applicable. Public checkout is
unauthenticated but requires validation, rate limiting, anti-abuse
controls, and server-side price/stock verification.

### Public catalog and checkout

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  `GET`                   `/api/public/catalog`           Return published
                                                          categories and
                                                          available published
                                                          items

  `GET`                   `/api/public/menu-items/[id]`   Return one published
                                                          item

  `POST`                  `/api/public/orders`            Validate and create
                                                          customer order

  `GET`                   `/api/public/orders/[token]`    Read limited order
                                                          status using a
                                                          high-entropy public
                                                          token
  -------------------------------------------------------------------------------

### Admin / staff operations

  -----------------------------------------------------------------------------------------------------------
  Method            Endpoint                                Permission                 Purpose
  ----------------- --------------------------------------- -------------------------- ----------------------
  `POST`            `/api/admin/categories`                 `catalog:create`           Create category

  `PATCH`           `/api/admin/categories/[id]`            `catalog:update`           Edit/publish category

  `POST`            `/api/admin/menu-items`                 `catalog:create`           Create item

  `PATCH`           `/api/admin/menu-items/[id]`            `catalog:update`           Edit item

  `PATCH`           `/api/admin/menu-items/[id]/stock`      `catalog:stock_toggle`     Toggle availability

  `GET`             `/api/orders`                           `orders:read` or           List orders permitted
                                                            `kot:read`                 to the caller

  `PATCH`           `/api/orders/[id]/status`               `orders:update` or         Validate and apply
                                                            `kot:status_update`        legal state transition

  `POST`            `/api/orders/[id]/whatsapp-staff`       `kot:whatsapp_broadcast`   Send staff order
                                                                                       summary if
                                                                                       supported/configured

  `POST`            `/api/admin/staff/invitations`          `staff:invite`             Create Clerk
                                                                                       Organization
                                                                                       invitation

  `POST`            `/api/admin/roles`                      `roles:create`             Create custom role

  `PATCH`           `/api/admin/roles/[id]`                 `roles:update`             Update role/permission
                                                                                       grants

  `GET`             `/api/delivery/tasks`                   `delivery:read_assigned`   List only assigned
                                                                                       tasks

  `POST`            `/api/delivery/orders/[id]/pickup`      `delivery:pickup`          Mark picked up,
                                                                                       calculate ETA, notify
                                                                                       customer

  `POST`            `/api/delivery/orders/[id]/delivered`   `delivery:complete`        Mark delivered and
                                                                                       send completion
                                                                                       template
  -----------------------------------------------------------------------------------------------------------

### Provider webhooks

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  `GET`, `POST`           `/api/whatsapp/webhook`         Meta verification
                                                          challenge and inbound
                                                          message/status webhooks

  `POST`                  `/api/telephony/inbound-call`   Return
                                                          provider-specific
                                                          parallel dial response

  `POST`                  `/api/telephony/call-ended`     Record
                                                          no-answer/finished call
                                                          and trigger allowed
                                                          fallback

  `POST`                  `/api/telephony/status`         Process call status
                                                          callbacks

  `POST`                  `/api/clerk/webhook`            Optional user/org
                                                          membership sync; verify
                                                          webhook signature

  `POST`                  `/api/imagekit/auth`            Generate server-side
                                                          ImageKit upload auth
                                                          parameters
  -------------------------------------------------------------------------------

### Socket.IO event names

Client-to-server events should be minimal; sensitive status changes
should use authenticated API routes rather than trusting arbitrary
socket payloads.

-   Server → KOT: `orders:new`, `orders:updated`, `menu:stock_updated`
-   Server → delivery portal: `delivery:task_assigned`,
    `delivery:task_updated`
-   Server → support inbox: `support:message_new`,
    `support:conversation_updated`
-   Optional client → server: `support:typing` (rate limited and
    authorized)

Each event should include a stable event ID, entity ID, timestamp, and
the minimum safe payload. Authorize room joins on the server; never
allow a client to subscribe to another bakery's rooms.

### Order transition enforcement

Implement a server-owned transition map. Reject invalid transitions with
HTTP `409 Conflict`. Examples:

-   `PLACED → ACCEPTED`
-   `ACCEPTED → KITCHEN_PREPARING`
-   `KITCHEN_PREPARING → READY_FOR_PICKUP`
-   `READY_FOR_PICKUP → OUT_FOR_DELIVERY` for delivery orders
-   `READY_FOR_PICKUP → DELIVERED` may be allowed only for pickup
    completion if the product defines that flow
-   `OUT_FOR_DELIVERY → DELIVERED`
-   Any cancellation transition must be explicitly defined and
    permission-gated

Do not let the browser directly write status fields to the database.

------------------------------------------------------------------------

## 7. Clerk authentication, organizations, and invitations

### Clerk setup

1.  Create a Clerk application for the BMS.
2.  Configure allowed origins, production domain, sign-in and sign-up
    policy, and session settings.
3.  Create a Clerk Organization for each bakery if the deployment
    supports multiple bakery tenants. For a single-bakery deployment, an
    organization is still useful for staff membership/invitations.
4.  Add Clerk's Next.js SDK and protect internal route families with
    middleware.
5.  Store the Clerk user ID in `StaffProfile`; do not copy passwords or
    session secrets into the application database.
6.  Use Clerk's server SDK for user lookup, organization membership, and
    invitations.
7.  Store app roles/permissions in the local database. Clerk
    Organization roles/metadata may mirror high-level membership
    information but must not replace local permission checks.

### Invitations

-   Admin chooses staff name/email/phone and role, then the server
    verifies `staff:invite`.
-   Server creates an invitation using the current Clerk Organizations
    API for the selected organization.
-   The app records invitation state and intended role; validate the
    role again when the invited user accepts.
-   Never trust a role ID supplied by the invitee/client.
-   When a staff user is deactivated, revoke or restrict their
    application access immediately and handle Clerk organization
    membership/session policy appropriately.

### Environment variables

Use server-only variables unless explicitly marked `NEXT_PUBLIC_`.

-   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
-   `CLERK_SECRET_KEY`
-   `CLERK_WEBHOOK_SIGNING_SECRET` (only if Clerk webhook sync is
    enabled)
-   `NEXT_PUBLIC_APP_URL`
-   `CLERK_SIGN_IN_URL`
-   `CLERK_SIGN_UP_URL`

Do not place `CLERK_SECRET_KEY` or webhook secrets in client components,
public environment variables, screenshots, commits, or logs.

------------------------------------------------------------------------

## 8. ImageKit integration

### Required configuration

-   `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
-   `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
-   `IMAGEKIT_PRIVATE_KEY` (server only)

### Upload flow

1.  Authorized staff opens the menu editor.
2.  Browser requests `POST /api/imagekit/auth`.
3.  Server authenticates the Clerk session, checks `catalog:create` or
    `catalog:update`, and returns ImageKit's required `token`, `expire`,
    and HMAC `signature` generated with the private key.
4.  Browser uploads directly to ImageKit into a controlled folder such
    as `/bakeries/{bakeryId}/menu-items/`.
5.  Server validates returned file metadata/URL before saving `fileId`
    and `url` on the menu item.
6.  Use ImageKit transformations for optimized display,
    e.g. `?tr=w-500,h-380,fo-auto,f-auto,q-80`, adjusted to the actual
    ImageKit URL format.

### Security notes

-   Never expose `IMAGEKIT_PRIVATE_KEY`.
-   Limit upload size and allowed MIME types; verify uploaded asset
    ownership and folder/bakery association.
-   Do not trust arbitrary `fileId`/URL posted by the browser without
    validation.
-   On menu item replacement/deletion, decide whether to delete the old
    ImageKit asset and log the operation.
-   Public product images can be CDN-accessible; staff-only media needs
    a different access policy.

------------------------------------------------------------------------

## 9. Meta WhatsApp Cloud API integration

### Meta setup checklist

1.  Create or select a Meta Business Portfolio.
2.  Create a Meta app with WhatsApp product enabled.
3.  Add/verify the WhatsApp Business Account and connect the intended
    business phone number.
4.  Configure a permanent/system-user access token appropriate for
    production, with least privilege and a rotation plan.
5.  Record the Phone Number ID and WhatsApp Business Account ID.
6.  Configure webhook callback URL and verify token.
7.  Subscribe the app to relevant webhook fields (messages and message
    status updates).
8.  Create and submit utility templates in the correct language(s); wait
    for approval before relying on them.
9.  Test in a development environment and verify delivery callbacks.
10. Confirm current Graph API version and Meta policy requirements at
    implementation time; do not hard-code an obsolete version
    indefinitely.

### Environment variables

-   `META_WHATSAPP_ACCESS_TOKEN` (server only)
-   `META_WHATSAPP_PHONE_NUMBER_ID`
-   `META_WHATSAPP_BUSINESS_ACCOUNT_ID`
-   `META_WHATSAPP_VERIFY_TOKEN` (random secret used for webhook
    verification)
-   `META_APP_SECRET` (for validating webhook signatures where required)
-   `META_GRAPH_API_VERSION` (configured to a currently supported
    version, e.g. `vXX.X`; replace with the version verified at
    implementation time)
-   `META_WEBHOOK_CALLBACK_URL` (optional convenience variable)

Never put the access token or app secret in a client-side variable,
source control, or logs.

### Templates to create and approve

Template names below are proposed names. Actual template names,
categories, variables, language codes, and body text must match the
approved Meta template definitions exactly.

#### `order_confirmation`

**Purpose:** Order received / confirmation\
**Suggested category:** Utility, subject to Meta review\
**Example body:**

> Hi {{1}}, we received bakery order #{{2}}. Total: {{3}}. We will
> update you when it is ready. Thank you!

Variables: `{{1}}` customer name, `{{2}}` order number, `{{3}}`
formatted total.

#### `order_ready`

**Purpose:** Chef marks order ready\
**Suggested category:** Utility, subject to Meta review\
**Example body:**

> Hi {{1}}, your order #{{2}} is freshly baked and ready for {{3}}.
> Please check with the bakery if you need assistance.

Variables: `{{1}}` customer name, `{{2}}` order number, `{{3}}` "pickup"
or "delivery dispatch".

#### `order_dispatched_with_eta`

**Purpose:** Driver picked up order\
**Suggested category:** Utility, subject to Meta review\
**Example body:**

> Hi {{1}}, order #{{2}} is on the way with {{3}}. Estimated arrival:
> {{4}} minutes.

Variables: `{{1}}` customer name, `{{2}}` order number, `{{3}}` driver
name, `{{4}}` ETA minutes.

#### `order_delivered`

**Purpose:** Delivery completion\
**Suggested category:** Utility, subject to Meta review\
**Example body:**

> Hi {{1}}, order #{{2}} has been marked delivered. Thank you for
> ordering from {{3}}!

Variables: `{{1}}` customer name, `{{2}}` order number, `{{3}}` bakery
name.

#### `missed_call_followup`

**Purpose:** Follow up after missed inbound call\
**Suggested category:** Must be reviewed against Meta's current policy
and template rules\
**Example body:**

> Hello, we missed your call to {{1}}. You can reply to this message
> with your bakery query and our team will assist you.

Variables: `{{1}}` bakery name.

### WhatsApp send helper responsibilities

Create a server-only helper such as `sendWhatsAppTemplate()` that:

-   Requires a configured phone number ID, token, and supported Graph
    API version.
-   Normalizes and validates destination phone numbers.
-   Builds the template payload using the exact approved template name,
    language, and ordered parameters.
-   Applies request timeouts and safe retries for transient errors;
    avoid duplicate sends by using a durable notification/outbox record.
-   Persists the provider message ID and final status.
-   Sanitizes error responses and never logs access tokens.
-   Distinguishes provider acceptance from delivery confirmation.

### Example template payload

Illustrative only; ensure template name, language and parameter order
match the approved template:

``` json
{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "template",
  "template": {
    "name": "order_dispatched_with_eta",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Customer" },
          { "type": "text", "text": "104" },
          { "type": "text", "text": "Ravi" },
          { "type": "text", "text": "25" }
        ]
      }
    ]
  }
}
```

### Webhook handling

-   `GET`: verify Meta's configured challenge token and return the
    challenge only when the verify token matches.
-   `POST`: validate the request signature using the app secret as
    required by Meta, parse event type, persist a deduplicated event,
    return promptly, and process asynchronously.
-   Handle inbound text, media metadata, message IDs, delivery statuses,
    and provider errors.
-   Respond quickly to webhooks; move slow tasks into a queue.
-   Deduplicate repeated webhook deliveries.

------------------------------------------------------------------------

## 10. Telephony integration: Twilio / Exotel

### Configuration keys

For Twilio (example key names):

-   `TWILIO_ACCOUNT_SID`
-   `TWILIO_AUTH_TOKEN`
-   `TWILIO_VOICE_NUMBER`
-   `TWILIO_STATUS_CALLBACK_URL`

For Exotel (exact values and API fields depend on the
account/region/product):

-   `EXOTEL_ACCOUNT_SID`
-   `EXOTEL_API_KEY`
-   `EXOTEL_API_TOKEN`
-   `EXOTEL_VIRTUAL_NUMBER`
-   `EXOTEL_SUBDOMAIN`
-   `EXOTEL_CALL_FLOW_APP_ID` (if required by the chosen setup)

Configure only the provider actually selected. Keep every credential
server-side.

### Required provider behavior

-   Configure the inbound virtual number to request
    `/api/telephony/inbound-call`.
-   Ring all four configured agent numbers concurrently using the
    provider's supported parallel-dial feature.
-   First answered agent bridges; other ringing legs stop.
-   No-answer/busy callbacks update `TelephonyCallLog`.
-   After the timeout, enqueue the missed-call follow-up if the caller's
    WhatsApp number is valid and policy allows it.
-   Verify webhook signatures/authentication and make callbacks
    idempotent.
-   Confirm that the chosen provider supports the required number,
    country, concurrency, caller ID, and call-flow features before
    purchase.

Do not treat a Twilio `<Dial><Number>` TwiML example as an Exotel
implementation. Use the exact provider documentation and test with real
inbound calls.

------------------------------------------------------------------------

## 11. Maps / ETA integration

Preferred integration: the currently supported Google Maps
routing/distance API selected at implementation time.

### Configuration

-   `GOOGLE_MAPS_API_KEY` (server only)
-   Restrict the key by API and, where applicable, server IP/network.
-   Do not send the key to the browser.
-   Set billing alerts and quotas.

### ETA procedure

-   Use bakery latitude/longitude as origin and customer destination
    coordinates as destination.
-   Request driving duration; use traffic-aware duration only when
    supported by the selected API, routing mode, and billing plan.
-   Store returned duration in minutes and `eta_calculated_at`.
-   Do not expose raw API errors or keys.
-   If customer coordinates are absent, request a valid address/geocode
    step or return "ETA unavailable".
-   Recalculate only at meaningful lifecycle points or when the route
    changes; respect provider quotas.

------------------------------------------------------------------------

## 12. Redis, real-time delivery, and reliable events

### Environment variables

-   `REDIS_URL` (managed Redis connection string)
-   `SOCKET_IO_ALLOWED_ORIGINS` (deployment-specific allowed origins)
-   `DATABASE_URL`
-   `DIRECT_URL` (optional Prisma direct connection if the database
    provider requires separate pooled/direct URLs)

### Reliability recommendations

-   Treat PostgreSQL as the source of truth; sockets are notifications,
    not durable storage.
-   Save an order/status update first, then publish the event.
-   Use an outbox table and background worker so a process crash between
    database commit and socket/message publish does not silently lose
    notifications.
-   Use Redis adapter/pub-sub if Socket.IO runs across multiple
    instances.
-   Reconnect clients and refetch authoritative data after reconnect.
-   Authorize socket connections and room membership using verified
    session identity and bakery membership.
-   Add rate limits, message-size limits, connection limits, heartbeat
    monitoring, and structured logs.

------------------------------------------------------------------------

## 13. `.env.example` inventory

The repository should include an `.env.example` with placeholder values
only. Do not put real secrets in this file.

``` dotenv
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PostgreSQL / Prisma
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require

# Redis / realtime
REDIS_URL=
SOCKET_IO_ALLOWED_ORIGINS=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=

# Meta WhatsApp Cloud API
META_WHATSAPP_ACCESS_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
META_WHATSAPP_BUSINESS_ACCOUNT_ID=
META_WHATSAPP_VERIFY_TOKEN=
META_APP_SECRET=
META_GRAPH_API_VERSION=

# Maps / ETA
GOOGLE_MAPS_API_KEY=

# Twilio (configure only if Twilio is selected)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VOICE_NUMBER=
TWILIO_STATUS_CALLBACK_URL=

# Exotel (configure only if Exotel is selected)
EXOTEL_ACCOUNT_SID=
EXOTEL_API_KEY=
EXOTEL_API_TOKEN=
EXOTEL_VIRTUAL_NUMBER=
EXOTEL_SUBDOMAIN=
EXOTEL_CALL_FLOW_APP_ID=

# Optional background worker
WORKER_SHARED_SECRET=
```

Use separate secret values per environment. Hosting-provider secret
managers are preferred over committed `.env` files.

------------------------------------------------------------------------

## 14. Security, privacy, and operational controls

-   Enforce authorization on every server action, route handler,
    background job, and socket room.
-   Validate all request bodies with a runtime schema library (for
    example Zod).
-   Rate-limit public checkout, login-related endpoints, webhook
    processing, and message sending.
-   Use CSRF/origin protections appropriate to the authentication and
    request model.
-   Keep credentials in a secret manager; redact authorization headers
    and personal data from logs.
-   Validate webhook signatures and prevent replay/duplicate processing.
-   Add idempotency to checkout, status transitions, and provider sends.
-   Do not trust client totals, order statuses, role IDs, uploaded asset
    URLs, or GPS coordinates without validation.
-   Restrict public order tracking to random tokens and minimal data.
-   Minimize retention of addresses, phone numbers, call records, and
    message media; document deletion and access policies.
-   Define backups, restore tests, alerting, error monitoring, and
    incident response.
-   For India deployments, review applicable privacy, messaging consent,
    telecom/DLT/provider, consumer, tax, and record-retention
    obligations with qualified advisers and the selected providers.
    Requirements depend on the actual service configuration.
-   Never store payment card data in this system unless a separately
    reviewed payment integration explicitly requires it.

------------------------------------------------------------------------

## 15. Testing and acceptance criteria

### Automated tests

-   Unit tests: order totals, state transition rules, permission
    evaluation, phone normalization, template payload builders.
-   Integration tests: Prisma transactions, stock validation, checkout
    idempotency, webhook signature verification, outbox retry behavior.
-   API tests: unauthorized users cannot access staff APIs; each role is
    limited to granted permissions.
-   End-to-end tests: customer checkout → KOT event → chef marks ready →
    delivery pickup/ETA → delivered.
-   Realtime tests: reconnect recovery, duplicate event handling,
    multiple connected KOT clients.
-   Provider contract tests: mock Meta, ImageKit, Maps, and telephony
    responses; never call paid production services in ordinary unit
    tests.

### Release acceptance checklist

-   [ ] Only published, active menu items appear publicly.
-   [ ] Server recalculates order totals from database prices.
-   [ ] Duplicate checkout retries do not create duplicate orders.
-   [ ] New orders appear on KOT without manual refresh.
-   [ ] Voice is enabled by a user gesture and respects mute settings.
-   [ ] Order state changes are validated server-side and audited.
-   [ ] Staff WhatsApp button clearly indicates live, failed, or
    not-connected state.
-   [ ] Customer templates are approved and delivery status callbacks
    are stored.
-   [ ] Driver can only act on assigned tasks.
-   [ ] ETA uses configured route data or explicitly reports
    unavailable.
-   [ ] Custom role permissions are enforced on APIs, not just the UI.
-   [ ] Clerk invitations assign the intended application role safely.
-   [ ] Four agents can access the same shared inbox without duplicate
    webhook messages.
-   [ ] Parallel ringing is tested on the actual provider and phone
    numbers.
-   [ ] Missed calls are logged and fallback messages follow messaging
    policy.
-   [ ] Secrets are absent from client bundles, logs, source control,
    and sample screenshots.
-   [ ] Database backups and restore procedure are tested.

------------------------------------------------------------------------

## 16. Suggested repository structure

``` text
bms/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── menu/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── order/[token]/page.tsx
│   ├── admin/
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── staff/
│   │   ├── roles/
│   │   ├── integrations/
│   │   └── audit/
│   ├── manager/
│   ├── kitchen/kot/
│   ├── delivery/tasks/
│   ├── support/inbox/
│   └── api/
│       ├── public/
│       ├── admin/
│       ├── orders/
│       ├── delivery/
│       ├── whatsapp/webhook/
│       ├── imagekit/auth/
│       ├── telephony/inbound-call/
│       ├── telephony/call-ended/
│       └── clerk/webhook/
├── components/
│   ├── catalog/
│   ├── checkout/
│   ├── kot/
│   ├── delivery/
│   ├── support/
│   └── ui/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── permissions/
│   ├── realtime/
│   ├── imagekit/
│   ├── whatsapp/
│   ├── maps/
│   ├── telephony/
│   ├── validation/
│   └── logging/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── workers/
│   ├── outbox-worker.ts
│   └── notification-worker.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── knowledge/
│   └── knowledge-base.md
├── .env.example
├── API.md
├── DEPLOYMENT.md
└── README.md
```

------------------------------------------------------------------------

## 17. Implementation plan and dependencies

### Phase 1 --- Core bakery operations

-   Finalize Prisma schema and initial migration.
-   Implement published catalog and admin menu CRUD.
-   Implement validated checkout and immutable order item snapshots.
-   Implement KOT dashboard and legal status transitions.
-   Add real-time event publication and reconnect refetch.
-   Add English/Telugu browser speech options and unlock-audio UI.
-   Add unit, integration, and core E2E tests.

### Phase 2 --- Authentication and staff management

-   Integrate Clerk sign-in/session verification.
-   Implement staff profiles and bakery membership.
-   Seed built-in roles and permission catalog.
-   Implement role/permission editor, invitation flow, deactivation, and
    audit logging.
-   Enforce permission checks on every internal API and dashboard.

### Phase 3 --- ImageKit and WhatsApp

-   Implement signed ImageKit uploads and asset ownership checks.
-   Configure Meta app, phone number, webhooks, and approved templates.
-   Implement order confirmation, ready, dispatched ETA, and delivered
    notifications.
-   Add outbox/retry logic and provider delivery-status tracking.
-   Implement the KOT "Send to WhatsApp" action only for a supported
    delivery mechanism.

### Phase 4 --- Delivery operations

-   Implement driver portal and task assignment.
-   Implement pickup and delivered actions.
-   Integrate route ETA and graceful fallback.
-   Test assignment security and notification retries.

### Phase 5 --- Support CRM and telephony

-   Implement shared conversations/messages and agent claims.
-   Add Meta webhook deduplication and shared inbox real-time updates.
-   Select Twilio or Exotel after confirming local number and parallel
    ringing support.
-   Configure four agent endpoints, call callbacks, missed-call logging,
    and permitted WhatsApp fallback.

### Phase 6 --- Production readiness

-   Configure managed database, Redis, worker, domains, TLS, backups,
    and monitoring.
-   Add rate limits, security review, load tests, provider failure
    tests, and restore drills.
-   Verify approved templates, sender registration, consent, and
    provider policies.
-   Deploy to staging first, execute acceptance checklist, then release
    production.

------------------------------------------------------------------------

## 18. Decisions to record before implementation

1.  Is the first production deployment for one bakery or multiple
    bakeries/tenants? The schema above includes `bakery_id` to support
    tenant scoping.
2.  Does the bakery accept pickup, delivery, or both? Are scheduled
    pickup and custom-cake lead times required at launch?
3.  Which provider will be used for calls: Twilio or Exotel? Confirm
    number availability and parallel dialing in the deployment country.
4.  Confirm whether the required staff WhatsApp group messaging is
    supported by the selected official Meta product. If not, choose an
    approved fallback before promising the feature.
5.  Confirm the currently supported Meta Graph API version and exact
    approved template names/languages.
6.  Decide whether public checkout requires OTP, guest checkout, payment
    gateway, or pay-on-delivery/counter payment.
7.  Define cancellation, refunds, stock reservation, and out-of-stock
    behavior for items already in carts.
8.  Confirm English/Telugu voice behavior on target kitchen devices and
    whether installed Telugu browser voices are available.
9.  Set data retention and consent policy for customer messaging, call
    logs, and support conversations.
10. Select the cloud host and verify persistent WebSocket support or
    provision a separate real-time service.

------------------------------------------------------------------------

## 19. Official documentation starting points

Use the current official documentation during implementation; provider
APIs, versions, and eligibility can change.

-   Next.js: https://nextjs.org/docs
-   Prisma: https://www.prisma.io/docs
-   Clerk Next.js: https://clerk.com/docs
-   Clerk Organizations: https://clerk.com/docs/organizations/overview
-   ImageKit: https://imagekit.io/docs
-   Meta WhatsApp Cloud API:
    https://developers.facebook.com/docs/whatsapp/cloud-api/
-   Meta WhatsApp templates:
    https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/
-   Twilio Programmable Voice: https://www.twilio.com/docs/voice
-   Exotel developer documentation: https://developer.exotel.com/
-   Google Maps Platform: https://developers.google.com/maps
-   Socket.IO: https://socket.io/docs/v4/
-   MDN Web Speech API:
    https://developer.mozilla.org/docs/Web/API/Web_Speech_API

------------------------------------------------------------------------

**End of knowledge base.** This document is the implementation baseline,
not proof that third-party accounts, credentials, approved templates, or
production integrations are already configured.
