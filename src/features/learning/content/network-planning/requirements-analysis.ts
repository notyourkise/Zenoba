import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Analisis Kebutuhan & Wawancara Klien (P6-M1)
 *
 * Covers distinguishing real business requirements from premature solutions,
 * active listening in client consultations, operational constraints,
 * and deriving testable quantitative acceptance criteria (SMART metrics).
 */
export const requirementsAnalysisModuleData: CurriculumModule = {
  id: "module-requirements-analysis",
  slug: "requirements-analysis",
  title: "Analisis Kebutuhan Jaringan & Wawancara Klien",
  description:
    "Pelajari metodologi konsultasi profesional: menggali kebutuhan hakiki klien melalui wawancara terstruktur, membedakan masalah bisnis dari asumsi perangkat, dan menyusun kriteria keberhasilan yang dapat diverifikasi.",
  orderIndex: 1,
  prerequisites: [],
  outcomes: [
    {
      id: "PLAN-M1-O1",
      text: "Siswa dapat membedakan antara pernyataan masalah bisnis operasional klien (problem statement) dan asumsi solusi perangkat yang diajukan secara prematur.",
    },
    {
      id: "PLAN-M1-O2",
      text: "Siswa dapat merumuskan kriteria keberhasilan proyek (Acceptance Criteria) yang spesifik, terukur, dan dapat diuji secara objektif.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 1: wawancara-klien (P6-L01)
    // =========================================================================
    {
      id: "lesson-wawancara-klien",
      slug: "wawancara-klien",
      title: "Wawancara Klien: Membedakan Kebutuhan Hakiki vs Solusi Prematur",
      description:
        "Memahami teknik wawancara konsultatif, active listening, pemetaan pain points pengguna bisnis, dan identifikasi batasan operasional (anggaran, downtime, regulasi).",
      orderIndex: 0,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: [],
      outcomes: [
        {
          id: "PLAN-L1-A",
          text: "Siswa dapat mengidentifikasi perbedaan fundamental antara 'Kebutuhan Pengguna' (What & Why) dengan 'Solusi Teknis' (How).",
        },
        {
          id: "PLAN-L1-B",
          text: "Siswa dapat menguraikan brief klien mentah menjadi daftar kendala operasional, aplikasi prioritas, dan pola jam sibuk.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L1-A",
          teachingBlockIds: ["plan-l1-h1", "plan-l1-txt1", "plan-l1-callout1"],
          activityIds: ["plan-l1-code1"],
          assessmentItemIds: ["quiz-plan-l1-q1", "quiz-plan-l1-q2"],
        },
        {
          outcomeId: "PLAN-L1-B",
          teachingBlockIds: ["plan-l1-h2", "plan-l1-txt2", "plan-l1-callout2"],
          activityIds: ["plan-l1-code1"],
          assessmentItemIds: ["quiz-plan-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l1-h1",
            type: "heading",
            level: 2,
            text: "Peran Konsultan IT: Dari Keluhan Menjadi Spesifikasi",
          },
          {
            id: "plan-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Dalam dunia industri, klien sering kali datang dengan usulan solusi perangkat yang didengar dari pihak ketiga, bukan dengan definisi masalah bisnis yang sebenarnya.\n\nContoh umum:\n* **Pernyataan Klien:** *'Tolong pasang Wi-Fi 6 mesh termahal karena internet di ruang staf lambat sekali.'*\n* **Fakta Lapangan:** Setelah dianalisis, bottleneck bukan pada sinyal Wi-Fi, melainkan bandwidth ISP yang hanya 20 Mbps dibagi untuk 50 komputer, atau kabel LAN uplink switch ruang staf yang mengalami degradasi ke 10 Mbps (Half-Duplex).\n\nSebagai konsultan jaringan profesional, tugas Anda bukan sekadar mencatat daftar belanja yang diminta klien, melainkan melakukan **wawancara diagnostik mendalam** untuk menemukan akar masalah hakiki.",
          },
          {
            id: "plan-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Konsultatif: Problem Statement vs Premature Solution",
            content:
              "Jangan pernah memesan atau merekomendasikan perangkat keras sebelum Anda memvalidasi problem statement. Solusi perangkat keras tanpa analisis kebutuhan berisiko menghabiskan anggaran tanpa menyelesaikan keluhan operasional pengguna.",
          },
          {
            id: "plan-l1-code1",
            type: "code",
            language: "markdown",
            filename: "panduan-wawancara-klien.txt",
            code:
              "1. Domain Bisnis & Alur Kerja:\n   - Aplikasi apa yang paling kritis untuk bisnis Anda? (ERP, POS Kasir, Video Call, Cloud Storage)\n   - Apa dampak finansial atau operasional jika jaringan terputus selama 1 jam?\n\n2. Populasi & Mobilitas Pengguna:\n   - Berapa jumlah staf tetap dan perkiraan jumlah tamu harian?\n   - Berapa rata-rata perangkat yang dibawa per orang (Laptop, Smartphone, Tablet)?\n\n3. Batasan Finansial & Fisik (Constraints):\n   - Berapa pagu anggaran maksimal (CAPEX pengadaan + OPEX bulanan)?\n   - Apakah gedung merupakan milik sendiri atau sewa (batasan pengeboran dinding / instalasi pipa)?",
          },
          {
            id: "plan-l1-h2",
            type: "heading",
            level: 2,
            text: "Mengekstrak Batasan Operasional (Constraints Matrix)",
          },
          {
            id: "plan-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Setiap rancangan jaringan dibatasi oleh 4 pilar kendala utama:\n\n1. **Anggaran (Budget Constraint):** Pagu biaya investasi awal (CAPEX). Desain terbaik yang melebihi anggaran klien adalah desain yang gagal.\n2. **Kebutuhan Ketersediaan (High Availability / SLA):** Apakah kantor memerlukan koneksi Dual-ISP Failover otomatis, atau cukup toleran terhadap downtime perbaikan 1-2 jam?\n3. **Keamanan & Kepatuhan Regulasi:** Apakah data keuangan staf harus diisolasi total dari akses tamu kafe atau pelanggan publik?\n4. **Fasilitas Fisik Gedung:** Ketersediaan ruang rak server (*server room/closet*), sistem pendingin udara (AC), dan stabilitas suplai listrik (kebutuhan UPS).",
          },
          {
            id: "plan-l1-callout2",
            type: "callout",
            variant: "tip",
            title: "Studi Kasus: Kantor Notaris & PPAT (SOHO)",
            content:
              "Notaris memiliki 12 staf dengan kebutuhan akses database sertifikat tanah lokal dan internet perbankan. Klien meminta internet kencang. Prioritas utama mereka sebenarnya adalah: keamanan data akta (tidak boleh diakses tamu yang menunggu di lobi), printer sharing handal, dan koneksi stabil ke server BPN.",
          },
          {
            id: "quiz-plan-l1-q1",
            type: "quiz",
            quizId: "quiz-plan-l1-q1",
            question:
              "Seorang pemilik restoran meminta Anda memasang 5 unit Access Point enterprise berharga mahal karena kasir sering gagal memproses transaksi EDC online. Berdasarkan prinsip konsultasi, langkah pertama yang tepat adalah:",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Langsung memesan 5 AP tersebut sesuai permintaan agar klien puas.",
              },
              {
                id: "opt-2",
                text: "Mewawancarai dan menganalisis apakah kegagalan EDC disebabkan oleh interferensi sinyal Wi-Fi, keterbatasan kuota bandwidth, atau ketiadaan isolasi jaringan kasir dari tamu.",
              },
              {
                id: "opt-3",
                text: "Menolak pesanan karena restoran kecil tidak memerlukan Access Point kelas enterprise.",
              },
              {
                id: "opt-4",
                text: "Menyuruh klien mengganti mesin EDC dengan transaksi tunai saja.",
              },
            ],
          },
          {
            id: "quiz-plan-l1-q2",
            type: "quiz",
            quizId: "quiz-plan-l1-q2",
            question:
              "Mengapa konsultan jaringan harus membedakan 'Problem Statement' (Pernyataan Masalah) dari 'Premature Solution' (Solusi Prematur)?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Agar konsultan dapat menjual perangkat yang memiliki margin keuntungan terbesar bagi vendor.",
              },
              {
                id: "opt-2",
                text: "Karena solusi yang diasumsikan klien sering kali keliru menargetkan gejala permukaan tanpa menyelesaikan akar penyebab teknis yang sebenarnya.",
              },
              {
                id: "opt-3",
                text: "Karena klien tidak berhak menentukan kebutuhan jaringan mereka sendiri.",
              },
              {
                id: "opt-4",
                text: "Supaya waktu pengerjaan proyek dapat diperpanjang selama mungkin.",
              },
            ],
          },
          {
            id: "quiz-plan-l1-q3",
            type: "quiz",
            quizId: "quiz-plan-l1-q3",
            question:
              "Manakah parameter di bawah ini yang tergolong sebagai batasan operasional non-teknis (Physical/Legal Constraint) yang membatasi pilihan arsitektur jaringan?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Bangunan kantor berstatus cagar budaya sewaan yang melarang pembongkaran dinding untuk jalur pipa konduit kabel tembaga.",
              },
              {
                id: "opt-2",
                text: "Panjang maksimum kabel Cat6 UTP 100 meter menurut standar TIA/EIA.",
              },
              {
                id: "opt-3",
                text: "Kapasitas tabel routing MikroTik RouterOS.",
              },
              {
                id: "opt-4",
                text: "Ukuran MTU standar Ethernet 1500 byte.",
              },
            ],
          },
          {
            id: "plan-l1-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Konsultan IT profesional membedakan kebutuhan bisnis hakiki (What/Why) dari asumsi perangkat prematur (How).",
              "Wawancara diagnostik bertujuan memvalidasi pain points, aplikasi kritis, populasi pengguna, dan pola trafik jam sibuk.",
              "Desain jaringan yang berhasil selalu menyeimbangkan antara performa teknis dan batasan operasional nyata (anggaran, SLA, fasilitas fisik gedung).",
            ],
          },
          {
            id: "plan-l1-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "Client Discovery Specialist",
            message:
              "Hebat! Anda telah memahami cara membedakan kebutuhan bisnis dari asumsi teknis prematur dalam wawancara klien.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 2: kriteria-keberhasilan (P6-L02)
    // =========================================================================
    {
      id: "lesson-kriteria-keberhasilan",
      slug: "kriteria-keberhasilan",
      title: "Kriteria Keberhasilan & Acceptance Criteria yang Dapat Diuji",
      description:
        "Merumuskan Acceptance Criteria berbasis angka kuantitatif: batas latensi, rasio konkurensi perangkat, throughput minimum, dan protokol User Acceptance Testing (UAT).",
      orderIndex: 1,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["wawancara-klien"],
      outcomes: [
        {
          id: "PLAN-L2-A",
          text: "Siswa dapat menyusun Acceptance Criteria kuantitatif (Throughput Mbps, Latency ms, Jitter, RSSI dBm) yang dapat diuji secara empiris.",
        },
        {
          id: "PLAN-L2-B",
          text: "Siswa dapat menghitung estimasi konkurensi perangkat (Concurrency Factor) untuk perencanaan beban puncak jaringan.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L2-A",
          teachingBlockIds: ["plan-l2-h1", "plan-l2-txt1", "plan-l2-callout1"],
          activityIds: ["plan-l2-code1"],
          assessmentItemIds: ["quiz-plan-l2-q1", "quiz-plan-l2-q2"],
        },
        {
          outcomeId: "PLAN-L2-B",
          teachingBlockIds: ["plan-l2-h2", "plan-l2-txt2", "plan-l2-callout2"],
          activityIds: ["plan-l2-code1"],
          assessmentItemIds: ["quiz-plan-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l2-h1",
            type: "heading",
            level: 2,
            text: "Bahaya Kriteria Kualitatif vs Kekuatan Angka Kuantitatif",
          },
          {
            id: "plan-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Salah satu penyebab sengketa terbesar antara konsultan jaringan dan klien adalah kriteria penerimaan proyek yang samar (*vague*).\n\nPerhatikan perbandingannya:\n* **Kriteria Samar (Kualitatif):** *'Internet di seluruh kantor harus kencang dan tidak lemot.'* (Makna 'kencang' sangat subjektif dan tidak dapat diukur secara hukum/teknis).\n* **Kriteria Teruji (Kuantitatif):**\n  1. Setiap meja kerja staf kabel LAN mendapatkan throughput minimal 900 Mbps ke server lokal dan 50 Mbps ke internet publik.\n  2. Sinyal Wi-Fi di area kerja memiliki kekuatan sinyal minimal **-65 dBm** dengan Signal-to-Noise Ratio (SNR) minimal 25 dB.\n  3. Latensi ping gateway router lokal $\\le$ 2 ms dengan packet loss 0% selama pengujian continuous ping 500 paket.",
          },
          {
            id: "plan-l2-callout1",
            type: "callout",
            variant: "warning",
            title: "Aturan Emas Kontrak Proyek",
            content:
              "Jika suatu kebutuhan tidak memiliki angka metrik yang dapat diukur dan disepakati alat ujinya, Anda tidak akan pernah bisa membuktikan kepada klien bahwa pekerjaan Anda telah selesai secara objektif.",
          },
          {
            id: "plan-l2-code1",
            type: "code",
            language: "markdown",
            filename: "metrik-acceptance-criteria.txt",
            code:
              "+-----------------------+---------------------+-------------------------+\n| Parameter Uji         | Target Nilai        | Metode Pengujian        |\n+-----------------------+---------------------+-------------------------+\n| Throughput LAN Kabel  | >= 940 Mbps         | iperf3 TCP multi-stream |\n| Sinyal Wi-Fi Kantor   | >= -65 dBm          | Wi-Fi Analyzer / Survey |\n| Latensi Gateway LAN   | <= 2 ms             | ICMP Ping 100 paket     |\n| Packet Loss Lokal     | 0.0%                | ICMP Ping 1000 paket    |\n| Isolasi Jaringan Tamu | Drop total ke Staff | Nmap port scan / Ping   |\n+-----------------------+---------------------+-------------------------+",
          },
          {
            id: "plan-l2-h2",
            type: "heading",
            level: 2,
            text: "Menghitung Estimasi Konkurensi Pengguna (Concurrency Factor)",
          },
          {
            id: "plan-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Pengguna jaringan tidak pernah mengonsumsi bandwidth maksimum secara bersamaan dalam detik yang sama.\n\nUntuk merancang kapasitas bandwidth dan daya tampung Access Point, konsultan menggunakan formula **Faktor Konkurensi (*Concurrency Ratio*)**:\n\n$$\\text{Total Klien Aktif Simultan} = \\text{Total Pengguna Terdaftar} \\times \\text{Faktor Konkurensi}\$$\n\nPedoman Industri untuk Lingkungan Bisnis:\n* **Kantor Kantor Staf (Office Workstation):** Konkurensi 70% - 90% (Hampir semua staf online simultan pada jam kerja).\n* **Kafe / Restoran / Tamu Hotel:** Konkurensi 30% - 50% (Pengguna datang silih berganti, konsumsi data sporadis).\n* **Laboratorium Sekolah / Warnet:** Konkurensi 100% (Semua siswa/gamer menggunakan PC bersamaan pada sesi praktikum).",
          },
          {
            id: "plan-l2-callout2",
            type: "callout",
            variant: "tip",
            title: "BYOD Multiplier (Bring Your Own Device)",
            content:
              "Ketika merencanakan pool IP DHCP dan kapasitas radio AP Wi-Fi, kalikan jumlah staf tetap dengan faktor 2.5x (karena setiap karyawan rata-rata membawa 1 laptop kerja, 1 smartphone pribadi, dan terkadang 1 smartwatch/tablet).",
          },
          {
            id: "quiz-plan-l2-q1",
            type: "quiz",
            quizId: "quiz-plan-l2-q1",
            question:
              "Manakah rumusan Acceptance Criteria yang paling tepat dan profesional untuk dokumen kontrak serah terima jaringan kantor?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Jaringan Wi-Fi harus cukup kuat untuk streaming YouTube tanpa buffering di seluruh sudut gedung.",
              },
              {
                id: "opt-2",
                text: "Kekuatan sinyal Wi-Fi di area meja kerja minimal -65 dBm dengan throughput TCP minimal 80 Mbps dan packet loss 0% saat diuji iperf3 ke server lokal.",
              },
              {
                id: "opt-3",
                text: "Jaringan harus sangat cepat dan tidak pernah ada komplain dari pimpinan perusahaan.",
              },
              {
                id: "opt-4",
                text: "Semua komputer terhubung ke internet dan lampu indikator switch menyala hijau.",
              },
            ],
          },
          {
            id: "quiz-plan-l2-q2",
            type: "quiz",
            quizId: "quiz-plan-l2-q2",
            question:
              "Sebuah kantor memiliki 40 karyawan. Jika perusahaan menerapkan kebijakan BYOD dengan rata-rata 2.5 perangkat per orang, berapakah perkiraan minimum kapasitas alokasi IP DHCP yang wajib disiapkan?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "40 IP address (cukup subnet /29).",
              },
              {
                id: "opt-2",
                text: "100 IP address (membutuhkan subnet minimal /25 dengan 126 host usable).",
              },
              {
                id: "opt-3",
                text: "400 IP address (membutuhkan subnet /22).",
              },
              {
                id: "opt-4",
                text: "16 IP address saja.",
              },
            ],
          },
          {
            id: "quiz-plan-l2-q3",
            type: "quiz",
            quizId: "quiz-plan-l2-q3",
            question:
              "Dalam protokol User Acceptance Testing (UAT), bagaimana cara membuktikan bahwa isolasi VLAN jaringan tamu (Guest) dari VLAN staf internal telah berhasil secara teknis?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Cukup menanyakan kepada tamu apakah mereka bisa browsing Instagram atau tidak.",
              },
              {
                id: "opt-2",
                text: "Melakukan ICMP ping dan pemindaian port TCP dari laptop di subnet Guest ke IP server/PC di subnet Staff, dan memverifikasi bahwa paket diblokir (100% packet loss / connection refused).",
              },
              {
                id: "opt-3",
                text: "Melihat bahwa kabel switch port tamu dan staf menggunakan warna kabel yang berbeda.",
              },
              {
                id: "opt-4",
                text: "Menonaktifkan password Wi-Fi tamu agar mudah diakses siapa saja.",
              },
            ],
          },
          {
            id: "plan-l2-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Acceptance Criteria wajib kuantitatif, memiliki ambang batas angka yang jelas, dan memiliki prosedur uji empiris (iperf3, ping, survey sinyal).",
              "Faktor konkurensi dan rasio BYOD (2.5x perangkat/karyawan) adalah basis perhitungan kapasitas pool DHCP, bandwidth, dan beban radio Access Point.",
              "Pengujian UAT mencakup verifikasi performa fisik/logis serta bukti empiris isolasi keamanan lintas segmen jaringan.",
            ],
          },
          {
            id: "plan-l2-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "Acceptance Criteria Architect",
            message:
              "Luar biasa! Anda telah menguasai cara menetapkan Acceptance Criteria kuantitatif dan menghitung konkurensi perangkat.",
          },
        ],
      },
    },
  ],
};
