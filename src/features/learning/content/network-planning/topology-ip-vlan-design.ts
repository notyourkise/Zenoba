import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Desain Topologi Hirarkis, Subnetting & VLAN (P6-M3)
 *
 * Covers 3-tier and collapsed-core hierarchical network architectures,
 * role distribution (Core, Distribution, Access), link redundancy,
 * VLSM subnet allocation, consistent gateway planning, and 802.1Q VLAN segmentation.
 */
export const topologyIpVlanDesignModuleData: CurriculumModule = {
  id: "module-topology-ip-vlan-design",
  slug: "topology-ip-vlan-design",
  title: "Desain Topologi Hirarkis, Subnetting & VLAN",
  description:
    "Pelajari arsitektur desain jaringan enterprise: model hierarkis Core-Distribution-Access, eliminasi Single Point of Failure (SPOF), alokasi subnet IP berbasis VLSM efisien, dan segmentasi keamanan VLAN terisolasi.",
  orderIndex: 3,
  prerequisites: ["capacity-procurement"],
  outcomes: [
    {
      id: "PLAN-M3-O1",
      text: "Siswa dapat merancang diagram arsitektur topologi jaringan hirarkis (Core-Distribution-Access / Collapsed Core) dengan pemisahan peran perangkat yang tepat.",
    },
    {
      id: "PLAN-M3-O2",
      text: "Siswa dapat menyusun skema pengalamatan IP hierarkis berbasis VLSM dan tabel alokasi VLAN 802.1Q yang konsisten dan bebas tumpang tindih (no IP overlap).",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 5: desain-topologi-hirarkis (P6-L05)
    // =========================================================================
    {
      id: "lesson-desain-topologi-hirarkis",
      slug: "desain-topologi-hirarkis",
      title: "Desain Arsitektur Topologi Hirarkis & Distribusi Peran",
      description:
        "Memahami prinsip model 3-tier (Core, Distribution, Access), arsitektur Collapsed Core untuk bisnis menengah, peran uplink redundan, dan eliminasi Single Point of Failure (SPOF).",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["penyusunan-boq-anggaran"],
      outcomes: [
        {
          id: "PLAN-L5-A",
          text: "Siswa dapat menjelaskan pembagian fungsi dan tanggung jawab perangkat pada lapisan Access, Distribution, dan Core.",
        },
        {
          id: "PLAN-L5-B",
          text: "Siswa dapat merancang topologi Collapsed Core yang andal dengan tautan redundan tanpa menimbulkan loop Layer 2.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L5-A",
          teachingBlockIds: ["plan-l5-h1", "plan-l5-txt1", "plan-l5-callout1"],
          activityIds: ["plan-l5-code1"],
          assessmentItemIds: ["quiz-plan-l5-q1", "quiz-plan-l5-q2"],
        },
        {
          outcomeId: "PLAN-L5-B",
          teachingBlockIds: ["plan-l5-h2", "plan-l5-txt2", "plan-l5-callout2"],
          activityIds: ["plan-l5-code1"],
          assessmentItemIds: ["quiz-plan-l5-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l5-h1",
            type: "heading",
            level: 2,
            text: "Model Jaringan Hierarkis: Core, Distribution, dan Access",
          },
          {
            id: "plan-l5-txt1",
            type: "text",
            format: "markdown",
            content:
              "Jaringan flat (semua switch dihubungkan secara sembarangan rantai daisy-chain) sangat rentan terhadap *broadcast storm*, *bottleneck*, dan sulit di-troubleshoot saat terjadi gangguan.\n\nIndustri jaringan enterprise menggunakan **Model Desain Hierarkis (Hierarchical Design Model)**:\n\n1. **Access Layer (Lapisan Akses):**\n   - Menghubungkan perangkat pengguna akhir (Workstation PC, Laptop, Printer, IP Camera, AP Wi-Fi).\n   - Fitur utama: Port Security (MAC limiting), 802.1Q VLAN assignment, PoE delivery, QoS marking.\n\n2. **Distribution Layer (Lapisan Distribusi):**\n   - Titik agregasi dari beberapa switch Access di setiap lantai atau gedung.\n   - Fitur utama: Inter-VLAN routing, Access Control List (ACL) filtering, Quality of Service (QoS), boundary broadcast domain.\n\n3. **Core Layer (Lapisan Inti / Backbone):**\n   - Jalan tol berkecepatan tinggi antar gedung atau antar pusat data.\n   - Prinsip utama: *High-speed switching*, throughput maksimal, latensi serendah mungkin, tanpa pemrosesan ACL rumit yang membebani CPU.\n\nUntuk skala kantor kecil hingga menengah (SOHO / SME), lapisan Core dan Distribution digabungkan menjadi satu arsitektur efisien yang disebut **Collapsed Core Architecture**.",
          },
          {
            id: "plan-l5-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Collapsed Core untuk UKM & SOHO",
            content:
              "Dalam arsitektur Collapsed Core, satu unit Core/Distribution Switch L3 (atau Router performa tinggi) berfungsi sekaligus sebagai gateway routing antar VLAN, penghubung WAN, dan agregator untuk semua Access Switch di lantai kerja.",
          },
          {
            id: "plan-l5-code1",
            type: "code",
            language: "markdown",
            filename: "arsitektur-topologi-hirarkis.txt",
            code:
              "                  +--------------------------+\n                  | Dual ISP Gateway / WAN   |\n                  +------------+-------------+\n                               |\n                  +------------+-------------+\n                  | Router / Core Firewall   |\n                  +------------+-------------+\n                               |\n         +---------------------+---------------------+\n         |                                           |\n+--------+----------------+                 +--------+----------------+\n| Access Switch Lt.1 PoE  |                 | Access Switch Lt.2 PoE  |\n+--------+----------------+                 +--------+----------------+\n         |                                           |\n    +----+----+                                 +----+----+\n    |         |                                 |         |\n[12 PC]    [2 AP]                            [18 PC]    [2 AP]",
          },
          {
            id: "plan-l5-h2",
            type: "heading",
            level: 2,
            text: "Mengeliminasi Single Point of Failure (SPOF)",
          },
          {
            id: "plan-l5-txt2",
            type: "text",
            format: "markdown",
            content:
              "**Single Point of Failure (SPOF)** adalah titik tunggal pada jaringan yang jika mengalami kerusakan fisik atau kegagalan daya, akan melumpuhkan seluruh operasional bisnis.\n\nStrategi Mitigasi SPOF oleh Konsultan IT:\n* **Redundansi ISP (Dual-WAN Failover):** Menggunakan 2 penyedia layanan internet berbeda (contoh: Fiber Optic IndiHome/Biznet sebagai primary + Seluler 4G/5G atau Wireless PTP sebagai backup).\n* **Redundansi Uplink (Link Aggregation / LACP):** Menggabungkan 2 kabel fisik antara Access Switch dan Core Switch (meningkatkan bandwidth sekaligus failover seketika jika 1 kabel putus).\n* **Redundansi Daya (UPS):** Menempatkan UPS line-interactive pada lemari rak server agar switch dan router tetap menyala saat listrik PLN padam tiba-tiba.",
          },
          {
            id: "plan-l5-callout2",
            type: "callout",
            variant: "warning",
            title: "Bahaya Daisy-Chaining Tanpa Hirarki",
            content:
              "Menghubungkan Switch A -> Switch B -> Switch C -> Switch D secara berantai (*daisy chain*) adalah anti-pattern terbesar. Jika Switch B mati atau kabelnya tersenggol, Switch C dan D beserta seluruh penggunanya otomatis terputus dari jaringan!",
          },
          {
            id: "quiz-plan-l5-q1",
            type: "quiz",
            quizId: "quiz-plan-l5-q1",
            question:
              "Dalam model jaringan 3-tier, lapisan (layer) manakah yang memiliki fungsi utama menghubungkan perangkat komputer pengguna, menerapkan Port Security, dan mengalirkan daya listrik PoE?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Core Layer.",
              },
              {
                id: "opt-2",
                text: "Access Layer.",
              },
              {
                id: "opt-3",
                text: "Distribution Layer.",
              },
              {
                id: "opt-4",
                text: "Internet Service Provider (ISP) Layer.",
              },
            ],
          },
          {
            id: "quiz-plan-l5-q2",
            type: "quiz",
            quizId: "quiz-plan-l5-q2",
            question:
              "Mengapa arsitektur Collapsed Core sangat populer dan direkomendasikan untuk jaringan kantor menengah (SME / Small Office)?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Karena arsitektur ini menggabungkan fungsi Core dan Distribution ke dalam satu perangkat yang sama, menghemat biaya pengadaan hardware dan kompleksitas kabel.",
              },
              {
                id: "opt-2",
                text: "Karena arsitektur ini tidak memerlukan switch maupun router.",
              },
              {
                id: "opt-3",
                text: "Karena arsitektur ini secara otomatis melarang penggunaan koneksi internet nirkabel Wi-Fi.",
              },
              {
                id: "opt-4",
                text: "Karena arsitektur ini hanya bisa menggunakan kabel fiber optik 100G.",
              },
            ],
          },
          {
            id: "quiz-plan-l5-q3",
            type: "quiz",
            quizId: "quiz-plan-l5-q3",
            question:
              "Sebuah warnet gaming dengan 30 PC mengalami kelumpuhan total setiap kali kabel ISP fiber putus tertabrak truk. Desain redundansi paling hemat biaya untuk mengeliminasi SPOF ini adalah:",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Membeli 30 unit PC baru.",
              },
              {
                id: "opt-2",
                text: "Memasang router Dual-WAN dengan link ISP sekunder (failover otomatis ke ISP cadangan atau modem seluler 4G/5G).",
              },
              {
                id: "opt-3",
                text: "Menyambung ulang kabel serat optik menggunakan lem kertas.",
              },
              {
                id: "opt-4",
                text: "Mengganti semua switch gigabit menjadi switch fast ethernet 100 Mbps.",
              },
            ],
          },
          {
            id: "plan-l5-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Model hirarkis membagi jaringan menjadi Access (koneksi endpoint), Distribution (routing & filtering), dan Core (kecepatan tinggi).",
              "Arsitektur Collapsed Core adalah standar terbaik untuk kantor skala kecil-menengah guna menyeimbangkan biaya dan modularitas.",
              "Eliminasi Single Point of Failure (SPOF) dilakukan melalui redundansi WAN (Dual-ISP), link uplink ganda, dan proteksi daya UPS.",
            ],
          },
          {
            id: "plan-l5-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "Hierarchical Topology Designer",
            message:
              "Hebat! Anda telah menguasai arsitektur jaringan modular Core-Distribution-Access dan teknik mitigasi SPOF.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 6: perencanaan-ip-dan-vlan (P6-L06)
    // =========================================================================
    {
      id: "lesson-perencanaan-ip-dan-vlan",
      slug: "perencanaan-ip-dan-vlan",
      title: "Perencanaan Alokasi Subnet IP & Segmentasi VLAN",
      description:
        "Mendesain skema pengalamatan IPv4 hierarkis berbasis VLSM, alokasi Default Gateway konsisten, dan segmentasi keamanan lintas departemen melalui VLAN 802.1Q.",
      orderIndex: 1,
      estimatedMinutes: 16,
      xpReward: 60,
      prerequisites: ["desain-topologi-hirarkis"],
      outcomes: [
        {
          id: "PLAN-L6-A",
          text: "Siswa dapat merancang tabel alokasi subnetting IP menggunakan VLSM (Variable Length Subnet Masking) tanpa terjadi tabrakan alamat (IP address overlap).",
        },
        {
          id: "PLAN-L6-B",
          text: "Siswa dapat menyusun skema penomoran VLAN ID dan pemetaan subnet yang terstandarisasi untuk isolasi keamanan lalu lintas data.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L6-A",
          teachingBlockIds: ["plan-l6-h1", "plan-l6-txt1", "plan-l6-callout1"],
          activityIds: ["plan-l6-code1"],
          assessmentItemIds: ["quiz-plan-l6-q1", "quiz-plan-l6-q2"],
        },
        {
          outcomeId: "PLAN-L6-B",
          teachingBlockIds: ["plan-l6-h2", "plan-l6-txt2", "plan-l6-callout2"],
          activityIds: ["plan-l6-code1"],
          assessmentItemIds: ["quiz-plan-l6-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l6-h1",
            type: "heading",
            level: 2,
            text: "Penyusunan Skema Pengalamatan IP Hierarkis (VLSM)",
          },
          {
            id: "plan-l6-txt1",
            type: "text",
            format: "markdown",
            content:
              "Perancangan alamat IP profesional harus memenuhi 3 syarat utama:\n1. **Bebas Overlap:** Tidak ada subnet yang bertumpang tindih satu sama lain di dalam tabel routing internal.\n2. **Hierarkis & Mudah Diingat:** Format penomoran oktet ke-3 mencerminkan VLAN ID atau nomor lantai (contoh: VLAN 10 menggunakan subnet `192.168.10.0/24`, VLAN 20 menggunakan `192.168.20.0/24`).\n3. **Konsistensi Gateway:** Selalu gunakan IP pertama usable (`.1`) atau IP terakhir usable untuk Default Gateway router di seluruh subnet secara seragam.\n\nDalam lingkungan dengan keterbatasan ruang IP privat (RFC 1918), teknik **VLSM (Variable Length Subnet Masking)** digunakan untuk mengalokasikan subnet dengan ukuran yang presisi sesuai kebutuhan host masing-masing departemen.",
          },
          {
            id: "plan-l6-callout1",
            type: "callout",
            variant: "tip",
            title: "Standar Penomoran IP & Gateway Netloka",
            content:
              "Gunakan IP host pertama (`.1`) sebagai Default Gateway untuk setiap interface VLAN router. Ini adalah konvensi industri yang paling mudah dioperasikan dan mencegah kebingungan teknisi lapangan.",
          },
          {
            id: "plan-l6-code1",
            type: "code",
            language: "markdown",
            filename: "tabel-desain-ip-vlan.txt",
            code:
              "+---------+---------------+------------------+----------------+----------------+--------------+\n| VLAN ID | Nama Segmen   | Network Subnet   | Netmask        | Usable Hosts   | Def. Gateway |\n+---------+---------------+------------------+----------------+----------------+--------------+\n| VLAN 10 | Manajemen-IT  | 192.168.10.0/27  | 255.255.255.224| 192.168.10.1-30| .10.1        |\n| VLAN 20 | Staf-Kantor   | 192.168.20.0/24  | 255.255.255.0  | 192.168.20.1-254| .20.1       |\n| VLAN 30 | Server-Lokal  | 192.168.30.0/28  | 255.255.255.240| 192.168.30.1-14| .30.1        |\n| VLAN 40 | Wi-Fi Tamu    | 172.16.40.0/23   | 255.255.254.0  | 172.16.40.1-41.254| .40.1     |\n| VLAN 99 | Native/Mgmt   | 10.99.99.0/29    | 255.255.255.248| 10.99.99.1-6   | .99.1        |\n+---------+---------------+------------------+----------------+----------------+--------------+",
          },
          {
            id: "plan-l6-h2",
            type: "heading",
            level: 2,
            text: "Segmentasi VLAN & Kebijakan Isolasi Keamanan",
          },
          {
            id: "plan-l6-txt2",
            type: "text",
            format: "markdown",
            content:
              "VLAN (Virtual Local Area Network) memecah satu switch fisik menjadi beberapa domain broadcast logis yang terisolasi secara mandiri.\n\nAturan Desain VLAN untuk Konsultan IT:\n1. **Pemisahan Trafik Tamu (Guest Isolation):** VLAN Tamu hanya diizinkan meresolusi DNS dan mengakses internet publik (NAT). Akses ke subnet Staf dan Server internal wajib di-drop oleh aturan firewall filter router.\n2. **Pemisahan Jaringan IoT & CCTV:** Kamera IP dan perangkat pintar (smart TV/lampu) wajib berada di VLAN terpisah agar tidak bisa disusupi peretas untuk mengintai jaringan komputer staf.\n3. **Hindari VLAN 1 untuk Data Sensitif:** Jangan pernah menempatkan server atau staf di VLAN default (VLAN 1). Ubah Native VLAN pada port trunk ke nomor khusus (misalnya VLAN 99) untuk mitigasi serangan *VLAN Hopping*.",
          },
          {
            id: "plan-l6-callout2",
            type: "callout",
            variant: "warning",
            title: "Validasi Evaluator Netloka Consultant",
            content:
              "Ketika menyelesaikan skenario di Consultant Workspace yang mensyaratkan VLAN, pastikan Switch yang Anda pilih berjenis **Managed Switch** (mendukung 802.1Q). Pemilihan switch unmanaged akan otomatis memberikan nilai 0 pada dimensi Security & Segmentation!",
          },
          {
            id: "quiz-plan-l6-q1",
            type: "quiz",
            quizId: "quiz-plan-l6-q1",
            question:
              "Departemen Keuangan memiliki 20 PC staf dan membutuhkan keamanan data tinggi. Subnet IPv4 manakah yang paling efisien (hemat IP) namun tetap menyediakan ruang pertumbuhan yang cukup?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Subnet /28 (hanya 14 host usable, tidak cukup untuk 20 PC).",
              },
              {
                id: "opt-2",
                text: "Subnet /27 (menyediakan 30 host usable, pas untuk 20 PC + 10 cadangan).",
              },
              {
                id: "opt-3",
                text: "Subnet /24 (254 host usable, terlalu banyak IP terbuang jika ruang alamat terbatas).",
              },
              {
                id: "opt-4",
                text: "Subnet /30 (hanya 2 host usable).",
              },
            ],
          },
          {
            id: "quiz-plan-l6-q2",
            type: "quiz",
            quizId: "quiz-plan-l6-q2",
            question:
              "Manakah dari pasangan subnet berikut ini yang mengalami tabrakan pengalamatan (IP Address Overlap) sehingga akan merusak tabel routing jaringan?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Subnet A: 192.168.1.0/24 dan Subnet B: 192.168.2.0/24.",
              },
              {
                id: "opt-2",
                text: "Subnet A: 10.0.0.0/23 (rentang 10.0.0.0 - 10.0.1.255) dan Subnet B: 10.0.1.0/24 (rentang 10.0.1.0 - 10.0.1.255).",
              },
              {
                id: "opt-3",
                text: "Subnet A: 172.16.10.0/24 dan Subnet B: 172.16.20.0/24.",
              },
              {
                id: "opt-4",
                text: "Subnet A: 192.168.10.0/25 dan Subnet B: 192.168.10.128/25.",
              },
            ],
          },
          {
            id: "quiz-plan-l6-q3",
            type: "quiz",
            quizId: "quiz-plan-l6-q3",
            question:
              "Mengapa konsultan jaringan profesional wajib menempatkan Access Point Wi-Fi tamu (Guest SSID) pada VLAN terpisah dari komputer kerja staf kantor?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Agar tamu tidak dapat memindai (scan) port terbuka, mengakses file sharing rahasia, maupun menyebarkan malware ke workstation staf internal.",
              },
              {
                id: "opt-2",
                text: "Agar sinyal Wi-Fi tamu bisa memancarkan warna lampu LED yang berbeda pada Access Point.",
              },
              {
                id: "opt-3",
                text: "Karena protokol TCP/IP tidak mendukung koneksi nirkabel tanpa VLAN.",
              },
              {
                id: "opt-4",
                text: "Hanya untuk menghabiskan stok nomor VLAN pada switch.",
              },
            ],
          },
          {
            id: "plan-l6-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Perancangan IP hierarkis menggunakan VLSM menghemat ruang alamat, mencegah IP overlap, dan memudahkan standarisasi gateway.",
              "Segmentasi VLAN 802.1Q membatasi domain broadcast dan menjadi fondasi utama penegakan aturan firewall isolasi trafik antar departemen.",
              "Switch yang digunakan untuk segmentasi VLAN wajib merupakan Managed Switch yang mendukung tagging IEEE 802.1Q.",
            ],
          },
          {
            id: "plan-l6-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "IP & VLAN Architect",
            message:
              "Luar biasa! Anda telah menguasai perencanaan alokasi subnetting VLSM dan segmentasi keamanan VLAN terstandarisasi.",
          },
        ],
      },
    },
  ],
};
