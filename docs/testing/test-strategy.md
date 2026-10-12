# Quality Assurance & Test Strategy

## 1. Test Pyramid
1. **Unit Tests (Vitest)**:
   - Order price calculation & tax computation logic.
   - Authoritative custom cake add-on cost accumulation.
   - ESC/POS byte sequence generation.
   - Interakt webhook signature verification.
2. **Integration Tests**:
   - Tenant isolation: User from Tenant A attempting access to Tenant B yields 403/404.
   - Atomic inventory deductions during order placement.
   - Order-to-KOT lifecycle transitions.
3. **End-to-End Tests (Playwright)**:
   - Public Storefront checkout -> Kitchen KOT display -> Ready notification.
   - Counter POS fast checkout -> Receipt print emulator.
   - Super Admin bakery tenant provisioning flow.
4. **Build & Type Checks**:
   - `tsc --noEmit` on every slice.
   - `next build` validation.
