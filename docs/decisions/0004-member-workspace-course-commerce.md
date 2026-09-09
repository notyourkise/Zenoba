# ADR 0004: Member Workspace & Course Commerce Foundation

## Status

Accepted

Planning update (2026-09-09): references to premium activation as "Milestone 8" below are historical. The gates were reviewed without activation in Milestone 12; real provider implementation and controlled activation are deliberately last in **Milestone 15 / Sprint 42** in [ROADMAP.md](../../ROADMAP.md). All original provider/product/legal/deployment gates remain in force.

## Context

Netloka provides interactive IT infrastructure learning, with Networking as its foundational MVP curriculum. Moving into Milestone 7 / Sprint 17, the platform requires:
1. A dedicated, authenticated learner workspace shell separate from the public space-themed landing page.
2. A durable, server-authoritative, provider-neutral commerce data model supporting lifetime access for future premium courses.
3. Strict separation between commercial entities (`Course`, `Package`, `Order`, `Entitlement`) and instructional entities (`LearningPath`, `Module`, `Lesson`).

## Decisions

1. **Course Identity vs Learning Path Identity:**
   - A `Course` is the commercial catalog entity.
   - A `LearningPath` is the instructional content entity.
   - An optional unique foreign key `Course.learningPathId` links a commercial course to a published learning path.
   - A premium course cannot be `AVAILABLE` without an existing, published `LearningPath`.

2. **Access Tiers & Product Packages:**
   - `FREE`: Networking is 100% free and cannot be included in any commercial package.
   - `PREMIUM`: Future tracks (CCTV, Fiber Optic, VoIP, MikroTik, Cisco, Linux Server, Security) start as `COMING_SOON` with unannounced pricing and no purchase affordance until content exists.
   - `SINGLE`: Contains exactly one premium course.
   - `COMBO`: Contains two or more premium courses only. Never contains free courses.

3. **Server-Side Authoritative Commerce & Immutability:**
   - Prices, package contents, and access tiers are strictly resolved and snapshot on the server (`OrderLine`). Client-provided prices, access tiers, or statuses are ignored.
   - Orders follow a strict state machine: `PENDING` -> `PAID`, `EXPIRED`, `CANCELLED`.
   - Final states cannot regress.

4. **Idempotent Payment Lifecycle:**
   - Every provider payment event is logged as a `PaymentEvent` with a unique provider event ID before mutation.
   - Duplicate or replayed webhook events are processed idempotently (returning success without duplicating entitlements).
   - In Sprint 17, payments are development-only using an internal `SandboxGateway`. Real payment providers (Midtrans/QRIS) and merchant credentials are deferred to Milestone 15 / Sprint 42.

5. **Entitlement & Access Guard:**
   - Entitlements grant lifetime access (`ACTIVE` / `REVOKED`) mapped to `(userId, courseId)`.
   - Content access guards (`requireLearningPathAccess`) verify server entitlements before serving lesson details or persisting lesson progress/XP.

6. **Authenticated Workspace UI:**
   - Authenticated surfaces use `#000000` background and `#ffffff` text (clean workspace contrast) with persistent sidebar on desktop and accessible drawer on mobile.
   - Public landing page (`/`), marketing sections, and auth modal remain locked and untouched.

## Consequences

- Learning modules remain decoupled from billing.
- Networking remains permanently accessible to all learners.
- Server-side access and price authority is the required boundary against client-request tampering; implementation still requires endpoint-level authorization review.
- Transparent upgrade path to Midtrans/QRIS in Milestone 15 / Sprint 42.
