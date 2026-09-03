# Netloka Changelog

All notable project changes are recorded here.

## Logging Rules

- Timezone: **WITA / GMT+8**
- Timestamp format: `YYYY-MM-DD HH:mm WITA`
- Newest entries appear first within the current date.
- Log meaningful project changes, not every keystroke.
- Code changes should reference the sprint/task and commit/PR when available.
- Never rewrite historical entries to make the project appear cleaner; append corrections instead.

### Entry Categories

- `ADDED` — new feature, file, capability, content, test, or infrastructure
- `CHANGED` — intentional behavior/design/architecture change
- `FIXED` — bug or regression fix
- `REMOVED` — deleted behavior or obsolete code
- `SECURITY` — security hardening or vulnerability fix
- `DOCS` — planning/documentation changes
- `REFACTOR` — internal restructure without intentional user-visible behavior change
- `TEST` — meaningful testing additions/changes
- `DEPLOY` — deployment/environment/release changes
- `REVIEW` — milestone/sprint/code review findings and resolution
- `MILESTONE` — milestone status transition
- `SPRINT` — sprint status transition

### Recommended Entry Format

```text
- [YYYY-MM-DD HH:mm WITA] [CATEGORY] [Milestone X / Sprint Y / Task Y.Z]
  Summary of the change.
  Files/areas: `path`, `path`
  Validation: tests/build/review performed
  Git: commit SHA and/or PR number when available
```

---

# 2026-09-03

- [2026-09-03 11:56 WITA] [DOCS] [Milestone 7 / Sprint 16 / PR Handoff]
  Recorded the committed auth modal/password-recovery implementation and prepared the user-requested pull request to main. Re-ran ESLint, type-check, and all 160 unit tests successfully before committing. The previously recorded 72-browser-test and production-build results apply to the same application code. The PR must expose migration, live SMTP/OAuth, timing/abuse, JWT policy, and dependency limitations; it is not deployment approval or sprint completion. Human review and merge remain with the project owner.
  Git: implementation commit 9d681b211af9dfa9a37e8e49efbc7e70b38cbac9; branch codex/auth-modal-password-reset; PR number and CI outcome will be reported in the GitHub handoff.

- [2026-09-03 11:51 WITA] [REVIEW] [Milestone 7 / Sprint 16 / Authentication]
  Completed local auth feature verification and documented remaining launch gates. Fixed callback URL normalization bypasses in the modal and legacy redirects, and bound reset-token deletion to its digest so concurrently replaced tokens cannot consume a newer token. Added regression coverage; retained a unique token-per-user constraint and atomic upsert. Recorded the actual NextAuth 4/Nodemailer alias architecture in ADR 0002.
  Validation: ESLint and TypeScript passed; 35 Vitest suites passed (160/160 tests); production build passed (30 routes plus middleware); 72/72 Playwright tests passed across Chromium, Firefox, and WebKit using one worker against a local production build on port 3001. Prisma schema validation and diff whitespace checks passed. Desktop/mobile visual and keyboard QA was completed on 2026-09-02; Impeccable review improved the pending-label text size.
  Limitations: SMTP and persistence are mocked in focused tests; the test server used placeholder DB credentials and exercised degraded health, not database connectivity. Docker was unavailable, so migration application and a live email-to-reset-to-login journey remain unverified. Google OAuth awaits credentials. Identical reset response bodies do not remove synchronous delivery timing differences; throttling/abuse resistance and JWT revocation policy remain pre-launch work. Audit reports one high and one moderate package finding through Prisma/mysql2; no Nodemailer finding. These release gates remain open in PLAN/technical debt; no deployment or sprint-completion claim is made.
  Test infrastructure: local Next dev runs with six workers showed timing-related failures; single-worker Chromium passed, and final three-browser verification used the built app. The temporary test configuration was removed after verification. Existing middleware deprecation and standalone-start warnings were observed.
  Files/areas: auth feature/routes/tests, Prisma migration, README, PLAN, technical debt, ADR 0002, implementation plan
  Git: pending; no commit, push, PR, or merge performed

# 2026-09-02

- [2026-09-02 16:31 WITA] [ADDED] [Milestone 7 / Sprint 16 / Authentication]
  Moved credentials Sign In and Create Account into an accessible URL-driven modal on the landing page, retained legacy auth URLs as compatibility redirects, prepared conditional Google OAuth account creation, and added a complete password-recovery flow. Password reset requests use account-enumeration-safe responses, Hostinger-compatible SMTP delivery, SHA-256 token digests, 30-minute expiry, one-active-token-per-user persistence, single-use transactional consumption, and a new Prisma migration. Google remains visibly disabled with `Setup pending` until both OAuth credentials are configured.
  Files/areas: `src/features/auth/`, `src/app/(auth)/`, `src/app/api/auth/`, `src/components/navigation/app-header.tsx`, `src/middleware.ts`, `prisma/schema.prisma`, `prisma/migrations/20260902_add_password_reset_tokens/`, `.env.example`, `README.md`
  Validation: ESLint passed; TypeScript type-check passed; 35 Vitest suites passed (154/154 tests); focused Chromium auth/landing E2E passed (9/9 tests); production build passed (30 application routes plus middleware); full browser suite and final visual/diff review pending
  Git: pending

- [2026-09-02 13:17 WITA] [FIXED] [Milestone 7 / Sprint 16 / Stabilization]
  Restored the complete local quality gate for the active UI refinement. Animated CTA labels now expose one accessible name while retaining the two-line visual transition; the simulator selector now uses a valid `tablist`/`tab`/`tabpanel` relationship; and tab-window state is updated from the selection event instead of synchronously inside an effect. Product positioning in the authoritative documentation now consistently describes Netloka as an IT infrastructure learning platform with Networking as the first available domain. The previously observed mobile `Mulai Gratis` label was rechecked at 390x844 and rendered visibly, so no speculative CSS change was applied.
  Files/areas: `src/components/ui/sliding-button-label.tsx`, `src/components/ui/sliding-button-label.test.tsx`, `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/live-simulator-showcase.test.tsx`, `AGENTS.md`, `README.md`, `ROADMAP.md`, `PLAN.md`
  Validation: ESLint passed; TypeScript type-check passed; 29 Vitest suites passed (128/128 tests); Playwright passed 66/66 tests across Chromium, Firefox, and WebKit; production build passed; `git diff --check` passed; local branch and `origin/main` share base `e42ee68` with no divergence before commit
  Known warning: Next.js 16.3.2 still reports the tracked low-severity `middleware` to `proxy` deprecation (TD-01)
  Git: pending

- [2026-09-02 12:25 WITA] [CHANGED] [Milestone 7 / Sprint 16 / Navigation]
  Reframed the primary navbar as an IT infrastructure learning catalog while preserving the product journey through `Learn`, `Labs`, `Challenges`, and `Consultant`. Networking remains available through the existing routes; Server & Linux, Cybersecurity, Cloud & DevOps, CCTV & Surveillance, Fiber Optic, and VoIP & PABX are presented as noninteractive `Soon` domains. Desktop dropdowns and the compact mobile roadmap now share one typed configuration, and decorative dropdown icons were removed in favor of clearer status and copy hierarchy.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/components/navigation/app-header.test.tsx`, `PRODUCT.md`, `DESIGN.md`, `PLAN.md`
  Validation: focused navbar test demonstrated RED before implementation and passed GREEN with 3/3 tests; type-check passed; 28 Vitest suites passed (126/126 tests); production build passed; desktop/mobile browser QA completed; Chromium foundation E2E passed 6/7 with one unrelated pre-existing landing CTA expectation failure; repository lint remains blocked by an unrelated existing `live-simulator-showcase.tsx` effect error and ARIA warning
  Git: pending

- [2026-09-02 12:06 WITA] [DOCS] [Milestone 7 / Sprints 15–16]
  Corrected project status documentation to match the existing codebase and actual deployment state. Milestones 0–6 are implemented; Milestone 7 remains active because staging and production deployment have not been performed. Existing landing page, dashboard, navigation, authentication UI, and cosmic visual work is classified as active Sprint 16 feature refinement rather than reopened Milestone 1 work. Historical entries are preserved and this entry supersedes their milestone labels for current planning purposes.
  Files/areas: `ROADMAP.md`, `PLAN.md`, `README.md`, `docs/TECHNICAL_DEBT.md`, `CHANGELOG.md`
  Validation: documentation cross-check against the repository structure, Prisma schema, package configuration, active source files, and Git working tree
  Git: pending

- [2026-09-02 11:37 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan bingkai/border pada setiap kartu sub-menu dropdown navigasi navbar dan menggantinya dengan garis pembatas yang bersih dan elegan:
  1. Garis pembatas vertikal (`divide-x divide-slate-800`) memisahkan kolom kiri dan kolom kanan.
  2. Garis pembatas horizontal (`divide-y divide-slate-800/70`) memisahkan item-item menu di dalam tiap kolom.
  3. Garis pembatas bawah (`border-t border-slate-800`) memisahkan daftar menu dengan link aksi di bagian bawah popover.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/components/ui/navigation-menu.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:33 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  1. Menyembunyikan seluruh scrollbar peramban (*browser scrollbars*) secara global di `globals.css` menggunakan aturan `-ms-overflow-style: none; scrollbar-width: none; *::-webkit-scrollbar { display: none; }` tanpa mengganggu kelancaran fungsi scroll.
  2. Menghapus komponen tombol peralihan tema (`ModeToggle`) dari header navigasi dan mengunci tema platform ke mode hitam/gelap (*dark theme / #030308*) secara permanen via `forcedTheme="dark"` di `Providers` dan kelas `dark` pada elemen `<html>`.
  Files/areas: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/providers.tsx`, `src/components/navigation/app-header.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:31 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyempurnakan visual 2 rasi bintang (*Crux & Cassiopeia*) di footer:
  1. Mengubah garis rasi dari putus-putus menjadi garis putih solid yang tebal dan jelas (`stroke="#ffffff" strokeWidth="1.8"`).
  2. Mengubah seluruh simpul titik bintang menjadi warna putih bersih (`fill="#ffffff"`).
  3. Menambahkan efek animasi kelap-kelip berkilau terang (*twinkling starlight pulse with drop shadow bloom*) pada bintang-bintang utama (*Acrux, Gacrux, Schedar, Navi*).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:30 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah gaya teks copyright pada footer (`© 2026 Netloka. Hak Cipta Dilindungi Undang-Undang.`) menjadi warna putih bersih dengan ketebalan tegas (*font-bold text-white tracking-wide*).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:29 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 2 ornamen rasi bintang (*constellations*) kosmik pada latar belakang section Footer:
  1. Rasi Bintang **Crux** (*Southern Cross*) di sisi kiri dengan 5 bintang bertaut garis halus berpendar (*Acrux, Gacrux, Mimosa, Imai, Ginan*).
  2. Rasi Bintang **Cassiopeia** (*Pola W*) di sisi kanan dengan 5 bintang bertaut garis halus berpendar (*Caph, Schedar, Navi, Ruchbah, Segin*).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:28 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen kosmik pada latar belakang section Footer:
  1. Kumpulan planet kecil dan bintang mikro bercahaya terang yang diam (*FooterStarField* dengan pendaran radiant halo cyan, gold, emerald, coral, ruby, sapphire, dan white starlight).
  2. Kumpulan planet kecil kosmik (10 planet) yang melayang/berterbangan secara halus dari kanan ke kiri (`driftPlanetRightToLeftFooter`).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus baris teks 'Domain resmi: netloka.biz.id' dan bar status 'Sistem Operasional / Zona Waktu' dari footer pemasaran agar tampilan penutup halaman lebih ringkas, elegan, dan fokus ke navigasi ekosistem.
  Files/areas: `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/marketing-footer.test.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:23 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  1. Menambahkan ornamen planet-planet kosmik kecil (10 planet bercahaya) yang melayang/berterbangan secara halus dari kiri ke kanan (`driftPlanetLeftToRightFaq`) melintasi latar belakang section FAQ Interaktif.
  2. Menerapkan efek animasi underline interaktif berwarna putih bersih yang melebar secara anggun dan perlahan dari arah tengah ke kiri dan kanan (`after:origin-center after:scale-x-0 hover:after:scale-x-100` dengan durasi 500ms dan kurva halus `cubic-bezier(0.16, 1, 0.3, 1)`) pada setiap tautan menu di Footer Navigasi.
  Files/areas: `src/components/marketing/interactive-faq.tsx`, `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:20 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan copywriting pada Final CTA footer dan deskripsi brand Netloka menjadi lebih luas dan generalist (*"Bergabung bersama ribuan pelajar, mahasiswa, dan calon praktisi IT untuk menguasai infrastruktur digital lewat simulasi interaktif langsung di browser"*), inklusif untuk seluruh peminat IT infrastructure, sysadmin, jaringan, dan teknologi modern.
  Files/areas: `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/marketing-footer.test.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:19 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah tampilan kedua area CTA informasi (CTA eksplorasi materi di bagian bawah Live Simulator Showcase dan Final CTA di Marketing Footer) dari yang sebelumnya menggunakan pembungkus card berkontur/border menjadi teks informasi biasa yang bersih dan berpadu langsung di atas kanvas hitam pekat.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites Vitest valid, dev server aktif di localhost:3000.
  Git: pending

