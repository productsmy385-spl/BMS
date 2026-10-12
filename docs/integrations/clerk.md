# Clerk Authentication Integration

## 1. Overview
Clerk provides secure user authentication, multi-factor authentication, and user session management for BMS.

## 2. Decoupled Tenant Membership
Clerk authenticates who the user is. The BMS application determines what bakeries and roles the user can access:
- When a user signs in via Clerk, BMS queries `User` table matching `clerkUserId` or `email`.
- BMS loads the user's `TenantMembership` list to determine whether they are `SUPER_ADMIN`, `BAKERY_ADMIN`, `POS_STAFF`, or `KITCHEN_STAFF`.

## 3. Configuration & Fallback
If Clerk credentials are not yet supplied (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are empty), BMS switches to internal session/token auth mode so local development and offline environments function seamlessly.
