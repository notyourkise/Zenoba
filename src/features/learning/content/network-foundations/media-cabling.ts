import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Physical Media & Cabling (P1-M6)
 *
 * Covers UTP/STP/Wireless, RJ45 T568A/T568B crimping, Straight vs Cross, and Fiber Optic fundamentals.
 */
export const physicalMediaCablingModuleData: CurriculumModule = {
  id: "module-physical-media-cabling",
  slug: "physical-media-cabling",
  title: "Physical Media & Cabling",
  description:
    "Standar media transmisi: kabel tembaga UTP/STP, terminasi konektor RJ45 standar T568A/T568B, dan pengenalan serat optik.",
  orderIndex: 5,
  prerequisites: ["network-devices"],
  outcomes: [
    {
      id: "PMC-M1",
      text: "Siswa dapat membandingkan media transmisi tembaga dan nirkabel berdasarkan jarak, kecepatan, dan interferensi.",
    },
    {
      id: "PMC-M2",
      text: "Siswa dapat menentukan urutan susunan pin T568A/T568B dan memilih kabel straight-through vs crossover.",
    },
    {
      id: "PMC-M3",
      text: "Siswa dapat mengidentifikasi skenario penggunaan serat optik (fiber optic).",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 13: copper-twisted-pair-wireless
    // =========================================================================
    {
      id: "lesson-copper-twisted-pair-wireless",
      slug: "copper-twisted-pair-wireless",
      title: "Media Transmisi: Kabel Tembaga vs Nirkabel",
      description:
        "Menganalisis perbedaan karakteristik kabel twisted pair (UTP/STP Cat5e/Cat6) dan gelombang radio Wi-Fi.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["modem-firewall-server"],
      outcomes: [
        {
          id: "PMC-L13-A",
          text: "Siswa dapat membedakan kabel UTP dan STP serta batas jarak transmisi kabel Ethernet (100 meter).",
        },
        {
          id: "PMC-L13-B",
          text: "Siswa dapat membandingkan kelebihan dan kelemahan kabel tembaga dibanding koneksi Wi-Fi.",
        },
      ],
      evidence: [
        {
          outcomeId: "PMC-L13-A",
          teachingBlockIds: ["pmc-l13-h1", "pmc-l13-txt1", "pmc-l13-callout1"],
          activityIds: ["pmc-l13-act1"],
          assessmentItemIds: ["quiz-pmc-l13-q1", "quiz-pmc-l13-q2"],
        },
        {
          outcomeId: "PMC-L13-B",
          teachingBlockIds: ["pmc-l13-txt2"],
          activityIds: ["pmc-l13-act1"],
          assessmentItemIds: ["quiz-pmc-l13-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "pmc-l13-h1",
            type: "heading",
            level: 2,
            text: "Media Pembawa Data: Tembaga dan Gelombang Udara",
          },
          {
            id: "pmc-l13-txt1",
            type: "text",
            format: "markdown",
            content:
              "Data digital harus diubah menjadi gelombang fisik agar dapat berpindah. Dua media paling lazim di jaringan lokal adalah:\n\n1. **Kabel Twisted Pair (Tembaga):**\n   - Terdiri dari 8 kawat tembaga berpasangan yang dipelintir (*twisted*) untuk saling meredam interferensi elektromagnetik (EMI / crosstalk).\n   - **UTP (Unshielded Twisted Pair):** Tanpa lapisan aluminium foil tambahan. Sangat fleksibel, murah, dan menjadi standar di dalam ruangan lab sekolah atau kantor.\n   - **STP / FTP (Shielded / Foiled):** Dilengkapi lapisan pelindung logam foil untuk area pabrik atau tiang luar ruangan yang rawan induksi kabel listrik bertegangan tinggi.\n   - **Batas Jarak Maksimal:** Panjang bentangan kabel tembaga Ethernet standar adalah **100 meter**. Jika melebihi 100 meter, sinyal akan melemah (*attenuation*) dan paket data rusak.\n2. **Nirkabel (Wi-Fi / Radio Waves):**\n   - Menggunakan frekuensi radio (2.4 GHz, 5 GHz, 6 GHz).\n   - Sangat fleksibel untuk mobilitas pengguna, namun rentan terhalang tembok beton dan terganggu interferensi gelombang elektromagnetik lain.",
          },
          {
            id: "pmc-l13-callout1",
            type: "callout",
            variant: "warning",
            title: "Aturan Jarak 100 Meter",
            content:
              "Hukum standar industri IEEE 802.3: Jarak maksimum kabel UTP dari port switch ke kartu jaringan komputer tidak boleh melebihi **100 meter** (biasanya 90 meter kabel instalasi dinding + 10 meter total patch cord). Jangan pernah menarik kabel UTP 150 meter langsung!",
          },
          {
            id: "pmc-l13-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Perbandingan Langsung Kabel vs Wi-Fi\n- **Kabel UTP:** Kecepatan konstan gigabit (1 Gbps), latensi sangat rendah (<1 ms), tidak terpengaruh cuaca, aman dari penyadapan udara.\n- **Wi-Fi:** Bebas kabel, mudah untuk smartphone, namun kecepatan dibagi (*shared bandwidth*) dan latensi fluktuatif.",
          },
          {
            id: "pmc-l13-act1",
            type: "interactive",
            interactiveType: "classification",
            config: {
              instruction: "Bandingkan karakteristik transmisi kabel UTP, kabel STP, dan sinyal nirkabel Wi-Fi.",
            },
          },
          {
            id: "pmc-l13-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Tembaga & Nirkabel",
          },
          {
            id: "pmc-l13-q1-block",
            type: "quiz",
            quizId: "quiz-pmc-l13-q1",
            question: "Berapa batas panjang bentangan maksimum standar untuk satu segmen kabel UTP Ethernet dari switch ke komputer?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "25 meter" },
              { id: "opt-b", text: "100 meter" },
              { id: "opt-c", text: "500 meter" },
              { id: "opt-d", text: "1.000 meter (1 km)" },
            ],
            explanation: "Batas panjang maksimum standar IEEE untuk kabel UTP Cat5e/Cat6 adalah 100 meter.",
            xpReward: 10,
          },
          {
            id: "pmc-l13-q2-block",
            type: "quiz",
            quizId: "quiz-pmc-l13-q2",
            question: "Kabel twisted pair jenis STP (Shielded Twisted Pair) paling disarankan digunakan pada kondisi lingkungan:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Di bawah kasur kamar tidur yang tenang" },
              { id: "opt-b", text: "Di area industri/pabrik yang dekat dengan motor listrik besar bertegangan tinggi" },
              { id: "opt-c", text: "Hanya untuk menghubungkan printer mini Bluetooth" },
              { id: "opt-d", text: "Di dalam akuarium air tawar" },
            ],
            explanation: "Lapisan pelindung logam foil (shielding) pada STP melindungi sinyal dari radiasi interferensi elektromagnetik (EMI) di pabrik/mesin listrik.",
            xpReward: 10,
          },
          {
            id: "pmc-l13-q3-block",
            type: "quiz",
            quizId: "quiz-pmc-l13-q3",
            question: "Mengapa untuk PC desktop server ujian sekolah lebih direkomendasikan menggunakan kabel UTP dibanding koneksi Wi-Fi?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Karena kabel UTP membuat komputer tidak memerlukan listrik PLN" },
              { id: "opt-b", text: "Karena kabel tembaga memberikan koneksi stabil tanpa gangguan interferensi frekuensi udara dan latensi rendah" },
              { id: "opt-c", text: "Karena sinyal Wi-Fi dilarang masuk ke dalam ruang kelas" },
              { id: "opt-d", text: "Karena kabel UTP harganya jutaan rupiah per meter" },
            ],
            explanation: "Koneksi kabel tembaga menawarkan stabilitas transmisi konsisten bebas interferensi gelombang radio.",
            xpReward: 10,
          },
          {
            id: "pmc-l13-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 13",
            keyPoints: [
              "Kabel twisted pair menggunakan lilitan kawat untuk mengurangi interferensi elektromagnetik.",
              "Jarak maksimum bentangan kabel tembaga Ethernet adalah 100 meter.",
              "Kabel UTP standar untuk dalam ruangan; STP digunakan di area berinterferensi tinggi.",
            ],
          },
          {
            id: "pmc-l13-reward",
            type: "reward",
            xp: 60,
            message: "Mantap! Anda memahami karakteristik media tembaga dan nirkabel.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 14: rj45-crimping-t568ab
    // =========================================================================
    {
      id: "lesson-rj45-crimping-t568ab",
      slug: "rj45-crimping-t568ab",
      title: "Standar Terminasi RJ45: T568A dan T568B",
      description:
        "Keahlian wajib TKJ: susunan urutan 8 warna kabel UTP standar EIA/TIA T568A dan T568B serta kabel straight vs crossover.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["copper-twisted-pair-wireless"],
      outcomes: [
        {
          id: "PMC-L14-A",
          text: "Siswa dapat mengurutkan 8 warna pin kabel UTP standar T568A dan T568B secara tepat.",
        },
        {
          id: "PMC-L14-B",
          text: "Siswa dapat membedakan penggunaan kabel Straight-Through dan Crossover.",
        },
      ],
      evidence: [
        {
          outcomeId: "PMC-L14-A",
          teachingBlockIds: ["pmc-l14-h1", "pmc-l14-txt1", "pmc-l14-callout1"],
          activityIds: ["pmc-l14-act1"],
          assessmentItemIds: ["quiz-pmc-l14-q1", "quiz-pmc-l14-q2"],
        },
        {
          outcomeId: "PMC-L14-B",
          teachingBlockIds: ["pmc-l14-txt2"],
          activityIds: ["pmc-l14-act1"],
          assessmentItemIds: ["quiz-pmc-l14-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "pmc-l14-h1",
            type: "heading",
            level: 2,
            text: "Standar Urutan Warna EIA/TIA-568",
          },
          {
            id: "pmc-l14-txt1",
            type: "text",
            format: "markdown",
            content:
              "Kabel UTP memiliki 4 pasang (8 kawat) dengan kode warna terstandarisasi internasional. Saat memasang konektor modular **RJ-45** menggunakan tang crimping (*crimping tool*), urutan pin 1 sampai 8 dari kiri ke kanan (posisi tembaga menghadap Anda) harus mengikuti standar:\n\n1. **Standar T568B (Paling Populer di Indonesia):**\n   - Pin 1: Putih Oranye\n   - Pin 2: Oranye\n   - Pin 3: Putih Hijau\n   - Pin 4: Biru\n   - Pin 5: Putih Biru\n   - Pin 6: Hijau\n   - Pin 7: Putih Cokelat\n   - Pin 8: Cokelat\n\n2. **Standar T568A:**\n   - Pasangan oranye dan hijau bertukar tempat: Pin 1 (Putih Hijau), Pin 2 (Hijau), Pin 3 (Putih Oranye), Pin 4 (Biru), Pin 5 (Putih Biru), Pin 6 (Oranye), Pin 7 (Putih Cokelat), Pin 8 (Cokelat).",
          },
          {
            id: "pmc-l14-callout1",
            type: "callout",
            variant: "tip",
            title: "Hafalan Cepat Pinout T568B",
            content:
              "Hafalan praktis anak TKJ: *Putih Oranye - Oranye, Putih Hijau - Biru, Putih Biru - Hijau, Putih Cokelat - Cokelat*. Perhatikan bahwa warna biru dan hijau bersilangan pada pin 3-4-5-6!",
          },
          {
            id: "pmc-l14-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Straight-Through vs Crossover Cable\n- **Straight-Through Cable:** Kedua ujung kabel menggunakan standar yang sama (**T568B di kedua ujung**). Digunakan untuk menghubungkan **perangkat yang berbeda jenis**: Komputer ke Switch, Switch ke Router.\n- **Crossover Cable:** Satu ujung menggunakan T568A dan ujung lainnya menggunakan T568B. Secara klasik digunakan untuk menghubungkan **perangkat yang sejenis**: Komputer ke Komputer, Switch ke Switch (meskipun perangkat modern kini mendukung *Auto-MDIX* yang dapat menyesuaikan otomatis).",
          },
          {
            id: "pmc-l14-act1",
            type: "interactive",
            interactiveType: "cable_order",
            config: {
              instruction: "Susun 8 warna kawat kabel UTP ke dalam urutan pin standar T568B yang benar dari pin 1 sampai pin 8.",
            },
          },
          {
            id: "pmc-l14-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Crimping & T568A/B",
          },
          {
            id: "pmc-l14-q1-block",
            type: "quiz",
            quizId: "quiz-pmc-l14-q1",
            question: "Manakah urutan 3 pin pertama pada standar pemasangan kabel UTP T568B?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Putih Hijau, Hijau, Putih Oranye" },
              { id: "opt-b", text: "Putih Oranye, Oranye, Putih Hijau" },
              { id: "opt-c", text: "Biru, Putih Biru, Cokelat" },
              { id: "opt-d", text: "Putih Cokelat, Cokelat, Hijau" },
            ],
            explanation: "Urutan T568B diawali dengan Pin 1: Putih Oranye, Pin 2: Oranye, Pin 3: Putih Hijau.",
            xpReward: 10,
          },
          {
            id: "pmc-l14-q2-block",
            type: "quiz",
            quizId: "quiz-pmc-l14-q2",
            question: "Kabel LAN yang kedua ujungnya dipasang dengan standar T568B disebut jenis kabel:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kabel Crossover" },
              { id: "opt-b", text: "Kabel Straight-Through" },
              { id: "opt-c", text: "Kabel Rollover Konsol" },
              { id: "opt-d", text: "Kabel Koaksial RG-58" },
            ],
            explanation: "Kabel yang kedua ujungnya memiliki susunan standar yang sama (T568B di kedua ujung) adalah kabel Straight-Through.",
            xpReward: 10,
          },
          {
            id: "pmc-l14-q3-block",
            type: "quiz",
            quizId: "quiz-pmc-l14-q3",
            question: "Untuk menghubungkan komputer PC siswa langsung ke port switch di lab tanpa router, jenis kabel yang digunakan adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kabel Straight-Through" },
              { id: "opt-b", text: "Kabel Crossover khusus" },
              { id: "opt-c", text: "Kabel HDMI" },
              { id: "opt-d", text: "Kabel USB Tipe C" },
            ],
            explanation: "Menghubungkan dua perangkat berbeda level fungsi (Host/PC ke Switch) menggunakan kabel Straight-Through.",
            xpReward: 10,
          },
          {
            id: "pmc-l14-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 14",
            keyPoints: [
              "Konektor RJ-45 memiliki 8 pin terstandarisasi EIA/TIA.",
              "T568B adalah standar susunan paling banyak digunakan di jaringan Indonesia.",
              "Kabel Straight-Through menghubungkan perangkat berbeda jenis; Crossover untuk perangkat sejenis.",
            ],
          },
          {
            id: "pmc-l14-reward",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai standar crimping RJ45 T568A dan T568B.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 15: fiber-optic-intro
    // =========================================================================
    {
      id: "lesson-fiber-optic-intro",
      slug: "fiber-optic-intro",
      title: "Pengenalan Serat Optik (Fiber Optic)",
      description:
        "Memahami media transmisi cahaya berkecepatan tinggi untuk jarak jauh (>100 meter) dan kebal interferensi elektromagnetik.",
      orderIndex: 2,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["rj45-crimping-t568ab"],
      outcomes: [
        {
          id: "PMC-L15-A",
          text: "Siswa dapat menjelaskan prinsip kerja serat optik (pulsa cahaya) dan keunggulannya dibanding kabel tembaga.",
        },
        {
          id: "PMC-L15-B",
          text: "Siswa dapat mengidentifikasi skenario di mana serat optik wajib diimplementasikan.",
        },
      ],
      evidence: [
        {
          outcomeId: "PMC-L15-A",
          teachingBlockIds: ["pmc-l15-h1", "pmc-l15-txt1", "pmc-l15-callout1"],
          activityIds: ["pmc-l15-act1"],
          assessmentItemIds: ["quiz-pmc-l15-q1", "quiz-pmc-l15-q2"],
        },
        {
          outcomeId: "PMC-L15-B",
          teachingBlockIds: ["pmc-l15-txt2"],
          activityIds: ["pmc-l15-act1"],
          assessmentItemIds: ["quiz-pmc-l15-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "pmc-l15-h1",
            type: "heading",
            level: 2,
            text: "Transmisi Kecepatan Cahaya: Serat Optik",
          },
          {
            id: "pmc-l15-txt1",
            type: "text",
            format: "markdown",
            content:
              "Kabel serat optik (*fiber optic*) terbuat dari untaian silika kaca murni yang sangat halus (seukuran rambut manusia). Alih-alih mengalirkan arus listrik seperti kabel tembaga, fiber optic mentransmisikan data menggunakan **pulsa cahaya** yang dipantulkan di dalam inti kaca (*total internal reflection*).\n\nKeunggulan mutlak serat optik:\n1. **Jangkauan Sangat Jauh:** Mampu mentransmisikan data hingga puluhan kilometer (hingga 40–80 km tanpa repeater).\n2. **Kapasitas Bandwidth Raksasa:** Mendukung kecepatan 10 Gbps, 40 Gbps, hingga 100+ Gbps.\n3. **100% Kebal Interferensi Elektromagnetik (EMI):** Karena membawa cahaya, kabel fiber sama sekali tidak terpengaruh radiasi mesin pabrik, petir, atau jalur kabel listrik tegangan tinggi PLN.",
          },
          {
            id: "pmc-l15-callout1",
            type: "callout",
            variant: "info",
            title: "Satu-Satunya Solusi Antar-Gedung",
            content:
              "Kapan Anda wajib memakai fiber optic? Ketika jarak antarlokasi **melebihi 100 meter** (misalnya menghubungkan Gedung A dan Gedung B sekolah sejauh 300 meter), atau saat menghubungkan ISP dari tiang jalan ke dalam gedung.",
          },
          {
            id: "pmc-l15-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Dua Jenis Serat Optik Utama\n- **Single-Mode Fiber (SMF):** Inti kaca sangat kecil (~9 mikron), menggunakan sinar laser, jangkauan sangat jauh (puluhan kilometer). Digunakan oleh penyedia telekomunikasi dan kabel laut.\n- **Multi-Mode Fiber (MMF):** Inti kaca lebih besar (~50–62.5 mikron), menggunakan sumber cahaya LED, jangkauan lebih pendek (<500 meter). Sering digunakan untuk koneksi antarrack server di dalam data center.",
          },
          {
            id: "pmc-l15-act1",
            type: "interactive",
            interactiveType: "classification",
            config: {
              instruction: "Pilih skenario instalasi yang membutuhkan kabel UTP tembaga vs kabel Fiber Optik.",
            },
          },
          {
            id: "pmc-l15-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Pengantar Fiber Optik",
          },
          {
            id: "pmc-l15-q1-block",
            type: "quiz",
            quizId: "quiz-pmc-l15-q1",
            question: "Media fisik apakah yang digunakan oleh kabel serat optik (fiber optic) untuk mentransmisikan data digital?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Aliran elektron listrik pada kawat tembaga" },
              { id: "opt-b", text: "Pulsa cahaya di dalam inti kaca silika murni" },
              { id: "opt-c", text: "Tekanan udara di dalam pipa vakum" },
              { id: "opt-d", text: "Gelombang suara ultrasonik" },
            ],
            explanation: "Serat optik menggunakan modulasi pulsa cahaya laser/LED di dalam inti kaca (core).",
            xpReward: 10,
          },
          {
            id: "pmc-l15-q2-block",
            type: "quiz",
            quizId: "quiz-pmc-l15-q2",
            question: "Sekolah ingin menghubungkan jaringan lab TKJ di Gedung Barat ke ruang guru di Gedung Timur dengan jarak bentangan 250 meter melewati taman terbuka. Solusi media yang paling tepat adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Satu kabel UTP biasa yang ditarik kencang" },
              { id: "opt-b", text: "Kabel Serat Optik (Fiber Optic) outdoor antargedung" },
              { id: "opt-c", text: "Kabel VGA sepanjang 250 meter" },
              { id: "opt-d", text: "Menghubungkan dua mouse USB berantai" },
            ],
            explanation: "Karena jarak 250 meter melebihi batas 100 meter kabel tembaga UTP, penggunaan kabel Fiber Optik adalah standar wajib.",
            xpReward: 10,
          },
          {
            id: "pmc-l15-q3-block",
            type: "quiz",
            quizId: "quiz-pmc-l15-q3",
            question: "Apa keunggulan terbesar kabel fiber optic saat dipasang berdampingan dengan kabel listrik utama gardu PLN?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Dapat menyerap daya listrik PLN untuk menyalakan komputer" },
              { id: "opt-b", text: "Kebal 100% dari induksi interferensi elektromagnetik (EMI)" },
              { id: "opt-c", text: "Lebih mudah ditekuk dengan sudut tajam 90 derajat" },
              { id: "opt-d", text: "Dapat disambung hanya dengan menggunakan selotip kertas" },
            ],
            explanation: "Karena transmisi menggunakan media kaca dan cahaya, fiber optic sama sekali tidak terpengaruh medan magnet atau induksi listrik.",
            xpReward: 10,
          },
          {
            id: "pmc-l15-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 15",
            keyPoints: [
              "Fiber optic menggunakan pulsa cahaya di dalam silika kaca murni.",
              "Mampu mentransmisikan data berkecepatan tinggi melampaui batas 100 meter tembaga.",
              "Menjadi tulang punggung (backbone) koneksi antargedung, kota, dan jaringan ISP.",
            ],
          },
          {
            id: "pmc-l15-reward",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda telah menyelesaikan seluruh modul Media Fisik & Pengkabelan.",
          },
        ],
      },
    },
  ],
};
