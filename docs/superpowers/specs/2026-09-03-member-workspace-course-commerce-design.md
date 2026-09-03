# Member Workspace & Course Commerce Foundation — Design

**Status:** Approved product design; planning documentation only. No application code, schema migration, payment credential, or production payment activation is authorized by this document.
**Date:** 2026-09-03
**Scope:** Milestone 7 / Sprint 17 planned, and Milestone 8 activation gates
**Owner decisions recorded:** hybrid lifetime catalog; Networking free; Single Course and Combo Package products; combos contain two or more premium courses only; premium tracks are sellable only after their learning content is available; unreleased offers show `Coming soon` and `Price announced at launch`; catalog management begins with repository seed/config; Dynamic QRIS is deferred until merchant readiness; refunds are handled outside the application.

## 1. Purpose and scope

Netloka currently has a public space-themed landing experience and protected learning routes with a header, dashboard, profile dropdown, and account modal. It has no course commercial catalog, purchase order, payment gateway, or durable entitlement model. This design makes the post-login experience a learner workspace and supplies a testable foundation for future paid courses without activating a real payment method.

### In scope for Sprint 17

- A persistent desktop sidebar and equivalent mobile drawer for authenticated routes.
- A learner workspace: Overview, My Learning, Course Catalog, My Packages, Orders, Profile, and Settings.
- Catalog/domain persistence for free and premium courses, Single Course packages, Combo Packages, orders, payment attempts, and lifetime entitlements.
- Seed/config management only; no browser-based admin system.
- Server-side premium-access authorization, while Networking remains free.
- A development/test-only sandbox payment gateway and deterministic, idempotent purchase lifecycle.
- Documentation, migrations, tests, review, and PR/CI delivery following `AGENTS.md`.

### Explicit non-goals

- No alteration to the public `/` page, marketing components, public navigation, public auth modal, or their UI/UX without a separate owner authorization.
- No production checkout, Midtrans credentials, QRIS generation, merchant onboarding, invoice/tax automation, coupon/promo, subscription, renewal, self-service refund, or admin dashboard.
- No premium course is displayed as purchasable until its actual learning content is published and linked.
- No fake production offer, hidden client-side entitlement, manual client payment success, or direct route bypass.

## 2. Existing boundaries and flow to preserve

| Boundary | Current implementation fact | Sprint 17 handling |
| --- | --- | --- |
| Public experience | `src/app/page.tsx`, `src/components/marketing/`, and the URL-driven auth modal are the locked pre-login surface. | Read only unless the owner grants a new public-UI task. |
| Authentication | `src/features/auth/auth.ts`, `src/lib/auth.ts`, `src/middleware.ts`, and `(auth)` routes issue/validate sessions. | Reuse the established session/user identity; do not change provider/session semantics. |
| Authenticated shell | `src/app/(app)/layout.tsx` currently renders `AppHeader` plus a centered content area. | Replace only the authenticated shell with workspace navigation; preserve route protection. |
| Learning | `src/features/learning/`, route handlers, Prisma learning models, progress and XP services contain current Networking learning flow. | Keep these domain functions independent; add a commerce guard before future premium content is read or submitted. |
| Profile/settings | Account modal, profile API, password API, and Settings route already exist. | Link to/reuse them; do not duplicate profile or settings state. |
| Persistence | Prisma/PostgreSQL is the established durable store. | Add a migration and deterministic commerce services; do not use browser storage as access authority. |

Existing learning flow remains:

```text
Authenticated learner → lesson/lab/challenge/consultant route or API
→ current session + input/ownership validation → deterministic domain service
→ Prisma progress/attempt/XP data → updated learning UI
```

Future premium content extends, rather than replaces, that flow:

```text
Authenticated learner → requested premium course content/action
→ resolve Course + server-side entitlement → existing learning validation/service
→ Prisma learning data → UI
```

## 3. Authenticated workspace experience