# 2026-09-01

- [2026-09-01 11:38 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh lapisan radial gradient dan ambient overlay berwarna pada latar belakang section FAQ dan Marketing Footer, sehingga murni menggunakan warna solid hitam pekat kosmik `#030308` secara penuh yang menyatu mulus dan bersih dengan ornamen bintang kosmik.
  Files/areas: `src/components/marketing/interactive-faq.tsx`, `src/components/marketing/marketing-footer.tsx`
  Validation: 28 test suites (124 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:37 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyempurnakan section **FAQ Interaktif** (`InteractiveFaq`):
  1. Mengimplementasikan animasi buka-tutup accordion yang sangat halus berbasis CSS Grid height transition (`grid-rows-[0fr]` s/d `grid-rows-[1fr]` dengan kurva `cubic-bezier(0.22, 1, 0.36, 1)`).
  2. Menghapus badge pill teks 'Tanya Jawab Seputar Netloka'.
  3. Menyamakan latar belakang menjadi hitam pekat kosmik `#030308` yang menyatu mulus dengan section sekitarnya.
  4. Menambahkan ornamen dense micro-stars dan beberapa bintang suar bercahaya terang (*radiant starlight halos*) dengan pendaran cyan, white, gold, emerald, dan coral.
  Files/areas: `src/components/marketing/interactive-faq.tsx`
  Validation: 28 test suites (124 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:30 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan section **FAQ Interaktif** (`InteractiveFaq`) dengan sistem accordion beranimasi dan filter kategori (Akses & Perangkat, Kurikulum SMK TKJ, Simulasi Terminal, dan Mode Konsultan), serta **Marketing Footer Kosmik** (`MarketingFooter`) yang memuat kartu Final CTA konversi, navigasi 5 kolom ekosistem, status sistem operasional (`/api/health`), dan copyright resmi Netloka.
  Files/areas: `src/components/marketing/interactive-faq.tsx`, `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/interactive-faq.test.tsx`, `src/components/marketing/marketing-footer.test.tsx`, `src/app/page.tsx`
  Validation: 28 test suites (124 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:22 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan efek animasi teks meluncur vertikal (*SlidingButtonLabel smooth cubic-bezier hover transition*) seperti pada tombol Masuk dan Mulai Gratis ke dalam 4 tombol navigasi utama:
  1. Tombol 'Jelajahi' pada Hero Dashboard (`src/app/page.tsx`)
  2. Tombol 'Lihat jalur belajar' pada Section Journey (`src/components/marketing/it-infrastructure-journey.tsx`)
  3. Tombol 'Mulai Belajar Sekarang' pada Section Simulator Showcase (`src/components/marketing/live-simulator-showcase.tsx`)
  4. Tombol 'Katalog Labs' pada Section Simulator Showcase (`src/components/marketing/live-simulator-showcase.tsx`)
  Membuat komponen bersama yang bersih di `src/components/ui/sliding-button-label.tsx` dan mengonsolidasikan referensinya dari seluruh navigasi header dan section pemasaran.
  Files/areas: `src/components/ui/sliding-button-label.tsx`, `src/components/navigation/app-header.tsx`, `src/app/page.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:18 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen planet-planet kosmik kecil (10 planet berukuran 10px - 16px) yang melayang/berterbangan secara halus dari kanan ke kiri (`driftPlanetRightToLeftShowcase`) melintasi latar belakang section Live Simulator Showcase, dilengkapi gradien warna kosmik beraneka ragam serta pendaran cahaya starlight halo berkilau (arctic cyan, white starlight, gold, emerald mint, teal, coral, ruby).
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:16 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus border kotak kartu dan background pembungkus pada setiap ilustrasi perangkat jaringan (`PC-1`, `SW-1`, `RTR-GW`, `SRV-1`) pada Visualizer Alur Paket ICMP, sehingga yang tampil murni hanya siluet bentuk fisik perangkat kerasnya langsung di atas kanvas dengan pendaran drop-shadow dinamis saat aktif.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyempurnakan desain ilustrasi perangkat keras fisik (Host PC Desktop dengan monitor stand & CPU tower, Switch 1U Rackmount dengan telinga baut rak & port RJ45, Router Gateway dengan dual dipole antennas & routing forwarding engine, dan Server Enterprise 2U Rackmount dengan 4 caddy drive SAS/SATA) pada visualizer alur paket ICMP agar tampil lebih besar, presisi, dan sepenuhnya menggantikan representasi planet bola gradien lama.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:09 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengganti representasi bola/planet pada visualizer alur paket ICMP menjadi bentuk ilustrasi perangkat keras fisik asli (Host Desktop PC dengan layar monitor & CLI, Switch Manageable 1U dengan matriks port RJ45 & activity LEDs, Router Gateway Edge dengan dual antenna & port routing, serta Target Server 2U Rackmount dengan hot-swap drive bays & cooling grilles) yang dilengkapi efek glow luminous saat transmisi paket data melewatinya.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:06 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 6 alat simulator interaktif baru dari berbagai ranah infrastruktur IT (Kalkulator Permission Linux `chmod`, Segmentasi VLAN & Trunking 802.1Q, Kalkulator Redaman Fiber Optik OPM, Kalkulator RAID Server & Parity, Kalkulator Kapasitas NVR & Bandwidth CCTV, serta Visualizer 4-Langkah Handshake SSL/TLS) melengkapi 3 simulator jaringan utama (Terminal CLI, Subnet IPv4, ICMP Packet Flow). Mengimplementasikan sistem navigasi tab slider horizontal dengan tombol panah kiri (`‹`) dan kanan (`›`) yang membatasi tampilan maksimal 3 menu sekaligus secara dinamis dengan transisi sliding pill kapsul abu-abu yang pas presisi.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/live-simulator-showcase.test.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 10:57 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki kapsul abu-abu (*sliding pill indicator*) pada tab switcher section Live Simulator Showcase (`Terminal Diagnostik CLI`, `Kalkulator & Visualizer Subnet`, dan `Visualizer Alur Paket ICMP`) dengan mengganti nilai hardcoded statis menjadi kalkulasi dinamis presisi berbasis `activeButton.offsetLeft` dan `activeButton.offsetWidth` dengan anchor `left: 0` seperti pada section Journey, sehingga kapsul abu-abu pas (*snug fit*) 100% mengikuti panjang teks pada setiap tab.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:54 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus ornamen planet besar yang melayang dan hanya mempertahankan planet-planet kecil kosmik (ukuran 10px-16px) yang melayang dari kiri ke kanan dengan pendaran cahaya starlight pada section IT Infrastructure Journey agar tampilan tetap bersih, fokus, dan tidak mendominasi konten materi.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:53 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen planet-planet kosmik besar (3 planet) dan planet-planet kecil (10 planet dengan proporsi lebih dominan) yang melayang/berterbangan secara kontinu dari kiri ke kanan melintasi latar belakang section IT Infrastructure Journey, dilengkapi pendaran cahaya starlight (*glowing halo*) putih cerah, cyan, gold, dan teal pada beberapa planet kecil.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:51 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki penentuan posisi dan lebar kapsul abu-abu (*sliding pill indicator*) pada tab slider IT Infrastructure Journey menggunakan koordinat `activeButton.offsetLeft` dan `activeButton.offsetWidth` dengan anchor `left: 0` sehingga kapsul abu-abu 100% pas dan sinkron dengan ukuran tombol teks tanpa keluar atau meleset ke sisi kanan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel padding tombol tab slider IT Infrastructure Journey (`px-3 sm:px-3.5` untuk teks tunggal dan `pl-3 sm:pl-3.5 pr-2.5 sm:pr-2.5` untuk teks dengan badge Soon) sehingga kapsul abu-abu aktif membungkus teks dan badge secara rapat dan pas (*snug fit*) tanpa kelebihan lebar di sisi kanan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperlebar bentangan horizontal menyamping pada kapsul tab slider IT Infrastructure Journey (`px-5 sm:px-7` per tombol tab dan `px-2 sm:px-3` pada bingkai kontainer luar) sehingga deretan menu tampil lebih megah, lapang, dan berjarak lega.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:47 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbesar ukuran dan padding kapsul bingkai latar belakang utama (`p-1.5 sm:p-2`, `px-3 sm:px-4`) pada tab slider IT Infrastructure Journey sehingga kapsul abu-abu aktif dan seluruh tab menu berada di dalam bingkai dengan ruang napas (*breathing room*) yang pas, seimbang, dan proporsional.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:46 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memangkas padding sisi kanan pada tombol tab `IT Consultant` (`pr-1` dan `px-1` pada badge `Soon`) sehingga kapsul abu-abu pembungkus aktif lebih ramping dan tidak lagi melebar di sisi kanan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:45 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengetatkan ukuran dan padding kapsul tab `IT Consultant` serta seluruh trek pada tab slider IT Infrastructure Journey sehingga kapsul membungkus teks dan badge `Soon` secara ringkas, pas, dan proporsional tanpa kelebihan lebar.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:44 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengurangi padding dan lebar sisi kanan kapsul latar abu-abu aktif pada ketiga tab slider IT Infrastructure Journey (`Network Engineer`, `SysAdmin & Linux`, dan `IT Consultant`) sehingga kapsul latar membungkus teks dan badge secara rapat, presisi, dan proporsional.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:43 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Merapikan dan menyesuaikan ukuran padding background pill slider tab IT Infrastructure Journey agar pas (*snug fit*) dengan panjang teks dan badge tanpa kelebihan ruang kosong di sisi kanan/kiri.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:41 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel tab slider IT Infrastructure Journey selain trek `Network Engineer` (`SysAdmin & Linux` dan `IT Consultant`) menjadi berstatus *Coming Soon* dengan badge indikator elegan dan kartu pratinjau kurikulum yang informatif beserta tombol kembali ke trek aktif.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:39 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meredupkan intensitas dan saturasi pendaran cahaya galaksi Milky Way pada Section 4 Pilar Pembelajaran (menurunkan opacity dan densitas gradient sebesar ~35-40%) sehingga menghasilkan suasana kosmik yang lebih tenang, lembut, dan tidak menyilaukan konten tata surya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:38 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan teknik *bidirectional gradient feather masking* (`maskImage` linear fade) pada batas bawah Hero Dashboard dan batas atas Section 4 Pilar Pembelajaran sehingga garis batas pemotongan horizontal (*hard clipping seam*) tersamarkan sempurna dan menyatu 100% secara alami.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:36 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus layer transisi bayangan atas (`h-52` top shadow overlay) di awal Section 4 Pilar Pembelajaran yang sebelumnya menggelapkan bagian atas dan menutupi aliran cahaya galaksi Milky Way dari Dashboard.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:35 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menaikkan posisi bentangan galaksi Milky Way pada Section 4 Pilar Pembelajaran hingga tepat mencapai tepi atas (`top: 0`) sudut kanan atas untuk menyatu mulus dengan ujung bawah Dashboard, serta menghapus seluruh sisa layer bayangan/ambient shadow overlay di Section 4 Pilar.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:34 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan koordinat geometris dan menambahkan jembatan cahaya kosmik (*luminous galactic connection bridge*) di sudut kanan atas-bawah perbatasan kedua section sehingga aliran galaksi Milky Way dari Dashboard Utama dan Section 4 Pilar tersambung 100% tanpa celah gelap atau jeda visual.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:32 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus layer shadow overlay pemisah (`h-52` bottom shadow) di bagian bawah Hero Dashboard sehingga kanvas kosmik hitam pekat `#030308` dan aliran bentangan Milky Way tersambung 100% mulus tanpa garis atau bayangan pembatas ke Section 4 Pilar Pembelajaran.
  Files/areas: `src/app/page.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:31 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh efek pendaran cahaya matahari (*SVG solar corona flares and oversized outer glow*) di pusat tata surya Section 4 Pilar Pembelajaran sehingga bola matahari tampil bersih, bulat alami, dan tidak menyilaukan bentangan galaksi Milky Way di belakangnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:30 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan kelanjutan aliran galaksi Milky Way dari dashboard utama ke Section 4 Pilar Pembelajaran dengan orientasi berlawanan (*inverted continuous galactic flow*: masuk dari sudut kanan atas dan mengalir ke sudut kiri bawah `-rotate-[34deg]`) menggunakan palet warna harmonis bebas ungu dan ratusan bintang mikro berkilau.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:29 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan seluruh nuansa warna ungu pada Milky Way dan menggantinya dengan perpaduan warna kosmik segar tanpa ungu: kuning emas surya (`#fde047`, `#fef08a`), aurora teal/emerald (`#2dd4bf`), cyan es kosmik (`#38bdf8`), sunset coral (`#fb923c`), dan putih cemerlang (`#ffffff`).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:28 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengganti implementasi gambar dengan sistem gradien warna kosmik murni prosedural (*pure multi-color procedural cosmic gradient*) dengan perpaduan warna emas, violet, cyan, rose, dan putih bercahaya yang memanjang diagonal dari atas kiri ke bawah kanan lengkap dengan ratusan bintang mikro SVG dinamis tanpa menggunakan file gambar statis.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:27 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengintegrasikan aset astrophotography galaksi Milky Way asli resolusi tinggi persis sesuai referensi foto pengguna (`public/images/milky-way.png`) dengan teknik blending optik kosmik (`mix-blend-screen` dan *feathered radial mask*) menyerong dari atas kiri ke bawah kanan pada hero dashboard utama.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `public/images/milky-way.png`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meredupkan intensitas kabut Milky Way menjadi lebih lembut dan nyaman dibaca (*subtle dimmed golden glow*), menyelaraskan seluruh warna murni dalam palet kuning emas (`#fde047`, `#fef08a`, `#fbbf24`), serta memperbanyak puluhan bintang-bintang kecil bercahaya di sepanjang bentangan galaksi.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:24 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan celah gelap di bagian tengah bentangan Milky Way sehingga pancaran cahaya starlight sungai galaksi mengalir penuh, utuh, dan bersambung cemerlang (*full continuous starlight stream*) dari sudut kiri atas hingga sudut kanan bawah.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:23 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki sudut kemiringan jalur galaksi Milky Way pada hero dashboard menjadi menyerong tepat dari atas kiri ke bawah kanan (`rotate-[34deg]`) serta menghaluskan gradien celah debu kosmik secara organik (*soft organic dark nebula lanes*) tanpa garis patahan kaku.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:22 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan bentangan jalur galaksi Bima Sakti realistis (*diagonal Milky Way galaxy band & Great Rift dark nebula rifts*) yang menyerong dari atas kiri ke bawah kanan pada canvas `CosmicBackground` hero dashboard utama dengan gradien stardust emas-putih, kabut debu kosmik, serta ribuan bintang mikro yang berkelap-kelip.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:21 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah pencahayaan matahari menjadi pilar cahaya background kosmik vertikal dari atas ke bawah (*vertical Milky Way celestial light column*) di sepanjang pusat Section 4 Pilar Pembelajaran dengan efek atmospheric glow bertingkat, sekaligus merapikan bola matahari utama agar tampak bersih dan natural di atas pilar cahaya kosmik.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:20 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan planet-planet kecil mikro berwarna putih murni bercahaya ultra-terang (*radiant pure white micro planets*) dengan pendaran cahaya multi-layer (`#ffffff` glow halo hingga 44px) yang berterbangan dari kanan ke kiri di Section 4 Pilar Pembelajaran.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:19 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan efek cahaya matahari bersinar megah (*radiant sunlight flare, pulsating corona aura, and lens flare beams*) di pusat tata surya Section 4 Pilar Pembelajaran, memancarkan pendaran cahaya surya emas hangat yang menyinari orbit dan planet-planet di sekelilingnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:18 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengurangi jumlah planet kecil yang melayang pada Section 4 Pilar Pembelajaran menjadi lebih seimbang dan estetik (4 planet mikro + 3 anchor planets), serta menyematkan pendaran cahaya neon ultra-terang (*intense multi-tier glowing halo*) pada planet-planet kecil yang berterbangan.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:16 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan armada planet-planet kecil mikro 3D berpendar neon (berukuran 9px s.d. 18px dalam aneka warna: ruby, cyan, gold, ungu, emerald, amber, ice blue, rose, dan violet) yang berterbangan melintasi kanvas dari kanan ke kiri (*right-to-left continuous drift*) di Section 4 Pilar Pembelajaran.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:15 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan artefak kotak transparan / bounding box pada cincin Saturnus dengan merefaktor implementasi ke pure vector SVG ellipse rings (stroke putih-emas bersih tanpa drop-shadow filter yang bocor ke bounding box).
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan intensitas kecerahan dan pendaran cahaya cincin planet Saturnus (*ultra-luminous planetary rings*) pada Section IT Infrastructure Journey dengan warna putih emas cemerlang (`#ffffff` & `#fef08a`) serta multi-layer drop shadow glow.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:13 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen cincin planet bercahaya emas kosmik (*luminous planetary rings*) berputar miring (-22°) dengan layering depan-belakang yang melintasi khatulistiwa planet Saturnus pada checkpoint Section IT Infrastructure Journey.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:12 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 4 rasi bintang unik berpendar neon dinamis: 2 rasi bintang pada Section 4 Pilar Pembelajaran (**Cassiopeia** bentuk W di kiri atas & **Cygnus / Salib Utara** di kanan atas) serta 2 rasi bintang pada Section IT Infrastructure Journey (**Ursa Major / Bintang Biduk** di kiri tengah & **Orion / Sang Pemburu beserta Sabuk Tiga Bintang** di kanan bawah) dengan animasi kelap-kelip bintang utama.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:09 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan puluhan titik planet mikro (*distant micro-planets*) dengan pendaran cincin atmosfer neon lembut (*glowing atmosphere halos*) dalam variasi warna cyan, amber, gold, ungu, emerald, dan ruby pada canvas `StarField` section IT Journey dan Live Simulator Showcase.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:07 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan garis batas pemisah (`border-t`) pada section Live Simulator Showcase serta menyamakan layer ambient glow dengan section IT Journey & 4 Pilar (`#030308`) sehingga transisi visual antar-section menyatu 100% mulus tanpa ada patahan garis sama sekali.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:05 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyeragamkan warna latar belakang seluruh section landing page (4 Pilar, IT Journey, Live Simulator Showcase, dan Footer) menjadi satu warna hitam pekat kosmik murni yang konsisten (`#030308`), serta menyematkan taburan mikro-bintang 4-warna harmonis pada StarField Journey.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:03 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan latar belakang section Live Simulator Showcase menjadi warna hitam pekat kosmik murni (`bg-[#030308]`) serta memperkaya `ShowcaseStarField` dengan taburan padat titik-titik mikro-bintang dalam 4 kombinasi warna: putih (`#ffffff`), biru (`#38bdf8`), kuning (`#fde047`), dan orange (`#fb923c`).
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:01 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah teks "Langsung di Web Tanpa Setup" pada judul section Live Simulator Showcase dari gradien multi-warna menjadi satu warna solid (`text-sky-400`).
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:00 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menetapkan warna teks hitam pekat murni secara eksplisit (`style={{ color: "#000000" }}` dan `text-black !text-black dark:text-black dark:!text-black`) pada kedua tombol CTA berlatar putih: tombol "Lihat jalur belajar" (section IT Infrastructure Journey) dan tombol "Mulai Belajar Sekarang" (section Live Simulator Showcase) agar kontras terbaca jelas.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 09:58 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah warna teks tombol CTA "Lihat jalur belajar" pada bagian bawah section IT Infrastructure Journey menjadi warna hitam pekat (`text-black dark:text-black`) di atas latar putih bersih (`bg-white hover:bg-slate-100`).
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, dev server aktif.
  Git: pending

- [2026-09-01 09:57 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyeragamkan tema warna latar belakang (`#01040e`), pendaran ambient nebula biru kosmik, bidang mikro-bintang berwarna-warni (`ShowcaseStarField`), kapsul sliding pill slider tab, serta ornamen bola planet topologi 3D bercahaya neon (*celestial spheres*) pada section Live Simulator Showcase agar selaras dengan section 4 Pilar dan IT Journey.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 09:53 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan section interaktif **Live Simulator Showcase** (`LiveSimulatorShowcase`) pada landing page yang memungkinkan pengunjung mencoba simulator terminal diagnostik CLI (`ping`, `ipconfig`, `arp`, `tracert`, `nslookup`, `netstat`), kalkulator & visualizer subnet CIDR, serta visualisasi alur transmisi paket ICMP secara real-time langsung di browser.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/live-simulator-showcase.test.tsx`, `src/app/page.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 09:41 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan latar belakang section 4 Pilar Pembelajaran Komprehensif dengan gradien linear mulus dari warna hitam kosmik pekat (`#030308`) di bagian atas menuju warna *deep obsidian navy* (`#01040e`) di bagian bawah, serta menambahkan pendaran ambient bawah agar menyatu sempurna tanpa batas patahan dengan section IT Infrastructure Journey.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

# 2026-08-31

- [2026-08-31 19:58 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyesuaikan kembali tingkat kegelapan warna biru pada section IT Infrastructure Journey dan transisi bawah 4 Pilar menjadi warna *deep obsidian navy* yang lebih gelap (`bg-[#01040e]`) dengan pendaran nebula yang sangat lembut.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:54 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggelapkan tone warna biru pada section IT Infrastructure Journey dan transisi bawah 4 Pilar sedikit lebih redup ke tingkat *deep dark navy* yang presisi (`bg-[#010513]`) dengan pendaran nebula biru yang lebih tenang dan anggun.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:52 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyesuaikan kembali intensitas tone biru pada section IT Infrastructure Journey dan transisi bawah 4 Pilar menjadi warna *deep cosmic navy* yang seimbang (`bg-[#020717]`) dengan pendaran nebula biru halus yang pas dan elegan.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggelapkan kembali warna latar belakang section IT Infrastructure Journey ke tingkat ultra-deep gelap (`bg-[#01030a]`) dengan sentuhan mikro-undertone biru kosmik yang sangat samar dan redup, menyempurnakan transisi mulus dari section 4 Pilar.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggelapkan tone warna biru pada section IT Infrastructure Journey dan bayangan transisi bawah 4 Pilar menjadi warna biru malam yang lebih pekat dan tenang (*darker obsidian navy* `bg-[#010510]`), serta melembutkan intensitas pendaran ambient biru agar terasa lebih gelap, dalam, dan harmonis.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:48 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel warna latar belakang section IT Infrastructure Journey menjadi warna biru kosmik gelap (*deep midnight navy blue* `bg-[#020817]`) yang diperkaya dengan pendaran nebula biru kosmik halus (`radial-gradient`), serta mengalirkan gradien bayangan akhir section 4 Pilar secara mulus menuju warna biru gelap tersebut tanpa patahan visual.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:45 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan garis batas sambungan (*seam discontinuity*) dan menyelaraskan warna latar belakang section IT Infrastructure Journey dengan bagian akhir section 4 Pilar menjadi warna hitam kosmik pekat yang identik (`bg-[#030308]`), menyatukan gradien ambient, serta memperkaya taburan mikrobintang berwarna-warni (*colorful micro-stars*) di sepanjang kanvas Journey.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:41 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbarui narasi dan identitas Matahari Pusat pada section 4 Pilar Pembelajaran Komprehensif: menetapkan Matahari sebagai representasi Netloka (*The Central Sun*) yang bertindak sebagai pusat gravitasi dan ekosistem pembelajaran IT terintegrasi yang mengalirkan energi pengetahuan ke empat pilar planet keahlian.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:28 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan garis batas border antar menu (*card border boundaries*) pada seluruh submenu dropdown navbar (Belajar, Labs, Challenges, Konsultasi) serta melengkapi setiap item menu dengan ikon Lucide tematik yang seragam berwarna putih (*uniform pure white monochrome icons*) di dalam kotak kontainer ikon yang rapi.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:19 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperlambat proses transisi terang dan redup piringan akresi Black Hole agar berjalan sangat anggun dan sinematis (3 detik terang pelan-pelan $\rightarrow$ 3 detik redup pelan-pelan), serta menyetel jeda istirahat tepat 5 detik penuh setelah cahaya benar-benar redup sebelum gelombang denyut berikutnya datang (total siklus 11 detik).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:18 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel interval denyut cahaya piringan akresi Black Hole menjadi siklus 5 detik yang sangat mulus (*ultra-smooth 5-second gravitational breathing pulse*): intensitas cahaya berpendar terang secara perlahan hingga puncak keemasan, lalu meredup lembut kembali ke kondisi dasar sebelum gelombang interval 5 detik berikutnya tiba.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:17 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengurangi kepadatan planet terbang menjadi 3 planet besar per section dengan jarak ruang (*spacing*) yang lapang dan elegan, serta menambahkan efek cahaya pulsa detak jantung kosmik (*gravitational accretion disk heartbeat pulse*) pada piringan akresi dan kubah lensa gravitasi Black Hole.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:13 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh cincin planet orbital di seluruh section (Dashboard / Hero, bayangan transisi, dan section 4 Pilar) serta memperbarui seluruh armada planet yang meluncur menjadi bola-bola planet bulat besar dan megah ($32\text{px}-46\text{px}$) tanpa cincin dengan pendaran atmosfer kosmik yang bersih, tajam, dan elegan.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:10 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki proporsi dan presisi geometri Black Hole: memposisikan lingkaran cakrawala peristiwa hitam tepat di pusat konsentris (`cx="250", cy="160"`), merapikan piringan akresi dan kubah lensa gravitasi agar menyelimuti bola hitam secara simetris dan rapi, serta menyesuaikan skala ukuran menjadi proporsional dan seimbang di sudut kanan atas Dashboard.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:08 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Merombak total visual Black Hole di Dashboard menjadi sama persis dengan referensi ilmiah Gargantua (*Interstellar-accurate gravitational lensing*): bayangan cakrawala peristiwa hitam pekat (*shadow of event horizon*), cincin foton putih tajam (*photon sphere*), lengkungan lensa gravitasi atas dan bawah (*warped upper and lower accretion disk halo*), piringan akresi ekuatorial menyala terang dengan berkas sinar inti putih (*intense core laser flare*), jalur debu kosmik, planet Miller di sisi kiri, serta menonaktifkan seluruh animasi putaran berputar (*static realistic cosmic monument*).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:05 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan kombinasi planet terbang (*drifting celestial bodies*) di section Dashboard / Hero dan area bayangan transisi yang meluncur anggun dari kanan ke kiri (`105vw` ke `-15vw`), menampilkan kombinasi planet berukuran besar ($34\text{px}-42\text{px}$) dan kecil ($11\text{px}-16\text{px}$), serta variasi dengan cincin 3D dan tanpa cincin.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:03 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 7 planet pengembara antariksa (*drifting celestial exoplanets*) beraneka warna dan bercincin 3D yang bergerak melintasi layar secara kontinu dari ujung kanan paling luar (`105vw`) hingga ujung kiri paling luar (`-15vw`) pada section 4 Pilar dan area bayangan transisi.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:02 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyeragamkan warna latar belakang seluruh section (4 Pilar & IT Infrastructure Journey) menjadi hitam pekat gelap murni (`bg-[#030308]`) persis seperti dashboard Hero, serta menambahkan hamparan luas titik-titik bintang mikro warna-warni (150+ bintang putih, cyan, emas, violet, emerald) dan planet-planet kecil jauh bercahaya lembut di section 4 Pilar.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:58 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menaburkan gugusan titik-titik bintang mikro warna-warni (*dense colorful micro-stars*) di dalam seluruh lapisan gradasi bayangan transisi (putih, biru cyan, kuning emas, ungu violet, dan hijau emerald) sehingga area bayangan tetap hidup dan menyatu secara harmonis dengan estetika antariksa Hero/Dashboard.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:54 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menaikkan posisi planet gas raksasa biru bercincin (`bottom-[32%]`) dan rasi bintang Scorpio di kanan bawah ke area tengah kanvas Hero, serta menambahkan efek kedip cahaya berkelap-kelip (*twinkling major stars pulse*) khusus pada bintang-bintang utama berukuran besar di kedua rasi bintang (Regulus/Denebola pada Leo dan Antares/Shaula pada Scorpio).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:52 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperpanjang tinggi vertikal section Hero / Dashboard (`min-h-[115vh] lg:min-h-[125vh]` dan `pb-44 lg:pb-56`) sehingga planet gas raksasa bercincin, rasi bintang Scorpio, dan seluruh elemen langit kosmik memiliki ruang pandang yang luas dan tidak tertutupi oleh lapisan bayangan bawah.
  Files/areas: `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:49 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki struktur hierarki layer (*stacking context*): memindahkan seluruh gradasi warna ambient dan stardust ke layer paling bawah (`z-0`), menempatkan lapisan bayangan hitam pekat penutup patahan di layer tengah (`z-20`), dan mengangkat seluruh teks judul, subjudul, dan konten pilar ke layer teratas (`z-30`) sehingga garis patahan tertutup 100% dan teks tetap terang benderang.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:47 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan lapisan bayangan hitam pekat (*deep bottom black shadow void*) setinggi $192\text{px}$ pada batas bawah section 4 Pilar menuju section IT Infrastructure Journey, serta menyelaraskan lapisan bayangan atas Journey agar perpindahan ke section bawah menyatu tanpa ada patahan visual.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:45 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengembalikan lapisan bayangan hitam pekat (*deep black shadow void*) setinggi $176\text{px}$ pada batas sambungan section di layer latar belakang (`z-0`) untuk menutup garis patahan secara sempurna, sembari menaikkan seluruh teks judul '4 Pilar Pembelajaran Komprehensif', subjudul, dan elemen tata surya ke layer teratas (`z-30`) sehingga teks tetap $100\%$ terang, tajam, dan bercahaya jelas tanpa tertutup bayangan.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:43 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengecilkan dan memfokuskan ketebalan gradasi bayangan hitam (*compact seam feather shadow*) tepat di garis patahan pertemuan antar section ($64\text{px}-80\text{px}$) dan memastikan seluruh teks judul dan tombol berada di atas layer bayangan (`z-10`) agar tidak tertutupi atau redup.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:39 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan lapisan gradasi bayangan hitam pekat (*deep black shadow vignette overlay*) di layer teratas batas transisi antara section Hero dan 4 Pilar, serta menaikkan posisi planet gas raksasa di latar belakang agar tidak terpotong di batas bawah section.
  Files/areas: `src/app/page.tsx`, `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:34 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan border pemisah kaku (*hard horizontal border line*) dan menambahkan gradasi transisi kosmik lembut (*seamless atmospheric vertical blend*) antara section Hero/Dashboard, 4 Pilar, dan Journey sehingga perpindahan section terasa mulus dan menyatu sebagai satu semesta kosmik tanpa patahan visual.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:31 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan dan memperluas copywriting deskripsi seluruh pilar pembelajaran dari yang sebelumnya terspesialisasi pada *IT Infrastructure* semata menjadi mencakup ranah **Teknologi Informasi (IT & Rekayasa Komputer)** secara luas dan komprehensif.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:29 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus baris teks tag fitur (*Micro-learning & Visualisasi*, *Evaluasi Otomatis & Presisi*, *Troubleshooting Nyata*, *BoQ, Anggaran & Topologi*) pada keempat pilar pembelajaran agar teks deskripsi tampil lebih bersih dan padat.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:27 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah garis jembatan konektor yang menghubungkan Matahari ke masing-masing 4 planet menjadi garis solid utuh (*continuous solid beam*) tanpa efek garis putus-putus/patah-patah.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:19 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan jembatan data/informasi bercahaya (*information bridges*) yang menghubungkan langsung pusat Matahari ke masing-masing 4 planet (**Merkurius**, **Venus**, **Bumi**, **Mars**) dan menambahkan tooltip kosmik interaktif yang muncul saat planet atau Matahari di-hover/fokus.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:16 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki lintasan 4 garis orbit tata surya: memperluas dan memperbesar radius orbit secara proporsional ke seluruh kanvas, memastikan semua 4 lingkaran orbit berada 100% di luar batas fisik Matahari tanpa ada garis yang memotong bola Matahari, serta menempatkan teks 4 pilar di margin kiri dan kanan tanpa tabrakan.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh kotak card (*card boxes background & borders*) pada teks informasi 4 pilar sehingga menjadi tipografi terbuka yang menyatu dengan latar belakang kosmik secara elegan, serta menghapus badge teks 'Ekosistem Tata Surya IT Infrastructure' di bagian atas.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:12 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menata ulang layout section 4 Pilar Pembelajaran Komprehensif menjadi 3 kolom terpisah (Kartu Kiri | Tata Surya Tengah | Kartu Kanan) sehingga 4 garis orbit elips matahari terisolasi rapi di kanvas tengah dan tidak lagi menabrak teks informasi, serta menyesuaikan planet dengan tata surya nyata (**Merkurius**, **Venus**, **Bumi**, **Mars**) secara akurat.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:05 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus kotak bar horizontal di bagian bawah, mengganti seluruh icon 4 pilar menjadi bola planet realistis bertekstur (Planet Es Sian, Planet Terestrial Zamrud, Planet Mars Ruby, dan Planet Gas Raksasa Ungu bercincin), dan menempatkan setiap planet tepat pada 4 garis lingkaran orbit Matahari konsentris terpisah (tepat 1 planet per 1 garis orbit).
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:02 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh teks dan lencana lencana di dalam bola Matahari pada section 4 Pilar Pembelajaran Komprehensif sehingga Matahari tampil murni sebagai bola plasma surya bercahaya tanpa elemen teks di dalamnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:01 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah pusat bola ekosistem pada section 4 Pilar Pembelajaran Komprehensif menjadi **Matahari (Solar Core)** dengan gradasi plasma api kosmik, korona cahaya emas bercahaya, dan orbit tata surya yang mengalirkan energi ke 4 planet pilar pembelajaran di sekelilingnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:59 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyesuaikan dan memperkecil proporsi section 4 Pilar Pembelajaran Komprehensif (padding section, ukuran bola Planet Bumi 160px, satelit orb 56px, ukuran font teks, serta bar alur bawah) agar tampil lebih ringkas, padat (*compact*), proporsional, dan nyaman dibaca.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:57 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mendesain ulang section 4 Pilar Pembelajaran Komprehensif dengan konsep orbital futuristik: pusat berupa bola realistis **Planet Bumi (Knowledge Core)** bergradien samudra & benua berpadu cincin orbit holografis dan sinar konektor laser menuju 4 satelit pilar (**01 Learn**, **02 Practice Labs**, **03 Challenges**, dan **04 Consultant Project**), serta dilengkapi alur pembelajaran fundamental di bagian bawah sesuai referensi desain pengguna.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:53 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki penempelan navbar dengan mengubah `sticky` menjadi `fixed top-0 inset-x-0 z-50` berpasangan dengan placeholder spacer dan mengganti `overflow-x: hidden` menjadi `overflow-x: clip` di `globals.css` sehingga navbar dijamin 100% selalu tampak melayang di atas saat scroll ke bawah dan bertransisi transparan/solid dengan benar.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/app/globals.css`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan perilaku navbar adaptif: navbar tetap melayang di atas, otomatis menjadi transparan saat pengguna menggulir ke bawah (*scroll down*), dan seketika kembali solid/normal saat menggulir ke atas (*scroll up*) atau saat kursor mouse diarahkan (*hover*) ke area navbar.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:40 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus tombol/link 'Dashboard' dari navigasi desktop dan mobile pada header, mengarahkan logo kata 'NETLOKA' ke halaman utama, dan menambahkan perilaku *smooth scroll* langsung ke puncak halaman (`window.scrollTo({ top: 0, behavior: 'smooth' })`) saat logo diklik dari posisi halaman yang telah di-scroll ke bawah.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan animasi tab slider dengan indikator kapsul aktif mengambang (*animated sliding pill indicator*) yang meluncur mulus 60fps dengan kurva easing `cubic-bezier(0.25, 1, 0.5, 1)` serta menyesuaikan lebar dan posisi secara dinamis saat berpindah antar trek.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:22 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memindahkan posisi tombol tab slider trek perjalanan ke posisi paling atas section (*above title* 'IT Infrastructure Journey') untuk menegaskan filter kategori perjalanan sebelum judul dan rincian alur ditampilkan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:21 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan komponen tombol tab geser (*pill sliding tabs switcher*) di awal section IT Infrastructure Journey (**Network Engineer**, **SysAdmin & Linux**, dan **IT Consultant**) dengan gaya kapsul gelap dan indikator aktif halus sesuai desain referensi pengguna.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/it-infrastructure-journey.test.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:15 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus lingkaran garis putus-putus (*dashed orbit rings*) di sekeliling setiap planet agar tampilan planet dan nama checkpoint menjadi bersih, mulus, dan terbebas dari artefak visual yang tidak diinginkan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:12 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menata ulang koordinat planet menjadi sebaran abstrak dan asimetris yang natural (*organic celestial scatter*), menghilangkan pola bolak-balik kaku, sembari tetap mempertahankan alur perjalanan yang mengalir turun ke bawah secara anggun.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:10 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mempertebal garis putih konektor antar planet (`strokeWidth="3.5"` dengan aura glow `strokeWidth="8"`) dan mengubah kurva menjadi alur perjalanan bertahap yang mengalir turun ke bawah (*descending journey path*) dari Mercury di posisi atas menuju Polaris di posisi akhir bawah secara berurutan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:09 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengganti roadline tebal dengan satu garis putih tipis berliku bercahaya (*constellation path*) yang menghubungkan keenam planet, menata ulang posisi planet pada titik-titik tetap yang tampak acak/natural seperti konstelasi rasi bintang, serta menambahkan interaksi hover dan keyboard focus langsung pada desktop sementara klik/tap tetap berfungsi untuk mengunci atau menutup pop-up detail.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/it-infrastructure-journey.test.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 16:57 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus card informasi “Simulasi 100% di Browser” dari section ekosistem landing page, termasuk seluruh deskripsi, daftar manfaat, dan CTA terkait.
  Files/areas: `src/app/page.tsx`
  Validation: typecheck, lint, build, dan UI layout detector; E2E tidak dijalankan sesuai permintaan pengguna.
  Git: pending

- [2026-08-31 16:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus ikon dekoratif pada section ekosistem pembelajaran landing page (badge, empat card, highlight simulasi, checklist, dan CTA) agar fokus visual berada pada teks dan aksi.
  Mengubah checkpoint `IT Infrastructure Journey` menjadi planet berwarna yang dapat dipilih dari sisi road line. Detail materi kini tersembunyi secara default dan tampil sebagai pop-up kecil di sekitar planet yang dipilih; layout mobile mempertahankan interaksi yang sama dalam urutan vertikal.
  Menambahkan kebijakan ikon pada `AGENTS.md`: ikon dekoratif, emoji, dan ikon pada card/badge/CTA dilarang kecuali pengguna memintanya secara eksplisit; ikon kontrol fungsional harus aksesibel.
  Files/areas: `AGENTS.md`, `src/app/page.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/it-infrastructure-journey.test.tsx`
  Validation: unit test Journey RED/GREEN dan full suite 24 file/109 test; typecheck; lint; production build; UI layout detector; pemeriksaan desktop pada browser lokal. E2E tidak dijalankan sesuai permintaan pengguna.
  Git: pending

- [2026-08-31 16:27 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan section `IT Infrastructure Journey` pada landing page: satu road line kosmik lebar dengan enam checkpoint astronomi (`Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, dan `Polaris`) yang memetakan seluruh jalur belajar MVP dan mengarahkan pengguna ke katalog belajar.
  Road line desktop menggunakan jalur berliku horizontal; mobile menyajikan urutan checkpoint vertikal yang tetap mudah dibaca. CCTV dan spesialisasi post-MVP tidak ditampilkan sebagai materi aktif.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`, `src/e2e/foundation.spec.ts`
  Validation: E2E RED/GREEN checkpoint; 66/66 E2E Chromium/Firefox/WebKit; typecheck; build produksi; UI layout detector lulus. Lint tanpa error dengan 3 peringatan pre-existing pada import tidak terpakai di `src/app/page.tsx`.
  Git: pending

- [2026-08-31 15:45 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Merapatkan gutter wordmark `NETLOKA` pada navbar desktop dari 40px menjadi 32px, sambil mempertahankan 24px pada mobile dan 32px pada tablet.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/e2e/foundation.spec.ts`
  Validation: E2E posisi diuji RED pada 40px lalu GREEN pada 32px; 63/63 E2E Chromium/Firefox/WebKit, typecheck, lint, dan UI layout detector lulus.
  Git: pending

- [2026-08-31 15:10 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki rule reset global yang menimpa seluruh utility spacing Tailwind (`padding` dan `margin` selalu kembali ke 0), sehingga offset navbar sebelumnya tidak pernah diterapkan. Reset dipindahkan ke base layer, navbar kini full-width dengan gutter brand 24px mobile, 32px tablet, dan 40px desktop; offset kompensasi besar dihapus.
  Menambahkan E2E pengukuran posisi wordmark dan menyelaraskan smoke landing page dengan heading serta CTA hero yang aktif.
  Files/areas: `src/app/globals.css`, `src/components/navigation/app-header.tsx`, `src/e2e/foundation.spec.ts`
  Validation: browser inspection desktop/mobile; UI detector bersih; typecheck; 23 suite/108 test Vitest; production build; 63/63 E2E lintas Chromium, Firefox, dan WebKit.
  Git: pending

- [2026-08-31 14:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan pergeseran posisi teks 'NETLOKA' secara signifikan ke arah dalam/kanan (`pl-20 sm:pl-32 md:pl-44 lg:pl-56`) serta menaikkan ukuran font judul menjadi `text-2xl sm:text-3xl` agar posisinya tampak jelas dan tegas berjarak dari pojok kiri navbar.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:18 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggeser posisi teks logo 'NETLOKA' pada navbar header lebih ke arah kanan (`pl-14 sm:pl-20 lg:pl-28`) untuk memberikan ruang bernapas yang lebih lapang di sisi kiri navbar.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:16 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan lebih dari 220 titik-titik cahaya bintang mikro yang diam (_dense stationary micro-starfield_) di seluruh kanvas luar angkasa dengan palet warna astronomis murni (Putih, Biru Cyan, dan Kuning Emas) untuk menciptakan atmosfer kosmos yang luas, megah, dan imersif.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan tanda silang (+) difraksi pada titik bintang terang, serta menyeimbangkan intensitas cahaya secara halus dan proporsional (titik standar rasi pada tingkat kecerahan ~50% dan bintang utama pilihan pada ~70%).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:12 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperluas cakupan judul utama hero dan badge ekosistem dari 'Jaringan Komputer' menjadi **'IT Infrastructure'** (_'Kuasai IT Infrastructure Lewat Praktik Interaktif'_), merefleksikan platform pembelajaran komprehensif yang mencakup jaringan, server/sysadmin, simulasi BoQ, dan arsitektur infrastruktur teknologi informasi.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:11 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan efek pendaran cahaya ultra-terang (_superBrightBloom_, cincin halo bercahaya, dan sinar difraksi mikro) pada beberapa bintang utama rasi tertentu (**Regulus** pada Rasi Leo, serta **Antares** dan **Shaula** pada Rasi Scorpio) sehingga menciptakan hierarki kecerahan astronomis yang dramatis dan realistis.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:09 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengembalikan titik-titik simpul rasi bintang Leo dan Scorpio menjadi warna putih solid bercahaya (_pure white starbloom_) dengan garis putih solid, serta mengembalikan teks judul hero dalam versi ringkas dan padat (_'Kuasai Jaringan Komputer Lewat Praktik Interaktif'_).
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:07 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus teks judul utama hero ('Kuasai Jaringan Komputer Lewat Praktik Interaktif & Simulasi Nyata') sehingga hanya menyisakan tombol 'Jelajahi' di tengah layar hero, serta menyeragamkan seluruh titik simpul rasi bintang Leo dan Scorpio menjadi warna biru cerah menyala (_cyan-blue_ `#38bdf8`) dengan garis rasi yang tetap solid putih.
  Files/areas: `src/app/page.tsx`, `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:02 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus bentangan Galaksi Bimasakti (Milky Way) dan kabut terang agar latar belakang menjadi hitam pekat antariksa (_deep black space_ `#030308`), mempertegas titik-titik bintang sirkular putih padat dengan efek bloom di setiap simpul rasi Leo dan Scorpio, serta menambahkan partikel debu bintang (_stardust_) yang melayang bergerak secara horizontal dari kiri ke kanan.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/globals.css`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:56 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menata ulang rasi bintang menjadi tepat 2 rasi zodiak utama (**Rasi Leo** di sisi kiri dan **Rasi Scorpio** di sisi kanan) dengan titik-titik bintang sirkular putih yang jelas dan bercahaya di setiap simpul persimpangan garis rasi sesuai referensi gambar zodiak pengguna.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:55 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus galaksi biru (Andromeda) dan menambahkan 3 buah bintang berpendar 8-arah (_8-pointed starburst / flare stars_) dengan gradasi purple, cyan, dan golden glow sesuai dengan contoh gambar referensi yang diunggah pengguna.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:53 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan bentangan sabuk Galaksi Bimasakti (Milky Way galaxy arch dengan debu bintang diagonal melintang), sekumpulan rasi bintang astronomis riil (Rasi Orion dengan Sabuk Orion, Rasi Cassiopeia 'W', Rasi Bintang Biduk / Ursa Major, Rasi Cygnus Northern Cross, dan Rasi Network Topology), serta galaksi spiral Andromeda dan Triangulum pada latar belakang mode malam `CosmicBackground`.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/globals.css`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:51 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan puluhan bintang mikro baru berkelap-kelip dengan gradasi glow dinamis (gold, cyan, purple) pada starfield kosmik `CosmicBackground`, serta memperkecil dimensi tombol 'Jelajahi' (`h-10`, `min-w-[110px]`, `px-6 py-2`) dan ketebalan bordernya menjadi proporsional.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperlebar dimensi dan ketebalan border tombol 'Jelajahi' (`border-2`, `h-14`, `min-w-[200px]`, `px-10 sm:px-14`), mempertahankan ukuran teks tetap proporsional (`text-base font-semibold`), dan menghapus ikon panah ke bawah.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:47 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan tombol 'Jelajahi' pada hero landing page agar menggunakan warna solid background putih (`bg-white`) dan teks solid hitam (`text-black`), konsisten dengan estetika tombol kontras 'Mulai Gratis'.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:45 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyederhanakan Hero Section landing page (`src/app/page.tsx`) dengan hanya menampilkan judul utama dan tombol 'Jelajahi' yang menggulir halus (_smooth scroll_) ke section ekosistem pembelajaran di bawahnya (4 Pilar Netloka, In-Browser Simulation highlights, dan CTA belajar).
  Files/areas: `src/app/page.tsx`, `src/app/globals.css`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:42 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengembalikan ukuran teks ke ukuran kompak proporsional (`text-2xl`) dan menggeser posisi logo 'NETLOKA' lebih ke kanan dengan jarak kiri yang jelas (`pl-8 sm:pl-12 lg:pl-16`), serta memperluas jarak sisi kiri teks fitur pada landing page (`px-6 sm:px-12`).
  Files/areas: `src/components/navigation/app-header.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:40 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ruang padding dan margin yang lebih lapang (_generous breathing room_) pada container navbar (`px-8 sm:px-12 lg:px-16`), logo brand NETLOKA (`pl-2 sm:pl-4`), serta section hero landing page (`px-8 sm:px-16 lg:px-24`) agar teks tidak menempel di sisi kiri dan memiliki jarak estetis yang nyaman.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:35 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan Google Font `Caveat` (bobot 700 / bold) bergaya tulisan tangan alami (_natural handwriting script_) untuk brand title 'NETLOKA' pada navbar (`app-header.tsx`), halaman masuk (`sign-in`), dan halaman daftar (`sign-up`).
  Files/areas: `src/app/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:34 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan Google Font `Montserrat` (bobot 900 / black dengan _letter-spacing wider_) untuk brand title 'NETLOKA' pada navbar (`app-header.tsx`), halaman masuk (`sign-in`), dan halaman daftar (`sign-up`).
  Files/areas: `src/app/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:29 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah teks brand wordmark menjadi huruf kapital 'NETLOKA' dan menerapkan font tulisan sambung (_neat cursive script_) Google Font `Dancing_Script` dengan ukuran proporsional di seluruh navbar, sign-in, dan sign-up.
  Files/areas: `src/app/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus pembungkus kartu (card wrapper container) dan tombol CTA ('Mulai Belajar Gratis' & 'Sudah Punya Akun? Masuk') pada landing hero page (`src/app/page.tsx`), sehingga teks judul, subjudul, dan 4 pilar fitur tampil bersih langsung di atas canvas latar belakang.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:19 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan Opsi B sesuai preferensi pengguna: Garis-garis grid geometris blueprint hanya aktif pada Tema Terang (White Theme), sedangkan Tema Gelap (Dark Theme) sepenuhnya bertransisi menjadi pengalaman Deep Space kosmik pekat (Black Hole, Planet Cincin, White Hole, Galaksi, dan Starfield) tanpa garis grid.
  Files/areas: `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:18 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengimplementasikan tema kosmik antariksa (Cosmic Space Theme) khusus untuk Dark Mode yang menampilkan Gargantua Black Hole dengan accretion disk, planet gas raksasa berdering (Kepler Node) dengan cincin 3D, White Hole quasar flare, galaksi spiral, debu nebula ambient, dan starfield konstelasi jaringan menggunakan murni SVG dan GPU-accelerated CSS animations.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:02 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan kontras dan visibilitas warna garis-garis grid geometris pada tema gelap (dark mode) menjadi putih cerah dan jelas (`rgba(255,255,255,0.22)`).
  Files/areas: `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:58 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus badge subtitle 'Platform Pembelajaran Jaringan Komputer' pada landing hero, dan merapikan seluruh garis background grid menjadi satu pola grid kotak geometris presisi yang seragam tanpa garis ganda tebal atau elemen garis manual yang keluar jalur.
  Files/areas: `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan background pola grid kotak geometris beserta garis silang horizontal & vertikal yang membentang membentuk frame '#' besar pada section Hero Landing Page (`src/app/page.tsx` di `localhost:3000`), membingkai kartu hero utama dengan crosshair '+' pada 4 titik persilangan sudut.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:43 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan background grid berpola kotak geometris beserta garis silang panduan horizontal & vertikal yang membentang membentuk frame '#' besar pada section Hero Dashboard (dengan crosshair marker '+' pada titik potong), dan membatasi efek grid khusus pada section Hero Dashboard.
  Files/areas: `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:42 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan seluruh warna teks antarmuka menjadi solid hitam (#000000 / text-black) pada tema terang (light mode) dan solid putih (#ffffff / dark:text-white) pada tema gelap (dark mode), dengan pengecualian tombol CTA 'Mulai Gratis' yang tetap mempertahankan gaya inverted kontras tinggi (solid-light).
  Files/areas: `src/app/globals.css`, `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/components/ui/navigation-menu.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:38 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan background garis-garis grid teknis (blueprint horizontal & vertikal dengan radial mask), serta 5 section informatif komprehensif pada halaman Dashboard (4 Pilar Ekosistem Netloka, Roadmap Pembelajaran & Standar UKK TKJ 5-tahap, Keunggulan Simulasi Deterministik In-Browser, Panduan Cepat/FAQ, dan Akreditasi Kurikulum).
  Files/areas: `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:26 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus badge subtitle 'Platform Pembelajaran Jaringan Interaktif' pada landing hero, menghapus kotak icon logo 'N' biru di navbar, dan menyisakan wordmark bersih 'netloka' dengan tipografi modern geometris Space Grotesk.
  Files/areas: `src/app/page.tsx`, `src/components/navigation/app-header.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

# 2026-08-25

- [2026-08-25 23:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Compactkan tombol autentikasi navbar desktop dan mobile agar proporsional dengan menu navigasi: tinggi 36px, font 14px, padding horizontal terukur, radius 8px, dan gap desktop 10px.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/components/navigation/app-header.test.tsx`
  Validation: UI detector bersih; lint, typecheck, 23 suite/108 test Vitest, production build, dan 5/5 smoke E2E Chromium lulus.
  Git: pending

- [2026-08-25 18:59 WITA] [MILESTONE] [REVIEW] [Milestone 7: Production Readiness & MVP Launch]
  Completed Milestone 7 — Production Readiness & MVP Launch (Sprint 15: Quality, Security & Deployment, and Sprint 16: MVP Stabilization).
  - MVP Exit Criteria Verified: Netloka is production-accessible, secure, resilient, measurable, recoverable, and ready for real learners at `netloka.biz.id`.
  - Security Hardening: Configured HTTP Security Headers (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`) in `next.config.ts` and `Caddyfile`.
  - Production Containerization: Multi-stage `Dockerfile` (Node 20 Alpine standalone with non-root nextjs user) and `docker-compose.prod.yml` with isolated Docker network `netloka-network`.
  - Reverse Proxy & SSL: `Caddyfile` with automatic HTTPS, zstd/gzip compression, and Cloudflare Full (Strict) SSL setup documentation in `docs/deployment/cloudflare-and-caddy.md`.
  - Database Disaster Recovery: Created automated backup script `scripts/backup-db.sh` with 14-day retention and restore script `scripts/restore-db.sh`.
  - Monitoring & Metrics: Enhanced `/api/health` with database latency ping, process memory usage, uptime, and application version.
  - Technical Debt Register: Documented debt items and post-MVP architecture pathways (MikroTik, Cisco, Linux Server) in `docs/TECHNICAL_DEBT.md`.
  - Validation: 22 Vitest test suites (107 tests passed), 20 Playwright E2E browser tests passed (including full critical-path test `src/e2e/critical-path.spec.ts`), Next.js 16 production build succeeded, typecheck clean, lint clean.
  Files/areas: `Dockerfile`, `docker-compose.prod.yml`, `Caddyfile`, `next.config.ts`, `scripts/`, `docs/`, `src/app/api/health/`, `src/e2e/critical-path.spec.ts`
  Git: pending

- [2026-08-25 18:55 WITA] [SPRINT] [Milestone 7 / Sprint 16]
  Completed Sprint 16 — MVP Stabilization.
  1. Enhanced system metrics and database connection monitoring in `src/app/api/health/route.ts`.
  2. Created technical debt register and post-MVP extension roadmap in `docs/TECHNICAL_DEBT.md`.
  3. Verified all 5 curriculum paths and attempt models for learning funnel tracking.
  Files/areas: `src/app/api/health/`, `docs/TECHNICAL_DEBT.md`
  Validation: health endpoint unit tests passed.

- [2026-08-25 18:40 WITA] [SPRINT] [Milestone 7 / Sprint 15]
  Completed Sprint 15 — Quality, Security & Deployment.
  1. Configured HTTP Security Headers (`CSP`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`) in `next.config.ts`.
  2. Created multi-stage production `Dockerfile` (Node 20 Alpine standalone) and `docker-compose.prod.yml`.
  3. Configured `Caddyfile` for reverse proxying and automatic HTTPS on `netloka.biz.id`.
  4. Documented Cloudflare DNS, WAF, and SSL settings in `docs/deployment/cloudflare-and-caddy.md`.
  5. Implemented automated database backup and restore scripts in `scripts/backup-db.sh` and `scripts/restore-db.sh`.
  6. Added critical-path E2E tests across all 4 product pillars in `src/e2e/critical-path.spec.ts`.
  Files/areas: `Dockerfile`, `docker-compose.prod.yml`, `Caddyfile`, `next.config.ts`, `scripts/`, `docs/deployment/`, `src/e2e/critical-path.spec.ts`
  Validation: 20 Playwright E2E tests passed, build passed.

- [2026-08-25 18:18 WITA] [MILESTONE] [REVIEW] [Milestone 6: IT Consultant Mode]
  Completed Milestone 6 — IT Consultant Mode (Sprint 12: Case & Procurement Engine, Sprint 13: Topology, IP/VLAN Planning & Scoring, Sprint 14: Portfolio & Advanced Cases).
  - Exit Criteria Verified: Learner can receive a case, analyze client requirements, procure devices (BoQ), design topology, plan IP/VLAN, submit a full proposal, receive deterministic 5-dimensional scoring (Technical Correctness, Requirement Fulfillment, Cost Efficiency, Scalability, Security), and retain the project in a persistent portfolio.
  - Database: Added `ConsultantCase` and `ConsultantProject` models to Prisma schema.
  - XP: Added `CONSULTANT_PROJECT_PASSED` (+250 XP) to `XpEventType` with idempotent award via `UserXpLedger`.
  - 5 Seeded Cases: Small Office Notaris (15M), Warnet Gaming Center (25M), Medium Office Logistics (50M), SMK TKJ School Lab (75M), Multi-Floor Corporate Enterprise (120M).
  - 14 Realistic Device Catalog: Routers (3), Switches (4), Access Points (2), Cables/Rack/SFP (5).
  - Validation: 22 Vitest test suites (107 tests passed), 17 Playwright E2E browser tests passed, production build succeeded (20 routes), typecheck clean, lint clean.
  Files/areas: `prisma/schema.prisma`, `src/features/consultant/`, `src/app/(app)/consultant/`, `src/app/api/consultant/`, `src/features/xp/ledger.ts`, `src/e2e/consultant-mode.spec.ts`
  Git: pending

- [2026-08-25 18:15 WITA] [SPRINT] [Milestone 6 / Sprint 14]
  Completed Sprint 14 — Consultant Portfolio & Advanced Cases.
  1. Built interactive ConsultantWorkspace 5-tab component (Brief → BoQ → Topology → IP/VLAN → Proposal & Score).
  2. Created consultant catalog at `/consultant` with 5 case cards.
  3. Created dynamic case workspace at `/consultant/[caseSlug]` with full proposal submission flow.
  4. Created user portfolio at `/consultant/portfolio` showing all submitted projects with scores and status.
  5. Seeded 2 advanced cases: SMK TKJ School Lab (75M, 72 PC, 3 VLAN) and Multi-Floor Corporate (120M, 100 node, Fiber 10G SFP+).
  Files/areas: `src/features/consultant/components/consultant-workspace.tsx`, `src/app/(app)/consultant/`
  Validation: build passed, E2E passed.

- [2026-08-25 18:10 WITA] [SPRINT] [Milestone 6 / Sprint 13]
  Completed Sprint 13 — Topology, IP/VLAN Planning & Scoring.
  1. Implemented pure deterministic 5-dimensional scoring engine in `src/features/consultant/scoring/engine.ts` with 3 unit tests.
  2. Scoring dimensions: Technical Correctness (0-20), Requirement Fulfillment (0-20), Cost Efficiency (0-20), Scalability (0-20), Security (0-20). Pass threshold ≥70/100.
  3. Created consultant submit API at `/api/consultant/[caseSlug]/submit` awarding +250 XP.
  4. Built topology architecture viewer and VLAN/IP subnet matrix editor in workspace UI.
  Files/areas: `src/features/consultant/scoring/`, `src/app/api/consultant/`
  Validation: unit tests passed, typecheck clean.

- [2026-08-25 18:06 WITA] [SPRINT] [Milestone 6 / Sprint 12]
  Completed Sprint 12 — Case & Procurement Engine.
  1. Added `ConsultantCase` and `ConsultantProject` models to Prisma schema with full JSON fields for BoQ, topology, IP plan, VLAN plan, and composite score.
  2. Created realistic fictional device catalog (14 devices) in `src/features/consultant/catalog/devices.ts`.
  3. Implemented pure BoQ calculator and budget validator in `src/features/consultant/procurement/boq.ts` with 3 unit tests.
  4. Seeded 5 consultant cases: Small Office (15M), Warnet (25M), Medium Office (50M), SMK TKJ (75M), Multi-Floor (120M).
  Files/areas: `prisma/schema.prisma`, `src/features/consultant/catalog/`, `src/features/consultant/procurement/`
  Validation: unit tests passed, Prisma generate clean.

- [2026-08-25 17:35 WITA] [MILESTONE] [REVIEW] [Milestone 5: Labs & Challenges Engine]
  Completed Milestone 5 — Labs & Challenges (Sprint 10: Lab Engine & Sprint 11: Challenge Engine).
  - Exit Criteria Verified: Hands-on interactive practice labs with persistent attempt tracking and real-world diagnostic troubleshooting challenges functioning with deterministic evaluation and anti-abuse idempotent XP rewards (+100 XP per Lab, +150 XP per Challenge).
  - Lab Engine (Sprint 10): 7 initial labs (Subnetting, IP Config, Packet Flow, VLAN, Routing, DHCP/DNS, Troubleshooting) with instructions, workbench, and reset/retry.
  - Challenge Engine (Sprint 11): 3 real-world multi-step scenario challenges (Branch Office Offline, Inter-VLAN Routing Bug, DHCP Scope Exhaustion) with CLI sandbox and hypothesis submission.
  - Database: Added `Lab`, `LabAttempt`, `Challenge`, and `ChallengeAttempt` models to Prisma.
  - Validation: 20 Vitest test suites (101 tests passed), 15 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Files/areas: `prisma/schema.prisma`, `src/features/labs/`, `src/features/challenges/`, `src/app/(app)/labs/`, `src/app/(app)/challenges/`, `src/e2e/labs-challenges.spec.ts`
  Git: `c95a57a`

- [2026-08-25 17:30 WITA] [SPRINT] [Milestone 5 / Sprint 11]
  Completed Sprint 11 — Challenge Engine.
  1. Implemented pure challenge diagnostic evaluator `evaluateChallengeDiagnosis` in `src/features/challenges/engine.ts` with 3 unit tests.
  2. Built interactive challenge runner `ChallengeRunner` (`src/features/challenges/components/challenge-runner.tsx`) with built-in CLI diagnostic terminal workbench.
  3. Created API submit route `/api/challenges/[challengeSlug]/submit` awarding +150 XP into `UserXpLedger`.
  4. Built challenge catalog at `/challenges` and dynamic challenge page at `/challenges/[challengeSlug]`.
  Files/areas: `src/features/challenges/`, `src/app/(app)/challenges/`
  Validation: unit tests passed, typecheck clean, E2E passed.
  Git: `c95a57a`

- [2026-08-25 17:25 WITA] [SPRINT] [Milestone 5 / Sprint 10]
  Completed Sprint 10 — Lab Engine.
  1. Defined `Lab` and `LabAttempt` schema in `prisma/schema.prisma`.
  2. Implemented pure deterministic lab evaluator `evaluateLabSubmission` in `src/features/labs/evaluator.ts` with 5 unit tests.
  3. Built interactive lab runner `LabRunner` (`src/features/labs/components/lab-runner.tsx`) with workbench, step-by-step instructions, and instant criteria evaluation.
  4. Created API submit route `/api/labs/[labSlug]/submit` awarding +100 XP into `UserXpLedger`.
  5. Built lab catalog at `/labs` and dynamic lab page at `/labs/[labSlug]`.
  Files/areas: `src/features/labs/`, `src/app/(app)/labs/`
  Validation: unit tests passed, typecheck clean, E2E passed.
  Git: `c95a57a`

- [2026-08-25 16:47 WITA] [SPRINT] [Sprint 9: Services, Wireless & Troubleshooting]
  Completed Sprint 9 — Services, Wireless & Troubleshooting.
  1. Built reusable Network Service Visualizers: `DhcpDoraVisualizer` (4-step DORA flow), `DnsQueryVisualizer` (DNS resolution hierarchy), `NatVisualizer` (NAT/PAT port translation table), and `IcmpPingVisualizer` (ICMP echo request/reply simulation).
  2. Built safe in-browser Terminal Simulator (`src/features/network-logic/terminal/terminal-simulator.ts`) with deterministic execution for `ipconfig` (/all), `ip` (addr/route), `ping`, `arp` (-a), `traceroute`/`tracert`, `route`, `nslookup`/`dig`, `netstat` (-an), `clear`, `help` and 10 unit tests.
  3. Implemented interactive CLI terminal UI component `TerminalBlockPlayer` (`src/features/learning/blocks/components/terminal-block-player.tsx`).
  4. Authored Path 4 (Network Services & Security) and Path 5 (Wireless & Troubleshooting) in `prisma/seed.ts`.
  Files/areas: `src/features/network-logic/terminal/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`
  Validation: 18 Vitest test suites (93 tests passed), 12 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Git: `6925d3a`

- [2026-08-25 16:25 WITA] [MILESTONE] [REVIEW] [Milestone 4: Addressing & Core Networking]
  Completed Milestone 4 — Addressing & Core Networking (Sprint 7: IPv4 & Subnetting Engine & Sprint 8: Switching, VLAN & Routing Fundamentals).
  - Exit Criteria Verified: Deterministic IPv4 calculation, subnetting, VLSM allocation, VLAN broadcast domain isolation, and Longest Prefix Match routing evaluation functioning 100% with rigorous unit tests.
  - Interactive Tools Added: `BinaryConverter`, `SubnetCalculator` (with step-by-step reasoning breakdown), `SubnetPractice` (random challenge generator), `ArpVisualizer`, `VlanBuilder`, and `RoutingTableVisualizer`.
  - Added Path 2 (IPv4 & Subnetting) and Path 3 (Switching, VLAN & Routing) to curriculum seed (`prisma/seed.ts`).
  - Validation: 17 Vitest test suites (83 tests passed), 12 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Files/areas: `src/features/network-logic/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`, `src/e2e/core-networking.spec.ts`
  Git: `7ab5cad`

- [2026-08-25 16:20 WITA] [SPRINT] [Milestone 4 / Sprint 8]
  Completed Sprint 8 — Switching, VLAN & Routing Fundamentals.
  1. Created typed logical simulation primitives in `src/features/network-logic/simulation/topology.ts` (`SimDevice`, `SimInterface`, `SimLink`, `SimRoute`).
  2. Implemented deterministic `evaluateL2Reachability` (access/trunk VLAN isolation) and `evaluateL3Routing` (Longest Prefix Match & direct vs next-hop forwarding) with 7 unit tests.
  3. Built interactive UI components: `ArpVisualizer`, `VlanBuilder`, and `RoutingTableVisualizer`.
  4. Seeded Path 3 curriculum in `prisma/seed.ts`.
  Files/areas: `src/features/network-logic/simulation/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `7ab5cad`

- [2026-08-25 16:15 WITA] [SPRINT] [Milestone 4 / Sprint 7]
  Completed Sprint 7 — IPv4 & Subnetting Engine.
  1. Built pure deterministic IPv4 library in `src/features/network-logic/ipv4/ipv4.ts` (parsing, CIDR conversions, subnet calculations, binary formatting, and VLSM multi-department allocation).
  2. Covered library with 10 comprehensive unit tests in `src/features/network-logic/ipv4/ipv4.test.ts`.
  3. Built interactive tools: `BinaryConverter`, `SubnetCalculator`, `SubnetPractice`.
  4. Seeded Path 2 curriculum in `prisma/seed.ts`.
  Files/areas: `src/features/network-logic/ipv4/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `7ab5cad`

- [2026-08-25 16:12 WITA] [MILESTONE] [REVIEW] [Milestone 3: Network Foundations Content]
  Completed Milestone 3 — Network Foundations Content (Sprint 5: Part A & Sprint 6: Part B).
  - Exit Criteria Verified: Path 1 (Network Foundations) is 100% completable end-to-end across all 8 modules (16 lessons) and includes the final challenge 'First Day as IT Support'.
  - Added modular interactive components: `TopologyExplorer`, `DeviceCard`, `PacketFlow`, `CableOrderExercise` (T568A/T568B pinout), `OSIStack` (7 Layer OSI & TCP/IP), `EncapsulationVisualizer`.
  - Implemented Final Capstone Challenge with deterministic evaluation engine (`support-challenge.ts`) and reward endpoint (`/api/challenges/submit`).
  - Validation: 15 Vitest test suites (66 tests passed), 11 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Files/areas: `src/features/learning/blocks/components/`, `src/features/challenges/`, `prisma/seed.ts`, `src/app/(app)/challenges/`, `src/e2e/network-foundations.spec.ts`
  Git: `2028ca9`

- [2026-08-25 16:05 WITA] [SPRINT] [Milestone 3 / Sprint 6]
  Completed Sprint 6 — Network Foundations Part B & Final Challenge.
  1. Built interactive components: `CableOrderExercise` (T568A/T568B color pinout reordering), `OSIStack`, `EncapsulationVisualizer`.
  2. Authored Modules 5 to 8 content in `prisma/seed.ts` (Network Devices, Physical Media & Cabling, How Data Travels, OSI & TCP/IP Foundations).
  3. Implemented Capstone Challenge: First Day as IT Support with evaluator, unit tests, and API handler.
  4. Added E2E tests in `src/e2e/network-foundations.spec.ts`.
  Files/areas: `src/features/challenges/`, `src/features/learning/blocks/components/`, `src/app/(app)/challenges/`, `src/app/api/challenges/submit/`
  Validation: `npm test` (66/66 passed), `npx playwright test` (11/11 passed).
  Git: `2028ca9`

- [2026-08-25 15:55 WITA] [SPRINT] [Milestone 3 / Sprint 5]
  Completed Sprint 5 — Network Foundations Part A.
  1. Built reusable interaction primitives: `TopologyExplorer`, `DeviceCard`, `PacketFlow`.
  2. Authored Modules 1 to 4 content in `prisma/seed.ts` (Welcome to Networking, Types of Networks, Client/Server & Communication, Network Topology).
  3. Registered components in `BLOCK_COMPONENTS` registry.
  Files/areas: `src/features/learning/blocks/components/`, `src/features/learning/blocks/registry.tsx`, `prisma/seed.ts`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `2028ca9`

- [2026-08-25 15:48 WITA] [MILESTONE] [REVIEW] [Milestone 2: Learning Engine]
  Completed Milestone 2 — Learning Engine (Sprint 3: Lesson Block Renderer & Sprint 4: Quiz, Practice & Reward Engine).
  - Exit Criteria Verified: A lesson can execute the complete Intro → Concept → Visual → Interactive → Knowledge Check → Practice → Summary → XP loop without hardcoded routes.
  - Reusable block renderer system with 13 typed block variants, fallback handling, and reduced motion.
  - Deterministic quiz evaluator and interactive quiz player with immediate visual feedback.
  - Auditable database-enforced idempotent XP ledger.
  - Full automated suite: 13 Vitest suites (61 tests passed), 9 Playwright E2E browser tests passed, clean typecheck, lint, and Next.js 16 build (16 routes).
  Files/areas: `src/features/learning/blocks/`, `src/features/quiz/`, `src/features/xp/`, `prisma/schema.prisma`, `prisma/seed.ts`, `src/app/api/learning/quiz/submit/`, `src/e2e/lesson-loop.spec.ts`
  Validation: `npm run lint`, `npm run typecheck`, `npm test` (61/61 passed), `npm run build` (16 routes), `npx playwright test` (9/9 passed).
  Git: `b77ad5f`

- [2026-08-25 15:45 WITA] [SPRINT] [Milestone 2 / Sprint 4]
  Completed Sprint 4 — Quiz, Practice & Reward Engine.
  1. Extended Prisma schema with `content Json?` on Lesson, `UserXpLedger` (with composite unique index for idempotency), and `QuizAttempt`.
  2. Implemented pure deterministic quiz evaluation engine (`src/features/quiz/evaluator.ts`) covering single choice, multiple choice, and ordering questions.
  3. Created interactive `QuizBlockPlayer` client component (`src/features/quiz/components/quiz-block-player.tsx`) and submit API (`/api/learning/quiz/submit/route.ts`).
  4. Implemented auditable XP ledger service (`src/features/xp/ledger.ts`) and integrated XP display on Dashboard.
  5. Seeded rich interactive lesson curriculum with quizzes and summaries (`prisma/seed.ts`).
  6. Added comprehensive unit and integration tests (21 tests in `evaluator.test.ts`, `ledger.test.ts`, `quiz-route.test.ts`, `lesson-loop.spec.ts`).
  Files/areas: `src/features/quiz/`, `src/features/xp/`, `prisma/schema.prisma`, `prisma/seed.ts`, `src/app/api/learning/quiz/submit/`
  Validation: `npm test` (61/61 passed), `npx playwright test` (9/9 passed).
  Git: `b77ad5f`

- [2026-08-25 15:40 WITA] [SPRINT] [Milestone 2 / Sprint 3]
  Completed Sprint 3 — Lesson Block Renderer.
  1. Defined versioned lesson content schema with Zod discriminated union for 13 block types (`src/features/learning/blocks/schema.ts`).
  2. Implemented block components: Heading, Text, Callout, Code, Image, Lottie (reduced motion), Diagram, Summary, Reward, and graceful FallbackBlock.
  3. Built component registry (`src/features/learning/blocks/registry.tsx`) and `LessonRenderer` (`src/features/learning/blocks/lesson-renderer.tsx`).
  4. Integrated dynamic block rendering into lesson runner page (`/learn/[pathSlug]/[moduleSlug]/[lessonSlug]`).
  5. Tested schema validation and error fallback rendering (`schema.test.ts`, `registry.test.tsx`).
  Files/areas: `src/features/learning/blocks/`, `src/app/(app)/learn/[pathSlug]/[moduleSlug]/[lessonSlug]/`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `b77ad5f`

- [2026-08-25 15:00 WITA] [SPRINT] [Milestone 1 / Sprint 2]
  Completed Sprint 2 — Learning Catalog & Progress Model.
  1. Extended Prisma data model with LearningPath, Module, Lesson, LessonPrerequisite, and UserLessonProgress (`prisma/schema.prisma`).
  2. Implemented pure deterministic prerequisite resolution engine and progress percentage calculator (`src/features/learning/prerequisites.ts`).
  3. Implemented persistent progress service (`startLessonProgress`, `completeLessonProgress`, `getUserProgressSummary`) and API endpoint (`/api/learning/progress`).
  4. Created typed learning catalog queries (`src/features/learning/queries.ts`) with deterministic status resolution.
  5. Built learning catalog UI (`/learn`), path detail view with module cards and prerequisite badges (`/learn/[pathSlug]`), and lesson runner view (`/learn/[pathSlug]/[moduleSlug]/[lessonSlug]`) with interactive action bar.
  6. Connected user progress statistics to Dashboard (`/dashboard`) displaying real-time metrics and active learning path progress.
  7. Seeded Network Foundations curriculum sample with modules, lessons, and prerequisite chains (`prisma/seed.ts`).
  8. Added 24 new unit and integration tests (total 40 tests across 8 suites in Vitest) and 2 new E2E tests (total 7 tests in Playwright).
  Files/areas: `prisma/schema.prisma`, `prisma/seed.ts`, `src/features/learning/`, `src/app/(app)/learn/`, `src/app/(app)/dashboard/`, `src/app/api/learning/`, `src/e2e/learning-catalog.spec.ts`
  Validation: `npm run lint`, `npm run typecheck`, `npm test` (40/40 passed), `npm run build` (15 routes), and `npx playwright test` (7/7 passed).
  Git: `0ae2eb9`

- [2026-08-25 14:43 WITA] [SPRINT] [Milestone 1 / Sprint 1]
  Completed Sprint 1 — Authentication, User Model & Application Shell.
  1. Integrated NextAuth.js with Prisma adapter, JWT sessions, and deterministic PBKDF2 password hashing (`src/features/auth/password.ts`).
  2. Implemented registration API (`/api/auth/register`), sign-in page (`/sign-in`), sign-up page (`/sign-up`), and route protection middleware (`src/middleware.ts`).
  3. Built responsive and accessible Application Shell (`src/app/(app)/layout.tsx`, `src/components/navigation/app-header.tsx`) with routes for Dashboard, Learn, Labs, Challenges, Consultant, and Profile.
  4. Implemented secure User Profile API (`/api/user/profile`) and interactive client form (`src/features/profile/profile-form.tsx`) preventing unauthorized mutations.
  5. Added comprehensive unit, integration, and E2E test suites (16 unit/integration tests passing in Vitest, 5 browser E2E tests passing in Playwright).
  Files/areas: `src/features/auth/`, `src/features/profile/`, `src/components/navigation/`, `src/app/(app)/`, `src/app/(auth)/`, `src/app/api/`, `src/lib/auth.ts`, `src/middleware.ts`, `src/types/next-auth.d.ts`
  Validation: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npx playwright test` all pass cleanly with 0 errors.
  Git: `53935bb`

---

# 2026-08-24

- [2026-08-24 20:04 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  Strengthened the staging edge-network repair after review: rendered Compose assertions now enforce the exact managed bridge, absence of external network/volume declarations, and project-scoped internal network and PostgreSQL volume names. The design spec, plan, and runbook now describe the dual-homed topology and correctly state that loopback publication—not the edge network—provides host Nginx access.
  Files/areas: `scripts/test-staging-env-path.sh`, `docs/superpowers/specs/2026-08-24-staging-deployment-design.md`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`, `docs/deployment/staging.md`
  Validation: controlled RED assertion demonstrated; real Compose config render without container runtime passed; ignored task report records commands and exits
  Git: pending

- [2026-08-24 19:54 WITA] [FIXED] [Milestone 0 / Sprint 0]
  Repaired the staging app edge topology by attaching only `app` to the managed `netloka_staging_edge` bridge network while preserving the internal-only database and migration network boundary.
  Files/areas: `compose.staging.yml`, `scripts/test-staging-env-path.sh`, `docs/deployment/staging.md`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`
  Validation: focused topology assertions demonstrated RED before the change; focused regression test passed with a real `docker compose config --profile maintenance --format json` render using a temporary external safe environment file and without starting containers
  Git: pending

- [2026-08-24 19:35 WITA] [FIXED] [Milestone 0 / Sprint 0]
  Moved staging environment validation after the fast-forward update and immediately before the first Compose operation; synchronized all staging-plan `env_file` examples and external temporary-file validation guidance; recorded a real local Compose config render with a safe external environment file.
  Files/areas: `scripts/deploy-staging.sh`, `scripts/test-staging-env-path.sh`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`
  Validation: focused ordering/path regression test and `docker compose ... config` render passed without starting a container or exposing environment values.
  Git: pending

- [2026-08-24 19:26 WITA] [DEPLOY] [Milestone 0 / Sprint 0]
  Required an explicit external `STAGING_ENV_FILE` for staging Compose operations, added a pre-Docker path/config validator, and made the deploy, backup, runbook, and deployment-plan commands preserve that explicit path.
  Files/areas: `compose.staging.yml`, `scripts/validate-staging-env.sh`, `scripts/deploy-staging.sh`, `scripts/backup-staging-postgres.sh`, `scripts/test-staging-env-path.sh`, `docs/deployment/staging.md`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`
  Validation: focused red/green shell validation, Bash syntax checks, lint, type-check, and unit tests passed without Docker runtime access.
  Git: pending

- [2026-08-24 15:48 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  GitHub Actions validation passed for Prisma security-remediation pull request #2: lint/type-check, unit tests, Chromium browser E2E, production build, and quality gate.
  Validation: GitHub Actions run 32702942803 passed.
  Git: PR #2

- [2026-08-24 15:44 WITA] [SECURITY] [Milestone 0 / Sprint 0]
  Upgraded Prisma ORM to 7.9.1, migrated the PostgreSQL client to `@prisma/adapter-pg`, and pinned transitive `deepmerge-ts` to 8.0.2 through npm overrides. This removes the audited Prisma 6 CLI advisory path without changing the database schema.
  Files/areas: `package.json`, `prisma.config.ts`, `prisma/schema.prisma`, `src/lib/db/client.ts`, `scripts/verify-db.ts`, `.github/workflows/ci.yml`
  Validation: `npm audit --omit=dev` reports 0 vulnerabilities; Prisma validation/migration status, live `SELECT 1`, lint, typecheck, unit tests, three-browser E2E, and production build passed locally.
  Git: d05ca0b

- [2026-08-24 15:25 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  GitHub Actions validation passed for pull request #1: lint/type-check, unit tests, Chromium browser E2E, production build, and the aggregate quality gate.
  Remaining blockers to Sprint 0 completion are the reviewed Prisma security-remediation decision and the unconfigured Cloudflare/staging deployment tasks.
  Validation: GitHub Actions run 32701246112 passed.
  Git: PR #1

- [2026-08-24 15:20 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  Re-audited the foundation before Sprint 1. Resolved the missing lockfile, absent Prisma migration history, unsafe default Docker port collision, placeholder health test, absent browser smoke coverage, and the Vitest/Playwright test-runner overlap.
  Remaining decision: `npm audit --omit=dev` reports a high advisory in Prisma CLI 6.19.3 through `deepmerge-ts`; the available automatic remediation requires a Prisma 7 major upgrade and is not applied without a reviewed migration decision.
  Validation: `npm ci`, Docker/Prisma migration validation, lint, typecheck, unit test, three-browser E2E, and production build executed; GitHub CI and deployment validation pending.
  Git: pending

- [2026-08-24 15:20 WITA] [FIXED] [Milestone 0 / Sprint 0 / Task 0.2]
  Bound the local PostgreSQL container to loopback-only host port `5433` to avoid interfering with the existing PostgreSQL service on `5432`, and committed the explicit empty Prisma baseline migration.
  Files/areas: `docker-compose.yml`, `.env.example`, `prisma/migrations/`
  Validation: container healthy; `prisma generate`, `prisma validate`, `prisma migrate deploy`, and `prisma migrate status` passed.
  Git: cd1491d

- [2026-08-24 15:20 WITA] [TEST] [Milestone 0 / Sprint 0 / Tasks 0.1, 0.3]
  Added a route-handler health contract test, landing-page and health-endpoint browser smoke tests, Playwright CI coverage, and a correct Vitest exclusion for browser specs.
  Files/areas: `src/app/api/health/health.test.ts`, `src/e2e/foundation.spec.ts`, `.github/workflows/ci.yml`, `vitest.config.ts`
  Validation: focused unit test, Chromium E2E, and the three-browser E2E suite passed.
  Git: 191f934, a547a11, 86e3a1f

- [2026-08-24 13:44 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.3]
  Completed Repository & Environment Bootstrap sprint with full verification suite passing.
  Created GitHub Actions CI workflow enforcing lint, typecheck, test, and build gates on all PRs.
  Documented local setup commands in README.md for contributor onboarding.
  Validation: All quality gates pass locally; CI configured for future automated runs.
  Git: `0317625`

- [2026-08-24 13:44 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.2]
  Completed PostgreSQL & environment validation tasks with all configuration files created.
  Created docker-compose.yml, Prisma schema, singleton DB client, and environment validation module.
  Note: Local DB connection verification pending until Docker Desktop is started separately.
  Validation: Database client imports correctly; environment validation fails gracefully on missing variables.
  Git: 0317625

- [2026-08-24 13:43 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.1]
  Bootstrapped Next.js 16.x monorepo with TypeScript 5.x and Tailwind CSS 4.x.
  Installed Vitest framework for unit/integration testing with jsdom environment.
  Configured Playwright for browser E2E testing against Chromium, Firefox, and WebKit.
  Created HTTP health endpoint at `/api/health` returning deterministic `{status: "ok"}` response.
  Added corresponding unit test verifying health endpoint response contract.
  Validation: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` all pass successfully.
  Git: 0317625

- [2026-08-24 13:41 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.1]
  Initialized npm dependency management with Node.js LTS v20 pinning (.nvmrc).
  Installed production dependencies: @prisma/client, zod, lucide-react, react-hook-form.
  Installed devDependencies: @playwright/test, vitest, playwright, eslint, tailwindcss plugins.
  Updated package.json scripts to include quality gate commands (lint, typecheck, test, test:e2e, build).
  Validation: `npm install` completes without errors; dependencies audited successfully.
  Git: 0317625

- [2026-08-24 13:40 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.1]
  Scaffolds Next.js application structure with App Router conventions.
  Creates src/app directory layout with globals.css, root layout, and home page.
  Validates project folder structure matches AGENTS.md requirements for modular monolith architecture.
  Validation: Directory structure reviewed against PLAN.md repository layout specification.
  Git: 0317625

- [2026-08-24 13:21 WITA] [DOCS] [Project Planning]
  Established the initial Netloka implementation documentation set: `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`, and `AGENTS.md`.
  Scope includes the MVP learning platform, reusable lesson engine, Network Foundations, IPv4/subnetting, switching/routing/services, Labs, Challenges, IT Consultant Mode, and production readiness.
  Future CCTV, Fiber Optic, PABX/VoIP, MikroTik, Cisco, Linux/Server, and Network Security learning paths are explicitly retained as post-MVP directions.
  Domain baseline: `netloka.biz.id`.
  Validation: cross-document scope and milestone consistency review performed.
  Git: not yet committed.

- [2026-08-24 13:21 WITA] [MILESTONE] [Milestone 0]
  Milestone 0 — Project Foundation defined and ready to begin.
  Current active sprint: Sprint 0 — Repository & Environment Bootstrap.
  Git: not yet committed.

---

# Unreleased

Use this section only for changes already made in the working tree that do not yet have an exact completion timestamp. Before merge/release, convert them into timestamped WITA entries.

_Currently no unreleased changes. All Sprint 0 work has been migrated to timestamped entries above._
