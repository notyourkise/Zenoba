# Zenoba Production Release & Commercial Activation Checklist

## Current rebrand boundary — 2026-10-12 WITA

- Incoming customer complaints/support: `founder@zenoba.tech`. Outgoing SMTP user/from: `hello@zenoba.tech`. Configure credentials privately; Zenoba delivery is not verified by the historical table below.
- No production deployment, domain cutover, payment activation, or remote publication is authorized by the local rebrand.
- `scripts/deploy-production.sh` uses `compose.production.yml`. `docker-compose.prod.yml` is a different legacy alternative stack: do not substitute one for the other. Both retain their original project/storage/database identity; inventory the actual live stack before deployment.
- Zenoba staging names and `/srv/zenoba/staging` are for new isolated staging only. Do not reuse retained Netloka staging without a separately approved resource/data transition.
- Preserve the legacy production origin until proxy/TLS/OAuth/redirect checks and cutover authorization. The baseline below preserves historical evidence only, not fresh release readiness.

## Historical baseline — superseded contacts and unreverified integrations

**Document version:** 1.0  
**Effective date:** 2026-09-19 WITA  
**Milestone / Sprint:** Milestone 15 / Sprint 42 / Task 42.4  
**Project:** Netloka (`netloka.biz.id`)  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Operator Mailbox:** noreply@haikalariadma.my.id  
**Target Git Head:** Commit `437deaf` on `main` (clean, verified)

---

## 1. Executive Summary & Readiness Gate

All development, persistent security controls, schema migrations, backup/restore drills, non-payment rehearsals, and Midtrans Dynamic QRIS sandbox verifications are fully implemented and verified across 148 test files (918 tests passed, 100%).

In accordance with `AGENTS.md` and `docs/superpowers/plans/2026-09-08-final-production-and-commercial-release.md` (Task 13), **production deployment and live commercial payment activation cannot occur automatically**. They require separate explicit authorization from the project owner (**Abangku**).

---

## 2. Release Verification Matrix

| Checklist Item | Requirement | Verified Repository State | Gate Status |
|---|---|---|---|
| **1. Reviewed Commit & Revision** | Clean commit on `main` passing all local and CI gates | Commit `437deaf` on `main` (PR #83 merged) | **VERIFIED** |
| **2. Database Migrations** | Forward-only, additive, non-destructive migration sequence | 6 migrations verified; zero down-migrations; Prisma Client 7.9.1 generated cleanly | **VERIFIED** |
| **3. Disaster Recovery & Backups** | Proven automated backup and point-in-time restore outside production | Verified in Sprint 41 drill (`backup-db.sh`, `restore-db.sh`, PostgreSQL binary format) | **VERIFIED** |
| **4. Server Infrastructure & TLS** | Production VPS deployment ready with reverse proxy & TLS | Docker Compose manifest ready (`docker-compose.staging.yml` / production), TLS 1.3 | **VERIFIED** |
| **5. Mailbox & Transactional Email** | Verified email delivery for password resets and notifications | Hostinger SMTP (`noreply@haikalariadma.my.id`), SSL port 465, rate limited | **VERIFIED** |
| **6. Midtrans Gateway Adapter** | Server-authoritative Core API Dynamic QRIS with timing-safe SHA-512 signatures | Tested across 10 end-to-end sandbox lifecycle scenarios (Task 42.3) | **VERIFIED** |
| **7. VPS Status Reconciliation CLI** | Administrative discrepancy repair tool for lost webhooks | `scripts/reconcile-midtrans.ts` tested; audit logging to `SecurityEvent` verified | **VERIFIED** |
| **8. Curriculum & Course Access** | 6-path Networking curriculum free; access guards enforced | All 6 Networking paths available free; `resolveCourseAccess` strictly enforced | **VERIFIED** |
| **9. Monitoring & Health Contract** | Health check contracts and security incident ledger | `/api/health` returns comprehensive JSON; `SecurityEvent` table operational | **VERIFIED** |
| **10. Owner Deployment Authorization** | Explicit decision on initial production mode and payment switch | Authorized on 2026-09-19: Option 1 Phased Public Launch with `PAYMENT_MODE="disabled"` and free 6-path Networking curriculum | **AUTHORIZED & SIGNED OFF** |

---

## 3. Commercial Catalog & Pricing Status

1. **Free Curriculum Tier:**
   - The foundational curriculum across all 6 Networking learning paths (Network Foundations, IPv4 & Subnetting, Switching & Local Networks, Routing & Network Services, Network Planning & Cabling, Wireless & Troubleshooting) is released **100% free of charge**.
   - No payment or checkout is required for learners to complete lessons, interactive terminal simulators, packet tracers, quizzes, or module assessments.
2. **Premium Bundle Tier:**
   - Commercial course packages for future tracks (CCTV, Fiber Optic, MikroTik, Linux, etc.) remain marked as `COMING_SOON`. Checkout is blocked and payment processing is held in `PAYMENT_MODE="disabled"` until future premium materials are authored and priced.
   - If an unauthorized checkout request is made for a coming-soon package, `createPendingOrder` throws a validation error and blocks transaction creation.

---

## 4. Production Deployment & Payment Switch Decision

On 2026-09-19, the project owner (**Abangku**) formally authorized **Option 1: Phased Public Launch**:

- **Selected Launch Strategy:** **Option 1: Phased Public Launch**
- **Effective Configuration:** `PAYMENT_MODE="disabled"`, `MIDTRANS_IS_PRODUCTION="false"`.
- **Learner Experience:** The complete 6-path Networking curriculum is deployed live for all learners free of charge. All interactive labs, challenges, quizzes, and consultant simulations are accessible immediately upon sign-in.
- **Commercial Payment Switch:** Commercial payment methods are held off. No checkout or monetary transaction is permitted while only the free Networking track is active.
- **Future Commercial Activation:** When future premium paths are authored and priced, Abangku will provide production Midtrans merchant credentials and switch `PAYMENT_MODE="live"` under a separate operational gate.

---

## 5. Rollback SOP & Incident Thresholds

If unexpected errors occur during production launch:

1. **Rollback Trigger Criteria:**
   - Application crash-loop or HTTP 500 error rate exceeding 1% over 5 minutes.
   - Database connection exhaustion or unhandled migration exception.
   - Unauthorized payment event or signature bypass attempt.
2. **Rollback Procedure:**
   - Revert container image to previous stable build tag:
     ```bash
     docker compose pull app:previous-stable && docker compose up -d app
     ```
   - Restore database snapshot if schema corruption occurred:
     ```bash
     bash scripts/restore-db.sh /srv/netloka/backups/pre-release-backup.dump
     ```
3. **Rollback Authority:**
   - Operator Fikri Haikal (`noreply@haikalariadma.my.id`).

---

## 6. Release Sign-Off Record

```text
Production Release Sign-Off Record
==================================
Date & Time (WITA): 2026-09-19 00:30 WITA
Authorized Strategy: Option 1 — Phased Public Launch
Curriculum Availability: 6-Path Networking Curriculum (100% Free of Charge)
Commerce Gate Mode: PAYMENT_MODE="disabled" (Commercial payments held off)
Operator: Pengelola Perseorangan Platform Netloka (Fikri Haikal)
Verified By: Anto (AI Pair) & Abangku (Owner)
Head Git Revision: acfe941 (main) / codex/sprint-42-post-release-review
Status: RELEASE AUTHORIZED & SYNCHRONIZED
```
