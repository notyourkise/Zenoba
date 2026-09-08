# Developer Portal, Internal Learner, and Learner Experience Design

Status: Owner approved; detailed implementation planning authorized on 2026-09-08 WITA

Decision date: 2026-09-07 WITA

Scope: Role separation, internal operations, learner-experience quality, security hardening, and roadmap resequencing

## 1. Purpose

Netloka needs a dedicated developer experience without weakening the learner experience or turning the web application into an operational control plane. The owner also wants learning quality, learner comfort, and security to take precedence over production deployment and payment-provider activation.

This design introduces:

1. a server-authoritative `DEVELOPER` role with a separate `/developer` portal;
2. an `INTERNAL_LEARNER` role for owner-operated curriculum testing;
3. one shared login form with role-based server redirects;
4. read-only system and curriculum observability in the developer portal;
5. controlled entitlement grant/revoke operations with password plus 2FA elevation and immutable audit evidence;
6. a prioritized learner-quality program; and
7. a roadmap sequence that leaves gateway, production, deployment, and live payment work until the final milestone.

This specification authorizes planning only. It does not authorize application implementation, database migration, deployment, live payment integration, remote publication, or production mutation.

## 2. Approved product decisions

### 2.1 Roles

Netloka will use exactly three application roles:

| Role | Purpose | Primary destination | Learning access | Included in learner analytics |
| --- | --- | --- | --- | --- |
| `LEARNER` | Ordinary registered learner | `/dashboard` | Free content plus active entitlements | Yes |
| `INTERNAL_LEARNER` | Owner-controlled end-to-end learner test account | `/dashboard` | Every course/path without payment; normal prerequisites and assessments still apply | No |
| `DEVELOPER` | Owner-controlled system and user administration | `/developer` | None | No |

`INTERNAL_LEARNER` is intentionally not named `ADMIN` or `LEARNER_ADMIN`. It has no authority over users, packages, configuration, or system state.

### 2.2 Provisioning invariants

- Email/password registration always creates `LEARNER`.
- Google registration always creates `LEARNER`.
- Registration and OAuth requests never accept or derive a privileged role from browser input or provider profile data.
- `INTERNAL_LEARNER` and `DEVELOPER` can be assigned only by a CLI command with direct production-database access from the VPS operational environment.
- No page, route handler, server action, or HTTP API may create or promote either privileged role.
- Promotion to `DEVELOPER` is rejected unless the account has a credentials password and enabled 2FA.
- Every role change records a security/audit event and invalidates prior authorization state.

### 2.3 Login and routing

All users use the existing shared login surface. After authentication, the browser is sent to a fixed server route such as `/auth/continue`. The server loads the current database role and redirects:

```text
LEARNER          -> /dashboard
INTERNAL_LEARNER -> /dashboard
DEVELOPER        -> /developer
```

The browser never chooses or asserts the role. JWT role claims may optimize presentation, but privileged authorization always checks current database state.

Developer accounts use credentials authentication only. Google authentication must not establish a developer session. A developer attempting learner routes is redirected or rejected, and a learner/internal learner attempting developer routes receives a server-side denial.

## 3. Authorization architecture

### 3.1 Defense in depth

Authorization is enforced at three layers:

1. middleware performs navigation-level redirects and basic rejection;
2. route-group layouts load the current database actor and enforce the workspace boundary; and
3. every route handler/service verifies the required actor and resource ownership before reading or mutating data.

Conditional menu rendering is never treated as an authorization boundary.

### 3.2 Central guards

Implement reusable server-only guards with narrow contracts:

- `requireDeveloperActor()` returns a fresh database-backed developer identity;
- `requireLearnerActor()` accepts `LEARNER` or `INTERNAL_LEARNER` and rejects `DEVELOPER`;
- `requireElevatedDeveloperSession()` verifies a current developer plus an unexpired elevation token;
- `requireLearningPathAccess()` treats `INTERNAL_LEARNER` as authorized for any course while retaining ordinary prerequisite, assessment, and progress rules;
- analytics queries explicitly include only `role = LEARNER` unless an internal-account diagnostic view is requested.

