# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Siswa SMK jurusan TKJ (Teknik Komputer dan Jaringan), pemula yang baru mempelajari networking, dan pembelajar/calon network engineer yang sedang mempersiapkan diri untuk uji kompetensi kejuruan (UKK) serta sertifikasi praktis jaringan (CCNA/MTCNA).

## Product Purpose

Netloka adalah platform pembelajaran jaringan komputer interaktif yang mengajarkan konsep fondasi hingga tingkat lanjutan melalui interaksi deterministik dan penalaran studi kasus nyata, bukan sekadar bahan bacaan teoritis pasif.

Alur belajar:
`Learn → Interact → Practice → Challenge → Consultant Project`

## Positioning

Satu-satunya platform edukasi jaringan berbahasa Indonesia yang menggabungkan:
1. Pembelajaran konsep micro-learning dengan blok diagram interaktif.
2. 7 Practice Labs mandiri dengan evaluasi deterministik (Subnetting, IP Config, VLAN 802.1Q, Routing LPM, Packet Flow, DHCP/DNS, Terminal CLI).
3. Troubleshooting skenario kasus nyata di mana pengguna mendiagnosa dan memperbaiki kerusakan jaringan.
4. Mode Konsultan TI lengkap dengan perancangan Bill of Quantities (BoQ), kalkulasi budget, evaluasi kapasitas port/bandwidth, perancangan IP/VLAN, dan penilaian otomatis berbasis rubrik 5 dimensi.

## Operating Context

- Digunakan melalui browser modern (Desktop, Tablet, Mobile) baik di laboratorium komputer sekolah maupun perangkat pribadi di rumah.
- Lingkungan eksekusi terdistribusi dalam container Docker terisolasi tanpa memerlukan instalasi software berat seperti Packet Tracer atau GNS3 di komputer klien.

## Capabilities and Constraints

- **Arsitektur:** Modular monolith berbasis Next.js 16 (Turbopack), React 19, Tailwind CSS v4, Prisma ORM, dan PostgreSQL 16.
- **Simulated Terminal Safety:** Semua perintah terminal/CLI dijalankan melalui pure deterministic parser di memori (tidak pernah dieksekusi ke host shell atau SSH).
- **Theming:** Dukungan Dark Mode dan Light Mode terintegrasi penuh melalui `next-themes` dan class-based dark variant Tailwind v4.
- **Autentikasi & Gamifikasi:** Manajemen akun dengan NextAuth, pencatatan progres per modul, perolehan XP transaksional, dan sertifikat/portofolio proyek konsultan.

## Brand Commitments

- **Nama Brand:** Netloka
- **Domain:** `netloka.biz.id`
- **Palet Utama:** Netloka Blue (`#2563eb`), Slate/Gray dark surface, Emerald untuk status aktif/lulus, Rose untuk error/troubleshooting, Indigo untuk Mode Konsultan.
- **Tipografi:** Modern geometric sans-serif dengan hierarki visual yang jelas, font monospaced untuk konfigurasi CLI dan tabel routing.

## Evidence on Hand

- 5 Learning Paths kurikulum jaringan lengkap (Dasar, TCP/IP, IPv4 Subnetting, Services & NAT, Wireless & Troubleshooting).
- 7 Modul Interactive Labs dengan validator input deterministik.
- 3 Skenario Troubleshooting Challenges dengan simulator jaringan.
- 5 Studi Kasus Konsultan Proyek TI (Notaris SOHO, Warnet Gaming, Logistik Gudang, Lab SMK TKJ, Gedung Korporat Multi-Lantai).
- 22 Test Suite Vitest (107 unit & integration tests) lolos 100%.

## Product Principles

1. **Deterministic Learning:** Setiap interaksi, kalkulasi subnet, dan simulasi routing memberikan hasil evaluasi deterministik yang objektif dan transparan.
2. **Real-World Relevance:** Studi kasus, harga perangkat BoQ (Rupiah), dan skenario troubleshooting mencerminkan kebutuhan nyata industri dan UKK SMK TKJ di Indonesia.
3. **Impeccable Visual Hierarchy:** Antarmuka harus bersih, fokus pada konten pembelajaran, tidak berantakan, dan memberikan feedback visual instan saat pengguna bereksperimen.
4. **Accessible & Responsive:** Nyaman diakses dari monitor sekolah resolusi rendah hingga layar laptop high-DPI dalam mode terang maupun gelap.

## Accessibility & Inclusion

- Dukungan kontras tinggi pada dark mode dan light mode (WCAG AA compliant).
- Navigasi keyboard dan penanda visual focus ring (`focus:ring-2 focus:ring-blue-500`).
- Bahasa Indonesia baku yang komunikatif dan ramah bagi siswa SMK dan pemula.
