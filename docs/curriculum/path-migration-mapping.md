# Path Migration & Legacy Curriculum Mapping Contract

**Status:** Reviewed Architectural Contract (Milestone 9 / Sprint 26)  
**Target Execution:** Milestone 10 (Sprints 27–30) & Milestone 11 (Sprints 31–32)  
**Governing Documents:** [AGENTS.md](../../AGENTS.md), [ROADMAP.md](../../ROADMAP.md), [PLAN.md](../../PLAN.md), [Networking Outcome Matrix](networking-outcomes.md)  
**Last Updated:** 2026-09-06 WITA  

---

## 1. Executive Summary & Purpose

Netloka is transitioning from its initial lightweight prototype seed (15 lessons across 5 paths) to the authoritative, outcome-driven SMK TKJ Networking Curriculum (65 comprehensive lessons across 6 paths). 

Milestone 8 and Milestone 9 successfully restructured and authored **Path 1 (Network Foundations)** with:
- 8 modules, 19 fully authored lessons, 45 server-validated formative quizzes, and zero placeholder content.
- Complete alignment of *First Day as IT Support* as the certified Path Final capstone challenge.

Before executing **Milestone 10 (Core Networking Curriculum & Applied Practice)** which expands Paths 2–5, this migration contract establishes a strict operational guarantee:
1. **Zero Data Loss:** Existing learner completion records (`UserLessonProgress`) and prerequisite dependencies must be preserved or safely mapped.
2. **URL Backward Compatibility:** All existing learning URLs must continue resolving transparently without breaking bookmarks, external references, or active browser tabs.
3. **Strict Free Access Policy:** All core networking paths (Paths 1 through 5) are guaranteed **100% FREE** for learners and students. Restructuring will never introduce commercial paywalls or entitlement requirements to foundational networking content.

---

## 2. Legacy Curriculum Inventory (Inspected Baseline)

The table below catalogs every legacy module and lesson currently seeded in `prisma/seed.ts` across Paths 2, 3, 4, and 5:

| Path Slug | Module Slug | Module Title | Lesson Slug | Lesson Title | XP | Content Type / Interactive Blocks |
|---|---|---|---|---|---|---|
| `ipv4-subnetting` | `binary-ipv4-structure` | 1. Biner & Struktur IPv4 | `binary-fundamentals` | Konversi Biner ke Desimal | 75 | `binary_converter`, reward block |
| `ipv4-subnetting` | `subnet-calculations` | 2. Kalkulasi Subnetting | `subnet-calculator-lab` | Kalkulator Subnet & Pembagian Host | 100 | `subnet_calculator`, `subnet_practice` |
| `switching-vlan-routing` | `switching-and-arp` | 1. Switching & Protokol ARP | `arp-resolution-flow` | Proses Resolusi Address Resolution Protocol (ARP) | 100 | `arp_visualizer` |
| `switching-vlan-routing` | `vlan-and-routing` | 2. Segmentasi VLAN & Routing Table | `vlan-segmentation-practice` | Konfigurasi Port VLAN & Evaluasi Routing | 120 | `vlan_builder`, `routing_table` |
| `network-services` | `dhcp-and-dns-services` | 1. Layanan DHCP & DNS | `dhcp-dora-process` | Proses 4-Tahap DHCP (DORA) | 100 | `dhcp_dora` |
| `network-services` | `dhcp-and-dns-services` | 1. Layanan DHCP & DNS | `dns-query-resolution` | Hirarki Resolusi Domain DNS | 100 | `dns_query` |
| `network-services` | `nat-pat-security` | 2. NAT/PAT & Port Security | `nat-pat-translation` | Network Address Translation (NAT/PAT) | 100 | `nat_visualizer` |
| `wireless-troubleshooting` | `wireless-technologies` | 1. Teknologi Wi-Fi & Nirkabel | `wifi-bands-and-security` | Frekuensi 2.4GHz vs 5GHz & WPA3 | 100 | Text explanation, Callout |
| `wireless-troubleshooting` | `cli-troubleshooting-tools` | 2. Diagnostik Jaringan & CLI | `terminal-diagnostics-lab` | Simulasi Perintah Diagnostik Jaringan | 150 | `terminal`, `icmp_ping` |

---

## 3. Destination Mapping Architecture (Milestones 10 & 11)

In Milestone 10, the curriculum structure will be refined to provide modular pedagogy. Specifically, the monolithic `switching-vlan-routing` will be cleanly separated into **Path 3 (Switching & LAN)** and **Path 4 (Routing & Network Services)**, matching the industrial standard separation between Layer 2 switching and Layer 3 routing/services.

### 3.1 Path 2: IPv4 & Subnetting (Milestone 10 / Sprint 27)

