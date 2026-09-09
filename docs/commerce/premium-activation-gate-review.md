# Milestone 12 — Premium Activation Entry-Gate Review

> **Sequencing update (2026-09-09):** This completed gate evidence remains valid. Earlier references to provider work in Sprint 34 were historical and have been reconciled: current `ROADMAP.md` places provider verification and controlled activation in Milestone 15 / Sprint 42, after Milestones 13–14 and the persistent-security/staging/recovery gates.

- **Review Date:** 2026-09-07 18:21 WITA
- **Milestone:** Milestone 12 — Commercial Readiness Gate Review
- **Sprint:** Sprint 33 — Premium Activation Entry-Gate Review
- **Status:** COMPLETED — COMMERCIAL ACTIVATION SAFELY BLOCKED
- **Auditor:** Anto (AI Pair Programmer)
- **Reviewer:** Abangku (Project Owner)

---

## 1. Executive Summary & Decision

This document records the formal entry-gate review for **Milestone 12 (Commercial Readiness Gate Review)** as specified in `ROADMAP.md` and `PLAN.md`.

### Verdict: **COMMERCIAL ACTIVATION IS SAFELY BLOCKED**

In accordance with architectural principles (ADR 0004) and roadmap invariants:
1. **Zero Published Premium Content:** All current published curriculum modules (Paths 1 to 6, covering 31 modules, 65 lessons, 195 formative quizzes, and 6 capstones) belong to **Networking** and are permanently **100% FREE**. No premium learning paths, modules, or lessons have been authored or published for any roadmap-scoped track (CCTV, Fiber Optic, VoIP, MikroTik, Cisco, Linux Server, Security).
2. **Pricing Unapproved & Unannounced:** All commercial packages (7 Single Course packages, 3 Combo packages) are cataloged as `COMING_SOON` with `amountIdr: null` ("Price announced at launch"). No pricing has been approved by the owner.
3. **No Commercial Products Sellable:** Under domain catalog invariants, a premium course cannot be `AVAILABLE` without a published, linked `LearningPath`. Consequently, no purchase order can be created by learners.
4. **Legal, Merchant, & Tax Prerequisites Incomplete:** Legal policies (`/terms`, `/privacy-policy`) remain in development status per ADR 0003; operational business entity registration, merchant onboarding (Midtrans), tax compliance (PPN), and dedicated privacy contact are not yet configured.
5. **No Production Payment Gateway:** The codebase strictly utilizes an internal `SandboxGateway`. No Midtrans credentials, SDK, or live webhook endpoints exist in the production environment or server configuration.

**Conclusion:** Sprint 42 (Midtrans Gateway and Controlled Commercial Activation) **must not execute live payment activation** until real premium content is authored, owner-approved pricing is published, and merchant legal prerequisites are satisfied.

---

## 2. Gate-by-Gate Detailed Audit

### Gate 1: Actual Published Premium Content Audit

- **Requirement:** At least one premium course must have published, review-passed learning content and linked learning paths before purchase affordances can be activated.
- **Observed Codebase Evidence:**
  - `src/features/learning/content/registry.ts`: Contains 27 registered module definitions across 6 Networking paths:
    - Path 1: `network-foundations` (5 modules, 10 lessons)
    - Path 2: `ip-addressing` (3 modules, 6 lessons)
    - Path 3: `switching-routing` (5 modules, 10 lessons)
    - Path 4: `network-services` (5 modules, 10 lessons)
    - Path 5: `wireless-troubleshooting` (4 modules, 8 lessons)
    - Path 6: `network-planning` (5 modules, 10 lessons)
  - All 6 paths are explicitly mapped to the `FREE` Networking course.
  - Future tracks (`cctv`, `fiber-optic`, `voip`, `mikrotik`, `cisco`, `linux-server`, `security`) have **zero** files under `src/features/learning/content/`.
  - In `prisma/commerce-seed.ts`:
    ```typescript
    {
      slug: "cctv",
      title: "CCTV & Video Surveillance",
      track: "cctv",
      accessTier: "PREMIUM",
      catalogStatus: "COMING_SOON",
      learningPathId: null, // No published path linked
    }
    ```
  - In `src/features/commerce/catalog-rules.ts`:
    ```typescript
    if (course.catalogStatus === "AVAILABLE") {
      if (!course.learningPathId || course.isLinkedPathPublished !== true) {
        throw new CatalogRuleError(
          "Premium course cannot be AVAILABLE without a published linked learning path"
        );
      }
    }
    ```