Successful authentication continues to use the validated local callback flow, then sends the user to `/dashboard`. The public space theme stops at the authentication boundary. Authenticated surfaces use `#000000` as their default background and `#ffffff` as their default text; they do not render the public cosmic background. The existing Settings theme toggle remains available and works normally when the user chooses light mode.

Desktop uses a persistent sidebar. Mobile uses an accessible drawer containing the same destinations, focus management, keyboard escape behavior, and a visible trigger. The sidebar is a navigation affordance, not permission proof.

| Destination | Responsibility | Data source | Access rule |
| --- | --- | --- | --- |
| Overview (`/dashboard`) | Continue-learning state, progress, active packages, recent orders, and relevant recommendations. | Learning summary + entitlement/order read models. | Authenticated user only. |
| My Learning (`/my-learning`) | Networking plus premium courses the user can access. | Catalog + entitlement resolver + learning progress. | Authenticated user only. |
| Course Catalog (`/catalog`) | All free, available premium, and coming-soon tracks/packages. | Published catalog query. | Authenticated user only in Sprint 17. |
| My Packages (`/my-packages`) | Lifetime course access grouped by purchase source. | Entitlements and package snapshots. | Owner-scoped only. |
| Orders (`/orders`) | Read-only order and payment status history. | Orders/payment attempts. | Owner-scoped only. |
| Profile / Settings | Existing account controls. | Existing profile/settings features. | Authenticated user only. |

Networking is labeled `Free` and available to every authenticated user. Initial premium catalog entries are CCTV & Video Surveillance, Fiber Optic, PABX/IP PBX/VoIP, MikroTik, Cisco, Linux & Server Administration, and Network Security. Until their learning content exists, every premium entry is `Coming soon`, shows `Price announced at launch`, and has no actionable checkout control.

## 4. Commerce domain model

Introduce `src/features/commerce/` as a focused domain module. Commerce is intentionally separate from lesson rendering, progress, quiz scoring, and UI components. A `Course` is the commercial catalog identity; an existing or future `LearningPath` is the learning-content identity. A course may link to one learning path when content is ready. This avoids treating unpublished content as a purchasable product and permits catalog metadata before course content exists.

### Persistent entities

| Entity | Essential fields | Invariants |
| --- | --- | --- |
| `Course` | immutable id; unique slug; title; track; `accessTier` (`FREE`/`PREMIUM`); `catalogStatus` (`COMING_SOON`/`AVAILABLE`/`RETIRED`); optional unique `learningPathId`; display order | `FREE` Course is not sold. `PREMIUM` Course cannot be `AVAILABLE` without a published linked learning path. |
| `Package` | unique slug; title; `kind` (`SINGLE`/`COMBO`); `catalogStatus`; nullable amount in integer IDR; currency `IDR`; display order | Price exists only for `AVAILABLE` packages. A `SINGLE` has one premium course; a `COMBO` has at least two premium courses. |
| `PackageCourse` | package id; course id; ordering | No Networking/free course in any commercial package. No duplicated course per package. |
| `Order` | immutable public reference; user id; state (`PENDING`/`PAID`/`EXPIRED`/`CANCELLED`); provider; total amount snapshot; currency; expiry; timestamps | An order belongs to one user. Only a successful payment transition can create entitlement. Final states cannot regress. |
| `OrderLine` | order id; package/course identifiers and title snapshot; amount snapshot; quantity fixed to one | Historical display never changes if catalog title or price changes later. |
| `PaymentAttempt` | order id; provider transaction/event identifiers; provider status; raw-provider metadata reduced to safe necessary fields; timestamps | Provider event id is unique. Replayed events are idempotent. No secret/card/QR payload is retained unnecessarily. |
| `Entitlement` | user id; course id; source order nullable for free grants; source type (`FREE`/`PURCHASE`/`ADMIN`); state (`ACTIVE`/`REVOKED`); granted timestamp | One active entitlement per user/course. A paid Combo creates one entitlement per contained course transactionally. Networking access is resolved as free; persisting it is optional but must not make it purchasable. |

