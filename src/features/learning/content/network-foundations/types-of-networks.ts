import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Types of Networks (P1-M2)
 *
 * Covers LAN, MAN, WAN classification and practical deployment contexts (SOHO, School, Enterprise).
 */
export const typesOfNetworksModuleData: CurriculumModule = {
  id: "module-types-of-networks",
  slug: "types-of-networks",
  title: "Types of Networks",
  description:
    "Klasifikasi jaringan berdasarkan cakupan geografis (LAN, MAN, WAN) dan konteks implementasi nyata di rumah, sekolah, dan perusahaan.",
  orderIndex: 1,
  prerequisites: ["welcome-to-networking"],
  outcomes: [
    {
      id: "TON-M1",
      text: "Siswa dapat mengklasifikasikan jaringan berdasarkan cakupan geografis dan kebutuhan konektivitas.",
    },
    {
      id: "TON-M2",
      text: "Siswa dapat membedakan konfigurasi dan skala jaringan pada lingkungan rumah, sekolah, dan perusahaan.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 5: lan-man-wan
    // =========================================================================
    {
      id: "lesson-lan-man-wan",
      slug: "lan-man-wan",
      title: "Klasifikasi Skala: LAN, MAN, dan WAN",
      description:
        "Memahami perbedaan Local Area Network, Metropolitan Area Network, dan Wide Area Network berdasarkan batas wilayah.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["simple-network-communication"],
      outcomes: [
        {
          id: "TON-L5-A",
          text: "Siswa dapat membedakan batas geografis dan karakteristik teknis antara LAN, MAN, dan WAN.",
        },
        {
          id: "TON-L5-B",
          text: "Siswa dapat mengelompokkan skenario jaringan nyata ke dalam kategori skala yang tepat.",
        },
      ],
      evidence: [
        {
          outcomeId: "TON-L5-A",
          teachingBlockIds: ["ton-l5-h1", "ton-l5-txt1", "ton-l5-callout1"],
          activityIds: ["ton-l5-act1"],
          assessmentItemIds: ["quiz-ton-l5-q1", "quiz-ton-l5-q2"],
        },
        {
          outcomeId: "TON-L5-B",
          teachingBlockIds: ["ton-l5-txt2"],
          activityIds: ["ton-l5-act1"],
          assessmentItemIds: ["quiz-ton-l5-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "ton-l5-h1",
            type: "heading",
            level: 2,
            text: "Skala Geografis Jaringan Komputer",
          },
          {
            id: "ton-l5-txt1",
            type: "text",
            format: "markdown",
            content:
              "Jaringan komputer dibangun untuk menjembatani jarak. Berdasarkan luas jangkauan geografis dan kepemilikan infrastrukturnya, jaringan secara umum dikelompokkan menjadi tiga skala utama:\n\n1. **LAN (Local Area Network):** Jaringan area lokal terbatas dalam satu ruangan, gedung, atau rumah. Dikelola oleh satu pemilik/organisasi secara mandiri dengan kecepatan transfer tinggi (100 Mbps – 10 Gbps) dan latensi sangat rendah.\n2. **MAN (Metropolitan Area Network):** Jaringan yang menghubungkan beberapa lokasi dalam satu kota atau kawasan terpadu (misalnya jaringan antarkampus universitas, bank antarcabang sekota, atau jaringan Pemkot).\n3. **WAN (Wide Area Network):** Jaringan skala luas yang melintasi kota, pulau, negara, bahkan benua. Internet adalah contoh WAN terbesar di dunia.",
          },
          {
            id: "ton-l5-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Utama Teknisi TKJ",
            content:
              "Perbedaan utama LAN dan WAN bukan hanya soal jarak fisik, melainkan **siapa pemilik infrastruktur transmisi kabel/jalur data**. Di LAN, sekolah atau kantor Anda memiliki kabelnya sendiri. Di WAN, data harus melintasi jaringan penyedia telekomunikasi publik (ISP / telco).",
          },
          {
            id: "ton-l5-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Contoh Kasus Nyata di Lapangan\n- **Lab Komputer TKJ:** 36 PC siswa terhubung ke switch lab = **LAN**.\n- **Koneksi Antar-Gedung Kampus:** Gedung Rektorat terhubung serat optik ke Gedung Lab Fasilkom sejauh 3 km = **MAN**.\n- **Sistem ATM Bank Nasional:** Mesin ATM di Makassar menghubungi Data Center pusat di Jakarta = **WAN**.",
          },
          {
            id: "ton-l5-act1",
            type: "interactive",
            interactiveType: "classification",
            config: {
              instruction: "Analisis studi kasus: tentukan skala jaringan yang paling sesuai untuk kebutuhan organisasi.",
            },
          },
          {
            id: "ton-l5-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Klasifikasi Skala Jaringan",
          },
          {
            id: "ton-l5-q1-block",
            type: "quiz",
            quizId: "quiz-ton-l5-q1",
            question: "Manakah karakteristik utama yang membedakan LAN dari WAN?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "LAN menggunakan kabel sedangkan WAN selalu nirkabel satelit" },
              { id: "opt-b", text: "LAN terbatas pada area lokal privat, sedangkan WAN melintasi area geografis luas melalui penyedia publik" },
              { id: "opt-c", text: "LAN hanya dapat menghubungkan maksimal 10 komputer saja" },
              { id: "opt-d", text: "LAN tidak memerlukan alamat IP untuk berkomunikasi" },
            ],
            explanation: "LAN mencakup area terbatas milik organisasi privat, sedangkan WAN melintasi wilayah luas via provider telekomunikasi.",
            xpReward: 10,
          },
          {
            id: "ton-l5-q2-block",
            type: "quiz",
            quizId: "quiz-ton-l5-q2",
            question: "Jaringan yang menghubungkan kantor dinas pendidikan kabupaten dengan seluruh SMP dan SMA di wilayah kota tersebut paling tepat diklasifikasikan sebagai:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "PAN (Personal Area Network)" },
              { id: "opt-b", text: "MAN (Metropolitan Area Network)" },
              { id: "opt-c", text: "LAN (Local Area Network)" },
              { id: "opt-d", text: "SAN (Storage Area Network)" },
            ],
            explanation: "Jaringan skala satu kota metropolitan yang menghubungkan instansi antarlokasi disebut MAN.",
            xpReward: 10,
          },
          {
            id: "ton-l5-q3-block",
            type: "quiz",
            quizId: "quiz-ton-l5-q3",
            question: "Sebuah SMK membuka lab ujian berbasis komputer dengan 40 PC terhubung ke switch gigabit tanpa koneksi luar. Ini adalah contoh murni dari:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "WAN privat" },
              { id: "opt-b", text: "LAN lokal mandiri (Isolated LAN)" },
              { id: "opt-c", text: "Internet publik" },
              { id: "opt-d", text: "MAN antarsekolah" },
            ],
            explanation: "Koneksi 40 PC di dalam ruangan yang terhubung ke switch lokal adalah Local Area Network (LAN).",
            xpReward: 10,
          },
          {
            id: "ton-l5-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 5",
            keyPoints: [
              "LAN mencakup area geografis terbatas dengan kendali penuh atas kabel dan perangkat.",
              "MAN menghubungkan beberapa lokasi atau cabang dalam lingkup satu kota.",
              "WAN menghubungkan jaringan melintasi negara dan benua via infrastruktur penyedia layanan.",
            ],
          },
          {
            id: "ton-l5-reward",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah memahami klasifikasi skala jaringan LAN, MAN, dan WAN.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 6: network-contexts-home-school-enterprise
    // =========================================================================
    {
      id: "lesson-network-contexts",
      slug: "network-contexts-home-school-enterprise",
      title: "Jaringan di Rumah, Sekolah, dan Perusahaan",
      description:
        "Menganalisis perbedaan skala, perangkat pendukung, dan kebutuhan bandwidth pada jaringan SOHO, lab TKJ, dan kantor korporat.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["lan-man-wan"],
      outcomes: [
        {
          id: "TON-L6-A",
          text: "Siswa dapat membandingkan kebutuhan perangkat dan arsitektur antara jaringan rumah (SOHO), lab sekolah, dan kantor perusahaan.",
        },
        {
          id: "TON-L6-B",
          text: "Siswa dapat mengidentifikasi kendala umum dan prioritas layanan pada masing-masing lingkungan operasional.",
        },
      ],
      evidence: [
        {
          outcomeId: "TON-L6-A",
          teachingBlockIds: ["ton-l6-h1", "ton-l6-txt1", "ton-l6-callout1"],
          activityIds: ["ton-l6-act1"],
          assessmentItemIds: ["quiz-ton-l6-q1", "quiz-ton-l6-q2"],
        },
        {
          outcomeId: "TON-L6-B",
          teachingBlockIds: ["ton-l6-txt2"],
          activityIds: ["ton-l6-act1"],
          assessmentItemIds: ["quiz-ton-l6-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "ton-l6-h1",
            type: "heading",
            level: 2,
            text: "Konteks Penerapan Jaringan di Dunia Nyata",
          },
          {
            id: "ton-l6-txt1",
            type: "text",
            format: "markdown",
            content:
              "Tidak semua jaringan komputer dirancang dengan cara yang sama. Desain jaringan disesuaikan dengan anggaran, jumlah pengguna, dan jenis aktivitas yang dilayani:\n\n1. **Jaringan Rumah (SOHO / Small Office Home Office):**\n   - Pengguna: 5–20 perangkat.\n   - Ciri khas: Menggunakan satu perangkat all-in-one (Modem + Router + Switch + Wi-Fi Access Point) dari ISP.\n   - Fokus: Kemudahan penggunaan dan hiburan (streaming, gaming, browsing).\n2. **Jaringan Sekolah / Kampus (Education Network):**\n   - Pengguna: Ratusan hingga ribuan siswa dan guru.\n   - Ciri khas: Pemisahan fungsi perangkat (Router MikroTik/Cisco terpisah, Managed Switch, Multiple Access Point).\n   - Fokus: Pembagian bandwidth merata, filter konten edukasi, dan kestabilan saat ujian daring.\n3. **Jaringan Korporat / Enterprise:**\n   - Pengguna: Ratusan karyawan dengan data bisnis sensitif.\n   - Ciri khas: Redundansi jalur (dua ISP), firewall khusus, segmentasi departemen, dan server data center lokal.\n   - Fokus: Keamanan tinggi, ketersediaan layanan 24/7 (high availability), dan kepatuhan audit.",
          },
          {
            id: "ton-l6-callout1",
            type: "callout",
            variant: "tip",
            title: "Catatan Arsitektur",
            content:
              "Di rumah, jika router ISP mati, aktivitas hiburan terganggu sesaat. Namun di perusahaan finansial atau rumah sakit, matinya jaringan selama 1 menit dapat menyebabkan kerugian jutaan rupiah atau membahayakan operasional. Karena itu jaringan Enterprise selalu memiliki perangkat cadangan (*redundancy*).",
          },
          {
            id: "ton-l6-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Perbandingan Kebutuhan Spesifikasi\n| Aspek | Rumah (SOHO) | Lab Sekolah TKJ | Enterprise Perusahaan |\n| :--- | :--- | :--- | :--- |\n| **Perangkat Utama** | 1 Wireless Router ISP | Routerboard + Managed Switch | Core Switch + Firewall + Controller |\n| **Manajemen Trafik** | Otomatis bawaan pabrik | Manajemen Bandwidth & Hotspot | VLAN, QoS, Failover Jalur Ganda |\n| **Keamanan** | Password Wi-Fi WPA2/WPA3 | Otentikasi RADIUS/Login Siswa | Zero Trust, VPN IPsec, IDS/IPS |",
          },
          {
            id: "ton-l6-act1",
            type: "interactive",
            interactiveType: "classification",
            config: {
              instruction: "Pilah fitur dan karakteristik jaringan ke dalam skenario Rumah, Sekolah, atau Enterprise.",
            },
          },
          {
            id: "ton-l6-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Konteks SOHO, Sekolah & Enterprise",
          },
          {
            id: "ton-l6-q1-block",
            type: "quiz",
            quizId: "quiz-ton-l6-q1",
            question: "Mengapa jaringan Enterprise umumnya memisahkan Router, Switch, dan Firewall ke perangkat terpisah dibanding perangkat all-in-one seperti di rumah?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Agar teknisi terlihat memiliki lebih banyak pekerjaan kabel" },
              { id: "opt-b", text: "Untuk menangani beban trafik tinggi, memudahkan skalabilitas, dan memberikan keandalan performa khusus" },
              { id: "opt-c", text: "Karena perangkat all-in-one dilarang oleh aturan pemerintah" },
              { id: "opt-d", text: "Agar komputer pengguna tidak memerlukan kartu jaringan" },
            ],
            explanation: "Perangkat khusus (dedicated) mampu memproses jutaan paket per detik dengan fitur keamanan canggih dan stabilitas tinggi.",
            xpReward: 10,
          },
          {
            id: "ton-l6-q2-block",
            type: "quiz",
            quizId: "quiz-ton-l6-q2",
            question: "Prioritas utama teknisi TKJ saat mengonfigurasi jaringan lab komputer sekolah untuk pelaksanaan Asesmen/Ujian Berbasis Komputer adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Mengaktifkan kecepatan unduh maksimal untuk streaming video 4K" },
              { id: "opt-b", text: "Memastikan stabilitas koneksi lokal ke server ujian dan membatasi akses keluar yang tidak diperlukan" },
              { id: "opt-c", text: "Membuka seluruh port firewall agar koneksi bebas tanpa hambatan" },
              { id: "opt-d", text: "Mengganti semua kabel LAN menjadi koneksi Bluetooth" },
            ],
            explanation: "Kestabilan koneksi lokal dan pembatasan trafik liar adalah kunci kelancaran ujian berbasis komputer di sekolah.",
            xpReward: 10,
          },
          {
            id: "ton-l6-q3-block",
            type: "quiz",
            quizId: "quiz-ton-l6-q3",
            question: "Sebuah kantor konsultan hukum dengan 15 karyawan membutuhkan jaringan untuk berbagi file kerja dan printer. Skenario ini paling tepat dikategorikan sebagai:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Jaringan SOHO (Small Office Home Office)" },
              { id: "opt-b", text: "Jaringan Backbone Antarbenua (WAN)" },
              { id: "opt-c", text: "Jaringan Satelit Maritim" },
              { id: "opt-d", text: "Jaringan Data Center Tier-4" },
            ],
            explanation: "Kantor kecil dengan 10–20 karyawan termasuk ke dalam kategori SOHO (Small Office / Home Office).",
            xpReward: 10,
          },
          {
            id: "ton-l6-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 6",
            keyPoints: [
              "Jaringan SOHO mengutamakan kemudahan dan efisiensi biaya menggunakan perangkat multifungsi.",
              "Jaringan sekolah membutuhkan pengelolaan kuota bandwidth dan isolasi trafik untuk pembelajaran.",
              "Jaringan enterprise memprioritaskan ketersediaan tinggi, keamanan berlapis, dan jalur cadangan.",
            ],
          },
          {
            id: "ton-l6-reward",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda memahami perbedaan nyata arsitektur jaringan dari rumah hingga korporat.",
          },
        ],
      },
    },
  ],
};