All privileged APIs return consistent `401`, `403`, `409`, and rate-limit responses without leaking whether a hidden account or resource exists.

### 3.3 Immediate role enforcement

Because Netloka currently uses JWT sessions, a role embedded in a token can become stale after a CLI role change. Every developer page/API therefore rechecks the user record. Privileged role changes revoke or invalidate earlier authorization state so demotion takes effect without waiting for JWT expiry.

## 4. Data design

### 4.1 User role and activity

Replace the free-form role string with a database enum:

```text
LEARNER | INTERNAL_LEARNER | DEVELOPER
```

Backfill every existing unknown or ordinary role to `LEARNER`; do not infer privileged roles from names or emails. Add `lastLoginAt` and a coarsely throttled `lastActiveAt` for operational metrics. Activity collection must avoid a database write on every request.

### 4.2 Developer elevation

Add `DeveloperElevationSession` with:

- developer user ID;
- opaque token hash, never the raw token;
- issued, last-used, expiry, and revoked timestamps;
- authentication method (`PASSWORD_2FA`); and
- sanitized request metadata sufficient for security review.

The raw token is kept only in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. Elevation lasts ten minutes, is rate-limited, and is revoked on password, 2FA, or role changes.

### 4.3 Audit and security evidence

Add `DeveloperAuditEvent` with:

- actor and optional target user/resource;
- stable action name;
- mandatory human-readable reason for sensitive business mutations;
- unique request ID and correlation ID;
- sanitized before/after JSON snapshots; and
- success/failure outcome and timestamp.

Add `SecurityEvent` for authentication failures, rate-limit enforcement, password reset, session revocation, forbidden privileged access, CLI role changes, and elevation events. Sensitive secrets, full credentials, assessment answer keys, reset tokens, 2FA secrets, and backup codes are never stored in either event table.

Application services expose audit events as immutable. Direct VPS/database administrators remain operationally capable of database mutation, so database access itself must be restricted and separately logged by infrastructure controls.

### 4.4 Entitlements

Retain the existing `Entitlement` model and use `sourceType = ADMIN` for manual grants. A revoke changes the entitlement state to `REVOKED`; it never deletes order or entitlement history. Actor, reason, and before/after state live in the audit event.

`INTERNAL_LEARNER` receives role-based all-course access rather than synthetic purchases or per-course entitlement fixtures. This keeps payment/order reporting truthful and automatically covers future internal curriculum testing.

## 5. Sensitive action flow

The only initially approved developer-portal mutations are manual entitlement grant and revoke. System configuration, deployment, database migration, backup/restore, process restart, role promotion, and curriculum editing remain unavailable through HTTP.

```text
Developer selects an ordinary/internal learner and package/course
-> server requests password plus current 2FA code
-> server creates a ten-minute elevated session
-> developer supplies a mandatory reason
-> server rechecks developer role, elevation, target, catalog, and request ID
-> entitlement mutation and audit event commit in one transaction
-> any audit failure rolls back the entitlement mutation
```

Additional rules:

- the developer cannot grant an entitlement to the developer account;
- client-provided price, order state, role, actor, or audit identity is ignored;
- repeated identical request IDs return the original result;
- reuse of a request ID with different input returns conflict;
- origin checks, CSRF protection, rate limits, and explicit confirmation are mandatory; and
- elevated sessions can be viewed and revoked from the developer account page.

## 6. Developer portal information architecture

The `/developer` route group has a separate text-led shell and no learner navigation.

### 6.1 Overview

- total ordinary learners;
- new learners over defined 7-day and 30-day windows;
- active learners using explicit, documented activity windows;
- separate internal-learner count;
- database health and bounded latency measurement;
- deployed application version, commit, and deployment timestamp when safely supplied by the VPS;
- published course/path/module/lesson/assessment/capstone counts;
- aggregate assessment and completion summaries excluding internal accounts;
- redacted integration readiness (`configured`, `not configured`, `degraded`); and
- recent security and developer audit events.

Each metric states its definition and freshness. One failed metric must degrade its own panel without breaking the entire portal.