The exact Prisma names and database constraints must be verified against the current schema during implementation. A migration is mandatory and must be reviewed with generated client changes. Catalog and price data are created by a deterministic seed/config source; no CMS/admin API is included in Sprint 17.

### Domain services and contracts

- `catalog.ts`: published catalog read model; never exposes checkout state that server validation would reject.
- `packages.ts`: package composition and price validation; rejects invalid Single/Combo definitions at seed and service boundaries.
- `orders.ts`: creates a pending order using the server catalog price snapshot; never accepts price, access tier, entitlement, or paid state from the browser.
- `payments.ts`: provider-neutral contract with `createCheckout`, `verifyWebhook`, and `getPaymentStatus`.
- `entitlements.ts`: resolves free/paid access and grants/revokes through a transaction; used by server routes and content guards.
- `access.ts`: translates a requested learning path/content action into a Course entitlement requirement; returns a safe 403/not-found product response without exposing other-user data.

## 5. Payment and entitlement lifecycle

Sprint 17 implements the lifecycle only in development/test through a `SandboxGateway`. Production must not enable a success control or grant pathway until a real provider is configured.

```text
Available package selected
→ server validates authenticated owner, package status, composition, and server price
→ order + line snapshots created as PENDING
→ selected gateway creates a payment attempt
→ verified provider/sandbox event arrives
→ one transaction marks order PAID and grants all course entitlements
→ sidebar/dashboard/catalog reads new access
```

Allowed transitions:

```text
PENDING → PAID
PENDING → EXPIRED
PENDING → CANCELLED
PAID, EXPIRED, CANCELLED → final
```

The payment status page or client redirect is feedback only. It cannot alter `Order`, `PaymentAttempt`, or `Entitlement`. The webhook/sandbox event must be authenticated, bound to the expected order/provider, and processed idempotently. Repeated delivery returns success without duplicating an entitlement. Expiry is represented by `expiresAt`; implementation must define a deterministic expiration check without inventing a new queue/microservice.

`SandboxGateway` is available only when an explicit non-production environment setting allows it. Tests use isolated fixture courses/packages that never enter production seed/catalog. If there are no real `AVAILABLE` premium courses, normal users see no checkout. Refund is outside the app: there is no refund endpoint or customer control in this phase. Any future operational correction requires an auditable, explicitly authorized process.

Phase 2 adds `MidtransGateway`, one Dynamic QRIS per server-created order, private credentials, provider webhook signature verification, safe callback URLs, expiry/status reconciliation, and sandbox then staging verification. `MIDTRANS_*` values are never committed, logged, or copied into `.env.example` as live secrets.

## 6. Milestone and sprint delivery plan

### Milestone 7 / Sprint 17 — Member Workspace & Commerce Foundation

**Goal:** Provide a distinct authenticated workspace and a durable, testable, payment-provider-neutral access model without changing the locked public experience or selling a premium course.

| Workstream | Ordered implementation outcome | Acceptance criteria |
| --- | --- | --- |
| 17.1 Commerce domain and catalog | ADR/migration, seed/config, Course/Package/Order/Entitlement services, valid state machine. | Invalid package composition/price/status is rejected; Networking remains free; all initial premium tracks render `Coming soon`. |
| 17.2 Authenticated shell | Sidebar desktop/drawer mobile; `/dashboard` as post-login workspace; default black/white theme; Settings toggle preserved. | Public routes have no diff; authenticated desktop/mobile navigation is keyboard accessible and no content is obscured. |
| 17.3 Learner workspace | Overview, My Learning, Catalog, My Packages, Orders and server-side guard integration. | User sees only their own orders/entitlements; direct premium route/action attempts are denied; free Networking flow stays functional. |
| 17.4 Sandbox lifecycle | Provider contract, non-production sandbox, idempotent paid event, expiry/cancellation behavior. | Browser/client success cannot grant access; duplicate events grant once; fixture purchase grants correct lifetime courses. |
| 17.5 Review and delivery | Complete docs, code review, relevant test suites, responsive/accessibility review, PR and CI. | All applicable local checks and all workflow jobs are green for the PR head; no Critical/High finding remains. |

