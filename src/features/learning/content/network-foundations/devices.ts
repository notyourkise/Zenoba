import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Network Devices (P1-M5)
 *
 * Covers core devices (NIC, Switch, Router, AP) and perimeter/service devices (Modem/ONT, Firewall, Server).
 */
export const networkDevicesModuleData: CurriculumModule = {
  id: "module-network-devices",
  slug: "network-devices",
  title: "Network Devices",
  description:
    "Mengenal fungsi spesifik perangkat jaringan: NIC, Switch, Router, Access Point, Modem/ONT, Firewall, dan Server.",
  orderIndex: 4,
  prerequisites: ["network-topology"],
  outcomes: [
    {
      id: "DEV-M1",
      text: "Siswa dapat mencocokkan perangkat jaringan utama (NIC, Switch, Router, Access Point) dengan fungsi konektivitasnya.",
    },
    {
      id: "DEV-M2",
      text: "Siswa dapat menjelaskan peran Modem/ONT, Firewall, dan Server dalam jaringan terintegrasi.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 11: nic-switch-router-ap
    // =========================================================================
    {
      id: "lesson-nic-switch-router-ap",
      slug: "nic-switch-router-ap",
      title: "Perangkat Jaringan Utama: NIC, Switch, Router & Access Point",
      description:
        "Memetakan peran empat perangkat fundamental dalam menghubungkan komputer di dalam LAN dan ke luar jaringan.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["topology-fault-impact"],
      outcomes: [
        {
          id: "DEV-L11-A",
          text: "Siswa dapat membedakan fungsi spesifik NIC, Switch, Router, dan Access Point.",
        },
        {
          id: "DEV-L11-B",
          text: "Siswa dapat memilih perangkat yang tepat untuk skenario penambahan koneksi LAN vs koneksi antarjaringan.",
        },
      ],
      evidence: [
        {
          outcomeId: "DEV-L11-A",
          teachingBlockIds: ["dev-l11-h1", "dev-l11-txt1", "dev-l11-callout1"],
          activityIds: ["dev-l11-act1"],
          assessmentItemIds: ["quiz-dev-l11-q1", "quiz-dev-l11-q2"],
        },
        {
          outcomeId: "DEV-L11-B",
          teachingBlockIds: ["dev-l11-txt2"],
          activityIds: ["dev-l11-act1"],
          assessmentItemIds: ["quiz-dev-l11-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "dev-l11-h1",
            type: "heading",
            level: 2,
            text: "Empat Perangkat Inti Penghubung Jaringan",
          },
          {
            id: "dev-l11-txt1",
            type: "text",
            format: "markdown",
            content:
              "Setiap perangkat dalam arsitektur jaringan memiliki spesialisasi tugas yang jelas:\n\n1. **NIC (Network Interface Card):** Kartu antarmuka jaringan yang tertanam di komputer/laptop. Berfungsi mengubah data digital komputer menjadi sinyal fisik (listrik atau gelombang) dan memiliki alamat fisik permanen yang unik di dunia (**MAC Address**).\n2. **Switch (Pengalih Jaringan):** Perangkat konsentrator multi-port yang menghubungkan banyak perangkat di dalam **satu jaringan lokal (LAN) yang sama**. Switch cerdas mempelajari MAC address sehingga meneruskan data tepat ke port tujuan (*unicast*).\n3. **Router (Perute Jaringan):** Perangkat cerdas yang menghubungkan **dua atau lebih jaringan yang berbeda subnet/network ID** (misalnya menghubungkan LAN sekolah ke WAN/Internet). Router bekerja berdasarkan alamat logika (**IP Address**).\n4. **Access Point (AP):** Jembatan nirkabel (*wireless bridge*) yang menghubungkan perangkat berbasis gelombang radio (smartphone, laptop Wi-Fi) ke jaringan kabel switch lokal.",
          },
          {
            id: "dev-l11-callout1",
            type: "callout",
            variant: "info",
            title: "Aturan Emas Teknisi TKJ: Switch vs Router",
            content:
              "- Gunakan **Switch** saat Anda ingin menambah colokan komputer di dalam satu lab/ruangan yang sama.\n- Gunakan **Router** saat Anda ingin menghubungkan lab tersebut ke lab lain dengan segmen IP berbeda, atau saat ingin menghubungkan sekolah ke Internet.",
          },
          {
            id: "dev-l11-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Ringkasan Cepat Fungsi Perangkat\n| Perangkat | Lapangan Kerja | Pengenal Utama | Fungsi Utama |\n| :--- | :--- | :--- | :--- |\n| **NIC** | Endpoint Host | MAC Address | Interface fisik ke media jaringan |\n| **Switch** | LAN Internal | Tabel MAC Address | Forwarding paket data antarkomputer lokal |\n| **Router** | Antarjaringan / WAN | Routing Table & IP | Memilih rute terbaik antarjaringan berbeda |\n| **Access Point** | Nirkabel LAN (WLAN) | SSID & Frekuensi Radio | Memancarkan sinyal Wi-Fi untuk koneksi nirkabel |",
          },
          {
            id: "dev-l11-act1",
            type: "interactive",
            interactiveType: "device_card",
            config: {
              instruction: "Pilih dan amati detail fungsi perangkat: NIC, Switch, Router, dan Wireless Access Point.",
            },
          },
          {
            id: "dev-l11-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Perangkat Jaringan Utama",
          },
          {
            id: "dev-l11-q1-block",
            type: "quiz",
            quizId: "quiz-dev-l11-q1",
            question: "Perangkat manakah yang bertugas menghubungkan jaringan lokal (LAN) sekolah ke jaringan Internet global?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Unmanaged Switch" },
              { id: "opt-b", text: "Router" },
              { id: "opt-c", text: "Kabel Patch Cord UTP" },
              { id: "opt-d", text: "Mouse Wireless" },
            ],
            explanation: "Router adalah perangkat yang dirancang khusus untuk merutekan paket data antarjaringan yang berbeda, seperti menghubungkan LAN ke Internet.",
            xpReward: 10,
          },
          {
            id: "dev-l11-q2-block",
            type: "quiz",
            quizId: "quiz-dev-l11-q2",
            question: "Fungsi utama dari kartu antarmuka jaringan (NIC) pada setiap komputer adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Mendinginkan prosesor saat komputer bekerja berat" },
              { id: "opt-b", text: "Menghubungkan komputer secara fisik ke media jaringan dan menyediakan alamat MAC unik" },
              { id: "opt-c", text: "Menyimpan file sistem operasi Windows atau Linux" },
              { id: "opt-d", text: "Mencetak dokumen langsung tanpa kabel" },
            ],
            explanation: "NIC adalah gerbang fisik host ke media transmisi data yang memiliki identitas perangkat keras unik (MAC Address).",
            xpReward: 10,
          },
          {
            id: "dev-l11-q3-block",
            type: "quiz",
            quizId: "quiz-dev-l11-q3",
            question: "Sekolah ingin menambah 20 komputer baru di ruang multimedia yang sudah memiliki switch penuh. Perangkat apa yang harus dibeli untuk menambah port LAN lokal tersebut?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Switch tambahan (misalnya switch 24-port)" },
              { id: "opt-b", text: "Printer laser jaringan" },
              { id: "opt-c", text: "Modem dial-up eksternal" },
              { id: "opt-d", text: "Mikrofon nirkabel" },
            ],
            explanation: "Untuk memperbanyak sambungan port kabel di segmen LAN lokal yang sama, solusi teknis yang benar adalah menambah Switch.",
            xpReward: 10,
          },
          {
            id: "dev-l11-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 11",
            keyPoints: [
              "NIC menyediakan identitas fisik (MAC Address) pada komputer client.",
              "Switch menghubungkan banyak endpoint dalam satu LAN lokal menggunakan tabel MAC.",
              "Router merutekan paket data antarjaringan yang berbeda menggunakan alamat IP.",
              "Access Point bertindak sebagai jembatan nirkabel ke jaringan kabel switch.",
            ],
          },
          {
            id: "dev-l11-reward",
            type: "reward",
            xp: 60,
            message: "Mantap! Anda telah memahami peran NIC, Switch, Router, dan Access Point.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 12: modem-firewall-server
    // =========================================================================
    {
      id: "lesson-modem-firewall-server",
      slug: "modem-firewall-server",
      title: "Perangkat Gerbang dan Layanan: Modem/ONT, Firewall, & Server",
      description:
        "Memahami peran penerjemah sinyal ISP, penyaring lalu lintas keamanan, dan penyedia sumber daya komputasi terpusat.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["nic-switch-router-ap"],
      outcomes: [
        {
          id: "DEV-L12-A",
          text: "Siswa dapat menjelaskan fungsi Modem/ONT dalam konversi media transmisi ISP ke jaringan lokal.",
        },
        {
          id: "DEV-L12-B",
          text: "Siswa dapat mengidentifikasi fungsi proteksi Firewall dan peran Server dalam infrastruktur jaringan.",
        },
      ],
      evidence: [
        {
          outcomeId: "DEV-L12-A",
          teachingBlockIds: ["dev-l12-h1", "dev-l12-txt1", "dev-l12-callout1"],
          activityIds: ["dev-l12-act1"],
          assessmentItemIds: ["quiz-dev-l12-q1", "quiz-dev-l12-q2"],
        },
        {
          outcomeId: "DEV-L12-B",
          teachingBlockIds: ["dev-l12-txt2"],
          activityIds: ["dev-l12-act1"],
          assessmentItemIds: ["quiz-dev-l12-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "dev-l12-h1",
            type: "heading",
            level: 2,
            text: "Perangkat Gerbang Perimeter dan Layanan Pusat",
          },
          {
            id: "dev-l12-txt1",
            type: "text",
            format: "markdown",
            content:
              "Selain perangkat penghubung internal, jaringan modern memerlukan perangkat gerbang perbatasan (*edge*) dan penyedia layanan:\n\n1. **Modem / ONT (Optical Network Terminal):**\n   - Modem (*Modulator Demodulator*) menerjemahkan sinyal analog/gelombang ke data digital.\n   - Pada jaringan internet serat optik saat ini, perangkat di rumah/sekolah disebut **ONT**, yang mengubah sinyal pulsa cahaya dari kabel fiber optic ISP menjadi sinyal listrik kabel Ethernet UTP (RJ-45).\n2. **Firewall (Dinding Pengaman Jaringan):**\n   - Bertindak sebagai satpam gerbang perbatasan jaringan. Firewall memeriksa setiap paket data yang keluar-masuk berdasarkan kumpulan aturan (*security rules*).\n   - Memblokir akses ilegal dari peretas luar, menyaring virus, dan mencegah akses situs berbahaya dari dalam.\n3. **Server (Peladen Layanan):**\n   - Komputer berperforma tinggi dengan sistem operasi khusus (seperti Ubuntu Server atau Windows Server) yang bertugas melayani ratusan client secara simultan (misalnya Web Server, DNS Server, Database Server).",
          },
          {
            id: "dev-l12-callout1",
            type: "callout",
            variant: "tip",
            title: "Topologi Jalur Masuk Internet",
            content:
              "Urutan koneksi fisik yang benar saat Internet masuk ke kantor/sekolah:\n`Kabel Fiber ISP` -> **ONT/Modem** -> **Router/Firewall** -> **Switch Distribusi** -> **Komputer Client / Server**.",
          },
          {
            id: "dev-l12-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Mengapa Firewall Sangat Kritis?\nTanpa Firewall, komputer di dalam jaringan sekolah dapat langsung diserang oleh botnet atau scanner otomatis dari Internet publik. Firewall menolak semua koneksi luar yang tidak diminta (*drop unsolicited incoming traffic*) secara default.",
          },
          {
            id: "dev-l12-act1",
            type: "interactive",
            interactiveType: "device_card",
            config: {
              instruction: "Pelajari fungsi spesifik Modem/ONT, Firewall, dan Server dalam diagram arsitektur jaringan.",
            },
          },
          {
            id: "dev-l12-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Modem, Firewall, & Server",
          },
          {
            id: "dev-l12-q1-block",
            type: "quiz",
            quizId: "quiz-dev-l12-q1",
            question: "Perangkat apa yang dipasang di sekolah untuk mengubah sinyal pulsa cahaya dari kabel fiber optic ISP Indihome/Biznet menjadi kabel tembaga LAN?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "ONT (Optical Network Terminal)" },
              { id: "opt-b", text: "Unmanaged Hub 10 Mbps" },
              { id: "opt-c", text: "Kabel VGA Komputer" },
              { id: "opt-d", text: "Stabilizer Listrik" },
            ],
            explanation: "ONT adalah perangkat terminal optik yang mengubah sinyal cahaya serat optik ISP menjadi sinyal listrik Ethernet UTP.",
            xpReward: 10,
          },
          {
            id: "dev-l12-q2-block",
            type: "quiz",
            quizId: "quiz-dev-l12-q2",
            question: "Fungsi utama Firewall dalam topologi perbatasan jaringan sekolah adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Meningkatkan resolusi monitor komputer pengguna" },
              { id: "opt-b", text: "Menyaring dan mengontrol paket data yang keluar-masuk berdasarkan aturan keamanan" },
              { id: "opt-c", text: "Menggandakan kapasitas memori RAM komputer" },
              { id: "opt-d", text: "Mematikan listrik seluruh gedung saat malam hari" },
            ],
            explanation: "Firewall bertugas memeriksa lalu lintas data dan memblokir paket berbahaya sesuai aturan kebijakan keamanan jaringan.",
            xpReward: 10,
          },
          {
            id: "dev-l12-q3-block",
            type: "quiz",
            quizId: "quiz-dev-l12-q3",
            question: "Manakah urutan alur fisik kabel koneksi Internet dari ISP yang masuk ke jaringan lokal sekolah?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "PC Siswa -> Fiber ISP -> ONT -> Switch" },
              { id: "opt-b", text: "Fiber ISP -> ONT -> Router/Firewall -> Switch -> PC Siswa" },
              { id: "opt-c", text: "Switch -> ONT -> PC Siswa -> Fiber ISP" },
              { id: "opt-d", text: "Router -> Fiber ISP -> Switch -> ONT" },
            ],
            explanation: "Urutan yang benar: Fiber optik dari ISP masuk ke ONT, lalu ke Router/Firewall, didistribusikan lewat Switch, dan sampai ke PC Siswa.",
            xpReward: 10,
          },
          {
            id: "dev-l12-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 12",
            keyPoints: [
              "Modem/ONT menerjemahkan sinyal media penyedia layanan ke protokol digital lokal.",
              "Firewall bertindak sebagai pelindung gerbang jaringan dari ancaman luar.",
              "Server menyediakan layanan aplikasi terpusat dengan performa dan stabilitas tinggi.",
            ],
          },
          {
            id: "dev-l12-reward",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai seluruh perangkat perimeter dan layanan jaringan.",
          },
        ],
      },
    },
  ],
};
