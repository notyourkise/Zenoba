---
name: Zenoba
description: Interactive IT infrastructure learning platform for students, beginners, and aspiring practitioners.
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-light: "#eff6ff"
  primary-dark: "#1e3a8a"
  background-light: "#ffffff"
  background-dark: "#0a0a0a"
  surface-light: "#f9fafb"
  surface-dark: "#111827"
  border-light: "#e5e7eb"
  border-dark: "#1f2937"
  text-light-primary: "#111827"
  text-light-secondary: "#4b5563"
  text-dark-primary: "#f9fafb"
  text-dark-secondary: "#9ca3af"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
  indigo-consultant: "#6366f1"
  legal-background: "#ffffff"
  legal-text: "#000000"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  code:
    fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  legal-heading:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "clamp(2rem, 6vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  legal-section:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 650
    lineHeight: 1.4
  legal-body:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1rem"
    lineHeight: 1.8
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background-light}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-surface:
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Visual Design System: Zenoba

## Overview

Zenoba menggunakan gaya visual modern, berorientasi IT infrastructure namun tetap ramah bagi siswa, pemula, dan calon praktisi. Desain mengutamakan kejelasan hierarki data, keterbacaan kode/diagram konfigurasi, dan feedback visual deterministik tanpa membatasi identitas produk pada networking saja.

Halaman `/terms` dan `/privacy-policy` merupakan pengecualian lokal untuk membaca dokumen legal: kanvas putih penuh dan teks hitam tanpa dekorasi. Pengecualian ini tidak mengganti identitas dark theme aplikasi atau tampilan modal autentikasi.

## Colors

Palet warna Zenoba dirancang untuk mendukung dual-theme (Light & Dark) dengan kontras tinggi:

- **Zenoba Blue (`#2563eb`):** Warna primer untuk aksi utama, link aktif, dan elemen interaktif.
- **Surface & Backgrounds:**
  - Light: `#ffffff` (Canvas), `#f9fafb` (Card/Container), `#f3f4f6` (Sub-container).
  - Dark: `#0a0a0a` (Canvas), `#111827` (Card/Container), `#1f2937` (Sub-container).
- **Aksen Domain:**
  - **Emerald (`#10b981`):** Practice Labs, status lulus (*Pass*), reachability tercapai.
  - **Rose (`#ef4444`):** Troubleshooting Challenges, status gagal, subnet collision, packet dropped.
  - **Amber (`#f59e0b`):** Peringatan kapasitas, budget warning, status pending.
  - **Indigo (`#6366f1`):** Mode Konsultan TI, portofolio proyek, skor proposal.

**Aturan Kanvas Legal.** Hanya `/terms` dan `/privacy-policy` menggunakan `colors.legal-background` dan `colors.legal-text`, termasuk tautan. Keduanya tetap putih-hitam ketika tema aplikasi gelap; seleksi teks membalik pasangan warna tersebut. Pengecualian berhenti berlaku saat meninggalkan route legal.

## Typography

- **Font Utama:** Geist Sans (`var(--font-geist-sans)`). Digunakan untuk semua heading, navigasi, deskripsi, dan tombol.
- **Font Monospaced:** Geist Mono (`var(--font-geist-mono)`). Digunakan untuk terminal CLI, subnet mask, IP address, MAC address, konfigurasi switch/router, dan tabel routing.
- **Hierarki Skala:**
  - **Hero Title:** `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight`
  - **Page Heading:** `text-2xl sm:text-3xl font-bold tracking-tight`
  - **Card Title:** `text-lg font-bold`
  - **Section Label:** `text-xs font-bold uppercase tracking-wider`
  - **Body Copy:** `text-sm sm:text-base leading-relaxed`
  - **Caption & Meta:** `text-xs text-gray-500 dark:text-gray-400`

- **Dokumen Legal:** Gunakan peran Geist Sans `typography.legal-heading` untuk h1, `typography.legal-section` untuk h2, dan `typography.legal-body` untuk isi. Skala baca ini khusus halaman legal, bukan pengganti tipografi aplikasi.

## Layout

