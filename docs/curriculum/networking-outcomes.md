# Networking Curriculum and Outcome Matrix

Status: Planned curriculum renewal, 2026-09-05 WITA. These are intended outcomes, not claims about currently published content or learner mastery.

Read the [design](../superpowers/specs/2026-09-05-learning-outcomes-and-curriculum-design.md), [delivery plan](../superpowers/plans/2026-09-05-learning-curriculum-renewal.md), and [pilot plan](../superpowers/plans/2026-09-05-welcome-to-networking.md). The matrix is the authored curriculum contract; final learner-facing prose and question wording receive technical/editorial review in their owning sprint.

## Usage and acceptance

- Every path statement and every lesson outcome below is prefixed in the learner UI by **Setelah menyelesaikan bagian ini, siswa dapat ...**.
- Each row owns one module outcome expressed through its listed lessons. Lesson IDs are stable curriculum IDs, not invented existing database IDs. Existing IDs/slugs must be mapped before seeding.
- Every lesson implements introduction/outcomes, concept, example, visual, interaction, quiz, and summary using the design's reusable template. Each module adds introduction, guided practice, and a final concept-plus-practical assessment.
- Evidence in the final column is required assessment coverage. Authors map concrete question/activity IDs to every lesson outcome before publishing. Missing evidence fails content review.
- Quiz and module assessment are required gates; unsuccessful learners receive feedback and retry. Numeric thresholds follow the pilot design review, not assumptions in seed code.
- Do not use "memahami" alone as the acceptance condition. Correctly explain, select, calculate, or demonstrate the stated outcome.
- Verify prerequisite concept coverage, not merely the order of rows. Review prior-path concepts briefly before requiring them. New scenarios must use taught concepts.

## Path 1 — Network Foundations

Path outcome P1: siswa dapat menjelaskan hubungan perangkat, media, dan aliran data untuk membaca serta menganalisis jaringan lokal sederhana.

Entry: basic computer/phone use; no networking knowledge. Exit: all module assessments plus First Day as IT Support final challenge. Owner milestone: M8 (reference module only), then M9 (remaining modules and path closure). This is curriculum reuse across milestones; each implementation sprint still has exactly one milestone owner.

| Module / module outcome | Lessons and observable outcomes | Required visual/practice and final evidence |
| --- | --- | --- |
| P1-M1 Welcome to Networking: explain networks, identify resources, distinguish Internet, predict simple disconnection | WN-L1 Apa Itu Jaringan Komputer?: distinguish connected/standalone devices and explain file/printer sharing. WN-L2 Jaringan di Sekitar Kita: identify endpoints/media and distinguish local service from Internet. WN-L3 Berbagi Sumber Daya: choose shared resources and identify requester/provider. WN-L4 Komunikasi Sederhana: order request/response and identify a faulty branch | Detailed eight lesson outcomes WN-L1-A through WN-L4-B and final blueprint are in the design. Library printer scenario; 10 questions and 3 essential practical criteria proposed |
| P1-M2 Types of Networks: classify a network by scale and organizational need | P1-L05 LAN, MAN, WAN: classify stated examples by coverage. P1-L06 Rumah, Sekolah, Perusahaan: compare connectivity needs without assuming all networks have identical equipment | Scope diagram; select and justify network category for 3 stated sites |
| P1-M3 Client, Server & Communication: explain roles and message direction | P1-L07 Peran Client/Server: identify roles per transaction rather than physical device appearance. P1-L08 Request dan Response: trace a complete request/response exchange | Reuse PacketFlow at appropriate vocabulary level; order exchange and distinguish initiator from responder |
| P1-M4 Network Topology: predict connectivity from structure | P1-L09 Bus, Star, Ring: distinguish connection arrangements. P1-L10 Dampak Kegagalan: predict the effect of one failed link or central device under declared assumptions | TopologyExplorer; compare two arrangements and identify affected endpoints |
| P1-M5 Network Devices: select a device by function | P1-L11 NIC, Switch, Router, AP: match device to connectivity function. P1-L12 Modem/ONT, Firewall, Server: explain their distinct roles in an example network | Device explorer; select a minimal inventory and explain unnecessary choices |
| P1-M6 Physical Media & Cabling: choose media and recognize correct termination | P1-L13 Kabel Tembaga dan Nirkabel: compare media against stated distance/interference needs. P1-L14 RJ45 dan T568A/B: arrange pin order and distinguish straight/crossover concepts. P1-L15 Pengantar Fiber: identify a justified fiber use case and distinguish it from copper | CableOrder exercise and media comparison; validate specified pin standard plus scenario-based media selection; no practical fiber installation certification |
| P1-M7 How Data Travels: distinguish units and delivery scope | P1-L16 Bit, Frame, Packet: identify representation by the taught layer. P1-L17 Unicast, Broadcast, Multicast: predict recipients in a declared topology | PacketFlow/EncapsulationVisualizer; identify recipients and order representations |
| P1-M8 OSI & TCP/IP Foundations: relate observed symptoms to model responsibilities | P1-L18 OSI: match representative functions to layers. P1-L19 TCP/IP dan Enkapsulasi: map simplified OSI groups to TCP/IP and trace wrapping/unwrapping | OSIStack; categorize a small set of symptoms and explain the relevant layer, without demanding memorized trivia alone |