### Milestone 8 — Premium Course & Payment Activation

**Goal:** Safely sell the first real premium learning content only when business, legal, product, and provider prerequisites are independently true.**

Entry gates:

1. At least one premium course has published learning content and verified access guards.
2. Final price and at least one valid Combo Package containing two real premium courses are owner-approved.
3. Merchant/onboarding requirements, operator identity, privacy contact, retention/right procedures, and payment terms are complete.
4. Midtrans account/configuration and secrets are supplied privately; no exposed/reused credential is accepted.
5. Staging database, webhook endpoint, monitoring, backup/restore, and deployment gates from Milestone 7 are verified.

Workstreams: provider adapter implementation, Midtrans sandbox verification, isolated staging verification, controlled live QRIS enablement, reconciliation/dispute/refund operational runbook, post-deploy smoke verification, then production availability. Milestone 8 does not start merely because Sprint 17 code exists.

## 7. Testing and review strategy

1. Establish baseline checks in the isolated worktree before implementation. If the baseline fails, investigate and record the blocker; do not claim green.
2. TDD for pure package validation, price snapshotting, order transitions, event idempotency, combo grant behavior, and entitlement resolution.
3. Route tests for session requirement, owner isolation, malformed body rejection, unavailable/coming-soon checkout rejection, and direct premium guard denial.
4. E2E tests for post-login redirect, sidebar/drawer keyboard behavior, black default authenticated surface, theme toggle, catalog states, My Packages/Orders ownership, and sandbox fixture lifecycle. Public landing/auth visual regression remains unchanged.
5. Run the repository's relevant `npm run db:generate`, lint, typecheck, unit/integration, E2E, build, and `git diff --check` gates after implementation. Use test database/env values only; never run a migration or sandbox flow against user data without explicit scope.
6. Independently review schema migration, transaction boundaries, server authorization, provider secrets/logs, mobile accessibility, and the final diff before PR. A green CI run is evidence, not a substitute for review.

## 8. Required agent workflow

Every future agent working on this design must:

1. Read `AGENTS.md`, `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`, `docs/HANDOFF.md`, this design, and the affected source/tests before drafting code.
2. Verify live Git/PR/CI facts instead of trusting this historical planning snapshot; report milestone, branch/worktree, local changes, and blockers before implementation.
3. Reconfirm scope when a decision would change public UI, course publication, pricing, payment provider, data contract/migration, refund policy, or deployment. Public landing/auth UI is locked without explicit owner permission.
4. Create or reuse one isolated, focused `codex/`-prefixed task worktree from current `main`; never edit `main`, delete unrelated worktrees, use live secrets, or invoke real payment during Phase 1.
5. Implement one approved workstream at a time with focused failing tests first, then broader checks. Keep commerce domain logic out of React components and price/entitlement authority on the server.
6. Update `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md` in WITA, `docs/HANDOFF.md`, ADRs, and tests with evidence. Do not mark a check, payment integration, deployment, or sprint complete without observed proof.
7. Review, commit focused conventional commits, validate, push, create one structured PR with `gh`, confirm all applicable CI jobs for the latest head/base, then wait for Abangku's review and merge.
8. After owner-confirmed merge, verify the PR merge, fast-forward clean main, and clean only the exact authorized task worktree/branch after status, ancestry, and untracked files are safe.

## 9. Risks and deliberate boundaries

- A visual lock cannot secure premium content. Server-side guards must precede every future premium read/write action.
- A client callback, redirect, or local storage status cannot prove payment. Verified provider events and idempotent transactions are mandatory.
- A catalog can be visible before content exists, but an unavailable premium course cannot have a clickable purchase path or price.
- Current UI/account data may contain client-local preferences. These cannot be used for entitlement or payment truth.
- The current payment phase has no merchant credentials and no live database/email/payment verification. It must remain development-only until Milestone 8 gates are satisfied.
- Refund, customer support, disputes, and legal/tax obligations require an operational policy before production payment, not an implied database flag.
