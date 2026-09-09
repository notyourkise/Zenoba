# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Siswa SMK bidang teknologi informasi, mahasiswa, pemula IT infrastructure, serta pembelajar yang mempersiapkan diri untuk peran network engineer, system administrator, cloud/DevOps, cybersecurity, dan teknisi infrastruktur lapangan. Arah yang telah disetujui juga membedakan `INTERNAL_LEARNER` milik operator untuk pengujian kurikulum dan `DEVELOPER` untuk observabilitas serta administrasi terbatas; keduanya hanya dapat ditetapkan melalui VPS CLI.

## Product Purpose

Netloka adalah platform pembelajaran IT infrastructure interaktif yang mengajarkan jaringan, server, Linux, cloud, cybersecurity, dan infrastruktur lapangan melalui interaksi deterministik serta penalaran studi kasus nyata, bukan sekadar bahan bacaan teoritis pasif.

Alur belajar:
`Learn → Interact → Practice → Challenge → Consultant Project`

## Positioning

Platform edukasi IT infrastructure berbahasa Indonesia yang menyatukan:
1. Pembelajaran micro-learning lintas domain melalui blok interaktif yang reusable.
2. Practice Labs mandiri dengan evaluasi deterministik, dimulai dari fondasi networking.
3. Challenges berbasis skenario nyata untuk melatih diagnosis tanpa langkah penyelesaian yang diarahkan.
4. Consultant Projects untuk analisis kebutuhan, BoQ, budgeting, capacity planning, desain teknis, dokumentasi, dan penilaian multidimensi.

Networking merupakan learning domain pertama yang sudah tersedia. Server & Linux, Cybersecurity, Cloud & DevOps, CCTV & Surveillance, Fiber Optic, serta VoIP & PABX ditampilkan sebagai arah pengembangan dan harus diberi status `Soon` sampai implementasinya benar-benar tersedia.

## Operating Context

- Digunakan melalui browser modern (Desktop, Tablet, Mobile) baik di laboratorium komputer sekolah maupun perangkat pribadi di rumah.
- Lingkungan eksekusi terdistribusi dalam container Docker terisolasi tanpa memerlukan instalasi software berat seperti Packet Tracer atau GNS3 di komputer klien.

## Capabilities and Constraints

- **Arsitektur:** Modular monolith berbasis Next.js 16 (script dev/build saat ini memakai Webpack), React 19, Tailwind CSS v4, Prisma ORM, dan PostgreSQL 16.
- **Simulated Terminal Safety:** Semua perintah terminal/CLI dijalankan melalui pure deterministic parser di memori (tidak pernah dieksekusi ke host shell atau SSH).
- **Theming:** Antarmuka saat ini menggunakan dark theme kosmik yang dikunci secara konsisten melalui `next-themes` dan class-based dark variant Tailwind v4. Pengecualian hanya untuk halaman terpisah `/terms` dan `/privacy-policy`: kanvas putih penuh, teks hitam, tanpa emoji, ikon, dekorasi, atau motion; tema aplikasi dan modal autentikasi tetap gelap.
- **Autentikasi & Gamifikasi:** Manajemen akun dengan NextAuth, pencatatan progres per modul, perolehan XP transaksional, dan sertifikat/portofolio proyek konsultan.

## Brand Commitments

- **Nama Brand:** Netloka
- **Domain:** `netloka.biz.id`
- **Palet Utama:** kanvas hitam kosmik, putih untuk hierarki utama, sky blue untuk aksi dan state aktif, amber untuk status `Soon`, Emerald untuk status lulus, serta Rose untuk error/troubleshooting.
- **Tipografi:** Modern geometric sans-serif dengan hierarki visual yang jelas, font monospaced untuk konfigurasi CLI dan tabel routing.

## Evidence on Hand

- Registry kurikulum saat ini mendefinisikan 6 learning paths, 31 modules, 65 lessons, 195 formative quizzes, dan 6 capstones. Jumlah ini berasal dari validasi source registry, bukan query database pengguna atau bukti deployment.
- 7 Modul Interactive Labs dengan validator input deterministik.
- 3 Skenario Troubleshooting Challenges dengan simulator jaringan.
- 5 Studi Kasus Konsultan Proyek TI (Notaris SOHO, Warnet Gaming, Logistik Gudang, Lab SMK TKJ, Gedung Korporat Multi-Lantai).
- Riwayat hasil pengujian ada di `CHANGELOG.md`; jumlah test dan CI yang lulus tidak membuktikan kelengkapan materi atau seluruh perjalanan authenticated.

## Learning Outcomes and Next Quality Program

Disetujui pemilik pada 2026-09-05: mulai dari module **Welcome to Networking** sebagai contoh untuk module berikutnya. Setiap path, module, dan lesson menampilkan **Capaian Pembelajaran** menggunakan kata kerja yang bisa diamati, misalnya "Siswa dapat membedakan jaringan lokal dan akses Internet pada skenario berbagi printer".

Alur yang telah diimplementasikan: introduction/capaian → konsep → contoh terbimbing → visualisasi → interaksi/praktik → quiz → rangkuman → penyelesaian terverifikasi. Quiz lesson dan tes akhir module memakai evidence server-authoritative dan retry/remediation.

Milestones 8–11 telah memperbaiki pengalaman pembelajaran Networking; Milestone 12 menyelesaikan review gate komersial tanpa mengaktifkan pembayaran. Milestone 13 aktif: fondasi developer/internal roles Sprint 34 telah merged tetapi closure findings authorization masih terbuka; developer portal, elevation, dan audit belum dijalankan. Milestone 14 meningkatkan continuity/mastery, dan Milestone 15 menempatkan gateway/deployment/production/live payment paling akhir pada Sprint 42. Lihat [approved design](docs/superpowers/specs/2026-09-07-developer-portal-and-learner-experience-design.md).

## Product Principles

1. **Deterministic Learning:** Setiap interaksi, kalkulasi subnet, dan simulasi routing memberikan hasil evaluasi deterministik yang objektif dan transparan.
2. **Real-World Relevance:** Studi kasus, harga perangkat BoQ (Rupiah), dan skenario troubleshooting mencerminkan kebutuhan nyata industri dan UKK SMK TKJ di Indonesia.
3. **Impeccable Visual Hierarchy:** Antarmuka harus bersih, fokus pada konten pembelajaran, tidak berantakan, dan memberikan feedback visual instan saat pengguna bereksperimen.
4. **Accessible & Responsive:** Nyaman diakses dari monitor sekolah resolusi rendah hingga layar laptop high-DPI dalam mode terang maupun gelap.

## Accessibility & Inclusion

- Dukungan kontras tinggi pada dark mode dan light mode (WCAG AA compliant).
- Navigasi keyboard dan penanda visual focus ring (`focus:ring-2 focus:ring-blue-500`).
- Bahasa Indonesia baku yang komunikatif dan ramah bagi siswa SMK dan pemula.
