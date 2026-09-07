import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Kapasitas Port, AP, PoE & Penyusunan BoQ (P6-M2)
 *
 * Covers switch port planning with growth buffers (20-30%), AP density & coverage,
 * PoE 802.3af/at/bt power budgets, and compiling realistic Bill of Quantities (BoQ)
 * balancing CAPEX, OPEX, and hardware compatibility.
 */
export const capacityProcurementModuleData: CurriculumModule = {
  id: "module-capacity-procurement",
  slug: "capacity-procurement",
  title: "Kapasitas Port, AP, PoE & Penyusunan BoQ",
  description:
    "Pelajari teknik perhitungan kapasitas fisik infrastruktur: perencanaan port switch dengan growth buffer, densitas Access Point, kalkulasi power budget PoE, serta penyusunan Bill of Quantities (BoQ) yang presisi dan hemat biaya.",
  orderIndex: 2,
  prerequisites: ["requirements-analysis"],
  outcomes: [
    {
      id: "PLAN-M2-O1",
      text: "Siswa dapat menghitung kebutuhan port switch fisik, densitas radio AP, dan kalkulasi daya PoE untuk mencegah kelebihan beban kelistrikan.",
    },
    {
      id: "PLAN-M2-O2",
      text: "Siswa dapat menyusun dokumen Bill of Quantities (BoQ) lengkap yang memadukan perangkat aktif, material pasif, dan estimasi biaya realistis.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 3: perhitungan-port-ap-poe (P6-L03)
    // =========================================================================
    {
      id: "lesson-perhitungan-port-ap-poe",
      slug: "perhitungan-port-ap-poe",
      title: "Perhitungan Port, Densitas AP, dan Anggaran Daya PoE",
      description:
        "Menghitung densitas port switch dengan margin pertumbuhan (spare growth), coverage Access Point, serta power budget switch PoE sesuai standar 802.3af/at/bt.",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["kriteria-keberhasilan"],
      outcomes: [
        {
          id: "PLAN-L3-A",
          text: "Siswa dapat merumuskan total kebutuhan port switch dengan formula port terpasang ditambah cadangan ekspansi (spare capacity) 20-30%.",
        },
        {
          id: "PLAN-L3-B",
          text: "Siswa dapat menghitung kalkulasi daya PoE switch (Watt budget) berdasarkan rating konsumsi maksimum Access Point dan perangkat IoT.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L3-A",
          teachingBlockIds: ["plan-l3-h1", "plan-l3-txt1", "plan-l3-callout1"],
          activityIds: ["plan-l3-code1"],
          assessmentItemIds: ["quiz-plan-l3-q1", "quiz-plan-l3-q2"],
        },
        {
          outcomeId: "PLAN-L3-B",
          teachingBlockIds: ["plan-l3-h2", "plan-l3-txt2", "plan-l3-callout2"],
          activityIds: ["plan-l3-code1"],
          assessmentItemIds: ["quiz-plan-l3-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l3-h1",
            type: "heading",
            level: 2,
            text: "Formula Perhitungan Port Switch & Buffer Pertumbuhan",
          },
          {
            id: "plan-l3-txt1",
            type: "text",
            format: "markdown",
            content:
              "Kesalahan paling fatal dalam pengadaan switch adalah membeli switch dengan jumlah port yang persis sama dengan jumlah komputer saat ini.\n\nJika kantor memiliki 16 PC dan Anda membeli switch 16-port, maka pada hari pertama jaringan Anda sudah mengalami **port exhaustion** (kehabisan port), karena tidak ada port tersisa untuk:\n1. Uplink ke Router Gateway (1 port).\n2. Uplink ke Access Point Wi-Fi (1-3 port).\n3. Koneksi Printer Jaringan / NAS Server (1-2 port).\n4. Penambahan karyawan baru tahun depan (*Growth Buffer*).\n\nStandar industri networking merekomendasikan **Buffer Pertumbuhan minimal 20% - 30%**:\n\n$$\\text{Kapasitas Switch Minimum} = (\\text{PC Staf} + \\text{Printer/Server} + \\text{AP Uplink} + \\text{Router Uplink}) \\times 1.25\$$",
          },
          {
            id: "plan-l3-callout1",
            type: "callout",
            variant: "info",
            title: "Ukuran Port Standar Industri Switch",
            content:
              "Switch jaringan diproduksi dalam form-factor kelipatan standar: **8-port**, **16-port**, **24-port**, dan **48-port**. Selalu bulatkan hasil perhitungan ke atas menuju form-factor standar berikutnya.",
          },
          {
            id: "plan-l3-code1",
            type: "code",
            language: "markdown",
            filename: "simulasi-port-kantor.txt",
            code:
              "Kebutuhan Kantor Notaris (12 Staf):\n- 12 PC Staf Meja Kerja\n- 2 Network Multi-Function Printer (MFP)\n- 2 Access Point Wi-Fi Tamu & Ruang Rapat\n- 1 Uplink ke Router Gateway\n---------------------------------------------\nSubtotal Terpasang : 17 Port Aktif\nBuffer Pertumbuhan : 17 x 25% = 4.25 (dibulatkan 5 Port Cadangan)\nTotal Port Ideal   : 17 + 5 = 22 Port\n\nPilihan Switch Komersial: Switch 24-Port Gigabit (Sangat Tepat!)",
          },
          {
            id: "plan-l3-h2",
            type: "heading",
            level: 2,
            text: "Kalkulasi Daya PoE (Power over Ethernet) & Power Budget",
          },
          {
            id: "plan-l3-txt2",
            type: "text",
            format: "markdown",
            content:
              "Power over Ethernet (PoE) mengalirkan daya listrik DC bersama sinyal data melalui 4-pair kabel UTP Cat5e/Cat6. Namun setiap switch PoE memiliki **Power Budget (Watt Total)** yang terbatas.\n\nStandar Standar IEEE PoE:\n* **IEEE 802.3af (PoE):** Pasokan daya maksimal 15.4 Watt per port (cocok untuk IP Phone, AP indoor standar single-radio).\n* **IEEE 802.3at (PoE+):** Pasokan daya maksimal 30 Watt per port (wajib untuk AP Wi-Fi 6 berkecepatan tinggi, kamera IP PTZ dengan inframerah).\n* **IEEE 802.3bt (PoE++):** Pasokan daya hingga 60W - 90W per port (AP Wi-Fi 7 quad-radio, smart lighting, digital signage).\n\nJika total daya yang ditarik oleh semua AP melebihi PoE Power Budget switch, port akan mengalami *power cycle reboot* berulang kali saat trafik tinggi!",
          },
          {
            id: "plan-l3-callout2",
            type: "callout",
            variant: "warning",
            title: "Kalkulasi Safety Margin Daya PoE",
            content:
              "Konsultan wajib menyisakan margin keamanan daya minimal **20%** dari total watt rating switch. Jika 4 AP Wi-Fi 6 masing-masing membutuhkan daya puncak 25W (total 100W), pilihlah switch PoE dengan power budget minimal 125W - 150W.",
          },
          {
            id: "quiz-plan-l3-q1",
            type: "quiz",
            quizId: "quiz-plan-l3-q1",
            question:
              "Sebuah kantor memiliki 18 komputer staf, 2 printer jaringan, 3 unit Access Point, dan 1 link ke router. Berapakah switch standar industri yang paling tepat dipilih untuk mengakomodasi kebutuhan saat ini sekaligus menyisakan growth buffer yang sehat?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Switch 16-port (cukup karena tidak semua PC menyala bersamaan).",
              },
              {
                id: "opt-2",
                text: "Switch 24-port (tepat, menampung 24 port dengan sisa port cadangan).",
              },
              {
                id: "opt-3",
                text: "Switch 8-port sebanyak 3 unit di-daisy chain.",
              },
              {
                id: "opt-4",
                text: "Switch 48-port (terlalu boros dan melebihi anggaran kecil).",
              },
            ],
          },
          {
            id: "quiz-plan-l3-q2",
            type: "quiz",
            quizId: "quiz-plan-l3-q2",
            question:
              "Apa konsekuensi teknis jika seorang konsultan menghubungkan Access Point Wi-Fi 6 yang membutuhkan standar daya 802.3at (PoE+ 25 Watt) ke switch lama yang hanya mendukung 802.3af (PoE standar 15.4 Watt)?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Access Point akan otomatis mengubah tegangan kabel menjadi 220V AC.",
              },
              {
                id: "opt-2",
                text: "Access Point akan kekurangan daya (underpowered), menyebabkan radio 5 GHz mati, reboot berulang kali (boot loop), atau performa throughput anjlok drastis.",
              },
              {
                id: "opt-3",
                text: "Kabel UTP akan langsung terbakar dalam hitungan detik.",
              },
              {
                id: "opt-4",
                text: "Koneksi internet klien akan otomatis menjadi lebih cepat.",
              },
            ],
          },
          {
            id: "quiz-plan-l3-q3",
            type: "quiz",
            quizId: "quiz-plan-l3-q3",
            question:
              "Anda merancang jaringan dengan 8 unit Access Point PoE+ (konsumsi daya puncak 20 Watt per unit). Berapakah PoE Power Budget switch minimum yang direkomendasikan dengan memperhitungkan safety margin 20%?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "60 Watt.",
              },
              {
                id: "opt-2",
                text: "160 Watt.",
              },
              {
                id: "opt-3",
                text: "200 Watt (160 Watt kebutuhan puncak + 40 Watt margin pengaman).",
              },
              {
                id: "opt-4",
                text: "1000 Watt.",
              },
            ],
          },
          {
            id: "plan-l3-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Perhitungan port switch harus memperhitungkan seluruh node kabel (PC, AP, printer, server, router) ditambah 20-30% buffer ekspansi.",
              "Form-factor switch komersial menggunakan kelipatan standar 8, 16, 24, dan 48 port.",
              "Perangkat modern seperti AP Wi-Fi 6/7 memerlukan standar PoE+ (802.3at) atau PoE++ (802.3bt) dengan kalkulasi power budget switch yang memiliki safety margin.",
            ],
          },
          {
            id: "plan-l3-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "Infrastructure Capacity Planner",
            message:
              "Hebat! Anda telah menguasai kalkulasi kapasitas port switch, densitas AP, dan power budget PoE secara matematis.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 4: penyusunan-boq-anggaran (P6-L04)
    // =========================================================================
    {
      id: "lesson-penyusunan-boq-anggaran",
      slug: "penyusunan-boq-anggaran",
      title: "Penyusunan Bill of Quantities (BoQ) & Optimasi Anggaran",
      description:
        "Menyusun Bill of Quantities (BoQ) pengadaan perangkat aktif dan material pasif, menghitung biaya CAPEX/OPEX, dan menyeimbangkan performa terhadap batas anggaran klien.",
      orderIndex: 1,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["perhitungan-port-ap-poe"],
      outcomes: [
        {
          id: "PLAN-L4-A",
          text: "Siswa dapat menyusun tabel Bill of Quantities (BoQ) yang mencakup komponen perangkat aktif, perangkat pasif, dan aksesoris instalasi.",
        },
        {
          id: "PLAN-L4-B",
          text: "Siswa dapat melakukan optimasi pengadaan agar spesifikasi teknis terpenuhi 100% tanpa melampaui pagu anggaran (budget constraint).",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L4-A",
          teachingBlockIds: ["plan-l4-h1", "plan-l4-txt1", "plan-l4-callout1"],
          activityIds: ["plan-l4-code1"],
          assessmentItemIds: ["quiz-plan-l4-q1", "quiz-plan-l4-q2"],
        },
        {
          outcomeId: "PLAN-L4-B",
          teachingBlockIds: ["plan-l4-h2", "plan-l4-txt2", "plan-l4-callout2"],
          activityIds: ["plan-l4-code1"],
          assessmentItemIds: ["quiz-plan-l4-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l4-h1",
            type: "heading",
            level: 2,
            text: "Struktur Dokumen Bill of Quantities (BoQ) Profesional",
          },
          {
            id: "plan-l4-txt1",
            type: "text",
            format: "markdown",
            content:
              "Bill of Quantities (BoQ) atau Rencana Anggaran Biaya (RAB) adalah daftar rincian item pengadaan yang memuat deskripsi spesifikasi, kuantitas, harga satuan, dan total biaya investasi.\n\nDalam infrastruktur jaringan, BoQ dibagi menjadi 3 kategori utama:\n\n1. **Perangkat Aktif (Active Hardware):** Perangkat elektronik yang memerlukan daya listrik dan memproses paket data (Router, Managed Switch, PoE Switch, Access Point, Firewall Appliance, Server).\n2. **Material Pasif (Passive Infrastructure):** Media penghantar fisik dan terminasi kabel (Roll kabel UTP Cat6 305m, Patch Panel 24-port, RJ45 Modular Plug, Faceplate, Patch Cord factory-molded 1m/2m, Pipa PVC Conduit).\n3. **Perangkat Pendukung & Rak (Mounting & Power Protection):** Wallmount Server Rack 6U/9U, PDU (Power Distribution Unit), UPS (Uninterruptible Power Supply) 1000VA - 2000VA.",
          },
          {
            id: "plan-l4-callout1",
            type: "callout",
            variant: "tip",
            title: "Jangan Lupakan Biaya Material Pasif",
            content:
              "Pemula sering kali hanya menghitung harga router dan switch. Pada instalasi nyata, material pasif (kabel, patch panel, rak server, dan aksesoris) menyumbang **20% - 35%** dari total anggaran fisik!",
          },
          {
            id: "plan-l4-code1",
            type: "code",
            language: "markdown",
            filename: "contoh-tabel-boq.txt",
            code:
              "+----+-----------------------------------+-----+--------+--------------+--------------+\n| No | Item Deskripsi                    | Qty | Satuan | Harga Satuan | Total Biaya  |\n+----+-----------------------------------+-----+--------+--------------+--------------+\n| 1  | Router Gateway 5-Port Gigabit     | 1   | Unit   | Rp 1.250.000 | Rp 1.250.000 |\n| 2  | Switch 24-Port Gigabit PoE+ 370W  | 1   | Unit   | Rp 4.800.000 | Rp 4.800.000 |\n| 3  | Access Point Wi-Fi 6 AX3000       | 2   | Unit   | Rp 1.350.000 | Rp 2.700.000 |\n| 4  | Roll Kabel UTP Cat6 305m          | 1   | Roll   | Rp 1.450.000 | Rp 1.450.000 |\n| 5  | Patch Panel 24-Port Cat6 1U       | 1   | Unit   | Rp   450.000 | Rp   450.000 |\n| 6  | Wallmount Rack 9U + PDU 6-Outlet  | 1   | Unit   | Rp 1.800.000 | Rp 1.800.000 |\n| 7  | UPS Line-Interactive 1200VA/720W  | 1   | Unit   | Rp 1.650.000 | Rp 1.650.000 |\n+----+-----------------------------------+-----+--------+--------------+--------------+\n| TOTAL ANGGARAN PENGADAAN (CAPEX)                                     | Rp14.100.000 |\n+----------------------------------------------------------------------+--------------+",
          },
          {
            id: "plan-l4-h2",
            type: "heading",
            level: 2,
            text: "Strategi Optimasi Anggaran & Analisis Nilai (Value Engineering)",
          },
          {
            id: "plan-l4-txt2",
            type: "text",
            format: "markdown",
            content:
              "Jika total BoQ awal melebihi pagu anggaran (*Over Budget*), konsultan dilarang menurunkan kualitas konektivitas esensial (seperti menghilangkan router atau membeli switch unmanaged untuk jaringan yang butuh VLAN).\n\nLangkah **Value Engineering** yang benar:\n* **Pisahkan PoE dan Non-PoE:** Jika hanya ada 2 AP, Anda tidak wajib membeli switch 24-port full PoE yang mahal. Anda bisa menggunakan switch 24-port Gigabit non-PoE standar, lalu menambahkan **PoE Injector 30W** mandiri untuk kedua AP tersebut.\n* **Pilih Switch Smart-Managed vs Fully Enterprise Layer 3:** Untuk kantor kecil (SOHO), switch Smart Managed L2 (mendukung 802.1Q VLAN dan web GUI) jauh lebih hemat daripada switch Enterprise L3 berbasis command line chassis.\n* **Hindari Over-Specification:** Membeli Router 10-Gigabit SFP+ untuk kantor dengan koneksi internet 50 Mbps adalah pemborosan anggaran.",
          },
          {
            id: "plan-l4-callout2",
            type: "callout",
            variant: "warning",
            title: "Aturan Netloka Consultant Engine",
            content:
              "Di Netloka Consultant Workspace, pengadaan yang melebihi pagu anggaran (*Over Budget*) akan mendapatkan skor Cost Efficiency = 0. Namun, menghemat biaya dengan menghilangkan perangkat inti (Router) juga akan otomatis menyebabkan proposal GAGAL.",
          },
          {
            id: "quiz-plan-l4-q1",
            type: "quiz",
            quizId: "quiz-plan-l4-q1",
            question:
              "Manakah dari daftar item berikut yang seluruhnya tergolong ke dalam kategori Material Pasif (Passive Infrastructure) dalam BoQ jaringan?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Router Gateway, Switch Managed, dan Access Point Wi-Fi 6.",
              },
              {
                id: "opt-2",
                text: "Roll kabel UTP Cat6, Patch Panel 24-port RJ45, Faceplate modular, dan Patch Cord.",
              },
              {
                id: "opt-3",
                text: "Server Database, NAS Storage, dan PDU Listrik.",
              },
              {
                id: "opt-4",
                text: "Firewall hardware dan Mikrotik Cloud Router Switch.",
              },
            ],
          },
          {
            id: "quiz-plan-l4-q2",
            type: "quiz",
            quizId: "quiz-plan-l4-q2",
            question:
              "Klien memiliki pagu anggaran Rp 15.000.000. Jika draf BoQ Anda mencapai Rp 16.500.000 (over budget 1.5 juta), langkah optimasi teknis manakah yang paling etis dan profesional?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Menghapus router gateway dan membiarkan modem ISP menangani seluruh beban routing dan DHCP.",
              },
              {
                id: "opt-2",
                text: "Mengganti switch full-PoE 24-port berharga mahal dengan switch gigabit non-PoE 24-port ditambah 2 unit adaptor PoE Injector mandiri untuk menyuplai Access Point.",
              },
              {
                id: "opt-3",
                text: "Menggunakan kabel telepon tembaga bekas untuk menghemat biaya kabel data.",
              },
              {
                id: "opt-4",
                text: "Mengurangi jumlah port switch sehingga 6 komputer karyawan tidak bisa terhubung.",
              },
            ],
          },
          {
            id: "quiz-plan-l4-q3",
            type: "quiz",
            quizId: "quiz-plan-l4-q3",
            question:
              "Mengapa dalam evaluasi proposal IT Consultant Netloka, efisiensi biaya (Cost Efficiency) yang tinggi tidak dapat menyelamatkan proposal yang tidak memiliki Router Gateway?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Karena tanpa router gateway, jaringan lokal tidak memiliki penerjemah rute L3 dan NAT untuk mengakses internet, sehingga jaringan gagal berfungsi secara esensial.",
              },
              {
                id: "opt-2",
                text: "Karena router adalah perangkat paling mahal di dalam katalog.",
              },
              {
                id: "opt-3",
                text: "Karena warna router membuat tampilan rak server lebih menarik.",
              },
              {
                id: "opt-4",
                text: "Karena vendor switch mewajibkan pembelian router dari merk yang sama.",
              },
            ],
          },
          {
            id: "plan-l4-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "BoQ profesional mengintegrasikan perangkat aktif (Router, Switch, AP), material pasif (Kabel, Patch Panel), dan proteksi fisik (Rak, UPS).",
              "Value Engineering adalah teknik menurunkan biaya pengadaan melalui pemilihan komponen alternatif cerdas tanpa mengorbankan fungsionalitas dan keamanan.",
              "Keberhasilan anggaran (hemat biaya) tidak pernah boleh dicapai dengan mengorbankan konektivitas esensial jaringan.",
            ],
          },
          {
            id: "plan-l4-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "BoQ & Procurement Strategist",
            message:
              "Luar biasa! Anda telah menguasai cara menyusun Bill of Quantities (BoQ) realistis dan melakukan Value Engineering yang efisien.",
          },
        ],
      },
    },
  ],
};
