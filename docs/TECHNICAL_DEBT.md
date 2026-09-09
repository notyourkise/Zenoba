# Technical Debt Register & Post-MVP Architecture

Dokumen pencatatan hutang teknis (*technical debt*), area refaktor masa depan, dan rencana transisi ke jalur pembelajaran tingkat lanjut (*Advanced Tracks*).

---

## 1. Status Hutang Teknis Saat Ini (Milestone 13 Aktif / Pra-Peluncuran MVP)

| ID | Kategori | Deskripsi | Dampak | Status Resolusi |
|---|---|---|---|---|
| **TD-01** | Middleware | Next.js 16 menandai `src/middleware.ts` sebagai deprecated dan merekomendasikan `proxy`. | Rendah (Warning saat build) | **Tervalidasi & Dipertahankan:** Pada pengujian di Next.js 16.3.2 dengan `--webpack`, `src/proxy.ts` mengalami runtime error `Native module not found: ./webpack-runtime.js` pada Edge sandbox dev. `src/middleware.ts` dipertahankan stabil hingga upstream Next.js Webpack engine memperbaiki runtime sandbox. |
| **TD-04** | Security Headers | Content Security Policy (CSP) belum dikonfigurasi. | Sedang sebelum production | **Selesai (2026-09-05):** Header `Content-Security-Policy` ketat dan adaptif telah diimplementasikan di `next.config.ts` dan `Caddyfile`, terverifikasi dengan unit test dan kompatibel penuh dengan Next.js, React 19, Tailwind, serta canvas. |
| **TD-05** | Deployment | Konfigurasi Docker, Caddy, Cloudflare, backup, dan restore tersedia, tetapi belum diverifikasi pada staging atau production nyata. | Tinggi sebelum release | Milestone 15 / Sprint 41 owns isolated staging, migration, backup/restore/rollback, monitoring, and production-like rehearsal; production requires separate owner authorization. |
| **TD-02** | Terminal Sim | Terminal Simulator saat ini menggunakan status state in-memory murni per sesi block. | Rendah | Untuk lab berdurasi panjang, pertimbangkan caching state terminal ke LocalStorage/IndexedDB. |
| **TD-03** | Subnet Visualizer | Visualisasi CIDR subnetting fokus pada IPv4 (/16 hingga /30). | Rendah | Tambahkan dukungan IPv6 visualizer di Milestone pasca-MVP. |

---

### Pre-launch authentication follow-up (2026-09-05)

- **TD-06 — Abuse Protection & Timing Defense (Sebagian selesai 2026-09-05):** In-memory sliding window rate limiting (IP & email) serta mitigasi timing-attack aktif di `/api/auth/forgot-password` dan `/api/auth/reset-password`. In-memory limiting is not multi-instance safe; Milestone 15 / Task 40.2 replaces it with shared persistence before release.
- **TD-07 — Integration verification:** Apply the new token migration on an isolated/staging database and verify real SMTP delivery, token replacement/consumption, reset-to-login, and Google OAuth after credentials are configured. Local unit tests mock database/mail boundaries; Docker was unavailable at final review.
- **TD-08 — Session policy (Sebagian selesai 2026-09-05):** Pembatalan sesi JWT in-memory terintegrasi dengan password reset and guards, but cannot enforce revocation across instances/restarts. Milestone 15 / Task 40.1 replaces it with shared database state.
- **TD-09 — Dependency audit:** `npm audit --omit=dev` on 2026-09-03 reports one high and one moderate package finding through Prisma's `mysql2` dependency. The application uses the PostgreSQL adapter; do not treat this as a clean audit or apply the suggested Prisma major downgrade blindly. Validate a compatible dependency remediation before release.

Pre-launch legal readiness: **TD-10 — High before collecting public learner data:** Terms and Privacy Policy now describe the development implementation, but are not a compliance certification. Confirm the operator's identity and reachable privacy contact; define lawful processing bases, consent evidence where required (including child/guardian safeguards), retention/deletion/export handling, deployed processors/locations, and international-transfer safeguards. Do not label link clicks or login as recorded consent. Also verify Google OAuth token storage/revocation against provider policy before activation. See `docs/decisions/0003-legal-pages-and-policy-boundaries.md`. No public deployment is authorized by this documentation.

## 2. Learning curriculum inspection follow-up (updated 2026-09-09)

- **TD-11 — Resolved in merged Milestone 8:** PR #28 added server-authoritative assessment/progression/XP, PR #29 delivered the Welcome experience, and PR #31 completed authenticated pilot integration. Historical `a95b025` findings remain valid for that revision only.
- **TD-12 — Partially resolved; retained-upgrade proof still open:** Sprint 34 / Task 34.1 replaced the broken historical chain with a complete fresh-database baseline and CI now applies it through `db:deploy`. Fresh CI deployment is evidenced; the documented retained-database reconciliation procedure has not been rehearsed against an explicitly approved representative retained database. Never repair or rewrite a real user database without agreed scope.
- **TD-13 — Resolved for repository curriculum evidence:** A current source-registry recount verifies six paths, 31 modules, 65 lessons, 195 formative quizzes, and six capstones with authenticated coverage. This does not prove staging/production deployment.
- **TD-14 — High before multi-instance/production operation:** Session revocation and password-reset rate limiting are process-local. Milestone 15 / Sprint 40 owns shared PostgreSQL-backed enforcement and failure behavior.
- **TD-15 — Partially resolved; live integration proof still open:** Sprint 34 removed unsafe automatic OAuth email linking and forces public registration to `LEARNER`. Milestone 15 / Sprint 40 must reverify that policy and prove real Google OAuth plus SMTP in isolated staging before public activation.
- **TD-16 — High before Sprint 35:** `getLearningPathDetail()` performs a direct premium-entitlement check instead of consistently reusing the shared role-aware access policy, so future premium paths may deny the promised all-course access to `INTERNAL_LEARNER`.
- **TD-17 — High before Sprint 35:** Learner mutation APIs authenticate a user but do not consistently enforce the centralized learner-role boundary. UI routing blocks developer navigation, but direct requests from a `DEVELOPER` must also be rejected server-side.

## 3. Rencana Jalur Ekstensi Pasca-MVP (*Future Tracks*)

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
