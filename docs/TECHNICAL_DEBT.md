# Technical Debt Register & Post-MVP Architecture

Dokumen pencatatan hutang teknis (*technical debt*), area refaktor masa depan, dan rencana transisi ke jalur pembelajaran tingkat lanjut (*Advanced Tracks*).

---

## 1. Status Hutang Teknis Saat Ini (Milestone 7 Aktif / Pra-Peluncuran MVP)

| ID | Kategori | Deskripsi | Dampak | Rekomendasi Resolusi |
|---|---|---|---|---|
| **TD-01** | Middleware | Next.js 16 menandai `src/middleware.ts` sebagai deprecated dan merekomendasikan `proxy`. | Rendah (Warning saat build) | Migrasi menggunakan `@next/codemod middleware-to-proxy` pada siklus maintenance Milestone 7 sebelum peluncuran jika aman terhadap alur autentikasi. |
| **TD-04** | Security Headers | `next.config.ts` dan `Caddyfile` telah menerapkan header keamanan dasar, tetapi Content Security Policy belum dikonfigurasi. | Sedang sebelum production | Rancang dan uji CSP terhadap seluruh aset Next.js, font, script, style, dan media sebelum deployment production. |
| **TD-05** | Deployment | Konfigurasi Docker, Caddy, Cloudflare, backup, dan restore tersedia, tetapi belum diverifikasi pada staging atau production nyata. | Tinggi untuk exit criteria Milestone 7 | Deploy ke staging, jalankan migration/backup/restore/smoke test, lalu deploy dan verifikasi `netloka.biz.id`. |
| **TD-02** | Terminal Sim | Terminal Simulator saat ini menggunakan status state in-memory murni per sesi block. | Rendah | Untuk lab berdurasi panjang, pertimbangkan caching state terminal ke LocalStorage/IndexedDB. |
| **TD-03** | Subnet Visualizer | Visualisasi CIDR subnetting fokus pada IPv4 (/16 hingga /30). | Rendah | Tambahkan dukungan IPv6 visualizer di Milestone pasca-MVP. |

---

## 2. Rencana Jalur Ekstensi Pasca-MVP (*Future Tracks*)

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
