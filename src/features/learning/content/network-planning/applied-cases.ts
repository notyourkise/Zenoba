import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Studi Kasus Nyata & Komparasi Kebutuhan (P6-M5)
 *
 * Covers:
 * 1. End-to-end small office implementation case (Notaris & PPAT) with real-world constraints
 * 2. Multi-case comparison matrix (Warnet, Logistics, School Lab, Multi-Floor Enterprise)
 * 3. Prerequisite proof gating pedagogical rationale and multi-dimensional rubric validation.
 */
export const appliedCasesModuleData: CurriculumModule = {
  id: "module-applied-cases",
  slug: "applied-cases",
  title: "Studi Kasus Nyata & Komparasi Kebutuhan Klien",
  description:
    "Terapkan seluruh kompetensi analisis kebutuhan, kalkulasi port/PoE, topologi, dan IP/VLAN pada skenario industri riil: dari kantor notaris SOHO hingga komparasi kebutuhan warnet esports, logistik, sekolah, dan gedung korporat 3 lantai.",
  orderIndex: 5,
  prerequisites: ["proposal-review"],
  outcomes: [
    {
      id: "PLAN-M5-O1",
      text: "Siswa dapat menganalisis dan menyelesaikan rancangan jaringan SOHO lengkap berdasarkan batasan riil klien (anggaran, port, PoE, keamanan VLAN).",
    },
    {
      id: "PLAN-M5-O2",
      text: "Siswa dapat membandingkan trade-off arsitektur antar 5 skenario industri dan memvalidasi kelayakan proposal berdasarkan rubrik multi-dimensi.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 9: small-office-transfer (P6-L09)
    // =========================================================================
    {
      id: "lesson-small-office-transfer",
      slug: "small-office-transfer",
      title: "Studi Kasus 1: Perancangan Jaringan SOHO Kantor Notaris",
      description:
        "Membedah perancangan jaringan kantor notaris (12 workstation, printer sharing, 2 AP Wi-Fi 6, segregasi tamu) dengan pagu anggaran Rp 15.000.000 secara end-to-end.",
      orderIndex: 0,
      estimatedMinutes: 18,
      xpReward: 60,
      prerequisites: ["review-desain-dan-revisi"],
      outcomes: [
        {
          id: "PLAN-L9-A",
          text: "Siswa dapat merumuskan BoQ dan anggaran SOHO lengkap (Router, Switch PoE, AP Wi-Fi 6, Cat6, Rack 6U, UPS) di bawah pagu Rp 15.000.000.",
        },
        {
          id: "PLAN-L9-B",
          text: "Siswa dapat merancang topologi star collapsed core serta alokasi subnet /27 dan segmentasi VLAN untuk memisahkan lalu lintas staf rahasia dari tamu kantor.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L9-A",
          teachingBlockIds: ["plan-l9-h1", "plan-l9-txt1", "plan-l9-callout1"],
          activityIds: ["plan-l9-txt-table1"],
          assessmentItemIds: ["quiz-plan-l9-q1", "quiz-plan-l9-q2"],
        },
        {
          outcomeId: "PLAN-L9-B",
          teachingBlockIds: ["plan-l9-h2", "plan-l9-txt2", "plan-l9-callout2"],
          activityIds: ["plan-l9-code1", "plan-l9-txt-table2"],
          assessmentItemIds: ["quiz-plan-l9-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l9-h1",
            type: "heading",
            level: 2,
            text: "1. Bedah Kasus Riil: Kantor Notaris & PPAT H. Suryadi, S.H.",
          },
          {
            id: "plan-l9-txt1",
            type: "text",
            format: "markdown",
            content:
              "Klien mengoperasikan kantor hukum dan notariat dengan 12 workstation staf (administrasi akta tanah, legalitas, dan kasir), 1 network printer/scanner terpusat, dan ruang tunggu klien publik. Klien mengeluhkan seringnya Wi-Fi tamu membebani koneksi internet, printer tidak terdeteksi dari beberapa PC, dan kerapian kabel yang semrawut di lantai. Klien mengalokasikan pagu anggaran maksimal sebesar **Rp 15.000.000**.",
          },
          {
            id: "plan-l9-callout1",
            type: "callout",
            variant: "info",
            title: "Parameter Kebutuhan & Batasan Kritis Klien (Constraints)",
            content:
              "• Perangkat Kabel (Wired): 12 PC Staf + 1 Network Printer = 13 titik kabel tetap.\n• Perangkat Nirkabel (Wireless): 2 Access Point (AP 1 untuk area staf, AP 2 untuk ruang tunggu tamu).\n• Kebutuhan PoE: Switch harus menyediakan daya PoE (802.3af) untuk menyalakan 2 unit AP tanpa adaptor colokan listrik tambahan di plafon.\n• Segmentasi Keamanan: Data akta notaris berkategori rahasia negara/klien, sehingga perangkat tamu TIDAK BOLEH berada dalam broadcast domain yang sama dengan PC staf dan printer dokumen.",
          },
          {
            id: "plan-l9-txt-table1",
            type: "text",
            format: "markdown",
            content:
              "### Tabel Formulasi Bill of Quantities (BoQ) Rekomendasi Konsultan\n\n| Komponen Perangkat | Spesifikasi / Tipe | Kuantitas | Estimasi Biaya | Justifikasi Teknis |\n| :--- | :--- | :---: | :--- | :--- |\n| **Router Gateway** | Gigabit Multi-Service Router (4x GbE RJ45) | 1 Unit | Rp 1.850.000 | Menjalankan NAT, firewall filter isolasi subnet, dan DHCP server multi-pool. |\n| **Switch Utama** | Managed Switch 16-Port Gigabit + 4-Port PoE+ | 1 Unit | Rp 3.200.000 | 16 port GbE mencukupi 13 kabel PC/printer + 2 AP + 1 uplink router. 4 port PoE mencukupi daya 2 AP. |\n| **Access Point** | Dual-Band Wi-Fi 6 Ceiling AP (PoE 802.3af) | 2 Unit | Rp 3.400.000 | 1 AP area staf (SSID Notaris-Staff), 1 AP ruang tunggu (SSID Notaris-Tamu). |\n| **Perkabelan UTP** | UTP Cat6 1 Roll (305m) + RJ45 + Patch Cord | 1 Paket | Rp 2.100.000 | Menjamin throughput gigabit dan standar kabel horizontal terstruktur. |\n| **Rack & Patch Panel** | Wallmount Rack 6U + Patch Panel 24-Port | 1 Unit | Rp 1.450.000 | Menata switch dan router terpusat aman dari lalu lalang publik. |\n| **UPS Cadangan Daya** | Line-Interactive UPS 1000VA / 600W | 1 Unit | Rp 1.600.000 | Melindungi router, switch, dan printer dari lonjakan daya dan pemadaman. |\n| **TOTAL PENGADAAN** | | | **Rp 13.600.000** | **Hemat Rp 1.400.000 (Sisa Anggaran 9,3%)** |",
          },
          {
            id: "quiz-plan-l9-q1",
            type: "quiz",
            quizId: "quiz-plan-l9-q1",
            question:
              "Pada perancangan jaringan SOHO Kantor Notaris (12 PC staf, 1 network printer, dan 2 Access Point PoE), berapa jumlah port fisik minimum yang harus disediakan switch agar seluruh perangkat dapat terhubung?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "15 port kabel horizontal (12 PC + 1 printer + 2 AP) ditambah 1 port uplink router sehingga switch 16-port pas mencukupi.",
              },
              {
                id: "opt-2",
                text: "12 port saja karena printer dan AP dapat menggunakan Wi-Fi tanpa kabel.",
              },
              {
                id: "opt-3",
                text: "8 port cukup dengan menyambungkan kabel secara paralel bercabang.",
              },
              {
                id: "opt-4",
                text: "24 port wajib karena standar industri tidak mengizinkan switch 16 port.",
              },
            ],
          },
          {
            id: "quiz-plan-l9-q2",
            type: "quiz",
            quizId: "quiz-plan-l9-q2",
            question:
              "Klien mengalokasikan anggaran Rp 15.000.000. Mengapa rekomendasi Switch Managed 16-port dengan 4-port PoE+ (harga Rp 3.200.000) lebih tepat dibandingkan membeli Switch 16-port Non-PoE (Rp 1.500.000) ditambah 2 PoE Injector terpisah?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Switch terintegrasi PoE+ menghemat ruang rak (rackmount), mengurangi kabel daya liar di stopkontak, dan terlindungi UPS terpusat di dalam pagu anggaran.",
              },
              {
                id: "opt-2",
                text: "Karena switch non-PoE dilarang secara hukum digunakan di kantor hukum notaris.",
              },
              {
                id: "opt-3",
                text: "Karena PoE Injector tidak mampu mengalirkan daya listrik standar ke Access Point.",
              },
              {
                id: "opt-4",
                text: "Hanya untuk menghabiskan sisa anggaran klien agar konsultan mendapatkan komisi lebih besar.",
              },
            ],
          },
          {
            id: "plan-l9-h2",
            type: "heading",
            level: 2,
            text: "2. Arsitektur Topologi Star Collapsed Core & Desain VLAN / Subnetting",
          },
          {
            id: "plan-l9-txt2",
            type: "text",
            format: "markdown",
            content:
              "Untuk skala 1 lantai dengan 15 titik perangkat aktif, arsitektur yang paling andal dan hemat biaya adalah **Collapsed Core Star Topology**. Seluruh perangkat kabel horizontal terhubung langsung ke patch panel di wallmount rack 6U, yang kemudian ditambatkan ke port Switch Managed 16-Port. Router gateway bertindak sebagai penghubung ke modem ISP sekaligus Default Gateway antar-VLAN.",
          },
          {
            id: "plan-l9-callout2",
            type: "callout",
            variant: "tip",
            title: "Pemisahan Keamanan: Staff vs Tamu",
            content:
              "VLAN 10 dialokasikan untuk staf dan printer, sedangkan VLAN 20 dialokasikan untuk Wi-Fi tamu. Di router gateway, firewall filter diterapkan untuk memblokir paket dari VLAN 20 yang menuju ke subnet VLAN 10.",
          },
          {
            id: "plan-l9-code1",
            type: "code",
            language: "text",
            filename: "diagram-topologi-soho-notaris.txt",
            code:
              "                      [ INTERNET / ISP MODEM ]\n                                 │\n                                 │ WAN (DHCP/PPPoE)\n                      ┌──────────┴──────────┐\n                      │   ROUTER GATEWAY    │ 192.168.10.1 (VLAN 10 GW)\n                      │ (NAT / DHCP / FW)   │ 192.168.20.1 (VLAN 20 GW)\n                      └──────────┬──────────┘\n                                 │ Trunk (VLAN 10, 20)\n                   ┌─────────────┴─────────────┐\n                   │ MANAGED SWITCH 16-PORT PoE │ (Wallmount Rack 6U)\n                   └──┬───────────────┬──────┬─┘\n                      │ Access (VLAN10)│      │ Access (VLAN10)\n             ┌────────┴────────┐      │   ┌──┴───────────────┐\n             │ 12x PC STAF     │      │   │ 1x PRINTER SERVER │\n             │ (Akta & Kasir)  │      │   │ (Dokumen Notaris) │\n             └─────────────────┘      │   └───────────────────┘\n                                      │ Trunk/PoE (VLAN 10, 20)\n                         ┌────────────┴────────────┐\n                         │ 2x CEILING ACCESS POINT │\n                         │ • SSID: Notaris-Staff   │ -> VLAN 10 (Protected)\n                         │ • SSID: Notaris-Tamu    │ -> VLAN 20 (Internet Only)\n                         └─────────────────────────┘",
          },
          {
            id: "plan-l9-txt-table2",
            type: "text",
            format: "markdown",
            content:
              "### Rancangan Alokasi Subnetting VLSM & Segmentasi VLAN\n\n| Nama Segmen | VLAN ID | Network Address | Subnet Mask / CIDR | Usable Host Range | Peruntukan |\n| :--- | :---: | :--- | :--- | :--- | :--- |\n| **VLAN Staf & Server** | VLAN 10 | 192.168.10.0 | 255.255.255.224 (/27) | 192.168.10.1 s.d. 192.168.10.30 | 12 PC Staf, 1 Printer, 1 GW, sisa 16 host untuk ekspansi laptop staf. |\n| **VLAN Tamu (Guest)** | VLAN 20 | 192.168.20.0 | 255.255.255.224 (/27) | 192.168.20.1 s.d. 192.168.20.30 | Smartphone dan laptop pengunjung ruang tunggu akta. |\n| **Management** | VLAN 99 | 192.168.99.0 | 255.255.255.240 (/28) | 192.168.99.1 s.d. 192.168.99.14 | IP Manajemen Switch, Router, dan Access Point terisolasi. |",
          },
          {
            id: "quiz-plan-l9-q3",
            type: "quiz",
            quizId: "quiz-plan-l9-q3",
            question:
              "Pada perancangan keamanan Kantor Notaris, mengapa SSID Wi-Fi Tamu harus diarahkan ke VLAN 20 yang terpisah dari VLAN 10 Staf, bukan hanya menggunakan password Wi-Fi yang berbeda?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Karena VLAN 20 memisahkan broadcast domain secara Layer 2 dan memungkinkan firewall router memblokir akses tamu ke PC staf serta printer akta.",
              },
              {
                id: "opt-2",
                text: "Karena password Wi-Fi yang berbeda otomatis memisahkan jalur kabel fisik.",
              },
              {
                id: "opt-3",
                text: "Agar smartphone tamu tidak dapat menggunakan koneksi internet sama sekali.",
              },
              {
                id: "opt-4",
                text: "Karena printer notaris hanya bisa mencetak jika terhubung ke VLAN 20.",
              },
            ],
          },
          {
            id: "plan-l9-sum1",
            type: "summary",
            title: "Rangkuman Studi Kasus SOHO Notaris",
            keyPoints: [
              "Perancangan jaringan SOHO menuntut efisiensi biaya ketat tanpa mengorbankan fungsi esensial: Router, Switch PoE, dan UPS wajib ada.",
              "Kalkulasi port fisik harus memperhitungkan seluruh titik kabel horizontal (PC, printer, AP) ditambah port uplink router.",
              "Segmentasi VLAN menjamin privasi data rahasia kantor notaris terlindungi dari akses publik pengunjung ruang tunggu.",
            ],
          },
          {
            id: "plan-l9-rew1",
            type: "reward",
            xp: 60,
            badgeTitle: "SOHO Network Architect",
            message: "Luar biasa! Anda telah menguasai formulasi BoQ dan topologi SOHO end-to-end untuk kantor notaris.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 10: komparasi-kasus-lanjutan (P6-L10)
    // =========================================================================
    {
      id: "lesson-komparasi-kasus-lanjutan",
      slug: "komparasi-kasus-lanjutan",
      title: "Studi Kasus 2–5: Komparasi Kebutuhan Kasus Menengah & Enterprise",
      description:
        "Membandingkan karakteristik teknis 5 skenario industri (SOHO, Warnet Gaming, Kantor Logistik, Lab Sekolah, dan Gedung Multi-Lantai) serta memahami alasan pedagogis di balik penguncian prasyarat.",
      orderIndex: 1,
      estimatedMinutes: 20,
      xpReward: 60,
      prerequisites: ["small-office-transfer"],
      outcomes: [
        {
          id: "PLAN-L10-A",
          text: "Siswa dapat membandingkan arsitektur dan parameter kritis antara kasus SOHO, Warnet Gaming (Dual-WAN), Gudang Logistik (3 VLAN), Lab SMK (Core-Distribution), dan Enterprise 3 Lantai (10G Fiber Backbone).",
        },
        {
          id: "PLAN-L10-B",
          text: "Siswa dapat menjelaskan alasan pedagogis di balik penguncian prasyarat (Prerequisite Proof Gating) dan pentingnya validasi multi-dimensi sebelum implementasi lapangan.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L10-A",
          teachingBlockIds: ["plan-l10-h1", "plan-l10-txt1", "plan-l10-callout1"],
          activityIds: ["plan-l10-txt-table1"],
          assessmentItemIds: ["quiz-plan-l10-q1", "quiz-plan-l10-q2"],
        },
        {
          outcomeId: "PLAN-L10-B",
          teachingBlockIds: ["plan-l10-h2", "plan-l10-txt2", "plan-l10-callout2"],
          activityIds: ["plan-l10-code1"],
          assessmentItemIds: ["quiz-plan-l10-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l10-h1",
            type: "heading",
            level: 2,
            text: "1. Matriks Komparasi 5 Arsitektur Kasus Konsultasi",
          },
          {
            id: "plan-l10-txt1",
            type: "text",
            format: "markdown",
            content:
              "Setiap lingkungan industri memiliki karakteristik beban kerja (*workload profile*) yang sangat berbeda. Sebagai konsultan jaringan, Anda tidak boleh menerapkan solusi *one-size-fits-all*.\n\nBerikut adalah analisis komparatif atas kelima domain kasus di Netloka:",
          },
          {
            id: "plan-l10-callout1",
            type: "callout",
            variant: "info",
            title: "Peta Skalabilitas Kasus Konsultan Netloka",
            content:
              "1. Kasus 1 (SOHO Notaris): Fondasi kapasitas port, PoE, dan pemisahan VLAN tamu sederhana.\n2. Kasus 2 (CyberArena Warnet): Fokus pada latensi rendah, throughput gaming masif, dan Dual-WAN ISP Failover.\n3. Kasus 3 (Nusantara Express Logistik): Fokus pada isolasi 3 segmen VLAN (Staff, Server/CCTV, Guest) dan Wi-Fi 6 gudang.\n4. Kasus 4 (SMK TKJ School Lab): Hierarki Core-Distribution Switch untuk 2 lab komputer (@ 36 PC) dan ruang guru.\n5. Kasus 5 (Gedung Finansial 3-Lantai): Infrastruktur enterprise 100 node dengan backbone 10G SFP+ Fiber Optic antar lantai.",
          },
          {
            id: "plan-l10-txt-table1",
            type: "text",
            format: "markdown",
            content:
              "### Matriks Perbandingan Teknis 5 Studi Kasus\n\n| Studi Kasus | Node Kabel | AP Wi-Fi | Pagu Anggaran | Fitur Kritis Utama | Tantangan Desain |\n| :--- | :---: | :---: | :--- | :--- | :--- |\n| **1. SOHO Notaris** | 12 PC | 2 AP | Rp 15 Juta | Switch PoE 16-Port, Isolasi Tamu | Anggaran terbatas, ruang rak sempit. |\n| **2. Warnet Esports** | 30 PC | 2 AP | Rp 25 Juta | Dual-WAN Failover, Bandwidth Mgmt | Latensi game online, proteksi DDoS. |\n| **3. Logistik Gudang** | 40 PC | 3 AP | Rp 50 Juta | 3 VLAN (Staff/CCTV/Guest), PoE NVR | Jarak kabel gudang, interferensi logam. |\n| **4. Lab SMK TKJ** | 72 PC | 4 AP | Rp 75 Juta | Core-Distribution Switch, 3 VLAN | Lonjakan traffic ujian CBT simultan. |\n| **5. Menara 3 Lantai** | 100 PC | 6 AP | Rp 120 Juta | 10G SFP+ Fiber Backbone, L3 Routing | Redundansi link vertikal, multi-SSID 802.1X. |",
          },
          {
            id: "quiz-plan-l10-q1",
            type: "quiz",
            quizId: "quiz-plan-l10-q1",
            question:
              "Dibandingkan dengan jaringan SOHO kantor notaris, fitur arsitektur jaringan manakah yang menjadi prioritas mutlak pada skenario CyberArena Warnet Gaming (30 PC)?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Dual-WAN load balancing/failover otomatis dan bandwidth management/QoS untuk latensi stabil bebas bufferbloat.",
              },
              {
                id: "opt-2",
                text: "Segmentasi VLAN kompleks untuk 10 departemen kantor yang berbeda.",
              },
              {
                id: "opt-3",
                text: "Backbone Fiber Optic 10G SFP+ antar lantai gedung.",
              },
              {
                id: "opt-4",
                text: "Pengadaan Access Point berdensitas tinggi untuk ribuan smartphone tamu.",
              },
            ],
          },
          {
            id: "quiz-plan-l10-q2",
            type: "quiz",
            quizId: "quiz-plan-l10-q2",
            question:
              "Pada skenario Gedung Korporat Multi-Lantai (3 Lantai, 100+ node), media transmisi manakah yang direkomendasikan untuk menghubungkan Core Switch di Ruang Server ke Distribution Switch di tiap lantai?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Kabel Fiber Optic Multimode (OM3/OM4) dengan modul transceiver 10G SFP+ kebal interferensi lift dan jarak vertikal.",
              },
              {
                id: "opt-2",
                text: "Kabel telepon tembaga 2-core biasa.",
              },
              {
                id: "opt-3",
                text: "Wi-Fi repeater nirkabel antar jendela lantai.",
              },
              {
                id: "opt-4",
                text: "Kabel serial RS-232.",
              },
            ],
          },
          {
            id: "plan-l10-h2",
            type: "heading",
            level: 2,
            text: "2. Prerequisite Proof Gating: Mengapa Fondasi SOHO Wajib Dikuasai Terlebih Dahulu?",
          },
          {
            id: "plan-l10-txt2",
            type: "text",
            format: "markdown",
            content:
              "Dalam perancangan platform Netloka, sistem menerapkan mekanisme **Prerequisite Proof Gating**. Kasus 2 hingga 5 tidak dapat diakses sebelum siswa membuktikan kelulusan proposal pada Kasus 1 (Kantor Notaris SOHO) dengan skor minimal 70/100.\n\nAlasan pedagogis di balik aturan ini:\n1. **Scaffolded Learning:** Prinsip dasar BoQ, perhitungan watt PoE, dan kalkulasi port switch harus dipahami pada skala 1 switch sebelum menghadapi kompleksitas multi-switch.\n2. **Mencegah Beban Kognitif Berlebih (Cognitive Overload):** Merancang backbone 10G dan routing L3 tanpa pemahaman dasar subnetting SOHO akan memicu kebingungan teknis yang kontraproduktif.\n3. **Standar Penilaian Objektif Multi-Dimensi:** Klien industri tidak menoleransi proposal yang murah namun tidak dapat berfungsi karena lupa memasukkan router gateway.",
          },
          {
            id: "plan-l10-callout2",
            type: "callout",
            variant: "tip",
            title: "Lima Dimensi Rubrik Penilaian Konsultan Netloka",
            content:
              "Proposal Anda dievaluasi secara deterministik pada 5 pilar:\n1. **Efisiensi Anggaran (Budget Optimization):** Maksimal 20 poin.\n2. **Kapasitas Port Switch:** Maksimal 20 poin.\n3. **Kecukupan Daya PoE:** Maksimal 20 poin.\n4. **Kepatuhan Segmentasi VLAN:** Maksimal 20 poin.\n5. **Konektivitas & Redundansi WAN:** Maksimal 20 poin.\n\nSkor kelulusan minimal: 70 / 100.",
          },
          {
            id: "plan-l10-code1",
            type: "code",
            language: "markdown",
            filename: "alur-validasi-proposal-konsultan.txt",
            code:
              "Alur Kerja Evaluasi Proposal Konsultan Netloka:\n\n1. Siswa memilih studi kasus (Kasus 1 SOHO terbuka untuk semua)\n2. Siswa mengisi BoQ, topologi, dan alokasi VLAN di Consultant Workspace\n3. Siswa mengajukan proposal resmi (/api/consultant/[caseSlug]/submit)\n4. Engine mengevaluasi 5 dimensi secara deterministik\n5. Jika Total Skor >= 70:\n   - Status: PASSED (Disetujui Klien)\n   - +250 XP diberikan ke akun siswa\n   - Proposal tersimpan permanen di Portofolio Konsultan (Rubrik v1.0)\n   - Akses Kasus 2-5 TERBUKA otomatis\n6. Jika Total Skor < 70:\n   - Status: REVISION REQUIRED (Perlu Revisi)\n   - Umpan balik diagnostik spesifik per dimensi diberikan\n   - Siswa dapat memperbaiki BoQ dan mengajukan ulang",
          },
          {
            id: "quiz-plan-l10-q3",
            type: "quiz",
            quizId: "quiz-plan-l10-q3",
            question:
              "Mengapa platform Netloka mewajibkan siswa menyelesaikan dan meluluskan proyek fondasi Small Office Notaris sebelum membuka akses ke kasus skala menengah hingga enterprise?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Untuk memastikan pemahaman prinsip dasar BoQ, PoE, kalkulasi port, dan segmentasi sebelum menghadapi kompleksitas redundansi HA dan multi-switch.",
              },
              {
                id: "opt-2",
                text: "Karena kasus enterprise memerlukan pembayaran biaya langganan tambahan.",
              },
              {
                id: "opt-3",
                text: "Agar siswa tidak cepat menyelesaikan seluruh studi kasus.",
              },
              {
                id: "opt-4",
                text: "Karena sistem database Netloka tidak mampu memproses dua proyek sekaligus.",
              },
            ],
          },
          {
            id: "plan-l10-sum1",
            type: "summary",
            title: "Rangkuman Komparasi Kasus & Prasyarat",
            keyPoints: [
              "Kebutuhan jaringan bervariasi drastis: warnet mengutamakan Dual-WAN dan QoS, gudang mengutamakan segmentasi 3 VLAN, sedangkan enterprise mengutamakan backbone fiber 10G.",
              "Prerequisite Proof Gating memastikan fondasi teknis kokoh sebelum siswa melangkah ke proyek enterprise berskala besar.",
              "Hasil proposal tersimpan permanen di Portofolio Konsultan dengan versi rubrik 1.0 tanpa perubahan historis yang tidak diinginkan.",
            ],
          },
          {
            id: "plan-l10-rew1",
            type: "reward",
            xp: 60,
            badgeTitle: "Senior Network Consultant",
            message: "Selamat! Anda telah menyelesaikan seluruh 10 pelajaran pada Jalur Pembelajaran Network Planning & IT Consultant.",
          },
        ],
      },
    },
  ],
};
