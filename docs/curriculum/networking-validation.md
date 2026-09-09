# Comprehensive Networking Curriculum Validation Report

**Document Version:** 1.1
**Timestamp:** 2026-09-09 WITA
**Scope:** Milestone 11 (Consultant Learning Path & Curriculum Validation) — Sprint 32  
**Curriculum Status:** Full 6-Path Networking Track Complete & Verified (31 Modules, 65 Lessons, 195 Formative Quizzes, 6 Capstones)

---

## 1. Executive Summary

This report documents the end-to-end curriculum audit and pedagogical validation of Netloka's flagship Networking curriculum. The curriculum has been designed and implemented in accordance with [AGENTS.md](../../AGENTS.md), [ROADMAP.md](../../ROADMAP.md), and [docs/curriculum/networking-outcomes.md](networking-outcomes.md) to serve SMK Teknik Komputer dan Jaringan (TKJ) students, beginners, and junior IT technicians.

The curriculum enforces Netloka's core learning doctrine:
$$\text{Learn} \longrightarrow \text{Interact} \longrightarrow \text{Practice} \longrightarrow \text{Challenge} \longrightarrow \text{Consultant Project}$$

Every lesson provides deterministic interactions and real-world reasoning rather than passive long-form reading. All formative quizzes are server-evaluated to eliminate client answer leakage.

---

## 2. Curriculum Topology & Path Matrix Overview

| Path | Title | Modules | Lessons | Quizzes | Capstone / Practical Lab |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Path 1** | Network Foundations | 8 | 19 | 57 | First Day as IT Support |
| **Path 2** | IPv4 & Subnetting | 5 | 10 | 30 | School Subnetting & VLSM Allocation |
| **Path 3** | Switching & LAN | 4 | 8 | 24 | VLAN Segmentation & Trunk Diagnosis |
| **Path 4** | Routing & Network Services | 5 | 10 | 30 | Service & Routing Fault Isolation |
| **Path 5** | Wireless & Troubleshooting | 4 | 8 | 24 | Safe Diagnostic Terminal & Wi-Fi Optimization |
| **Path 6** | Network Planning & IT Consultant | 5 | 10 | 30 | Consultant Capstone & Multi-Dimensional Portfolio |
| **Total** | **Full Networking Curriculum** | **31** | **65** | **195** | **6 Capstones / Simulations** |

---

## 3. Path-by-Path Detailed Validation

### Path 1: Network Foundations (M1–M8, 19 Lessons)
- **Path Outcome:** Siswa dapat menjelaskan hubungan perangkat, media, dan aliran data untuk membaca serta menganalisis jaringan lokal sederhana.
- **Module Structure:**
  1. `welcome-to-networking`: P1-L01 (Apa Itu Jaringan Komputer), P1-L02 (Perangkat Jaringan di Sekitar Kita), P1-L03 (Berbagi Sumber Daya dalam Jaringan), P1-L04 (Bagaimana Perangkat Saling Berbicara)
  2. `types-of-networks`: P1-L05 (LAN, MAN, WAN), P1-L06 (Rumah, Sekolah, Perusahaan)
  3. `client-server`: P1-L07 (Peran Client & Server), P1-L08 (Request dan Response)
  4. `network-topology`: P1-L09 (Bus, Star, Ring), P1-L10 (Dampak Kegagalan Topologi)
  5. `network-devices`: P1-L11 (NIC, Switch, Router, AP), P1-L12 (Modem, Firewall, Server)
  6. `physical-media`: P1-L13 (Kabel Tembaga & Nirkabel), P1-L14 (RJ-45 & Standar T568A/B), P1-L15 (Pengenalan Serat Optik)
  7. `how-data-travels`: P1-L16 (Bit, Frame, Packet), P1-L17 (Unicast, Broadcast, Multicast)
  8. `osi-tcpip`: P1-L18 (7 Lapisan OSI), P1-L19 (TCP/IP & Enkapsulasi)
- **Assessment Evidence:** 57 formative multiple-choice questions in `foundations.server.ts`.
- **Capstone:** *First Day as IT Support* — interactive diagnosis of faulty link, device inventory, and local vs Internet reachability.