- **Finding:** Invariant is fully enforced in domain logic and unit tests (`src/features/commerce/activation-gates.test.ts`).
- **Gate Status:** **BLOCKED (No premium content authored)**.

---

### Gate 2: Server-Side Entitlement & Content Access Guard Verification

- **Requirement:** Client-side affordances must never control access; server-side guards must protect premium content from unauthorized reading or execution.
- **Observed Codebase Evidence:**
  - `src/features/commerce/access.ts` exports `requireLearningPathAccess({ userId, pathSlug })`:
    - Checks `path.commerceCourse`.
    - If `course.accessTier === "FREE"`, grants instant access without requiring an entitlement record.
    - If `course.accessTier === "PREMIUM"`, queries database for `userId_courseId` with `state: "ACTIVE"`.
    - Rejects with `CourseAccessDeniedError` (code: `COURSE_ACCESS_DENIED`) if entitlement is missing or `REVOKED`.
  - Unit tests in `access.test.ts` and `activation-gates.test.ts` verify:
    - Free paths accessible by any authenticated user.
    - Unentitled or revoked access to hypothetical premium courses is rejected with HTTP 403 / `CourseAccessDeniedError`.
  - Immutable historical record: Entitlements are tied to `(userId, courseId)` with lifetime grant timestamps and order lineage.
- **Gate Status:** **SATISFIED (Guards built and verified; dormant until premium content is linked)**.

---

### Gate 3: Owner-Approved Pricing & Product Package Integrity

- **Requirement:** Owner-approved pricing for single courses and at least one valid Combo Package containing two or more real premium courses.
- **Observed Codebase Evidence:**
  - In `prisma/commerce-seed.ts`:
    - 7 Single packages (`cctv-course`, `fiber-optic-course`, `voip-course`, `mikrotik-course`, `cisco-course`, `linux-server-course`, `security-course`): `amountIdr: null`, `catalogStatus: "COMING_SOON"`.
    - 3 Combo packages (`field-infrastructure-bundle`, `network-operations-bundle`, `all-access-bundle`): `amountIdr: null`, `catalogStatus: "COMING_SOON"`.
  - Catalog UI (`src/features/commerce/components/course-catalog-grid.tsx`):
    - Renders `Coming soon` badge.
    - Displays `Price announced at launch`.
    - Renders no checkout or purchase button.
  - Domain rules (`validatePackageDefinition`):
    - Rejects any `COMING_SOON` package with a non-null price.
    - Rejects any package containing the `FREE` networking course.
    - Rejects any `COMBO` package with fewer than two courses.
  - Order creation route (`POST /api/commerce/orders`):
    - Tested in `src/features/commerce/commerce-route.test.ts`.
    - Automatically rejects order creation for `COMING_SOON` packages with HTTP 400 (`Package is not available for purchase`).
    - Client cannot submit prices, amounts, or states (attacker payloads like `amount: 500`, `state: "PAID"` are discarded; price is always resolved from server catalog).
- **Gate Status:** **BLOCKED (Prices unannounced; commercial purchase disabled)**.

---

### Gate 4: Operator, Legal, Privacy, Merchant & Tax Readiness

