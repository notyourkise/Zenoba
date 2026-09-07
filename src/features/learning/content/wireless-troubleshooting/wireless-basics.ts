import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Dasar Wireless & Propagasi Radio (P5-M1)
 *
 * Covers 2.4 GHz vs 5 GHz vs 6 GHz bands, radio propagation tradeoffs,
 * non-overlapping 2.4 GHz channels (1, 6, 11), 5 GHz UNII bands,
 * Co-Channel Interference (CCI), and Adjacent Channel Interference (ACI).
 */
export const wirelessBasicsModuleData: CurriculumModule = {
  id: "module-wireless-basics",
  slug: "wireless-basics",
  title: "Dasar Wireless & Propagasi Gelombang Radio",
  description:
    "Pelajari karakteristik spektrum frekuensi 2.4 GHz, 5 GHz, dan 6 GHz, prinsip propagasi gelombang radio, perencanaan kanal non-overlapping, serta mitigasi interferensi nirkabel.",
  orderIndex: 1,
  prerequisites: [],
  outcomes: [
    {
      id: "WLS-M1",
      text: "Siswa dapat membandingkan trade-off jangkauan, redaman penghalang, dan throughput antara pita frekuensi 2.4 GHz, 5 GHz, dan 6 GHz pada lingkungan nyata.",
    },
    {
      id: "WLS-M2",
      text: "Siswa dapat merancang alokasi kanal nirkabel non-overlapping (1, 6, 11 pada 2.4 GHz) serta membedakan Co-Channel Interference (CCI) dari Adjacent Channel Interference (ACI).",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 1: band-frekuensi-wifi (P5-L01)
    // =========================================================================
    {
      id: "lesson-band-frekuensi-wifi",
      slug: "band-frekuensi-wifi",
      title: "Karakteristik Frekuensi Wi-Fi: 2.4 GHz, 5 GHz & 6 GHz",
      description:
        "Memahami prinsip fisika propagasi gelombang radio, perbedaan panjang gelombang, penetrasi dinding, bandwidth, dan skenario penerapan optimal untuk masing-masing pita frekuensi.",
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: [],
      outcomes: [
        {
          id: "WLS-L1-A",
          text: "Siswa dapat menganalisis hubungan antara frekuensi, panjang gelombang, dan redaman sinyal saat menembus rintangan fisik (dinding bata, beton, kaca).",
        },
        {
          id: "WLS-L1-B",
          text: "Siswa dapat menentukan pita frekuensi yang tepat berdasarkan kebutuhan bandwidth, kepadatan klien, dan jangkauan area kerja.",
        },
      ],
      evidence: [
        {
          outcomeId: "WLS-L1-A",
          teachingBlockIds: ["wls-l1-h1", "wls-l1-txt1", "wls-l1-callout1"],
          activityIds: ["wls-l1-code1"],
          assessmentItemIds: ["quiz-wls-l1-q1", "quiz-wls-l1-q2"],
        },
        {
          outcomeId: "WLS-L1-B",
          teachingBlockIds: ["wls-l1-h2", "wls-l1-txt2", "wls-l1-callout2"],
          activityIds: ["wls-l1-interactive1"],
          assessmentItemIds: ["quiz-wls-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "wls-l1-h1",
            type: "heading",
            level: 2,
            text: "Prinsip Fisika Gelombang Radio Wi-Fi",
          },
          {
            id: "wls-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Wi-Fi mentransmisikan data melalui udara menggunakan gelombang elektromagnetik radio (RF - Radio Frequency). Hukum dasar fisika gelombang menyatakan bahwa frekuensi berbanding terbalik dengan panjang gelombang:\n\n1. **Panjang Gelombang Lebih Panjang (Frekuensi Rendah - 2.4 GHz):** Panjang gelombang sekitar 12.5 cm. Gelombang yang lebih panjang lebih mudah terdifraksi mengitari rintangan dan lebih mampu menembus objek padat seperti dinding bata dan partisi kayu.\n2. **Panjang Gelombang Lebih Pendek (Frekuensi Tinggi - 5 GHz & 6 GHz):** Pada 5 GHz (panjang gelombang ~6 cm) dan 6 GHz (~5 cm), energi gelombang diserap jauh lebih cepat oleh material padat (attenuation). Partisi beton tebal atau kaca berlapis logam dapat meredam sinyal 5 GHz hingga 15–20 dB lebih besar dibanding 2.4 GHz.",
          },
          {
            id: "wls-l1-code1",
            type: "code",
            language: "text",
            code: "Perbandingan Karakteristik Tiga Pita Frekuensi Wi-Fi:\n\nFitur                 2.4 GHz            5 GHz              6 GHz (Wi-Fi 6E/7)\n--------------------------------------------------------------------------------\nPanjang Gelombang     ~12.5 cm           ~6 cm              ~5 cm\nJangkauan Ruang Terbuka Sangat Luas      Sedang             Terbatas / Line-of-Sight\nPenetrasi Dinding     Tinggi             Sedang - Rendah    Rendah (Tinggi Redaman)\nKapasitas Bandwidth   Rendah (maks 3ch)  Tinggi (hingga 25ch) Sangat Tinggi (59 ch 20MHz)\nInterferensi Eksternal Tinggi (Microwave, Rendah             Nol (Bebas perangkat lama)\n                      Bluetooth, dsb)",
          },
          {
            id: "wls-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Miskonsepsi Umum: Frekuensi Tinggi Selalu Lebih Baik?",
            content:
              "Banyak pemula berasumsi 5 GHz atau 6 GHz selalu lebih unggul daripada 2.4 GHz. Faktanya, frekuensi tinggi hanya unggul dalam throughput ketika klien berada relatif dekat dengan Access Point. Untuk area outdoor luas atau gudang dengan banyak rak barang dan sedikit AP, sinyal 2.4 GHz tetap menjadi pilihan praktis untuk konektivitas dasar perangkat IoT dan barcode scanner.",
          },
          {
            id: "wls-l1-h2",
            type: "heading",
            level: 2,
            text: "Kapan Memilih 2.4 GHz, 5 GHz, atau 6 GHz?",
          },
          {
            id: "wls-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Dalam perancangan jaringan nirkabel SMK TKJ maupun kantor enterprise, strategi modern yang diterapkan adalah **Dual-Band** atau **Tri-Band** dengan alokasi peran terencana:\n\n- **2.4 GHz:** Didedikasikan untuk perangkat cerdas IoT (printer nirkabel, sensor absensi, CCTV wireless dasar) dan cakupan area luar ruangan jarak jauh.\n- **5 GHz:** Didedikasikan untuk laptop staf, komputer lab sekolah, dan streaming video resolusi tinggi yang membutuhkan kanal lebar (40 MHz atau 80 MHz).\n- **6 GHz:** Standar Wi-Fi 6E dan Wi-Fi 7 yang beroperasi di spektrum bersih 5.925–7.125 GHz, khusus perangkat modern berkemampuan transfer gigabit tanpa beban kompatibilitas mundur (zero backward compatibility overhead).",
          },
          {
            id: "wls-l1-interactive1",
            type: "interactive",
            interactiveType: "frequency_comparison",
            config: {
              scenarios: [
                {
                  id: "office-lounge",
                  name: "Ruang Rapat Eksekutif (Banyak Dinding Kaca, Klien Padat)",
                  recommendedBand: "5 GHz",
                },
                {
                  id: "warehouse",
                  name: "Area Gudang Logistik Luas (Perangkat Scanner Barcode)",
                  recommendedBand: "2.4 GHz",
                },
                {
                  id: "design-studio",
                  name: "Studio Multimedia Sekolah (Transfer Render File Besar)",
                  recommendedBand: "6 GHz",
                },
              ],
            },
          },
          {
            id: "wls-l1-callout2",
            type: "callout",
            variant: "tip",
            title: "Aturan Praktis: Band Steering",
            content:
              "Access Point enterprise modern menyediakan fitur **Band Steering**, yaitu mengarahkan perangkat yang mendukung dual-band secara otomatis ke frekuensi 5 GHz agar pita 2.4 GHz tidak mengalami kepadatan (congestion).",
          },
          {
            id: "wls-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-wls-l1-q1",
            question:
              "Mengapa sinyal Wi-Fi frekuensi 2.4 GHz mampu menjangkau ruangan di balik dinding bata lebih baik dibanding 5 GHz?",
            options: [
              {
                id: "opt-a",
                text: "Panjang gelombang 2.4 GHz lebih panjang sehingga mengalami redaman penyerapan energi (attenuation) lebih kecil pada materi padat",
              },
              {
                id: "opt-b",
                text: "Daya pancar pemancar 2.4 GHz diatur 10 kali lebih kuat oleh standar regulasi internasional",
              },
              {
                id: "opt-c",
                text: "Frekuensi 2.4 GHz secara otomatis membelokkan gelombang melalui kabel listrik gedung",
              },
              {
                id: "opt-d",
                text: "Frekuensi 5 GHz menggunakan enkripsi digital yang menolak tembus dinding bata",
              },
            ],
            explanation:
              "Secara hukum fisika propagasi elektromagnetik, gelombang frekuensi lebih rendah memiliki panjang gelombang lebih panjang (~12.5 cm pada 2.4 GHz vs ~6 cm pada 5 GHz), sehingga energi gelombang diserap lebih sedikit oleh partisi fisik padat.",
            xpReward: 10,
          },
          {
            id: "wls-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-wls-l1-q2",
            question:
              "Jika lab komputer sekolah membutuhkan transfer file video 4K antar laptop dengan delay minimal di satu ruangan terbuka tanpa sekat, pita manakah yang paling ideal?",
            options: [
              {
                id: "opt-a",
                text: "5 GHz atau 6 GHz karena mendukung lebar kanal 40/80/160 MHz dengan throughput data jauh lebih tinggi",
              },
              {
                id: "opt-b",
                text: "2.4 GHz karena frekuensi rendah menghasilkan koneksi yang paling tahan interferensi",
              },
              {
                id: "opt-c",
                text: "Pita 900 MHz karena hanya diperuntukkan bagi transmisi data video",
              },
              {
                id: "opt-d",
                text: "Pita Bluetooth karena tidak membutuhkan Access Point sama sekali",
              },
            ],
            explanation:
              "Di ruangan tanpa sekat, redaman dinding tidak menjadi kendala. Pita 5 GHz dan 6 GHz menyediakan spektrum kanal yang jauh lebih lebar untuk mencapai throughput transfer gigabit.",
            xpReward: 10,
          },
          {
            id: "wls-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-wls-l1-q3",
            question:
              "Apa fungsi utama dari mekanisme Band Steering pada Access Point enterprise?",
            options: [
              {
                id: "opt-a",
                text: "Mendorong klien dual-band untuk memprioritaskan koneksi ke pita 5 GHz demi mengurangi kepadatan di pita 2.4 GHz",
              },
              {
                id: "opt-b",
                text: "Mempercepat putaran antena motorik di dalam casing Access Point",
              },
              {
                id: "opt-c",
                text: "Mengubah frekuensi 2.4 GHz menjadi 5 GHz secara instan saat sinyal melemah",
              },
              {
                id: "opt-d",
                text: "Memblokir semua perangkat smartphone agar hanya laptop yang dapat terhubung",
              },
            ],
            explanation:
              "Band Steering bekerja dengan merespons probe request klien dual-band hanya pada frekuensi 5 GHz, memaksa perangkat berkemampuan tinggi meninggalkan pita 2.4 GHz yang padat.",
            xpReward: 10,
          },
          {
            id: "wls-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 1",
            keyPoints: [
              "Frekuensi 2.4 GHz memiliki panjang gelombang lebih panjang (~12.5 cm), menghasilkan daya tembus rintangan dinding yang lebih kuat namun kapasitas kanal terbatas.",
              "Frekuensi 5 GHz menyediakan kanal lebih banyak dan throughput lebih cepat, namun redaman sinyal pada dinding dan lantai beton jauh lebih tinggi.",
              "Frekuensi 6 GHz (Wi-Fi 6E/7) menyediakan 1200 MHz spektrum bersih tanpa beban kompatibilitas mundur dengan perangkat legacy 802.11b/g.",
              "Band Steering mengarahkan perangkat dual-band ke frekuensi 5 GHz secara cerdas untuk membagi beban lalu lintas jaringan.",
            ],
          },
          {
            id: "wls-l1-rew",
            type: "reward",
            xp: 60,
            message:
              "Hebat! Anda telah menguasai karakteristik dan perbandingan gelombang radio Wi-Fi 2.4 GHz, 5 GHz, dan 6 GHz.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 2: channel-dan-interferensi (P5-L02)
    // =========================================================================
    {
      id: "lesson-channel-dan-interferensi",
      slug: "channel-dan-interferensi",
      title: "Kanal & Interferensi Sinyal Wi-Fi: 1, 6, 11 & Mitigasi",
      description:
        "Memahami pembagian kanal frekuensi, aturan kanal non-overlapping pada pita 2.4 GHz, perencanaan kanal 5 GHz, serta perbedaan Co-Channel Interference (CCI) dan Adjacent Channel Interference (ACI).",
      orderIndex: 1,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["band-frekuensi-wifi"],
      outcomes: [
        {
          id: "WLS-L2-A",
          text: "Siswa dapat merancang denah kanal non-overlapping (1, 6, dan 11) pada frekuensi 2.4 GHz untuk mencegah tabrakan spektrum antar Access Point bertetangga.",
        },
        {
          id: "WLS-L2-B",
          text: "Siswa dapat membedakan dampak Co-Channel Interference (kontensi CSMA/CA) vs Adjacent Channel Interference (distorsi noise RF tak terbaca) dan cara mitigasinya.",
        },
      ],
      evidence: [
        {
          outcomeId: "WLS-L2-A",
          teachingBlockIds: ["wls-l2-h1", "wls-l2-txt1", "wls-l2-callout1"],
          activityIds: ["wls-l2-code1"],
          assessmentItemIds: ["quiz-wls-l2-q1", "quiz-wls-l2-q2"],
        },
        {
          outcomeId: "WLS-L2-B",
          teachingBlockIds: ["wls-l2-h2", "wls-l2-txt2", "wls-l2-callout2"],
          activityIds: ["wls-l2-interactive1"],
          assessmentItemIds: ["quiz-wls-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "wls-l2-h1",
            type: "heading",
            level: 2,
            text: "Kanal Non-Overlapping pada Pita 2.4 GHz",
          },
          {
            id: "wls-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Pita 2.4 GHz secara global dibagi menjadi 11 hingga 14 kanal logis. Namun, setiap kanal standar memiliki lebar **20 MHz**, sedangkan jarak antar frekuensi tengah kanal hanya berjarak **5 MHz**!\n\nAkibatnya, jika AP-1 diatur di Kanal 1 (frekuensi 2412 MHz) dan AP-2 diatur di Kanal 2, 3, 4, atau 5, spektrum gelombang kedua AP tersebut akan saling bertumpuk (overlap) dan menyebabkan distorsi sinyal parah.\n\nDalam regulasi Indonesia dan standar internasional 2.4 GHz, hanya terdapat **3 kanal non-overlapping** pada lebar 20 MHz, yaitu:\n\n- **Kanal 1** (2401 – 2423 MHz)\n- **Kanal 6** (2426 – 2448 MHz)\n- **Kanal 11** (2451 – 2473 MHz)",
          },
          {
            id: "wls-l2-code1",
            type: "code",
            language: "text",
            code: "Ilustrasi Spektrum Kanal 2.4 GHz (Lebar 20 MHz):\n\nKanal 1:   [---- 2412 MHz ----]\nKanal 2:      [---- 2417 MHz ----]  <-- Tumpang tindih dengan Kanal 1!\nKanal 3:         [---- 2422 MHz ----]  <-- Tumpang tindih dengan Kanal 1 & 6!\nKanal 6:              [---- 2437 MHz ----]\nKanal 11:                          [---- 2462 MHz ----]\n\nAturan Emas: Gunakan HANYA kanal 1, 6, atau 11 untuk instalasi multi-AP!",
          },
          {
            id: "wls-l2-callout1",
            type: "callout",
            variant: "warning",
            title: "Jangan Pernah Gunakan Kanal 2, 3, 4, 7, 8, 9, atau 10!",
            content:
              "Mengatur AP pada 'Kanal Bebas' seperti Kanal 3 atau 8 adalah kesalahan fatal. Menggunakan Kanal 3 akan terkena interferensi ganda dari Kanal 1 di sebelah kiri dan Kanal 6 di sebelah kanan, memperburuk kualitas sinyal untuk semua perangkat di sekitar.",
          },
          {
            id: "wls-l2-h2",
            type: "heading",
            level: 2,
            text: "Co-Channel Interference (CCI) vs Adjacent Channel Interference (ACI)",
          },
          {
            id: "wls-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Ketika merancang tata letak banyak AP di sekolah atau gedung bertingkat, teknisi TKJ harus memahami dua jenis interferensi:\n\n1. **Co-Channel Interference (CCI) / Co-Channel Contention:**\n   - Terjadi ketika dua AP berjarak dekat menggunakan kanal yang **sama persis** (misal sama-sama Kanal 1).\n   - Dampak: Karena protokol Wi-Fi menggunakan **CSMA/CA** (Carrier Sense Multiple Access with Collision Avoidance), perangkat dapat saling mendengarkan header transmisi AP lain. Akibatnya, perangkat akan menahan transmisi (*backoff*) dan menunggu giliran. Jaringan menjadi lambat karena harus bergantian antre, namun paket data tidak rusak.\n2. **Adjacent Channel Interference (ACI):**\n   - Terjadi ketika dua AP menggunakan kanal yang **saling tumpang tindih sebagian** (misalnya Kanal 1 dan Kanal 3).\n   - Dampak: Sinyal dari kanal sebelah terbaca sebagai derau mentah (*raw RF noise*), menyebabkan frame corruption, checksum error, retransmisi terus-menerus, dan pemutusan sambungan acak. ACI jauh lebih merusak performa jaringan dibanding CCI!",
          },
          {
            id: "wls-l2-interactive1",
            type: "interactive",
            interactiveType: "channel_visualizer",
            config: {
              frequencyBand: "2.4 GHz",
              validChannels: [1, 6, 11],
              defaultScenario: "multi-room-school",
            },
          },
          {
            id: "wls-l2-callout2",
            type: "callout",
            variant: "tip",
            title: "Bagaimana dengan Kanal di Pita 5 GHz?",
            content:
              "Di frekuensi 5 GHz, setiap kanal 20 MHz dirancang terpisah tanpa tumpang tindih (misal Kanal 36, 40, 44, 48 pada UNII-1). Namun, jika Anda menggunakan channel bonding (lebar 40 MHz atau 80 MHz), kanal-kanal tersebut akan digabung, sehingga jumlah kanal independen yang tersedia berkurang.",
          },
          {
            id: "wls-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-wls-l2-q1",
            question:
              "Berapakah kombinasi kanal non-overlapping yang menjadi standar internasional pada pita frekuensi 2.4 GHz dengan lebar kanal 20 MHz?",
            options: [
              { id: "opt-a", text: "Kanal 1, Kanal 6, dan Kanal 11" },
              { id: "opt-b", text: "Kanal 1, Kanal 2, dan Kanal 3" },
              { id: "opt-c", text: "Kanal 2, Kanal 4, dan Kanal 8" },
              { id: "opt-d", text: "Kanal 1, Kanal 5, Kanal 9, dan Kanal 13" },
            ],
            explanation:
              "Dengan lebar kanal 20 MHz dan separasi antar kanal 5 MHz, hanya kanal 1, 6, dan 11 yang memiliki jarak 25 MHz antar frekuensi tengah sehingga tidak saling tumpang tindih sama sekali.",
            xpReward: 10,
          },
          {
            id: "wls-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-wls-l2-q2",
            question:
              "Apa akibat teknis jika seorang teknisi menyetel AP Ruang Guru pada Kanal 3 di samping AP Ruang Kelas yang menggunakan Kanal 1?",
            options: [
              {
                id: "opt-a",
                text: "Terjadi Adjacent Channel Interference (ACI) parah karena frekuensi saling bertumpuk sebagian, menimbulkan RF noise dan frame corruption",
              },
              {
                id: "opt-b",
                text: "Kecepatan kedua AP otomatis bertambah dua kali lipat karena frekuensi saling menguatkan",
              },
              {
                id: "opt-c",
                text: "Kedua AP secara otomatis melakukan bonding kanal menjadi 40 MHz",
              },
              {
                id: "opt-d",
                text: "AP pada Kanal 3 otomatis mengubah frekuensinya menjadi 5 GHz",
              },
            ],
            explanation:
              "Kanal 3 bertumpang tindih sebagian dengan Kanal 1. Sinyal yang tumpang tindih sebagian tidak dapat didekode oleh CSMA/CA melainkan dianggap derau (noise), memicu retransmisi dan packet loss tinggi.",
            xpReward: 10,
          },
          {
            id: "wls-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-wls-l2-q3",
            question:
              "Mengapa Co-Channel Interference (CCI) masih dianggap lebih aman bagi integritas paket dibanding Adjacent Channel Interference (ACI)?",
            options: [
              {
                id: "opt-a",
                text: "Karena pada CCI perangkat memahami protokol CSMA/CA dan menunda transmisi secara teratur, bukan menghasilkan distorsi noise acak",
              },
              {
                id: "opt-b",
                text: "Karena CCI menggunakan kabel fisik di udara untuk mengalirkan data",
              },
              {
                id: "opt-c",
                text: "Karena CCI tidak memerlukan antena nirkabel pada laptop klien",
              },
              {
                id: "opt-d",
                text: "Karena CCI secara otomatis mengenkripsi data dengan kunci 256-bit",
              },
            ],
            explanation:
              "Pada kanal yang sama (CCI), perangkat dapat mendeteksi frame preamble perangkat lain dan melakukan backoff antrean (contention), sehingga data tidak rusak meskipun throughput terbagi.",
            xpReward: 10,
          },
          {
            id: "wls-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 2",
            keyPoints: [
              "Pada pita frekuensi 2.4 GHz dengan lebar 20 MHz, hanya terdapat 3 kanal non-overlapping: Kanal 1, 6, dan 11.",
              "Penggunaan kanal 'tengah' seperti 2, 3, 4, 7, 8, 9 merusak kinerja karena menciptakan Adjacent Channel Interference (ACI).",
              "Co-Channel Interference (CCI) menyebabkan perangkat saling menunggu giliran (CSMA/CA contention), sedangkan ACI menghasilkan noise RF yang merusak frame data.",
              "Perencanaan pola kanal seluler (honeycomb pattern) 1-6-11 antar ruangan memastikan AP bersebelahan tidak menggunakan kanal yang sama.",
            ],
          },
          {
            id: "wls-l2-rew",
            type: "reward",
            xp: 60,
            message:
              "Selamat! Anda telah menguasai perencanaan kanal non-overlapping dan mitigasi interferensi Wi-Fi.",
          },
        ],
      },
    },
  ],
};
