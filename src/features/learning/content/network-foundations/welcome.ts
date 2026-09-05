import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Welcome to Networking (P1-M1)
 *
 * Designed for SMK TKJ students and networking beginners.
 * Contains 4 outcome-driven lessons with two-way traceability.
 */
export const welcomeModuleData: CurriculumModule = {
  id: "module-welcome-to-networking",
  slug: "welcome-to-networking",
  title: "Welcome to Networking",
  description:
    "Fondasi awal jaringan komputer: perangkat, koneksi, berbagi sumber daya, dan komunikasi dasar.",
  orderIndex: 0,
  prerequisites: [],
  outcomes: [
    {
      id: "WN-M1",
      text: "Siswa dapat menjelaskan jaringan komputer sebagai kumpulan perangkat yang saling terhubung untuk berkomunikasi dan berbagi sumber daya.",
    },
    {
      id: "WN-M2",
      text: "Siswa dapat mengidentifikasi perangkat akhir, media koneksi, dan sumber daya bersama pada jaringan rumah atau sekolah.",
    },
    {
      id: "WN-M3",
      text: "Siswa dapat membedakan jaringan lokal dari akses Internet pada skenario operasional sehari-hari.",
    },
    {
      id: "WN-M4",
      text: "Siswa dapat memprediksi dampak gangguan pada satu koneksi terhadap komunikasi lokal melalui analisis bukti dan simulasi terarah.",
    },
  ],
  finalAssessment: {
    assessmentId: "assessment-welcome-final",
    title: "Ujian Akhir Modul: Welcome to Networking",
    description:
      "Evaluasi komprehensif pemahaman konsep jaringan dasar dan verifikasi praktik konektivitas lab perpustakaan.",
    conceptQuestionCount: 10,
    conceptPassThreshold: 8,
    practicalCriteriaCount: 3,
    practicalPassThreshold: 3,
  },
  lessons: [
    // =========================================================================
    // Lesson 1: intro-to-networking
    // =========================================================================
    {
      id: "lesson-intro-to-networking",
      slug: "intro-to-networking",
      title: "Apa Itu Jaringan Komputer?",
      description:
        "Mengenal perangkat mandiri vs berjaringan serta manfaat berbagi berkas dan printer.",
      orderIndex: 0,
      estimatedMinutes: 8,
      xpReward: 50,
      prerequisites: [],
      outcomes: [
        {
          id: "WN-L1-A",
          text: "Siswa dapat membedakan kumpulan perangkat yang terhubung dan perangkat yang berdiri sendiri.",
        },
        {
          id: "WN-L1-B",
          text: "Siswa dapat menjelaskan dua manfaat jaringan dari skenario berbagi file dan printer.",
        },
      ],
      evidence: [
        {
          outcomeId: "WN-L1-A",
          teachingBlockIds: ["block-l1-teach-standalone-vs-networked"],
          activityIds: ["block-l1-act-connectivity-toggle"],
          assessmentItemIds: ["quiz-wn-l1-q1"],
        },
        {
          outcomeId: "WN-L1-B",
          teachingBlockIds: ["block-l1-teach-file-printer-sharing"],
          activityIds: ["block-l1-act-resource-match"],
          assessmentItemIds: ["quiz-wn-l1-q2", "quiz-wn-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "block-l1-heading-intro",
            type: "heading",
            level: 1,
            text: "Apa Itu Jaringan Komputer?",
          },
          {
            id: "block-l1-intro-problem",
            type: "text",
            format: "markdown",
            content:
              "Bayangkan kamu berada di ruang lab komputer sekolah dengan 10 komputer siswa dan hanya 1 unit printer di meja guru. Untuk mencetak tugas, siswa harus bergantian menyalin berkas ke flashdisk dan berjalan ke komputer guru. Jika ada 30 siswa, banyak waktu terbuang hanya untuk antre flashdisk. Di sinilah jaringan komputer hadir memberikan solusi.",
          },
          {
            id: "block-l1-teach-standalone-vs-networked",
            type: "text",
            format: "markdown",
            content:
              "### Perangkat Mandiri (*Standalone*) vs Berjaringan (*Networked*)\n\n- **Perangkat Mandiri (*Standalone*):** Komputer yang bekerja terisolasi. Komputer dapat menyala dan memproses dokumen, namun tidak memiliki sambungan kabel atau nirkabel ke komputer lain. Pemindahan data harus memakai media fisik (*flashdisk/sneaker-net*).\n- **Perangkat Berjaringan (*Networked*):** Perangkat yang terhubung melalui media transmisi dan mampu bertukar data langsung secara elektronik.\n\n**Definisi Jaringan Komputer:** Dua atau lebih perangkat komputasi yang saling terhubung menggunakan media transmisi untuk tujuan komunikasi data dan berbagi sumber daya.",
          },
          {
            id: "block-l1-act-connectivity-toggle",
            type: "interactive",
            interactiveType: "connectivity_toggle",
            config: {
              scenario: "standalone_vs_connected",
              devices: ["PC-A", "PC-B"],
              instruction:
                "Uji sambungan kabel antara PC-A dan PC-B. Amati pesan teks hanya terkirim ketika status kabel 'Connected'.",
            },
          },
          {
            id: "block-l1-teach-file-printer-sharing",
            type: "text",
            format: "markdown",
            content:
              "### Manfaat Nyata: Berbagi Berkas & Printer\n\n1. **Berbagi Berkas (*File Sharing*):** Guru menempatkan dokumen di folder bersama (*shared folder*). Semua komputer siswa dapat mengaksesnya langsung dalam hitungan detik tanpa flashdisk yang rawan membawa virus.\n2. **Berbagi Printer (*Printer Sharing*):** Printer dihubungkan ke jaringan lab sehingga seluruh komputer siswa dapat mengirim dokumen cetak ke printer yang sama.",
          },
          {
            id: "block-l1-act-resource-match",
            type: "interactive",
            interactiveType: "resource_match",
            config: {
              scenario: "lab_efficiency",
              instruction:
                "Cocokkan kebutuhan lab dengan solusi jaringan yang paling efisien.",
            },
          },
          {
            id: "block-l1-callout-misconception",
            type: "callout",
            variant: "tip",
            title: "Miskonsepsi Umum",
            content:
              "Memiliki komputer canggih atau aksesoris mouse nirkabel tidak otomatis membuat komputer berada dalam jaringan komputer. Jaringan membutuhkan koneksi data antar perangkat.",
          },
          {
            id: "quiz-wn-l1-q1",
            type: "quiz",
            quizId: "quiz-wn-l1-q1",
            question:
              "Manakah kondisi yang paling tepat menggambarkan bahwa sebuah komputer telah menjadi bagian dari jaringan komputer?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Komputer menyala dengan spesifikasi RAM dan prosesor yang tinggi." },
              {
                id: "opt-b",
                text: "Komputer terhubung ke perangkat lain melalui media transmisi kabel atau nirkabel sehingga dapat saling bertukar data.",
              },
              { id: "opt-c", text: "Komputer memiliki monitor layar sentuh dan keyboard nirkabel." },
              { id: "opt-d", text: "Komputer mampu menyimpan ribuan file di dalam harddisk internalnya." },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l1-q2",
            type: "quiz",
            quizId: "quiz-wn-l1-q2",
            question:
              "Di lab sekolah dengan 20 komputer mandiri (standalone), siswa harus memindahkan tugas menggunakan satu flashdisk bergantian. Apa manfaat utama yang dirasakan jika ke-20 komputer tersebut dihubungkan dalam satu jaringan komputer?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Komputer tidak lagi memerlukan sistem operasi untuk bekerja." },
              { id: "opt-b", text: "Kecepatan mengetik dokumen siswa bertambah secara otomatis." },
              {
                id: "opt-c",
                text: "Siswa dapat saling mengirim dan mengakses berkas tugas langsung tanpa perlu mencolokkan flashdisk fisik berulang kali.",
              },
              { id: "opt-d", text: "Kapasitas memori RAM setiap komputer akan berlipat ganda." },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l1-q3",
            type: "quiz",
            quizId: "quiz-wn-l1-q3",
            question:
              "Sebuah kantor memiliki 5 ruangan kerja dan membeli 1 unit printer laser berkualitas tinggi. Bagaimana konsep jaringan komputer membantu kantor tersebut secara efisien?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kantor harus membeli kabel listrik tambahan untuk setiap ruangan." },
              {
                id: "opt-b",
                text: "Kelima ruangan dapat berbagi akses ke printer yang sama melalui jaringan tanpa harus memindahkan fisik printer ke tiap ruangan.",
              },
              { id: "opt-c", text: "Printer akan mencetak dokumen lima kali lebih tebal dari biasanya." },
              { id: "opt-d", text: "Kantor diwajibkan membeli 5 printer tambahan agar adil bagi setiap ruangan." },
            ],
            xpReward: 10,
          },
          {
            id: "block-l1-summary",
            type: "summary",
            title: "Rangkuman Materi",
            keyPoints: [
              "Perangkat mandiri (standalone) bekerja terisolasi tanpa koneksi ke komputer lain.",
              "Jaringan terbentuk saat dua atau lebih perangkat terhubung via media kabel/nirkabel untuk bertukar data.",
              "Berbagi file dan printer adalah manfaat nyata penghematan waktu dan biaya perangkat keras.",
            ],
          },
          {
            id: "block-l1-reward",
            type: "reward",
            xp: 50,
            badgeTitle: "Network Explorer",
            message: "Selamat! Anda memahami konsep dasar jaringan komputer.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 2: everyday-networks
    // =========================================================================
    {
      id: "lesson-everyday-networks",
      slug: "everyday-networks",
      title: "Perangkat Jaringan di Sekitar Kita",
      description:
        "Mengidentifikasi perangkat akhir, kabel vs nirkabel, dan membedakan LAN dengan Internet.",
      orderIndex: 1,
      estimatedMinutes: 8,
      xpReward: 50,
      prerequisites: ["intro-to-networking"],
      outcomes: [
        {
          id: "WN-L2-A",
          text: "Siswa dapat mengidentifikasi perangkat akhir dan media koneksi pada jaringan rumah/sekolah.",
        },
        {
          id: "WN-L2-B",
          text: "Siswa dapat membedakan layanan lokal yang masih dapat digunakan ketika akses Internet terputus.",
        },
      ],
      evidence: [
        {
          outcomeId: "WN-L2-A",
          teachingBlockIds: ["block-l2-teach-end-devices-media"],
          activityIds: ["block-l2-act-device-media-classification"],
          assessmentItemIds: ["quiz-wn-l2-q1"],
        },
        {
          outcomeId: "WN-L2-B",
          teachingBlockIds: ["block-l2-teach-lan-vs-internet"],
          activityIds: ["block-l2-act-uplink-toggle"],
          assessmentItemIds: ["quiz-wn-l2-q2", "quiz-wn-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "block-l2-heading-intro",
            type: "heading",
            level: 1,
            text: "Perangkat Jaringan di Sekitar Kita",
          },
          {
            id: "block-l2-intro-problem",
            type: "text",
            format: "markdown",
            content:
              "Ketika lampu internet di router rumahmu berkedip merah dan kamu tidak bisa menonton YouTube, apakah printer Wi-Fi di sebelah meja belajarmu juga ikut mati? Jawabannya: tidak selalu. Memahami perbedaan antara jaringan lokal dan Internet akan mengubah cara pandangmu terhadap infrastruktur IT.",
          },
          {
            id: "block-l2-teach-end-devices-media",
            type: "text",
            format: "markdown",
            content:
              "### Perangkat Akhir vs Media Koneksi\n\n- **Perangkat Akhir (*End Devices / Endpoints*):** Perangkat yang digunakan langsung oleh manusia untuk membuat, mengirim, atau menerima data (PC, laptop, smartphone, tablet, smart TV, printer jaringan).\n- **Media Koneksi (*Transmission Media*):** Penghantar sinyal data antar perangkat:\n  - *Kabel (Wired):* Kabel tembaga Ethernet (UTP) dengan konektor RJ-45, berkecepatan stabil.\n  - *Nirkabel (Wireless / Wi-Fi):* Menggunakan gelombang radio di udara, fleksibel untuk perangkat bergerak.",
          },
          {
            id: "block-l2-act-device-media-classification",
            type: "interactive",
            interactiveType: "classification",
            config: {
              scenario: "endpoints_and_media",
              instruction:
                "Pilah komponen mana yang merupakan perangkat akhir dan mana yang merupakan media transmisi.",
            },
          },
          {
            id: "block-l2-teach-lan-vs-internet",
            type: "text",
            format: "markdown",
            content:
              "### Jaringan Lokal (LAN) vs Internet\n\n- **LAN (*Local Area Network*):** Jaringan milik sendiri dalam lingkup area terbatas (rumah, kelas, kantor). Komunikasi lokal tidak memerlukan jalur internet luar.\n- **Internet:** Jaringan global yang menghubungkan berbagai LAN di seluruh dunia melalui Penyedia Jasa Internet (*ISP*).\n\nJika kabel ISP di jalan terputus, akses internet luar padam, namun transfer file atau pencetakan dokumen di dalam LAN lokal tetap berjalan normal.",
          },
          {
            id: "block-l2-act-uplink-toggle",
            type: "interactive",
            interactiveType: "uplink_toggle",
            config: {
              scenario: "home_office_uplink",
              instruction:
                "Putus jalur ISP Uplink. Amati bahwa laptop tetap berhasil mencetak ke printer lokal di LAN yang sama.",
            },
          },
          {
            id: "block-l2-callout-wifi-vs-internet",
            type: "callout",
            variant: "warning",
            title: "Wi-Fi Bukan Internet",
            content:
              "Sinyal Wi-Fi penuh hanya menunjukkan bahwa perangkatmu terhubung dengan baik ke router lokal. Jika router tersebut tidak terhubung ke ISP, kamu tetap tidak bisa mengakses internet.",
          },
          {
            id: "quiz-wn-l2-q1",
            type: "quiz",
            quizId: "quiz-wn-l2-q1",
            question:
              "Di sebuah lab komputer SMK, terdapat PC siswa, laptop guru, kabel UTP, printer jaringan, dan sinyal Wi-Fi. Manakah kelompok yang seluruhnya merupakan perangkat akhir (end devices)?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kabel UTP dan sinyal Wi-Fi" },
              { id: "opt-b", text: "PC siswa, laptop guru, dan printer jaringan" },
              { id: "opt-c", text: "Kabel UTP dan printer jaringan" },
              { id: "opt-d", text: "Sinyal Wi-Fi dan PC siswa" },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l2-q2",
            type: "quiz",
            quizId: "quiz-wn-l2-q2",
            question:
              "Saat modem penyedia internet di sekolah sedang mengalami gangguan massal dan koneksi internet padam total, Pak Budi tetap berhasil mencetak dokumen dari laptopnya ke printer yang terhubung ke switch lab yang sama. Mengapa hal ini dimungkinkan?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Printer secara ajaib memiliki koneksi internet satelit sendiri." },
              {
                id: "opt-b",
                text: "Mencetak dokumen di jaringan lokal hanya membutuhkan komunikasi LAN yang masih aktif, tanpa perlu melewati jalur internet luar.",
              },
              { id: "opt-c", text: "Pak Budi mencetak dokumen menggunakan tenaga baterai laptop." },
              { id: "opt-d", text: "Gangguan internet hanya berlaku untuk siswa, bukan untuk guru." },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l2-q3",
            type: "quiz",
            quizId: "quiz-wn-l2-q3",
            question:
              "Di smartphone muncul ikon Wi-Fi penuh, namun ada tanda seru kecil bertuliskan 'Connected without internet' dan aplikasi media sosial tidak bisa memuat data baru. Apa arti sebenarnya dari status tersebut?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Smartphone mengalami kerusakan pada chip prosesornya." },
              {
                id: "opt-b",
                text: "Smartphone berhasil terhubung ke access point lokal melalui gelombang radio, namun jaringan lokal tersebut tidak memiliki jalur keluar menuju Internet.",
              },
              { id: "opt-c", text: "Sinyal Wi-Fi di rumah pasti palsu dan tidak memancarkan frekuensi apa pun." },
              { id: "opt-d", text: "Seluruh kabel di dalam smartphone terputus." },
            ],
            xpReward: 10,
          },
          {
            id: "block-l2-summary",
            type: "summary",
            title: "Rangkuman Materi",
            keyPoints: [
              "Perangkat akhir (endpoints) adalah asal dan tujuan data pengguna.",
              "Media koneksi berupa kabel (UTP) dan nirkabel (Wi-Fi).",
              "Jaringan lokal (LAN) dapat tetap melayani perangkat lokal meski akses Internet terputus.",
            ],
          },
          {
            id: "block-l2-reward",
            type: "reward",
            xp: 50,
            badgeTitle: "Infrastructure Scout",
            message: "Luar biasa! Anda memahami perangkat dan batas jaringan lokal.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 3: sharing-network-resources
    // =========================================================================
    {
      id: "lesson-sharing-network-resources",
      slug: "sharing-network-resources",
      title: "Berbagi Sumber Daya dalam Jaringan",
      description:
        "Memilih sumber daya bersama dan memahami peran peminta (client) serta penyedia (server).",
      orderIndex: 2,
      estimatedMinutes: 8,
      xpReward: 50,
      prerequisites: ["everyday-networks"],
      outcomes: [
        {
          id: "WN-L3-A",
          text: "Siswa dapat memilih sumber daya yang tepat untuk kebutuhan berbagi file atau mencetak bersama.",
        },
        {
          id: "WN-L3-B",
          text: "Siswa dapat mengidentifikasi peminta dan penyedia layanan pada satu transaksi sederhana.",
        },
      ],
      evidence: [
        {
          outcomeId: "WN-L3-A",
          teachingBlockIds: ["block-l3-teach-resources"],
          activityIds: ["block-l3-act-resource-selection"],
          assessmentItemIds: ["quiz-wn-l3-q1"],
        },
        {
          outcomeId: "WN-L3-B",
          teachingBlockIds: ["block-l3-teach-client-server-roles"],
          activityIds: ["block-l3-act-role-assignment"],
          assessmentItemIds: ["quiz-wn-l3-q2", "quiz-wn-l3-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "block-l3-heading-intro",
            type: "heading",
            level: 1,
            text: "Berbagi Sumber Daya dalam Jaringan",
          },
          {
            id: "block-l3-intro-problem",
            type: "text",
            format: "markdown",
            content:
              "Ketika lima orang siswa mengerjakan tugas proyek bersama, mereka membutuhkan dokumen referensi yang sama. Menyimpan salinan berbeda di lima laptop berisiko membingungkan versi mana yang paling baru. Bagaimana jaringan membantu kerja kolaboratif?",
          },
          {
            id: "block-l3-teach-resources",
            type: "text",
            format: "markdown",
            content:
              "### Sumber Daya Jaringan (*Network Resources*)\n\nSumber daya jaringan adalah perangkat keras atau data yang dapat diakses oleh banyak pengguna:\n- **Sumber Daya Data:** Berkas dokumen bersama (*shared folder*), database perpustakaan.\n- **Sumber Daya Perangkat Keras:** Printer bersama, pemindai (*scanner*), media penyimpanan jaringan (*NAS*).",
          },
          {
            id: "block-l3-act-resource-selection",
            type: "interactive",
            interactiveType: "resource_selection",
            config: {
              scenario: "file_and_print_needs",
              instruction:
                "Pilih sumber daya jaringan yang sesuai untuk skenario kantor sekolah.",
            },
          },
          {
            id: "block-l3-teach-client-server-roles",
            type: "text",
            format: "markdown",
            content:
              "### Peran Peminta (*Client*) vs Penyedia (*Server*)\n\nDalam pertukaran data di jaringan:\n- **Peminta (*Client / Requester*):** Perangkat atau aplikasi yang mengajukan permintaan layanan (misalnya PC siswa meminta file modul).\n- **Penyedia (*Server / Provider*):** Perangkat atau aplikasi yang melayani permintaan tersebut (misalnya PC guru yang membagikan folder modul).\n\n*Peran ini fungsional:* Komputer biasa di lab dapat bertindak sebagai server jika ia menyediakan berkas yang diminta oleh komputer lain.",
          },
          {
            id: "block-l3-act-role-assignment",
            type: "interactive",
            interactiveType: "role_assignment",
            config: {
              scenario: "client_server_identification",
              instruction:
                "Tentukan perangkat mana yang bertindak sebagai peminta (client) dan penyedia (server).",
            },
          },
          {
            id: "quiz-wn-l3-q1",
            type: "quiz",
            quizId: "quiz-wn-l3-q1",
            question:
              "Seorang instruktur lab ingin memastikan 30 siswa dapat membaca modul praktikum yang sama setiap sesi tanpa perlu menggandakan kertas fotokopi. Sumber daya jaringan apa yang paling tepat disiapkan?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kabel listrik tambahan di setiap meja praktikum." },
              {
                id: "opt-b",
                text: "Folder berkas bersama (shared folder) di jaringan lokal yang berisi file modul digital.",
              },
              { id: "opt-c", text: "Mouse cadangan di laci instruktur." },
              { id: "opt-d", text: "Mengubah warna cat dinding lab agar terlihat modern." },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l3-q2",
            type: "quiz",
            quizId: "quiz-wn-l3-q2",
            question:
              "Andi duduk di depan PC-05 lab komputer dan menekan tombol cetak pada aplikasi pengolah kata ke printer jaringan yang berada di meja depan. Dalam transaksi komunikasi ini, siapa yang berperan sebagai peminta (client / requester)?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Printer jaringan di meja depan" },
              { id: "opt-b", text: "Kertas yang keluar dari mesin printer" },
              { id: "opt-c", text: "PC-05 yang digunakan oleh Andi" },
              { id: "opt-d", text: "Meja tempat printer diletakkan" },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l3-q3",
            type: "quiz",
            quizId: "quiz-wn-l3-q3",
            question:
              "Dina membagikan folder tugas kelompok dari laptopnya agar teman satu kelompoknya, Eko, dapat mengunduh dokumen laporan. Dalam pertukaran berkas tersebut, laptop Dina menjalankan peran sebagai apa?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Perangkat perantara pasif tanpa peran" },
              { id: "opt-b", text: "Penyedia layanan (server / provider) berkas" },
              { id: "opt-c", text: "Peminta layanan (client / requester)" },
              { id: "opt-d", text: "Penghalang koneksi data" },
            ],
            xpReward: 10,
          },
          {
            id: "block-l3-summary",
            type: "summary",
            title: "Rangkuman Materi",
            keyPoints: [
              "Sumber daya jaringan meliputi berkas data digital dan perangkat keras bersama.",
              "Peminta (client) menginisiasi permintaan layanan.",
              "Penyedia (server) merespons dan menyediakan sumber daya yang diminta.",
            ],
          },
          {
            id: "block-l3-reward",
            type: "reward",
            xp: 50,
            badgeTitle: "Resource Master",
            message: "Hebat! Anda memahami peran client dan server dalam berbagi sumber daya.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 4: simple-network-communication
    // =========================================================================
    {
      id: "lesson-simple-network-communication",
      slug: "simple-network-communication",
      title: "Bagaimana Perangkat Saling Berbicara?",
      description:
        "Menelusuri siklus request & response serta mengisolasi jalur koneksi yang bermasalah.",
      orderIndex: 3,
      estimatedMinutes: 10,
      xpReward: 50,
      prerequisites: ["sharing-network-resources"],
      outcomes: [
        {
          id: "WN-L4-A",
          text: "Siswa dapat mengurutkan permintaan, pengiriman melalui koneksi, penerimaan, dan respons pada komunikasi sederhana.",
        },
        {
          id: "WN-L4-B",
          text: "Siswa dapat memilih koneksi yang menyebabkan kegagalan komunikasi berdasarkan diagram dan hasil simulasi.",
        },
      ],
      evidence: [
        {
          outcomeId: "WN-L4-A",
          teachingBlockIds: ["block-l4-teach-request-response"],
          activityIds: ["block-l4-act-message-flow"],
          assessmentItemIds: ["quiz-wn-l4-q1"],
        },
        {
          outcomeId: "WN-L4-B",
          teachingBlockIds: ["block-l4-teach-independent-branches"],
          activityIds: ["block-l4-act-branch-disconnect"],
          assessmentItemIds: ["quiz-wn-l4-q2", "quiz-wn-l4-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "block-l4-heading-intro",
            type: "heading",
            level: 1,
            text: "Bagaimana Perangkat Saling Berbicara?",
          },
          {
            id: "block-l4-intro-problem",
            type: "text",
            format: "markdown",
            content:
              "Di ruang tata usaha, Komputer 1 dan Komputer 2 terhubung ke satu switch dan biasa mencetak ke Printer TU. Suatu hari, Komputer 1 sukses mencetak, namun Komputer 2 gagal dengan pesan error. Staf berkata: 'Printernya rusak!'. Benarkah printernya yang rusak?",
          },
          {
            id: "block-l4-teach-request-response",
            type: "text",
            format: "markdown",
            content:
              "### Siklus Permintaan dan Tanggapan (*Request & Response*)\n\nKomunikasi data dua arah berlangsung dalam 4 tahapan pasti:\n1. **Pembuatan Permintaan (*Request Creation*):** Komputer pengirim membuat instruksi atau permintaan.\n2. **Pengiriman Melalui Media (*Transmission*):** Pesan dikirim melalui kabel/gelombang radio menuju perangkat tujuan.\n3. **Penerimaan & Pemrosesan (*Processing*):** Perangkat tujuan menerima instruksi dan mengeksekusinya.\n4. **Pengiriman Respons (*Response Reply*):** Perangkat tujuan mengirim konfirmasi status kembali ke pengirim.",
          },
          {
            id: "block-l4-act-message-flow",
            type: "interactive",
            interactiveType: "message_flow",
            config: {
              scenario: "request_response_trace",
              instruction:
                "Urutkan 4 tahapan komunikasi data dari awal permintaan hingga respons diterima.",
            },
          },
          {
            id: "block-l4-teach-independent-branches",
            type: "text",
            format: "markdown",
            content:
              "### Jalur Cabang yang Independen\n\nPada jaringan modern, setiap perangkat memiliki kabel cabang mandiri ke switch. Jika kabel Komputer 2 lepas:\n- Komputer 2 kehilangan komunikasi.\n- Komputer 1 dan Printer tetap terhubung dan dapat mencetak normal.\n\n**Prinsip IT Support:** Amati bukti! Jika satu perangkat berhasil, masalahnya terletak pada cabang perangkat yang gagal, bukan seluruh sistem.",
          },
          {
            id: "block-l4-act-branch-disconnect",
            type: "interactive",
            interactiveType: "branch_disconnect",
            config: {
              scenario: "printer_branch_troubleshooting",
              instruction:
                "Simulasikan kabel PC-2 putus. Perhatikan bahwa PC-1 tetap dapat mencetak. Sambungkan kembali kabel PC-2 untuk memulihkan.",
            },
          },
          {
            id: "quiz-wn-l4-q1",
            type: "quiz",
            quizId: "quiz-wn-l4-q1",
            question:
              "Manakah urutan tahapan yang benar pada komunikasi jaringan dua arah ketika sebuah laptop meminta berkas dari komputer penyedia?",
            quizType: "single_choice",
            options: [
              {
                id: "opt-a",
                text: "Laptop menerima berkas -> Laptop meminta -> Komputer penyedia mengirim respons -> Media terhubung",
              },
              {
                id: "opt-b",
                text: "Laptop membuat permintaan -> Permintaan dikirim melalui media transmisi -> Komputer penyedia menerima & memproses -> Komputer penyedia mengirim respons balik",
              },
              {
                id: "opt-c",
                text: "Komputer penyedia mengirim berkas sebelum ada permintaan -> Laptop mematikan kabel -> Transaksi selesai",
              },
              {
                id: "opt-d",
                text: "Media transmisi mengirim berkas sendiri tanpa ada perangkat pengirim",
              },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l4-q2",
            type: "quiz",
            quizId: "quiz-wn-l4-q2",
            question:
              "PC-A dan PC-B terhubung ke switch yang sama di lab. PC-A dapat mencetak dokumen ke printer jaringan, namun PC-B selalu gagal. Setelah diperiksa ke belakang meja, kabel jaringan PC-B tidak tercolok ke port LAN. Kesimpulan teknis apa yang paling tepat?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Printer lab rusak total dan harus segera dibuang." },
              {
                id: "opt-b",
                text: "Kegagalan komunikasi hanya terjadi pada PC-B karena kabel cabangnya terputus, sedangkan printer dan PC-A bekerja normal.",
              },
              { id: "opt-c", text: "Seluruh kabel jaringan di sekolah terkena petir." },
              { id: "opt-d", text: "PC-B tidak menyukai printer tersebut." },
            ],
            xpReward: 10,
          },
          {
            id: "quiz-wn-l4-q3",
            type: "quiz",
            quizId: "quiz-wn-l4-q3",
            question:
              "Berdasarkan temuan kabel PC-B yang lepas pada skenario di atas, tindakan perbaikan terarah apa yang harus dilakukan pertama kali oleh petugas IT Support?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Menginstal ulang seluruh sistem operasi di PC-A dan PC-B." },
              { id: "opt-b", text: "Mengganti switch lab dengan switch baru yang lebih mahal." },
              {
                id: "opt-c",
                text: "Menancapkan kembali kabel jaringan PC-B ke port LAN hingga terkunci rapat lalu memverifikasi koneksi.",
              },
              { id: "opt-d", text: "Menghubungi penyedia jasa internet (ISP) untuk komplain kecepatan internet." },
            ],
            xpReward: 10,
          },
          {
            id: "block-l4-summary",
            type: "summary",
            title: "Rangkuman Materi",
            keyPoints: [
              "Komunikasi jaringan terstruktur: Request dibuat -> Dikirim -> Diproses -> Response dikirim.",
              "Kerusakan satu cabang kabel tidak melumpuhkan cabang perangkat lain di jaringan star.",
              "Troubleshooting berbasis bukti: perbaiki komponen fisik yang terbukti gagal terlebih dahulu.",
            ],
          },
          {
            id: "block-l4-reward",
            type: "reward",
            xp: 50,
            badgeTitle: "Network Communicator",
            message: "Selamat! Anda menyelesaikan seluruh materi Welcome to Networking.",
          },
        ],
      },
    },
  ],
};