### 6.2 Users

- paginated name/email search;
- role, account dates, last login/activity, XP, progress, and latest assessment;
- current and historical course access;
- orders, packages, amount snapshots, provider/state, payment time, and entitlement lineage; and
- no password hash, reset token, OAuth token, 2FA material, private assessment key, or unrestricted raw answer payload.

### 6.3 Access and packages

- active and revoked entitlements;
- immutable order/package/payment history;
- elevated grant/revoke workflow; and
- actor, reason, request, and before/after evidence.

### 6.4 Learning analytics

- path/module/lesson funnel;
- completion and retry rates;
- frequently missed outcomes and questions;
- assessment abandonment and remediation behavior; and
- aggregate metrics that exclude `INTERNAL_LEARNER` and `DEVELOPER`.

### 6.5 Curriculum health

Read-only validation of registry completeness, outcome/evidence coverage, assessment counts, duplicate or dangling IDs, prerequisite cycles, orphaned content, version mismatches, and unpublished dependencies. No curriculum editor or private answer-key response is exposed.

### 6.6 System health

Read-only database and application health, latency, deployment metadata, redacted environment readiness, and backup freshness only when the VPS publishes safe metadata. There is no web terminal, arbitrary query console, environment editor, migration trigger, restart, deployment, or backup/restore control.

### 6.7 Security and audit

Filterable security and audit timelines by time, actor, target, severity, action, result, and request ID. Views redact protected data and are paginated.

### 6.8 Developer account

Developer profile, password change, 2FA rotation, active elevation/session visibility, and self-session revocation. Role changes remain VPS-only.

## 7. Learner-quality program

### 7.1 Immediate comfort improvements

1. Add an authoritative exact-next-lesson resolver and dashboard resume link.
2. Add a learning queue for the current lesson, pending assessments, remediation, and unlocked capstone.
3. Autosave unsubmitted practice/assessment drafts without treating them as verified evidence.
4. Clarify lesson stage progress, estimated time, prerequisite explanations, and previous/next navigation.
5. Add curriculum search and personal bookmarks.
6. Standardize learner-facing errors so each message explains what happened, what was saved, and the next safe action.

### 7.2 Mastery improvements

1. Add a mastery view based on outcome evidence rather than completion percentage alone.
2. Add a remediation center that maps failed evidence back to the relevant lesson and practice.
3. Add optional spaced-review prompts without invalidating historical completion.
4. Add item/outcome quality analytics for curriculum review.
5. Show traceability from lesson through practice, module assessment, and capstone.
6. Improve consultant feedback with requirement gaps, technical consequences, trade-offs, and actionable revision guidance.

### 7.3 Deferred engagement features

Notes, bookmarks, weekly goals, mastery-based achievements, and shareable verified portfolio/certificates follow the reliability and mastery work. A future teacher/classroom role requires a separate design and must not inherit developer authority.

## 8. Security and operational prerequisites

The developer portal does not replace existing pre-launch work. Before public production use:

- reconcile migration history so a fresh database works with `prisma migrate deploy`;
- replace in-memory session revocation and rate limiting with persistent multi-process-safe controls;
- remove dangerous automatic OAuth email linking and design verified account linking;
- verify SMTP, Google OAuth, password reset, backup/restore, and staging journeys;
- progressively remove CSP allowances such as `unsafe-eval` where compatible;
- define privacy retention/redaction and alerting policies; and
- verify production topology, monitoring, recovery, legal, merchant, and payment-provider readiness.

## 9. Proposed roadmap sequence

Historical milestones and completed sprint evidence remain intact. Open deployment/provider work moves to the end rather than being falsely marked complete.

### Milestone 12 — Commercial Readiness Gate Review

- Sprint 33 remains the completed entry-gate review.
- Its blocked verdict remains authoritative.
- The former planned Sprint 34 provider release is replaced by the final release sprint under Milestone 15.

### Milestone 13 — Developer Operations and Internal Accounts