### Path 2: IPv4 & Subnetting (M1–M5, 10 Lessons)
- **Path Outcome:** Siswa dapat menghitung dan menyusun pengalamatan IPv4 yang memenuhi kapasitas host, tidak tumpang tindih, dan memiliki network/broadcast/gateway yang konsisten.
- **Module Structure:**
  1. `binary-ipv4`: P2-L01 (Biner 8-Bit), P2-L02 (Struktur IPv4)
  2. `address-types`: P2-L03 (IP Public vs Private), P2-L04 (Loopback & APIPA)
  3. `mask-cidr`: P2-L05 (Subnet Mask & Pembagian Bit), P2-L06 (Notasi CIDR / Prefix)
  4. `subnet-calc`: P2-L07 (Network & Broadcast Address), P2-L08 (Usable Host Range & Kapasitas)
  5. `subnetting-vlsm`: P2-L09 (Subnetting FLSM), P2-L10 (Variable Length Subnet Mask - VLSM)
- **Assessment Evidence:** 30 deterministic questions in `subnetting.server.ts`.
- **Capstone:** Multi-room school subnet allocation with non-overlapping range verification and gateway consistency.

### Path 3: Switching & LAN (M1–M4, 8 Lessons)
- **Path Outcome:** Siswa dapat menjelaskan forwarding Layer 2 dan merancang segmentasi VLAN serta koneksi access/trunk yang sesuai kebutuhan jaringan lokal.
- **Module Structure:**
  1. `ethernet-mac`: P3-L01 (Ethernet Frame & MAC Address), P3-L02 (MAC Address Learning)
  2. `arp-broadcast`: P3-L03 (Protokol ARP Request & Reply), P3-L04 (Komunikasi Lokal vs Remote Gateway)
  3. `vlan-segmentation`: P3-L05 (Broadcast Domain & Isolasi), P3-L06 (Keanggotaan VLAN ID)
  4. `access-trunk`: P3-L07 (Access Port & Tagging 802.1Q), P3-L08 (Trunk Port & Mismatch Trunk)
- **Assessment Evidence:** 24 questions in `switching.server.ts`.
- **Capstone:** Switching & VLAN Simulator with broadcast domain isolation check and trunk native VLAN consistency.

### Path 4: Routing & Network Services (M1–M5, 10 Lessons)
- **Path Outcome:** Siswa dapat menelusuri jalur antar-subnet, konfigurasi layanan dasar, dan penyebab kegagalan akses layanan menggunakan bukti routing, DHCP, DNS, dan NAT.
- **Module Structure:**
  1. `gateway-routing`: P4-L01 (Default Gateway), P4-L02 (Routing Table & Longest Prefix Match)
  2. `static-intervlan`: P4-L03 (Static Route & Default Route), P4-L04 (Inter-VLAN Routing Router-on-a-Stick)
  3. `dhcp-dns`: P4-L05 (Proses DHCP DORA), P4-L06 (DNS Name Resolution)
  4. `nat-pat`: P4-L07 (Network Address Translation - NAT), P4-L08 (Port Address Translation - PAT)
  5. `transport-services`: P4-L09 (TCP, UDP, dan ICMP), P4-L10 (Port Standar & Troubleshooting Layanan)
- **Assessment Evidence:** 30 questions in `routing.server.ts`.
- **Capstone:** Bounded scenario troubleshooting addressing, route, DNS, and PAT service failures.

### Path 5: Wireless & Troubleshooting (M1–M4, 8 Lessons)
- **Path Outcome:** Siswa dapat memilih konfigurasi wireless berdasarkan kebutuhan dan menyelesaikan gangguan melalui observasi, hipotesis, pengujian, serta verifikasi hasil.
- **Module Structure:**
  1. `wireless-basics`: P5-L01 (Frekuensi 2.4 GHz, 5 GHz, 6 GHz), P5-L02 (Channel & Interferensi)
  2. `wireless-security`: P5-L03 (WPA2 vs WPA3 Personal/Enterprise), P5-L04 (SSID & Guest Network Isolation)
  3. `diagnostic-tools`: P5-L05 (ipconfig, ping, dan verifikasi IP), P5-L06 (nslookup, traceroute, dan netstat)
  4. `troubleshooting-methodology`: P5-L07 (Metode Troubleshooting & Bukti), P5-L08 (Verifikasi Solusi & Dokumentasi)
