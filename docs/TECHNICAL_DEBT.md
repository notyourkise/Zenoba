# Technical Debt Register & Post-MVP Architecture

Dokumen pencatatan hutang teknis (*technical debt*), area refaktor masa depan, dan rencana transisi ke jalur pembelajaran tingkat lanjut (*Advanced Tracks*).

---

## 1. Status Hutang Teknis Saat Ini (Milestone 15 Selesai — Release Ready)

| ID | Kategori | Deskripsi | Dampak | Status Resolusi |
|---|---|---|---|---|
| **TD-01** | Middleware | Next.js 16 menandai `src/middleware.ts` sebagai deprecated dan merekomendasikan `proxy`. | Rendah (Warning saat build) | **Tervalidasi & Dipertahankan:** Pada pengujian di Next.js 16.3.2 dengan `--webpack`, `src/proxy.ts` mengalami runtime error `Native module not found: ./webpack-runtime.js` pada Edge sandbox dev. `src/middleware.ts` dipertahankan stabil hingga upstream Next.js Webpack engine memperbaiki runtime sandbox. |
| **TD-04** | Security Headers | Content Security Policy (CSP) belum dikonfigurasi. | Sedang sebelum production | **Selesai (2026-09-05):** Header `Content-Security-Policy` ketat dan adaptif telah diimplementasikan di `next.config.ts` dan `Caddyfile`, terverifikasi dengan unit test dan kompatibel penuh dengan Next.js, React 19, Tailwind, serta canvas. |
| **TD-05** | Deployment | Konfigurasi Docker, Caddy, Cloudflare, backup, dan restore tersedia, tetapi belum diverifikasi pada staging atau production nyata. | Tinggi sebelum release | **Selesai di Milestone 15 (Sprint 41 & 42):** Staging deployment terisolasi, forward-only migration sequence (090000–095000), backup/restore PostgreSQL dump drills, monitoring `/api/health`, dan production rehearsal tervalidasi penuh. Otorisasi rilis diberikan owner pada 2026-09-19 (Option 1: Phased Public Launch, `PAYMENT_MODE="disabled"`). |
| **TD-02** | Terminal Sim | Terminal Simulator saat ini menggunakan status state in-memory murni per sesi block. | Rendah | Untuk lab berdurasi panjang, pertimbangkan caching state terminal ke LocalStorage/IndexedDB. |
| **TD-03** | Subnet Visualizer | Visualisasi CIDR subnetting fokus pada IPv4 (/16 hingga /30). | Rendah | Tambahkan dukungan IPv6 visualizer di Milestone pasca-MVP. |

---

### Pre-launch authentication follow-up (2026-09-05)

