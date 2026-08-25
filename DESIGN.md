---
name: Netloka
description: Interactive networking learning platform for SMK TKJ, beginners, and sysadmin aspirants.
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

# Visual Design System: Netloka

## Overview

Netloka menggunakan gaya visual modern, berorientasi teknis namun tetap ramah (*approachable*) bagi siswa SMK TKJ dan pemula networking. Desain mengutamakan kejelasan hierarki data, keterbacaan kode/diagram konfigurasi, dan feedback visual deterministik.

## Colors

Palet warna Netloka dirancang untuk mendukung dual-theme (Light & Dark) dengan kontras tinggi:

- **Netloka Blue (`#2563eb`):** Warna primer untuk aksi utama, link aktif, dan elemen interaktif.
- **Surface & Backgrounds:**
  - Light: `#ffffff` (Canvas), `#f9fafb` (Card/Container), `#f3f4f6` (Sub-container).
  - Dark: `#0a0a0a` (Canvas), `#111827` (Card/Container), `#1f2937` (Sub-container).
- **Aksen Domain:**
  - **Emerald (`#10b981`):** Practice Labs, status lulus (*Pass*), reachability tercapai.
  - **Rose (`#ef4444`):** Troubleshooting Challenges, status gagal, subnet collision, packet dropped.
  - **Amber (`#f59e0b`):** Peringatan kapasitas, budget warning, status pending.
  - **Indigo (`#6366f1`):** Mode Konsultan TI, portofolio proyek, skor proposal.

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

## Layout

- **Grid System:** 12-kolom responsif dengan `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Spacing:** Menggunakan Tailwind v4 Flex `gap-*` standar (`gap-1.5`, `gap-3`, `gap-4`, `gap-6`, `gap-8`) untuk memastikan konsistensi ritme vertikal dan horizontal.
- **Navbar Layout:** 3-zona simetris:
  - Kiri: Brand Logo
  - Tengah: Navigation Menu Dropdown
  - Kanan: User Controls & Dark Mode Toggle

## Elevation & Depth

- **Border Hierarchy:** Tipis dan elegan (`border border-gray-200/80 dark:border-gray-800`).
- **Shadows:**
  - Card biasa: `shadow-sm`
  - Dropdown & Modal: `shadow-xl dark:shadow-2xl`
  - CTA Button: `shadow-lg shadow-blue-500/20`
- **Glassmorphism:** Sticky headers menggunakan `backdrop-blur bg-white/95 dark:bg-gray-900/95`.

## Shapes

- **Badges & Pills:** `rounded-full` dengan padding `px-3 py-1 text-xs font-semibold`.
- **Buttons & Interactive Triggers:** `rounded-lg` hingga `rounded-xl`.
- **Cards & Modals:** `rounded-2xl` dengan border halus.

## Components

- **NavigationMenu:** Menu berbasis dropdown dengan panel tengah `left-1/2 -translate-x-1/2`.
- **ModeToggle:** Switch tema instan Light/Dark/System dengan icon Lucide.
- **Terminal Simulator:** Console bernuansa dark mode (`bg-gray-950 text-emerald-400 font-mono`) dengan prompt `netloka>`.
- **Interactive Quiz & Lab Evaluator:** Panel pilihan ganda/input CIDR dengan indikator feedback instan (hijau untuk benar, merah untuk salah beserta penjelasannya).

## Do's and Don'ts

### Do's
- Gunakan `gap-*` untuk layout flex dan grid, bukan utilitas legacy `space-x-*`.
- Selalu sediakan pasangan warna dark mode (`dark:bg-gray-900 dark:text-white dark:border-gray-800`).
- Gunakan font mono untuk nilai teknis (IP address, CIDR prefix, port interface, CLI syntax).
- Berikan state hover, focus, dan transition yang halus pada seluruh elemen yang dapat diklik.

### Don'ts
- Jangan hardcode warna tanpa kelas Tailwind atau token yang sesuai.
- Jangan gunakan terminal asli (exec/spawn); selalu gunakan parser simulasi deterministik.
- Jangan gunakan layout asimetris tanpa penyeimbang pada navbar utama.