- **Grid System:** 12-kolom responsif dengan `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Spacing:** Menggunakan Tailwind v4 Flex `gap-*` standar (`gap-1.5`, `gap-3`, `gap-4`, `gap-6`, `gap-8`) untuk memastikan konsistensi ritme vertikal dan horizontal.
- **Navbar Layout:** 3-zona simetris:
  - Kiri: Brand Logo
  - Tengah: `Learn`, `Labs`, `Challenges`, dan `Consultant` dengan katalog domain IT infrastructure
  - Kanan: User Controls atau tombol autentikasi

Domain yang belum tersedia ditampilkan sebagai item noninteraktif dengan label `Soon`. Jangan membuat tautan atau route placeholder untuk domain tersebut.

### Planned role-specific workspaces

- Satu form login melayani semua akun; role database menentukan tujuan setelah login, bukan pilihan role di form.
- `LEARNER` dan `INTERNAL_LEARNER` memakai workspace learner yang memprioritaskan lanjut belajar, antrean, progres, mastery, dan remediation.
- `DEVELOPER` memakai shell `/developer` terpisah yang memprioritaskan system/user/package/curriculum health; jangan menampilkan kartu progres belajar learner.
- Developer web tetap read-only untuk curriculum dan system operations. Aksi grant/revoke entitlement harus tampil sebagai alur terpisah dengan elevated authentication, reason tertulis, konfirmasi target/paket, serta hasil audit.
- Jangan menyediakan kontrol UI untuk promosi role. Empty/loading/error/denied states wajib eksplisit, responsif, dan dapat dioperasikan dengan keyboard.

- **Layout Legal:** Satu kolom terpusat selebar `min(100%, 74ch)`, gutter horizontal (1.5rem), tinggi minimum (100svh), serta scrollbar native tanpa smooth scrolling. Padding atas/bawah (2rem/4rem) menjadi (3rem/6rem) mulai lebar viewport (768px). Navigasi kembali mendahului artikel; tautan antardokumen mengikutinya. Tidak memakai navbar atau footer marketing di halaman legal.

## Elevation & Depth

- **Border Hierarchy:** Tipis dan elegan (`border border-gray-200/80 dark:border-gray-800`).
- **Shadows:**
  - Card biasa: `shadow-sm`
  - Dropdown & Modal: `shadow-xl dark:shadow-2xl`
  - CTA Button: `shadow-lg shadow-blue-500/20`
- **Glassmorphism:** Sticky headers menggunakan `backdrop-blur bg-white/95 dark:bg-gray-900/95`.

- **Pengecualian Legal:** Halaman legal tetap datar tanpa shadow, glow, gradien, panel dekoratif, atau motion; hierarki berasal dari tipografi dan spasi.

## Shapes

- **Badges & Pills:** `rounded-full` dengan padding `px-3 py-1 text-xs font-semibold`.
- **Buttons & Interactive Triggers:** `rounded-lg` hingga `rounded-xl`.
- **Cards & Modals:** `rounded-2xl` dengan border halus.

## Components

- **NavigationMenu:** Menu berbasis dropdown dengan panel tengah `left-1/2 -translate-x-1/2`.
- **Catalog Status:** Label teks `Soon` berwarna amber; status tidak boleh disampaikan hanya melalui warna.
- **Terminal Simulator:** Console bernuansa dark mode (`bg-gray-950 text-emerald-400 font-mono`) dengan prompt `zenoba>`.
- **Interactive Quiz & Lab Evaluator:** Panel pilihan ganda/input CIDR dengan indikator feedback instan (hijau untuk benar, merah untuk salah beserta penjelasannya).
- **Navigasi Legal:** Tautan teks hitam selalu bergaris bawah, offset garis (0.22em), ketebalan hover (2px), serta outline focus-visible (2px) dengan offset (4px). Label `Back to Zenoba`, `Terms`, dan `Privacy Policy` tidak memakai ikon.
- **Tautan Legal Autentikasi:** Modal login/register tetap gelap dengan tautan teks bahasa Inggris `Terms` dan `Privacy Policy`, bergaris bawah dan memiliki penanda fokus. Keduanya memakai `target="_blank"` dan `rel="noopener noreferrer"`, disertai pemberitahuan tab baru agar isian modal tetap tersedia. Footer marketing menyediakan tautan langsung ke kedua route tanpa membuka tab baru.

## Do's and Don'ts

### Do's
- Gunakan `gap-*` untuk layout flex dan grid, bukan utilitas legacy `space-x-*`.
- Selalu sediakan pasangan warna dark mode (`dark:bg-gray-900 dark:text-white dark:border-gray-800`), kecuali kedua route legal yang mengikuti Aturan Kanvas Legal.
- Gunakan font mono untuk nilai teknis (IP address, CIDR prefix, port interface, CLI syntax).
- Berikan state hover, focus, dan transition yang halus pada seluruh elemen yang dapat diklik; tautan halaman legal tetap memiliki hover/focus tanpa transition atau motion.

### Don'ts
- Jangan hardcode warna tanpa kelas Tailwind atau token yang sesuai.
- Jangan gunakan terminal asli (exec/spawn); selalu gunakan parser simulasi deterministik.
- Jangan gunakan layout asimetris tanpa penyeimbang pada navbar utama.
- Jangan tambahkan emoji, ikon, ilustrasi, kartu, badge, atau dekorasi pada `/terms` dan `/privacy-policy`; jangan perluas pengecualian putih-hitam ini ke halaman aplikasi lainnya.