Path final: **First Day as IT Support**. Given a small school/office brief, identify resources, choose devices/media, read topology, explain one fault with evidence, and distinguish LAN/Internet. Do not assess subnet arithmetic before Path 2. Existing `support-challenge.ts` is a starting evaluator, not assumed complete coverage.

## Path 2 — IPv4 & Subnetting

Path outcome P2: siswa dapat menghitung dan menyusun pengalamatan IPv4 yang memenuhi kapasitas host, tidak tumpang tindih, dan memiliki network/broadcast/gateway yang konsisten.

Entry: Path 1 evidence or an owner-approved equivalent placement route; no placement implementation in pilot. Owner: M10 / Sprint 27.

| Module / module outcome | Lessons and observable outcomes | Required visual/practice and final evidence |
| --- | --- | --- |
| P2-M1 Biner dan IPv4: interpret address structure | P2-L01 Biner 8-bit: convert a byte between decimal/binary. P2-L02 Struktur IPv4: distinguish octet, address, and prefix | BinaryConverter; conversion and valid/invalid address cases |
| P2-M2 Jenis Alamat: distinguish usage constraints | P2-L03 Public/Private: classify addresses using taught ranges. P2-L04 Loopback/APIPA: explain what each indicates in a stated scenario | Address classification exercise; select plausible diagnostic implication without claiming APIPA proves one unique cause |
| P2-M3 Mask dan CIDR: distinguish network/host portions | P2-L05 Subnet Mask: identify bits belonging to network/host. P2-L06 CIDR: convert supported masks/prefixes | Bit highlighting; mask/prefix equivalence and same-subnet decisions |
| P2-M4 Kalkulasi Subnet: derive addressing limits | P2-L07 Network/Broadcast: calculate both for given IP/prefix. P2-L08 Host Range: determine usable range and host capacity | SubnetCalculator with worked steps, then independent SubnetPractice; invalid inputs and edge cases explicitly covered |
| P2-M5 Subnetting dan VLSM: allocate nonoverlapping ranges | P2-L09 Pembagian Subnet: allocate equal-capacity segments. P2-L10 VLSM: allocate unequal host requirements and explain remaining capacity | Deterministic IPv4/VLSM functions; satisfy every required segment without overlap |

Path final: school with multiple rooms and stated present/growth host counts. Submit subnet table with capacity, usable range, gateway choice, and overlap evidence. Introduce /31 and /32 semantics explicitly if assessed; do not apply ordinary LAN host formulas blindly.

## Path 3 — Switching & LAN

Path outcome P3: siswa dapat menjelaskan forwarding Layer 2 dan merancang segmentasi VLAN serta koneksi access/trunk yang sesuai kebutuhan jaringan lokal.

Entry: foundational device knowledge and IPv4 local-subnet concept. Owner: M10 / Sprint 28.