- **TD-06 — Resolved in Sprint 40 (PR #74):** In-memory rate limiting replaced with multi-instance-safe PostgreSQL `AuthRateLimit` model, atomic window reset, one-way SHA-256 identity hashing, and automated retention cleanup.
- **TD-07 — Resolved in Milestone 15 (Sprint 41, PR #77–#80):** Applied token migration on staging database; verified real Hostinger SMTP email delivery, token replacement/consumption, password reset-to-login, rate limiting, and Google OAuth callback.
- **TD-08 — Resolved in Sprint 40 (PR #73):** Shared persistent session revocation implemented with PostgreSQL `UserSecurityState.validAfter`, timestamp invalidation across instances, and Edge-compatible runtime decoupling.
- **TD-09 — Resolved in Sprint 40 (Task 40.4):** Next.js upgraded to 16.3.5 and package overrides configured for `mysql2` (^3.24.4) and `sharp` (^0.35.4), achieving **0 vulnerabilities** in production dependency audit (`npm audit --omit=dev`).
- **TD-10 — Resolved in Milestone 15 (Sprint 41 & 42, PR #77, #84):** Operator identity formalized (Pengelola Perseorangan Platform Netloka - Fikri Haikal, reachable mailbox `noreply@haikalariadma.my.id`), privacy policy and terms established in `docs/decisions/0003-legal-pages-and-policy-boundaries.md`, and explicit phased launch authorized on 2026-09-19 (Networking curriculum 100% free, commercial checkout held off via `PAYMENT_MODE="disabled"`). All pre-launch legal and operational gates satisfied.

## 2. Learning curriculum inspection follow-up (updated 2026-09-09)

- **TD-11 — Resolved in merged Milestone 8:** PR #28 added server-authoritative assessment/progression/XP, PR #29 delivered the Welcome experience, and PR #31 completed authenticated pilot integration. Historical `a95b025` findings remain valid for that revision only.
- **TD-12 — Resolved in Sprint 40 (Task 40.4):** Forward-only migration sequence (090000–095000) verified as non-destructive; formal backup-based snapshot recovery protocol established in `docs/operations/release-baseline-verification.md` with explicit prohibition of destructive reverse migrations.
- **TD-13 — Resolved for repository curriculum evidence:** A current source-registry recount verifies six paths, 31 modules, 65 lessons, 195 formative quizzes, and six capstones with authenticated coverage. This does not prove staging/production deployment.
- **TD-14 — Resolved in Sprint 40 (PR #73, #74):** Session revocation and password-reset rate limiting migrated from process-local memory to shared PostgreSQL persistence (`UserSecurityState` and `AuthRateLimit`).
- **TD-15 — Resolved in Sprint 40 (PR #75):** OAuth email linking hardened with explicit `allowDangerousEmailAccountLinking: false`, provider `email_verified` enforcement, credentials-first conflict prevention, developer OAuth block, and staging verification runbook (`docs/operations/auth-live-verification.md`).
- **TD-16 — Resolved in merged Sprint 34 (PR #52):** `getLearningPathDetail()` now consistently delegates access evaluation to `requireLearningPathAccess`, ensuring `INTERNAL_LEARNER` receives full all-course access to premium learning paths without synthetic entitlements.
- **TD-17 — Resolved in merged Sprint 34 (PR #53):** Enforced database-authoritative role boundary (`requireLearnerActor`) across all 7 learner mutation APIs (`/api/learning/progress`, `/api/learning/quiz/submit`, `/api/learning/assessment/module`, `/api/labs/[labSlug]/submit`, `/api/challenges/submit`, `/api/challenges/[challengeSlug]/submit`, and `/api/consultant/[caseSlug]/submit`), returning `403 Forbidden` (`"Learner workspace access required"`) for `DEVELOPER` callers.

## 3. Learner quality and testing follow-up (Milestone 14 completion, 2026-09-17)

- **TD-18 — Worktree node_modules junction compatibility:** In Windows environments, creating directory junctions or symlinks for `node_modules` inside nested `.worktrees/` breaks Vitest realpath resolution with "No test suite found in file". Worktrees must rely on standard Node.js parent directory traversal (`../../node_modules`) rather than local junctions.
- **TD-19 — Next.js Route Announcer Alert Filtering in Playwright:** Next.js automatically mounts an accessibility live region `<div role="alert" id="__next-route-announcer__"></div>`. E2E tests asserting on `role="alert"` must filter by container or exact accessible name to prevent strict mode locator collisions.
- **TD-20 — Non-blocking test coverage upload in CI:** CI workflow job `test` uploads coverage artifacts from `coverage/`, which emits a harmless annotation when Vitest runs without `--coverage`. Retain until test coverage reporting is formally standardized in Milestone 15.

## 4. Rencana Jalur Ekstensi Pasca-MVP (*Future Tracks*)

The following extension ideas remain future domains. Milestone 12 completed only the commercial gate review; actual gateway/payment activation is last in Milestone 15. Networking curriculum renewal does not activate these premium tracks.

Arsitektur Netloka saat ini dirancang modular sehingga siap untuk mengakomodasi path tingkat lanjut tanpa mengubah core engine:

1. **MikroTik RouterOS Fundamentals:**
   - Syntax CLI RouterOS deterministik (`/ip address add`, `/ip route add`, `/ip firewall nat add`).
   - Winbox-like simplified web UI visualizer.
2. **Cisco CCNA Practical Prep:**
   - Cisco IOS CLI simulator (`enable`, `configure terminal`, `interface gig0/0`, `vlan 10`, `show ip route`).
   - Packet Tracer lite web topology verification.
3. **Linux System & Server Administration:**
   - Linux networking configuration (`ip link`, `systemd-networkd`, `iptables`/`nftables`, `bind9`/`named`, `dnsmasq`).
4. **Network Security & Defense:**
   - Firewall rule construction, ACL matching logic, Port Scanning detection & defense.