| Legacy Source Slug | Target Planned Lesson ID | Target Module & Lesson Slug | Migration Action |
|---|---|---|---|
| `binary-fundamentals` | `P2-L01`, `P2-L02` | `biner-dan-ipv4` / `biner-8-bit`, `struktur-ipv4` | **Expand & Split:** Migrate interactive `binary_converter` into P2-L01; add structured 32-bit anatomy concepts and formative quizzes. |
| `subnet-calculator-lab` | `P2-L07`, `P2-L08` | `kalkulasi-subnet` / `network-broadcast`, `host-range` | **Integrate with Guided Practice:** Keep `subnet_calculator` and `subnet_practice` as interactive laboratory blocks in P2-M4; link deterministic domain scoring. |
| *(New Planned)* | `P2-L03`, `P2-L04` | `jenis-alamat` / `public-private`, `loopback-apipa` | **New Content:** Author dedicated lessons for address categories and APIPA auto-configuration. |
| *(New Planned)* | `P2-L05`, `P2-L06` | `mask-dan-cidr` / `subnet-mask`, `cidr-notation` | **New Content:** Author bitmasking and prefix conversions. |
| *(New Planned)* | `P2-L09`, `P2-L10` | `subnetting-dan-vlsm` / `pembagian-subnet`, `vlsm-design` | **New Content:** Author equal subnetting and VLSM allocation scenarios. |

### 3.2 Path 3: Switching & LAN (Milestone 10 / Sprint 28)

*Note: Path slug transitions from `switching-vlan-routing` to `switching-lan` while maintaining full redirect aliases.*

| Legacy Source Slug | Target Planned Lesson ID | Target Module & Lesson Slug | Migration Action |
|---|---|---|---|
| `arp-resolution-flow` | `P3-L03`, `P3-L04` | `arp-dan-broadcast` / `arp-request-reply`, `local-remote-destination` | **Retain & Contextualize:** Preserve `arp_visualizer` interactive block; add gateway vs local ARP destination decision logic. |
| `vlan-segmentation-practice` (Part A: VLAN) | `P3-L05`, `P3-L07` | `vlan-dan-segmentasi` / `broadcast-domain-vlan`, `access-trunk-ports` | **Extract Layer 2 VLAN:** Move `vlan_builder` block into P3-M3 and P3-M4; isolate from L3 routing. |
| *(New Planned)* | `P3-L01`, `P3-L02` | `ethernet-dan-mac` / `ethernet-mac-address`, `mac-learning-table` | **New Content:** Author Ethernet frame format and switch CAM table learning algorithms. |
| *(New Planned)* | `P3-L06`, `P3-L08` | `access-trunk` / `vlan-membership`, `8021q-trunk-tagging` | **New Content:** Author access vs 802.1Q trunk tagging mechanics. |

### 3.3 Path 4: Routing & Network Services (Milestone 10 / Sprint 29)

| Legacy Source Slug | Target Planned Lesson ID | Target Module & Lesson Slug | Migration Action |
|---|---|---|---|
| `vlan-segmentation-practice` (Part B: Routing) | `P4-L02`, `P4-L04` | `gateway-dan-route` / `routing-table-lookup`, `inter-vlan-routing` | **Extract Layer 3 Routing:** Relocate `routing_table` block to P4-M1 (Longest Prefix Match) and P4-M2 (Router-on-a-Stick / Inter-VLAN). |
| `dhcp-dora-process` | `P4-L05` | `dhcp-dan-dns` / `dhcp-dora-process` | **Enhance Content:** Retain `dhcp_dora` interactive block; author comprehensive DORA packet trace and lease lifetime explanation. |
| `dns-query-resolution` | `P4-L06` | `dhcp-dan-dns` / `dns-query-resolution` | **Enhance Content:** Retain `dns_query` block; contrast name resolution failure with IP layer unreachable failure. |
| `nat-pat-translation` | `P4-L07`, `P4-L08` | `nat-pat-security` / `nat-static-dynamic`, `pat-port-address-translation` | **Enhance Content:** Retain `nat_visualizer` block; distinguish one-to-one NAT from many-to-one overload (PAT). |
| *(New Planned)* | `P4-L01`, `P4-L03` | `gateway-dan-route` / `default-gateway`, `static-default-routes` | **New Content:** Author default gateway logic and static route configuration. |
| *(New Planned)* | `P4-L09`, `P4-L10` | `transport-dan-layanan` / `tcp-udp-icmp`, `port-dan-aplikasi` | **New Content:** Author TCP three-way handshake vs UDP, and common port services. |

### 3.4 Path 5: Wireless & Troubleshooting (Milestone 10 / Sprint 30)

| Legacy Source Slug | Target Planned Lesson ID | Target Module & Lesson Slug | Migration Action |
|---|---|---|---|
| `wifi-bands-and-security` | `P5-L01`, `P5-L03` | `teknologi-wireless` / `frekuensi-wifi-bands`, `keamanan-wpa2-wpa3` | **Promote to Full Lesson:** Expand text into rich lessons with radio propagation diagrams and WPA3 SAE encryption comparisons. |
| `terminal-diagnostics-lab` | `P5-L05`, `P5-L06` | `alat-diagnostik-cli` / `ipconfig-ping-diagnostic`, `nslookup-arp-traceroute` | **Extend Terminal Simulation:** Retain safe simulated `terminal` and `icmp_ping` blocks; introduce structured troubleshooting scenarios. |
| *(New Planned)* | `P5-L02`, `P5-L04` | `wireless-advanced` / `channel-dan-interferensi`, `guest-network-isolation` | **New Content:** Author non-overlapping Wi-Fi channels (1, 6, 11) and guest captive isolation. |
| *(New Planned)* | `P5-L07`, `P5-L08` | `metodologi-troubleshooting` / `observasi-dan-hipotesis`, `perbaikan-dan-verifikasi` | **New Content:** Author scientific IT support diagnosis workflow. |