- **Requirement:** Operator identity, privacy contact, user retention/deletion procedures, child data consent, merchant account, terms of sale, and tax compliance (PPN) established before accepting customer funds.
- **Observed Codebase Evidence:**
  - `src/app/terms/page.tsx` and `src/app/privacy-policy/page.tsx`:
    - Documented in ADR 0003 (`docs/decisions/0003-legal-pages-and-policy-boundaries.md`):
      > "The policies describe the current implementation, not certified legal compliance. Operator identity, a reachable privacy contact, retention/deletion procedures, child-data consent, and deployed infrastructure disclosures remain pre-launch work."
  - Business Entity: Netloka currently operates as an educational development project without formal legal entity registration (PT / CV) required for Indonesian payment gateway merchant verification (KYC/KYB).
  - Tax (PPN): No automated 11%/12% VAT calculation or e-faktur invoicing mechanism is implemented.
  - Customer Support & Refund: In accordance with Section 1 of the commerce design, digital product refunds are currently out-of-scope; no dispute or chargeback handling workflows exist.
- **Gate Status:** **BLOCKED (Pre-launch legal/merchant prerequisites incomplete)**.

---

### Gate 5: Private Provider Configuration & Webhook Security

- **Requirement:** Midtrans credentials, webhook signature verification, and isolated staging environments configured through private channels without exposing secrets in code.
- **Observed Codebase Evidence:**
  - `src/features/commerce/payments/`:
    - Contains `sandbox-gateway.ts` and `types.ts`.
    - No Midtrans gateway adapter (`midtrans.ts`) exists.
  - `src/lib/env/server.ts`:
    - Validates server environment variables.
    - Contains **zero** `MIDTRANS_*` keys (`MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_MERCHANT_ID`).
  - `.env.example`:
    - Configured with `PAYMENT_MODE="disabled"`.
    - No secret leakage across repository history or commits.
  - Webhook Endpoint:
    - `/api/commerce/sandbox/events/route.ts` exists for development testing only, protected by `SANDBOX_PAYMENT_EVENT_SECRET`.
    - No production Midtrans webhook handler (`/api/commerce/webhooks/midtrans`) exists.
- **Gate Status:** **BLOCKED (provider integration deferred to the final payment sprint, Milestone 15 / Sprint 42)**.

---

### Gate 6: Staging Infrastructure & Operational Launch Gates

- **Requirement:** Staging deployment, database replication, automated backups, and TLS termination verified under Milestone 7 operational gates.
- **Observed Codebase Evidence:**
  - Production target: `netloka.biz.id`.
  - Milestone 7 remains open for production infrastructure deployment.
  - Staging database with isolated webhook simulation has not yet been deployed to remote cloud infrastructure.
- **Gate Status:** **PENDING M7 OPERATIONAL DEPLOYMENT**.

---

## 3. Evidence Matrix

| Gate | Requirement | Repository Evidence | Status |
| --- | --- | --- | --- |
| **Gate 1** | Published Premium Content | 6 Networking paths free; 7 premium courses unlinked and `COMING_SOON` | **BLOCKED** |
| **Gate 2** | Access Guards & Entitlements | `requireLearningPathAccess` enforced; tested in unit/route suites | **SATISFIED** |
| **Gate 3** | Approved Pricing & Combo Packages | All packages `COMING_SOON` with null price; order creation blocked | **BLOCKED** |
| **Gate 4** | Operator, Legal & Merchant Setup | Terms & Privacy in development draft; merchant KYC/tax pending | **BLOCKED** |
| **Gate 5** | Provider Adapter & Webhook | Sandbox mock only; zero Midtrans secrets; live payments disabled | **BLOCKED** |
| **Gate 6** | Staging & Deployment Runbook | Local Docker verified; remote staging/production deployment pending | **BLOCKED** |

---

## 4. Conditions for Authorizing Sprint 42

Sprint 42 (*Midtrans Gateway and Controlled Commercial Activation*) may be authorized **only after**:
1. Abangku approves authoring and publishing at least one real premium course (e.g., MikroTik MTCNA or CCTV Surveillance).
2. Abangku sets and approves the official IDR pricing for single courses and combo bundles.
3. Operator entity, merchant onboarding on Midtrans, and production legal/privacy policies are formalized.
4. Midtrans API keys are provided securely via environment variables on staging/production servers (never committed to Git).

Until the above conditions are met, Netloka will continue to provide its complete 6-path Networking curriculum **100% free of charge**, with commercial checkout safely and deterministically disabled.
