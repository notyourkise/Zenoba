import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Network Topology (P1-M4)
 *
 * Covers Bus, Star, Ring physical architectures and single-point-of-failure impact analysis.
 */
export const topologyModuleData: CurriculumModule = {
  id: "module-network-topology",
  slug: "network-topology",
  title: "Network Topology",
  description:
    "Struktur fisik dan logis tata letak jaringan: Bus, Star, Ring, serta analisis ketahanan terhadap titik kegagalan tunggal (Single Point of Failure).",
  orderIndex: 3,
  prerequisites: ["client-server-communication"],
  outcomes: [
    {
      id: "TOP-M1",
      text: "Siswa dapat membedakan karakteristik fisik dan logis topologi Bus, Star, dan Ring.",
    },
    {
      id: "TOP-M2",
      text: "Siswa dapat memprediksi dampak kegagalan link atau perangkat terhadap konektivitas jaringan.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 9: bus-star-ring
    // =========================================================================
    {
      id: "lesson-bus-star-ring",
      slug: "bus-star-ring",
      title: "Topologi Dasar: Bus, Star, dan Ring",
      description:
        "Mengenal tata letak koneksi klasik dan standar de-facto jaringan modern berbasis switch konsentrator.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["request-response-cycle"],
      outcomes: [
        {
          id: "TOP-L9-A",
          text: "Siswa dapat membedakan karakteristik arsitektur topologi Bus, Star, dan Ring.",
        },
        {
          id: "TOP-L9-B",
          text: "Siswa dapat menjelaskan mengapa topologi Star menjadi standar dominan di jaringan modern.",
        },
      ],
      evidence: [
        {
          outcomeId: "TOP-L9-A",
          teachingBlockIds: ["top-l9-h1", "top-l9-txt1", "top-l9-callout1"],
          activityIds: ["top-l9-act1"],
          assessmentItemIds: ["quiz-top-l9-q1", "quiz-top-l9-q2"],
        },
        {
          outcomeId: "TOP-L9-B",
          teachingBlockIds: ["top-l9-txt2"],
          activityIds: ["top-l9-act1"],
          assessmentItemIds: ["quiz-top-l9-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "top-l9-h1",
            type: "heading",
            level: 2,
            text: "Geometri Hubungan Perangkat: Topologi Jaringan",
          },
          {
            id: "top-l9-txt1",
            type: "text",
            format: "markdown",
            content:
              "Topologi jaringan mendefinisikan bagaimana perangkat-perangkat terhubung satu sama lain secara fisik maupun jalur aliran data logisnya:\n\n1. **Topologi Bus (Linier):**\n   - Menggunakan satu kabel tulang punggung (*backbone*) tunggal (biasanya kabel koaksial) dengan terminator di kedua ujungnya.\n   - Semua node terhubung ke kabel yang sama menggunakan T-connector.\n   - Sederhana dan hemat kabel, namun jika kabel utama terputus di tengah, seluruh jaringan lumpuh.\n2. **Topologi Star (Bintang):**\n   - Setiap komputer memiliki kabel tersendiri yang terhubung langsung ke satu perangkat pusat konsentrator (Switch).\n   - Merupakan **standar de-facto jaringan lokal saat ini** di lab sekolah dan kantor.\n   - Jika kabel ke satu PC putus, PC lain tetap bekerja normal tanpa gangguan.\n3. **Topologi Ring (Cincin):**\n   - Setiap perangkat terhubung ke dua perangkat tetangga membentuk lingkaran tertutup.\n   - Sinyal data mengalir satu arah mengelilingi cincin menggunakan token (*token ring*).",
          },
          {
            id: "top-l9-callout1",
            type: "callout",
            variant: "info",
            title: "Mengapa Star Menjadi Standar Dunia Nyata?",
            content:
              "Meskipun topologi Star membutuhkan lebih banyak kabel (karena setiap PC menarik kabel langsung ke switch), kemudahan melokalisasi kerusakan (*troubleshooting*) dan fleksibilitas menambah/mencabut PC tanpa mematikan jaringan menjadikannya pilihan mutlak bagi seluruh instalasi modern.",
          },
          {
            id: "top-l9-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Karakteristik Perbandingan Cepat\n- **Bus:** Rentan tabrakan sinyal (*collision*), sulit dilacak jika putus, teknologi warisan (*legacy*).\n- **Star:** Mudah dikelola, sangat modular, performa tinggi, bergantung pada kesehatan switch sentral.\n- **Ring:** Sinyal diteruskan estafet, memerlukan regenerasi sinyal di tiap node.",
          },
          {
            id: "top-l9-act1",
            type: "interactive",
            interactiveType: "topology_explorer",
            config: {
              instruction: "Eksplorasi perbedaan tata letak topologi Bus, Star, dan Ring serta amati aliran koneksinya.",
            },
          },
          {
            id: "top-l9-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Pola Hubungan Topologi",
          },
          {
            id: "top-l9-q1-block",
            type: "quiz",
            quizId: "quiz-top-l9-q1",
            question: "Manakah ciri fisik utama dari jaringan yang menggunakan topologi Star?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Semua perangkat dihubungkan secara melingkar tanpa titik akhir" },
              { id: "opt-b", text: "Setiap perangkat memiliki kabel tersendiri yang terhubung ke satu switch/hub pusat" },
              { id: "opt-c", text: "Semua komputer berbagi satu kabel tembaga lurus dengan terminator di ujungnya" },
              { id: "opt-d", text: "Setiap komputer wajib memiliki antena satelit sendiri" },
            ],
            explanation: "Topologi Star menghubungkan semua node secara individual ke perangkat pusat konsentrator (switch).",
            xpReward: 10,
          },
          {
            id: "top-l9-q2-block",
            type: "quiz",
            quizId: "quiz-top-l9-q2",
            question: "Apa kelemahan paling fatal pada topologi Bus jika kabel tulang punggung (backbone) terpotong?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Hanya komputer yang terpotong yang mati, komputer lain otomatis beralih ke Star" },
              { id: "opt-b", text: "Seluruh jaringan lumpuh total karena sinyal memantul dan sirkuit terbuka tanpa terminator" },
              { id: "opt-c", text: "Kecepatan transfer data justru meningkat dua kali lipat" },
              { id: "opt-d", text: "Semua komputer otomatis terformat ulang" },
            ],
            explanation: "Pada topologi bus, putusnya kabel utama menghilangkan resistansi terminasi dan melumpuhkan komunikasi seluruh jaringan.",
            xpReward: 10,
          },
          {
            id: "top-l9-q3-block",
            type: "quiz",
            quizId: "quiz-top-l9-q3",
            question: "Mengapa teknisi lab TKJ memilih memasang topologi Star dibanding topologi Bus?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Karena topologi Star tidak memerlukan switch sama sekali" },
              { id: "opt-b", text: "Karena jika kabel satu komputer siswa rusak atau tercabut, komputer lain tidak terganggu" },
              { id: "opt-c", text: "Karena kabel topologi Star tidak menggunakan konektor tembaga" },
              { id: "opt-d", text: "Karena topologi Star hanya bisa digunakan untuk 3 komputer saja" },
            ],
            explanation: "Isolasi gangguan adalah keunggulan terbesar topologi Star: masalah pada kabel individual tidak merusak komunikasi node lainnya.",
            xpReward: 10,
          },
          {
            id: "top-l9-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 9",
            keyPoints: [
              "Topologi menentukan pola koneksi fisik dan logis antarperangkat jaringan.",
              "Topologi Star adalah standar industri modern karena ketahanan isolasi gangguan per kabel.",
              "Topologi Bus dan Ring memiliki ketergantungan berantai yang rentan melumpuhkan seluruh segmen.",
            ],
          },
          {
            id: "top-l9-reward",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah memahami konsep arsitektur topologi Bus, Star, dan Ring.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 10: topology-fault-impact
    // =========================================================================
    {
      id: "lesson-topology-fault-impact",
      slug: "topology-fault-impact",
      title: "Analisis Titik Kegagalan (Single Point of Failure)",
      description:
        "Menganalisis dampak pemutusan satu kabel atau matinya perangkat sentral terhadap komunikasi endpoint lainnya.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["bus-star-ring"],
      outcomes: [
        {
          id: "TOP-L10-A",
          text: "Siswa dapat mengidentifikasi titik kegagalan tunggal (Single Point of Failure) pada berbagai topologi.",
        },
        {
          id: "TOP-L10-B",
          text: "Siswa dapat merencanakan langkah mitigasi isolasi gangguan menggunakan redundansi.",
        },
      ],
      evidence: [
        {
          outcomeId: "TOP-L10-A",
          teachingBlockIds: ["top-l10-h1", "top-l10-txt1", "top-l10-callout1"],
          activityIds: ["top-l10-act1"],
          assessmentItemIds: ["quiz-top-l10-q1", "quiz-top-l10-q2"],
        },
        {
          outcomeId: "TOP-L10-B",
          teachingBlockIds: ["top-l10-txt2"],
          activityIds: ["top-l10-act1"],
          assessmentItemIds: ["quiz-top-l10-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "top-l10-h1",
            type: "heading",
            level: 2,
            text: "Konsep Single Point of Failure (SPOF)",
          },
          {
            id: "top-l10-txt1",
            type: "text",
            format: "markdown",
            content:
              "Dalam perancangan infrastruktur jaringan, **Single Point of Failure (SPOF)** adalah satu komponen, link kabel, atau perangkat yang jika mengalami kegagalan, akan menyebabkan seluruh atau sebagian besar sistem berhenti beroperasi:\n\n1. **SPOF pada Topologi Bus:** Kabel backbone linier. Satu titik putus melumpuhkan 100% jaringan.\n2. **SPOF pada Topologi Star:** Switch pusat konsentrator. Jika switch sentral kehilangan daya listrik atau rusak, semua komputer yang terhubung padanya kehilangan konektivitas bersamaan.\n3. **Kabel Client pada Topologi Star:** BUKAN SPOF. Jika kabel dari Switch ke PC-01 digigit tikus, hanya PC-01 yang offline. PC-02, PC-03, dan server tetap saling berkomunikasi normal.",
          },
          {
            id: "top-l10-callout1",
            type: "callout",
            variant: "warning",
            title: "Prinsip Keandalan Jaringan",
            content:
              "Sebagai calon perancang jaringan TKJ atau konsultan IT, tugas Anda adalah **mengeliminasi SPOF** pada bagian kritis. Contoh: menggunakan power supply ganda (redundant PSU) pada switch core, atau menambahkan kabel cadangan (*uplink redundancy*) antargedung.",
          },
          {
            id: "top-l10-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Matriks Analisis Dampak Kegagalan\n| Komponen Rusak | Topologi Bus | Topologi Star | Penanganan Teknisi |\n| :--- | :--- | :--- | :--- |\n| **1 Kabel Cabang Endpoint** | Seluruh bus mati (pada sistem koaksial) | **Hanya 1 endpoint mati** | Ganti kabel patch cord PC |\n| **Kabel Tulang Punggung** | **Seluruh bus mati** | N/A (jika antarswitch, segmen bawah mati) | Sambung kabel / aktifkan link cadangan |\n| **Perangkat Pusat (Switch)**| N/A | **Seluruh endpoint mati** | Ganti switch cadangan / periksa sumber daya UPS |",
          },
          {
            id: "top-l10-act1",
            type: "interactive",
            interactiveType: "connectivity_toggle",
            config: {
              instruction: "Simulasikan pemutusan kabel individual vs pemutusan switch sentral dan perhatikan status reachability perangkat.",
            },
          },
          {
            id: "top-l10-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Analisis Titik Kegagalan",
          },
          {
            id: "top-l10-q1-block",
            type: "quiz",
            quizId: "quiz-top-l10-q1",
            question: "Pada lab sekolah yang menggunakan topologi Star dengan 1 switch 24-port, komponen manakah yang menjadi Single Point of Failure (SPOF)?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Mouse pada komputer PC-05" },
              { id: "opt-b", text: "Switch 24-port utama yang menghubungkan semua komputer" },
              { id: "opt-c", text: "Kabel UTP pendek yang menuju ke komputer PC-12" },
              { id: "opt-d", text: "Monitor di meja guru" },
            ],
            explanation: "Switch pusat adalah SPOF pada topologi star; jika switch mati, seluruh PC di lab kehilangan koneksi bersamaan.",
            xpReward: 10,
          },
          {
            id: "top-l10-q2-block",
            type: "quiz",
            quizId: "quiz-top-l10-q2",
            question: "Seorang siswa di PC-03 tidak sengaja menendang kabel LAN hingga terlepas dari port switch. Apa yang terjadi pada PC-01 dan PC-02 di lab tersebut?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "PC-01 dan PC-02 ikut mati dan tidak bisa mengakses server" },
              { id: "opt-b", text: "PC-01 dan PC-02 tetap terhubung normal dan dapat bertukar data seperti biasa" },
              { id: "opt-c", text: "Switch otomatis terbakar karena sirkuit terbuka" },
              { id: "opt-d", text: "Semua komputer langsung restart otomatis" },
            ],
            explanation: "Pada topologi star, pemutusan kabel satu endpoint terisolasi secara sempurna dan tidak memengaruhi endpoint lain.",
            xpReward: 10,
          },
          {
            id: "top-l10-q3-block",
            type: "quiz",
            quizId: "quiz-top-l10-q3",
            question: "Langkah terbaik untuk mencegah seluruh kantor lumpuh saat switch core utama mendadak rusak adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kembali menggunakan topologi Bus tanpa switch" },
              { id: "opt-b", text: "Menerapkan redundansi perangkat (switch cadangan dengan konfigurasi identik / failover)" },
              { id: "opt-c", text: "Mengurangi kecepatan jaringan menjadi 10 Mbps" },
              { id: "opt-d", text: "Menghapus semua alamat IP di komputer karyawan" },
            ],
            explanation: "Redundansi perangkat dan jalur (*hardware failover*) adalah solusi standar industri untuk mengeliminasi dampak SPOF.",
            xpReward: 10,
          },
          {
            id: "top-l10-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 10",
            keyPoints: [
              "SPOF adalah komponen tunggal yang kegagalannya melumpuhkan seluruh sistem.",
              "Topologi Star mengisolasi gangguan pada level kabel pengguna, namun memiliki SPOF pada perangkat pusat (switch).",
              "Infrastruktur enterprise memitigasi SPOF dengan redundansi perangkat, daya cadangan (UPS), dan jalur failover.",
            ],
          },
          {
            id: "top-l10-reward",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda mampu menganalisis dampak kegagalan topologi secara profesional.",
          },
        ],
      },
    },
  ],
};
