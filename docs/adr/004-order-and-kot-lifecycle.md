# ADR 004: Unified Order & KOT Lifecycle

## Status
Accepted

## Context
Orders arrive via two distinct channels:
1. Walk-in counter (POS)
2. Online store (Public Website)
Both channels must use identical core pricing logic, inventory checks, kitchen ticket dispatch, and accounting records.

## Decision

### Order State Machine
```
[NEW] (Website order placed / POS checkout)
  │
  ├──> [ACCEPTED] (Kitchen / Cashier accepts order; KOT dispatched)
  │      │
  │      ├──> [PREPARING] (Kitchen is baking / decorating custom cake)
  │      │      │
  │      │      ├──> [READY_FOR_PICKUP] (Order packed; audio announcement fired)
  │      │      │      │
  │      │      │      ├──> [DELIVERED] (Order collected or delivered)
  │      │      │      │
  │      │      │      └──> [OUT_FOR_DELIVERY] ──> [DELIVERED]
  │
  └──> [CANCELLED] (Order rejected or cancelled with reason)
```

### KOT Ticket Generation
- Each accepted order automatically produces one or more `KOTTicket` records.
- For mixed orders (e.g., standard cookies + customized multi-tiered cake), tickets carry item-level special instructions, customization tags, and scheduled completion deadlines.
- Status changes in `KOTTicket` propagate back to update the parent `Order` status automatically.