- **Assessment Evidence:** 24 questions in `wireless.server.ts`.
- **Capstone:** Multi-issue network diagnosis using the safe simulated terminal with command-line proof verification.

### Path 6: Network Planning & IT Consultant (M1–M5, 10 Lessons)
- **Path Outcome:** Siswa dapat menyusun proposal jaringan yang memenuhi kebutuhan klien, anggaran, kapasitas, segmentasi, dan dokumentasi dengan alasan teknis yang dapat diverifikasi.
- **Module Structure:**
  1. `client-requirements`: P6-L01 (Wawancara & Identifikasi Kebutuhan), P6-L02 (Kriteria Penerimaan Teknis)
  2. `capacity-procurement`: P6-L03 (Perhitungan Kapasitas Port & PoE), P6-L04 (Penyusunan Bill of Quantities - BoQ)
  3. `topology-ip-vlan`: P6-L05 (Perancangan Topologi Hierarkis), P6-L06 (Alokasi Subnet IP & VLAN)
  4. `proposal-review`: P6-L07 (Penyusunan Dokumen Proposal), P6-L08 (Review & Evaluasi Kelayakan Proposal)
  5. `applied-cases`: P6-L09 (Studi Kasus 1: SOHO Notaris), P6-L10 (Studi Kasus 2-5: Komparasi Kasus Lanjutan)
- **Assessment Evidence:** 30 questions in `planning.server.ts`.
- **Capstone:** Full Consultant Workspace & Multi-Dimensional Proposal Evaluation (Budget, Port Capacity, PoE Capacity, VLAN Compliance, ISP Uplink/WAN Redundancy).

---

## 4. Prerequisite Graph & Proof Gating Verification

1. **Course Chaining:**
   - Path 1 is unlocked for all learners.
   - Path 2 requires Path 1 completion.
   - Path 3 requires Path 2 completion.
   - Path 4 requires Path 3 completion.
   - Path 5 requires Path 4 completion.
   - Path 6 requires Path 5 completion.
2. **Linear Module & Lesson Progression:**
   - Modules within each path are chained sequentially (`prerequisiteModuleId`).
   - Lessons within each module enforce linear progression (`prerequisiteLessonId`).
   - No cyclic dependencies exist in the graph.
3. **Consultant Mode Prerequisite Proof Gating:**
   - The consultant catalog (`/consultant`) enforces that Case 1 (*Kantor Notaris & PPAT SOHO*) is the foundational case.
   - Cases 2 to 5 (*Warnet Esports*, *Logistik*, *Lab SMK*, *Gedung Korporat 3 Lantai*) are locked until the learner passes Case 1 with a composite score $\ge 70/100$.
   - The submit route (`/api/consultant/[caseSlug]/submit`) verifies foundational completion server-side, returning HTTP 403 if unearned.

---

## 5. Security & Safety Compliance

- **Zero Client Answer Leakage:** Lesson definitions only export presentation content. Correct answer indexes, keys, and rationales remain isolated in `*.server.ts` modules.
- **Simulated Terminal Isolation:** Learner terminal commands are evaluated deterministically in memory. No shell execution (`exec`, `spawn`, `Docker`, `SSH`) is permitted.
- **Rubric Versioning:** All evaluated proposals record `rubricVersion: "1.0"` in composite scores to ensure historical proposals remain immutable when rubrics evolve.
- **Visual Design Compliance (Section 5.6):** Strictly zero decorative icons or emojis exist in cards, badges, and CTA buttons across the learning and consultant interfaces.

---

## 6. Verification Status

- **Unit Tests:** All content registry tests, assessment bank tests, and procurement engine tests pass.
- **End-to-End Tests:** Playwright suite `consultant-learning.spec.ts` verifies lesson navigation, formative quizzes, prerequisite gating, proposal submission, and portfolio record rendering.
- **Prisma Schema & Database Seed:** deterministic seed covers 6 learning paths, 31 modules, 65 lessons, and 5 consultant cases; the current counts were verified from the typed source registry.
- **Build & Quality Gates:** TypeScript typecheck, ESLint, Vitest, and Next.js production build pass cleanly.

---
*Report certified for Netloka Milestone 11 closure.*