- Sprint 34: role enum, safe migration, VPS-only provisioning, shared-login routing, authoritative guards, and internal-learner access/exclusion.
- Sprint 35: developer portal shell, overview, users, system health, curriculum health, and safe read models.
- Sprint 36: password-plus-2FA elevation, entitlement grant/revoke, audit/security events, and privileged-flow review.

### Milestone 14 — Learner Experience and Mastery Quality

- Sprint 37: exact resume, learning queue, autosave, lesson navigation, consistent errors, search, and bookmarks.
- Sprint 38: mastery view, remediation center, outcome/item analytics, and consultant feedback improvements.
- Sprint 39: spaced review, accessibility/responsive/performance regression, learner-quality review, and milestone acceptance.

### Milestone 15 — Production and Commercial Release

- Sprint 40: persistence/session/rate-limit hardening, migration reproducibility, dependency remediation, and release security review.
- Sprint 41: legal/operator readiness, private environment setup, staging deployment, backup/restore, monitoring, and production rehearsal.
- Sprint 42: provider adapter/webhook/reconciliation verification, controlled production deployment, live payment activation only with explicit owner authorization, and post-release recovery evidence.

Remaining deployment-specific deliverables previously carried by Milestone 7 move to Milestone 15. Historical M7 implementation evidence remains, while its unverified staging/production claims are not advanced.

## 10. Delivery strategy

Keep each sprint on an isolated branch/worktree and deliver focused pull requests:

1. role/data migration and authorization foundation;
2. read-only developer portal;
3. elevated entitlement operations and auditing;
4. learner comfort features;
5. mastery and remediation features; and
6. final hardening and release work.

Every behavior change follows test-first implementation. Database migrations use disposable fresh and legacy fixtures before any staging application. Each PR receives local review, relevant full gates, current-head CI, owner review/merge, main synchronization, and safe cleanup.

## 11. Acceptance criteria

- Public registration can only create `LEARNER`.
- No HTTP request can create or promote `INTERNAL_LEARNER` or `DEVELOPER`.
- Developer and learner workspaces are mutually isolated by server checks.
- Internal learners receive all-course access but remain subject to learning gates and absent from external metrics.
- Privileged role changes take effect immediately for server-authorized operations.
- Portal responses contain no credentials, secrets, private assessment answers, or unsafe raw environment data.
- System, curriculum, deployment, database, and configuration controls remain read-only on the web.
- Entitlement changes require current developer role, password, 2FA, unexpired elevation, explicit reason, idempotency, and atomic audit evidence.
- Orders and historical entitlement evidence cannot be edited or deleted through the portal.
- Metrics have explicit definitions, filters, freshness, pagination, and degraded states.
- Gateway, production, deployment, and payment activation remain in the final milestone and cannot proceed without their independent gates.

## 12. Main risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Stale JWT preserves developer access | Fresh database role guard on every privileged boundary; revoke authorization state on role change |
| Registration or OAuth privilege escalation | Ignore role input; force `LEARNER`; test malicious payloads and provider profiles |
| Internal accounts pollute analytics | Central learner cohort filter restricted to `LEARNER`; regression tests for every aggregate query |
| Audit written after mutation fails | Entitlement mutation and audit event share one database transaction |
| Portal leaks secrets or answer keys | Explicit projections, response-schema tests, redaction, and no generic object serialization |
| Developer portal becomes remote shell | No terminal/query/config/deploy endpoints; system surfaces are read-only |
| Metrics overload PostgreSQL | Indexed bounded queries, pagination, justified cached aggregates, and latency budgets |
| Activity tracking becomes surveillance | Minimal documented fields, coarse throttling, retention policy, and protected detail access |
| Roadmap status becomes misleading | Preserve history; relocate only unfinished release work; synchronize canonical documentation |

## 13. Non-goals

- live gateway or payment-provider implementation;
- production or staging deployment;
- web-based role promotion;
- web terminal, SQL console, environment editor, migration runner, or process control;
- curriculum authoring UI;
- developer participation in learner courses;
- teacher/classroom administration;
- changing Networking from permanently free access; or
- inventing legal, merchant, pricing, or premium-content readiness.