| Module / module outcome | Lessons and observable outcomes | Required visual/practice and final evidence |
| --- | --- | --- |
| P3-M1 Ethernet/MAC: identify link-layer delivery | P3-L01 Ethernet dan MAC: distinguish link-layer address from IP. P3-L02 MAC Learning: predict table updates from source frames | MAC table trace; justify forwarding after a sequence of frames |
| P3-M2 ARP dan Broadcast: resolve local next-hop hardware address | P3-L03 ARP Request/Reply: trace broadcast/unicast exchange. P3-L04 Local/Remote Destination: choose whether to resolve peer or gateway MAC | ArpVisualizer; predict recipients and resolved next hop |
| P3-M3 VLAN: reason about segmentation | P3-L05 Broadcast Domain: identify isolation boundaries. P3-L06 VLAN Membership: assign endpoints to required groups | VlanBuilder; test same/different VLAN behavior within declared topology |
| P3-M4 Access/Trunk: transport the intended VLANs | P3-L07 Access Port: select endpoint port membership. P3-L08 Trunk: select allowed/tagged VLANs and diagnose mismatches | Layer-2 topology evaluator and VLAN lab; fix one trunk fault while preserving isolation |

Path final: segment staff/guest LAN and diagnose a misassigned port. Explicitly state that inter-VLAN routing is a later Layer-3 capability, not an automatic switch property.

## Path 4 — Routing & Network Services

Path outcome P4: siswa dapat menelusuri jalur antar-subnet, konfigurasi layanan dasar, dan penyebab kegagalan akses layanan menggunakan bukti routing, DHCP, DNS, dan NAT.

Entry: Paths 2–3 addressing and segmentation outcomes. Owner: M10 / Sprint 29.

| Module / module outcome | Lessons and observable outcomes | Required visual/practice and final evidence |
| --- | --- | --- |
| P4-M1 Gateway dan Route: choose correct next hop | P4-L01 Gateway: determine when a host needs it. P4-L02 Routing Table: select route using longest-prefix match | RoutingTableVisualizer; explain local/remote and matching route choices |
| P4-M2 Static/Default/Inter-VLAN: connect distinct networks | P4-L03 Static/Default Route: add correct next hop for stated topology. P4-L04 Inter-VLAN: identify Layer-3 gateway requirement and return route | Routing lab; bidirectional reachability and incorrect gateway cases |
| P4-M3 DHCP dan DNS: separate configuration from name resolution | P4-L05 DHCP DORA: order messages and validate lease configuration. P4-L06 DNS: distinguish name-resolution failure from IP reachability failure | DHCP/DNS visualizers; inspect lease and compare address/name diagnostics |
| P4-M4 NAT/PAT: trace address/port translation | P4-L07 NAT: distinguish inside/outside address representation. P4-L08 PAT: trace concurrent mappings and replies | NatVisualizer; identify correct mapping and explain why NAT is not a complete security policy |
| P4-M5 Transport dan Layanan: interpret service-level behavior | P4-L09 TCP/UDP/ICMP: distinguish delivery/diagnostic roles. P4-L10 HTTP/HTTPS/SSH/Ports: match common services and explain connectivity versus application success | Service/port scenario; diagnose a reachable host with unavailable service using taught evidence |

Path final: configured LAN fails to reach a named service; diagnose addressing, route, DNS, or service evidence and submit a bounded correction. Random-looking outputs must remain deterministic for a scenario/version.

## Path 5 — Wireless & Troubleshooting

Path outcome P5: siswa dapat memilih konfigurasi wireless berdasarkan kebutuhan dan menyelesaikan gangguan melalui observasi, hipotesis, pengujian, serta verifikasi hasil.

Entry: networking and service outcomes through Path 4. Owner: M10 / Sprint 30.