---

## 4. URL Backward Compatibility & Routing Strategy

To ensure zero link rot, Next.js routing must transparently handle legacy URLs:

### 4.1 URL Redirection Matrix
1. **Path-Level Aliases:**
   - `/learn/switching-vlan-routing` $\rightarrow$ Permanent Redirect (HTTP 308) to `/learn/switching-lan`.
2. **Lesson-Level Aliases:**
   - `/learn/switching-vlan-routing/switching-and-arp/arp-resolution-flow` $\rightarrow$ `/learn/switching-lan/arp-dan-broadcast/arp-resolution-flow`.
   - `/learn/switching-vlan-routing/vlan-and-routing/vlan-segmentation-practice` $\rightarrow$ `/learn/switching-lan/vlan-dan-segmentasi/vlan-segmentation-practice`.
   - `/learn/ipv4-subnetting/binary-ipv4-structure/binary-fundamentals` $\rightarrow$ `/learn/ipv4-subnetting/biner-dan-ipv4/binary-fundamentals`.
   - `/learn/ipv4-subnetting/subnet-calculations/subnet-calculator-lab` $\rightarrow$ `/learn/ipv4-subnetting/kalkulasi-subnet/subnet-calculator-lab`.

### 4.2 Technical Implementation Mechanism
In Next.js `next.config.ts`, define strict 308 redirect rules:
```ts
async redirects() {
  return [
    {
      source: "/learn/switching-vlan-routing/:path*",
      destination: "/learn/switching-lan/:path*",
      permanent: true,
    },
    // Explicit legacy lesson aliases mapped in curriculum registry
  ];
}
```
Additionally, `getLessonDetail(pathSlug, moduleSlug, lessonSlug)` in `src/features/learning/queries.ts` will support slug alias lookup through `CURRICULUM_REGISTRY` so that even if a user directly hits an internal API or outdated link, the lesson resolves seamlessly.

---

## 5. User Progress & Database State Preservation

### 5.1 Progress Integrity
- In Prisma, `UserLessonProgress` references `lessonId` (a unique CUID or string ID).
- When upgrading seed scripts or applying database migrations in Milestone 10:
  1. The legacy `Lesson.id` will remain unchanged or mapped via an upsert identifier key.
  2. If a legacy lesson is renamed or given an updated slug, an alias entry in `src/features/learning/content/registry.ts` will map the legacy slug to the modern slug.
  3. No learner who has previously earned `status: "COMPLETED"` or XP for a legacy lesson will have their status reverted to `LOCKED` or `AVAILABLE`.

### 5.2 Prerequisite Chain Safety
- The prerequisite relationship table `lesson_prerequisites` links `(lessonId, prerequisiteId)`.
- When new intermediate lessons are introduced (e.g., P2-L03 between P2-L02 and P2-L07):
  - A learner who already completed P2-L07 (`subnet-calculator-lab`) under the legacy schema will have their completion respected.
  - The prerequisite engine (`src/features/learning/prerequisites.ts`) checks `existingStatus === "COMPLETED"` first, ensuring completed lessons are never locked post-facto.

---

## 6. Access Policy & Commercial Guardrails

1. **All Core Networking Paths are FREE:**
   - Path 1: Network Foundations (`network-foundations`)
   - Path 2: IPv4 & Subnetting (`ipv4-subnetting`)
   - Path 3: Switching & LAN (`switching-lan`)
   - Path 4: Routing & Network Services (`network-services`)
   - Path 5: Wireless & Troubleshooting (`wireless-troubleshooting`)
   All of these paths are permanently associated with `accessTier: "FREE"`.
2. **Entitlement Isolation:**
   - The commerce engine (`src/features/commerce/`) and `Course` models strictly govern optional future vocational domains (e.g. CCTV, Fiber Optic, VoIP, MikroTik).
   - Core networking curriculum restructuring in Milestone 10 is strictly forbidden from creating `CommerceCourse` records with `accessTier: "PREMIUM"` or blocking learners via `CourseAccessDeniedError`.

---

## 7. Migration Verification & Acceptance Gate (Sprint 26 Review)

This contract is verified under the following criteria:
- [x] All 9 legacy lessons from `prisma/seed.ts` are inventoried with current XP and interactive block types.
- [x] Every legacy lesson is mapped to its exact destination module and lesson in Milestone 10.
- [x] Clean architectural decoupling between Layer 2 Switching and Layer 3 Routing/Services is established.
- [x] Redirect and alias resolution strategy guarantees zero broken links (308 redirect + registry lookup).
- [x] Existing learner progress (`COMPLETED` state and XP ledger) is protected against resets.
- [x] 100% FREE access for core networking is explicitly reaffirmed.
