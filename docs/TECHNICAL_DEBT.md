# Technical Debt Register & Post-MVP Architecture

Dokumen pencatatan hutang teknis (*technical debt*), area refaktor masa depan, dan rencana transisi ke jalur pembelajaran tingkat lanjut (*Advanced Tracks*).

---

## 1. Status Hutang Teknis Saat Ini (Milestone 7 Aktif / Pra-Peluncuran MVP)

| ID | Kategori | Deskripsi | Dampak | Status Resolusi |
|---|---|---|---|---|
| **TD-01** | Middleware | Next.js 16 menandai `src/middleware.ts` sebagai deprecated dan merekomendasikan `proxy`. | Rendah (Warning saat build) | **Tervalidasi & Dipertahankan:** Pada pengujian di Next.js 16.3.2 dengan `--webpack`, `src/proxy.ts` mengalami runtime error `Native module not found: ./webpack-runtime.js` pada Edge sandbox dev. `src/middleware.ts` dipertahankan stabil hingga upstream Next.js Webpack engine memperbaiki runtime sandbox. |
| **TD-04** | Security Headers | Content Security Policy (CSP) belum dikonfigurasi. | Sedang sebelum production | **Selesai (2026-09-05):** Header `Content-Security-Policy` ketat dan adaptif telah diimplementasikan di `next.config.ts` dan `Caddyfile`, terverifikasi dengan unit test dan kompatibel penuh dengan Next.js, React 19, Tailwind, serta canvas. |
| **TD-05** | Deployment | Konfigurasi Docker, Caddy, Cloudflare, backup, dan restore tersedia, tetapi belum diverifikasi pada staging atau production nyata. | Tinggi untuk exit criteria Milestone 7 | Deploy ke staging, jalankan migration/backup/restore/smoke test, lalu deploy dan verifikasi `netloka.biz.id`. |
| **TD-02** | Terminal Sim | Terminal Simulator saat ini menggunakan status state in-memory murni per sesi block. | Rendah | Untuk lab berdurasi panjang, pertimbangkan caching state terminal ke LocalStorage/IndexedDB. |
| **TD-03** | Subnet Visualizer | Visualisasi CIDR subnetting fokus pada IPv4 (/16 hingga /30). | Rendah | Tambahkan dukungan IPv6 visualizer di Milestone pasca-MVP. |

---

### Pre-launch authentication follow-up (2026-09-05)

- **TD-06 — Abuse Protection & Timing Defense (Selesai 2026-09-05):** In-memory sliding window rate limiting (IP & email) serta mitigasi timing-attack (konstanta durasi ~250ms dan dummy crypto entropy) telah aktif di `/api/auth/forgot-password` dan `/api/auth/reset-password` dengan unit & integration test 100% green.
- **TD-07 — Integration verification:** Apply the new token migration on an isolated/staging database and verify real SMTP delivery, token replacement/consumption, reset-to-login, and Google OAuth after credentials are configured. Local unit tests mock database/mail boundaries; Docker was unavailable at final review.
- **TD-08 — Session policy (Selesai 2026-09-05):** Mekanisme pembatalan sesi JWT in-memory (`src/features/auth/session-revocation.ts`) telah terintegrasi dengan `consumePasswordResetToken`, NextAuth `session` callback, dan route guard middleware. Sesi aktif yang terbit sebelum reset password dibatalkan secara otomatis.
- **TD-09 — Dependency audit:** `npm audit --omit=dev` on 2026-09-03 reports one high and one moderate package finding through Prisma's `mysql2` dependency. The application uses the PostgreSQL adapter; do not treat this as a clean audit or apply the suggested Prisma major downgrade blindly. Validate a compatible dependency remediation before release.

Pre-launch legal readiness: **TD-10 — High before collecting public learner data:** Terms and Privacy Policy now describe the development implementation, but are not a compliance certification. Confirm the operator's identity and reachable privacy contact; define lawful processing bases, consent evidence where required (including child/guardian safeguards), retention/deletion/export handling, deployed processors/locations, and international-transfer safeguards. Do not label link clicks or login as recorded consent. Also verify Google OAuth token storage/revocation against provider policy before activation. See `docs/decisions/0003-legal-pages-and-policy-boundaries.md`. No public deployment is authorized by this documentation.

## 2. Learning curriculum inspection follow-up (2026-09-05)

- **TD-11 — High for trustworthy learning completion:** At `a95b025`, quiz submit accepts a nonempty answer without using the real evaluator, the player can show success on network failure, and lesson completion does not enforce assessment evidence. Seeded content lacks quiz/summary blocks. Scope and remediation: M8 / S21–24 in the [pilot plan](superpowers/plans/2026-09-05-welcome-to-networking.md), followed by content expansion in M9–M11. This is a source-inspection finding; no runtime reproduction or fix occurred in the documentation task.
- **TD-12 — High for reproducible persistence:** Initial migration is empty and the subsequent reset-token migration assumes `users` already exists, while current schema includes learning/commerce models without matching creation migrations. Reconcile fresh/legacy migration paths on disposable DB in M8 / Task 21.2 before claiming real persisted learning integration. Never repair against a real user DB without agreed scope.
- **TD-13 — Curriculum coverage/evidence:** Historical completion claims and anonymous E2E barriers do not prove a full authenticated learning journey. The [outcome matrix](curriculum/networking-outcomes.md) and M8 / S24 require actual taught/assessed outcome coverage and authenticated isolated DB tests. Preserve historical changelog; correct current planning status with evidence.

## 3. Rencana Jalur Ekstensi Pasca-MVP (*Future Tracks*)

The following extension ideas remain future domains. The former M8 premium/payment activation gate is now M12; Networking curriculum renewal does not activate these premium tracks.

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