| Module / module outcome | Lessons and observable outcomes | Required visual/practice and final evidence |
| --- | --- | --- |
| P5-M1 Wireless Basics: compare coverage and interference | P5-L01 Band 2.4/5/6 GHz: compare tradeoffs under stated environment. P5-L02 Channel/Interference: select a less-conflicting channel from a given diagram | Coverage/channel diagram; make scenario-dependent choices without claiming universal range/speed |
| P5-M2 Wireless Security: choose appropriate access protection | P5-L03 WPA2/WPA3: distinguish taught authentication/encryption options. P5-L04 Guest Network: choose segmentation and access restrictions | Guest/staff scenario; justify settings and identify limitations |
| P5-M3 Diagnostic Tools: collect useful evidence | P5-L05 ipconfig/ip/ping: interpret address and reachability output. P5-L06 nslookup/arp/traceroute/netstat: choose the tool matching a diagnostic question | Safe TerminalSimulator; record command/result supporting a hypothesis |
| P5-M4 Troubleshooting Method: resolve faults with verification | P5-L07 Observasi dan Hipotesis: distinguish evidence from guess. P5-L08 Perbaikan dan Verifikasi: test a bounded correction and document remaining uncertainty | Challenge engine; diagnose, fix, re-test, and explain; unsupported conclusions do not receive full credit |

Path final: adapt existing branch-office, inter-VLAN, and DHCP-pool scenarios after confirming state/evaluator consistency. Passing requires both diagnosis and evidence of restored expected behavior.

## Path 6 — Network Planning & IT Consultant

Path outcome P6: siswa dapat menyusun proposal jaringan yang memenuhi kebutuhan klien, anggaran, kapasitas, segmentasi, dan dokumentasi dengan alasan teknis yang dapat diverifikasi.

Entry: Paths 1–5 competencies. Owner: M11 / Sprints 31–32. Creating this instructional path does not imply a new paid product.

| Module / module outcome | Lessons and observable outcomes | Required visual/practice and final evidence |
| --- | --- | --- |
| P6-M1 Requirements: convert brief into constraints | P6-L01 Wawancara Klien: distinguish requirements from proposed solutions. P6-L02 Acceptance Criteria: derive verifiable user/capacity/service needs | Annotated brief; select mandatory requirements and verification steps |
| P6-M2 Capacity/Procurement: select sufficient inventory | P6-L03 Port/AP/PoE: compute present and growth requirements. P6-L04 BoQ/Budget: select catalog items and calculate total/capacity | Procurement engine; satisfy essential capacities without fabricated market-price accuracy |
| P6-M3 Topology/IP/VLAN: design consistent architecture | P6-L05 Topology: connect devices according to required roles. P6-L06 IP/VLAN Plan: allocate subnets, gateways, and segmentation | Topology/IP/VLAN evaluators; detect overlap, disconnected nodes, invalid gateway, and isolation failure |
| P6-M4 Proposal and Review: explain technical decisions | P6-L07 Dokumentasi: produce inventory, topology, IP plan, and operational notes. P6-L08 Review Desain: identify and correct unmet requirements | Versioned proposal summary; review against explicit rubric and correct a flawed proposal |
| P6-M5 Applied Cases: transfer design to constraints | P6-L09 Small Office: complete one supported end-to-end case with decreasing guidance. P6-L10 Kasus Lanjutan: compare warnet, logistics, school, and multi-floor requirements | Existing cases reused; independent final submission retained in portfolio with case/rubric version |

Path final: Small Office proposal covering requirement evidence, BoQ, topology, IP/VLAN, tests, and explanations; advanced cases unlock after foundational proof. Five consultant scoring dimensions remain explicit, but missing essential connectivity/security cannot be compensated solely by cheap procurement.

## Cross-path validation and migration

Map current `switching-vlan-routing` content to Paths 3 and 4; keep old URLs resolving to the corresponding preserved lesson. Map current `network-services` into Path 4 without silently changing historical identity. Path 6 is a new instructional sequence, not proof that current Consultant UI has authored lessons. Preserve Path 1/2/5 slugs where possible. Exact redirect and progress mapping is reviewed in Sprint 26 before writing new path records.

Each path final must test a new situation using already-taught knowledge. Lab/challenge completions reached through the catalog or a lesson use the same activity identity; no duplicated rewards. The graph must have no prerequisite cycle and no path that can award mastery without its required evidence.

The full matrix defines 65 proposed lessons including the four-lesson pilot. Authors may propose decompositions after pilot review, but changing outcomes or scope requires synchronized matrix, plan, roadmap, and owner decision records. Existing seed lesson count remains 15 at the inspected baseline.
