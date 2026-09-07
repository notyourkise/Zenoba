import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Konsep Routing & Default Gateway (P4-M1)
 *
 * Covers inter-subnet packet forwarding, Default Gateway roles,
 * routing table anatomy, and Longest Prefix Match lookup mechanics.
 */
export const gatewayRouteModuleData: CurriculumModule = {
  id: "module-gateway-dan-route",
  slug: "gateway-dan-route",
  title: "Konsep Routing & Default Gateway",
  description:
    "Pahami bagaimana paket berpindah antar-subnet logis, fungsi krusial Default Gateway, struktur tabel routing, serta mekanisme Longest Prefix Match.",
  orderIndex: 1,
  prerequisites: [],
  outcomes: [
    {
      id: "RTG-M1",
      text: "Siswa dapat menjelaskan fungsi Default Gateway sebagai titik keluar paket menuju jaringan remote dan menganalisis peran ARP dalam menjangkau gateway.",
    },
    {
      id: "RTG-M2",
      text: "Siswa dapat menafsirkan baris tabel routing router dan memprediksi rute keluar menggunakan algoritma Longest Prefix Match.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 1: default-gateway (P4-L01)
    // =========================================================================
    {
      id: "lesson-default-gateway",
      slug: "default-gateway",
      title: "Peran Default Gateway & Komunikasi Antar-Subnet",
      description:
        "Memahami mengapa host membutuhkan Default Gateway saat mengirim paket ke luar subnet lokal, dan proses resolusi MAC gateway menggunakan ARP.",
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: [],
      outcomes: [
        {
          id: "RTG-L1-A",
          text: "Siswa dapat membedakan pengiriman paket ke peer lokal (tanpa gateway) vs pengiriman ke host remote (melalui Default Gateway).",
        },
        {
          id: "RTG-L1-B",
          text: "Siswa dapat menelusuri bagaimana frame Layer 2 menuju MAC Default Gateway sementara alamat IP tujuan Layer 3 tetap mengarah ke host akhir.",
        },
      ],
      evidence: [
        {
          outcomeId: "RTG-L1-A",
          teachingBlockIds: ["gw-l1-h1", "gw-l1-txt1", "gw-l1-callout1"],
          activityIds: ["gw-l1-code1"],
          assessmentItemIds: ["quiz-rtg-l1-q1", "quiz-rtg-l1-q2"],
        },
        {
          outcomeId: "RTG-L1-B",
          teachingBlockIds: ["gw-l1-h2", "gw-l1-txt2", "gw-l1-callout2"],
          activityIds: ["gw-l1-interactive1"],
          assessmentItemIds: ["quiz-rtg-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "gw-l1-h1",
            type: "heading",
            level: 2,
            text: "Kapan Sebuah Komputer Membutuhkan Default Gateway?",
          },
          {
            id: "gw-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika sebuah komputer (misalnya PC-A dengan IP `192.168.1.10/24`) ingin mengirim data ke komputer lain, langkah pertama yang dilakukan sistem operasi adalah membandingkan **IP tujuan** dengan **IP lokal dan Subnet Mask** miliknya sendiri melalui operasi logika AND.\n\n1. **Tujuan Lokal (Satu Subnet):** Jika IP tujuan berada dalam subnet `192.168.1.0/24` (misalnya `192.168.1.20`), PC-A tahu bahwa tujuan berada di satu jaringan LAN yang sama. PC-A mengirimkan ARP Request langsung mencari MAC address `192.168.1.20` dan mengirimkan frame secara direct Layer 2.\n2. **Tujuan Remote (Beda Subnet):** Jika IP tujuan berada di luar subnet (misalnya server web Google `8.8.8.8` atau server sekolah `192.168.2.50`), PC-A menyadari bahwa ia tidak dapat menjangkau komputer tersebut secara langsung. Di sinilah **Default Gateway** (biasanya port router lokal `192.168.1.1`) dibutuhkan!",
          },
          {
            id: "gw-l1-code1",
            type: "code",
            language: "text",
            code: "Logika Keputusan Pengiriman Paket pada Host:\n\n1. Hitung NetID Lokal:\n   Host IP: 192.168.1.10  AND  255.255.255.0  =  192.168.1.0\n\n2. Hitung NetID Tujuan:\n   Target:  192.168.2.50  AND  255.255.255.0  =  192.168.2.0\n\n3. Bandingkan NetID:\n   192.168.1.0 != 192.168.2.0  --> Subnet Berbeda (Remote Destination!)\n\n4. Tindakan Host:\n   - Bungkus Paket IP dengan IP Tujuan = 192.168.2.50\n   - Bungkus Frame Layer 2 dengan MAC Tujuan = MAC Address Default Gateway!",
          },
          {
            id: "gw-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Utama: Gateway Adalah Pintu Keluar LAN",
            content:
              "Tanpa Default Gateway, sebuah komputer hanya bisa berkomunikasi dengan teman se-LAN-nya. Jika kolom Default Gateway pada adapter PC kosong atau salah ketik, komputer tidak akan pernah bisa mengakses Internet meskipun kabel tercolok dan lampu indikator hijau.",
          },
          {
            id: "gw-l1-h2",
            type: "heading",
            level: 2,
            text: "Perubahan Alamat Layer 2 vs Ketetapan Alamat Layer 3",
          },
          {
            id: "gw-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Salah satu konsep paling krusial dalam dunia jaringan yang sering membingungkan teknisi pemula adalah bagaimana alamat MAC dan IP bekerja saat melintasi router:\n\n- **IP Header (Layer 3) Tetap End-to-End:** Alamat IP Sumber (`192.168.1.10`) dan IP Tujuan (`8.8.8.8`) **TIDAK PERNAH BERUBAH** dari komputer pengirim sampai ke server tujuan (kecuali jika melewati NAT).\n- **Ethernet Header (Layer 2) Berubah Setiap Hop:** Alamat MAC Sumber dan MAC Tujuan **SELALU BERUBAH** di setiap link fisik. Di link LAN pertama, MAC tujuan adalah MAC port router gateway. Begitu router menerima frame, router membuang frame lama, membuat frame baru dengan MAC sumber router dan MAC tujuan hop berikutnya!",
          },
          {
            id: "gw-l1-interactive1",
            type: "interactive",
            interactiveType: "routing_table",
            config: {},
          },
          {
            id: "gw-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "Miskonsepsi Umum SMK TKJ",
            content:
              "Jangan pernah mengira PC-A mengirimkan ARP request broadcast mencari MAC address milik `8.8.8.8`! ARP broadcast terhalang oleh router. Yang dicari oleh PC-A lewat ARP hanyalah MAC address dari Default Gateway-nya sendiri (`192.168.1.1`).",
          },
          {
            id: "gw-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l1-q1",
            question: "Sebuah PC memiliki IP 10.0.1.15/24. Kapan PC tersebut akan mengirimkan paket ke Default Gateway?",
            options: [
              { id: "opt-a", text: "Saat mengirim data ke host 10.0.1.20" },
              { id: "opt-b", text: "Saat mengirim data ke host 10.0.2.15" },
              { id: "opt-c", text: "Saat melakukan ping ke IP loopback 127.0.0.1" },
              { id: "opt-d", text: "Setiap kali komputer mengirim data apa pun" },
            ],
            explanation:
              "IP 10.0.2.15 berada di subnet 10.0.2.0/24 yang berbeda dengan subnet lokal PC (10.0.1.0/24). Oleh karena itu, paket wajib diteruskan ke Default Gateway.",
            xpReward: 10,
          },
          {
            id: "gw-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l1-q2",
            question: "Saat PC mengirimkan paket ke server web di Internet melalui router gateway, informasi apakah yang tercantum pada Destination MAC address frame Ethernet pertama?",
            options: [
              { id: "opt-a", text: "MAC address dari server web tujuan" },
              { id: "opt-b", text: "MAC address dari antarmuka router Default Gateway" },
              { id: "opt-c", text: "Broadcast MAC address (FF:FF:FF:FF:FF:FF)" },
              { id: "opt-d", text: "MAC address dari switch access LAN" },
            ],
            explanation:
              "Di link LAN lokal pengirim, Destination MAC diisi dengan MAC address milik interface router Default Gateway, sedangkan Destination IP tetap berisi IP server web tujuan.",
            xpReward: 10,
          },
          {
            id: "gw-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l1-q3",
            question: "Apa akibatnya jika adapter jaringan PC salah dikonfigurasi dengan IP Default Gateway yang tidak ada / mati?",
            options: [
              { id: "opt-a", text: "PC tidak dapat berkomunikasi dengan PC lain di subnet lokal yang sama" },
              { id: "opt-b", text: "PC tetap bisa berkomunikasi lokal, namun gagal terhubung ke subnet lain atau Internet" },
              { id: "opt-c", text: "Kartu jaringan PC otomatis dinonaktifkan oleh Windows/Linux" },
              { id: "opt-d", text: "PC otomatis berganti ke alamat IP 127.0.0.1" },
            ],
            explanation:
              "Komunikasi dalam subnet lokal (LAN yang sama) hanya membutuhkan Layer 2 switch dan ARP langsung antar-host. Namun kegagalan gateway membuat seluruh paket tujuan luar subnet terhenti.",
            xpReward: 10,
          },
          {
            id: "gw-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 1",
            keyPoints: [
              "Default Gateway adalah antarmuka Layer 3 (router) yang menjadi pintu gerbang bagi host lokal untuk keluar dari subnetnya.",
              "Host menentukan apakah tujuan bersifat lokal atau remote dengan meng-AND-kan IP tujuan terhadap subnet mask lokal.",
              "Untuk tujuan remote, IP Destination tetap mengarah ke server akhir, sedangkan MAC Destination diarahkan ke router Default Gateway.",
              "Jika gateway salah atau tidak aktif, komunikasi satu LAN tetap berjalan namun koneksi ke Internet atau subnet lain putus total.",
            ],
          },
          {
            id: "gw-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai peran krusial Default Gateway dalam pengiriman paket antar-subnet.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 2: routing-table-lookup (P4-L02)
    // =========================================================================
    {
      id: "lesson-routing-table-lookup",
      slug: "routing-table-lookup",
      title: "Struktur Tabel Routing & Longest Prefix Match",
      description:
        "Menganalisis komponen tabel routing (Network Destination, Netmask, Next Hop, Interface, Metric) dan aturan pencocokan prefix terpanjang (Longest Prefix Match).",
      orderIndex: 1,
      estimatedMinutes: 14,
      xpReward: 70,
      prerequisites: ["default-gateway"],
      outcomes: [
        {
          id: "RTG-L2-A",
          text: "Siswa dapat membaca dan menafsirkan kolom-kolom utama tabel routing (Destination Network, Subnet Mask, Next-hop Gateway, dan Exit Interface).",
        },
        {
          id: "RTG-L2-B",
          text: "Siswa dapat menerapkan algoritma Longest Prefix Match untuk menentukan baris rute yang dipilih saat terdapat beberapa rute yang cocok.",
        },
      ],
      evidence: [
        {
          outcomeId: "RTG-L2-A",
          teachingBlockIds: ["gw-l2-h1", "gw-l2-txt1", "gw-l2-callout1"],
          activityIds: ["gw-l2-code1"],
          assessmentItemIds: ["quiz-rtg-l2-q1"],
        },
        {
          outcomeId: "RTG-L2-B",
          teachingBlockIds: ["gw-l2-h2", "gw-l2-txt2", "gw-l2-callout2"],
          activityIds: ["gw-l2-interactive1"],
          assessmentItemIds: ["quiz-rtg-l2-q2", "quiz-rtg-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "gw-l2-h1",
            type: "heading",
            level: 2,
            text: "Anatomi Baris Tabel Routing (Routing Table)",
          },
          {
            id: "gw-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Jika switch bekerja mengandalkan MAC Address Table untuk meneruskan frame Layer 2, maka router bekerja mengandalkan **Routing Table** untuk meneruskan paket Layer 3.\n\nSetiap baris rute dalam tabel routing memuat informasi esensial:\n1. **Network Destination:** Jaringan tujuan yang dituju oleh paket.\n2. **Netmask / Prefix Length:** Panjang bit penentu ukuran blok subnet tujuan.\n3. **Gateway / Next Hop:** Alamat IP router tetangga berikutnya yang bertugas menerima paket.\n4. **Interface:** Port fisik atau logis milik router lokal tempat paket harus dikirimkan keluar.\n5. **Metric / Cost:** Nilai bobot rute (jarak hop atau bandwidth) untuk memilih rute terbaik jika terdapat rute ganda.",
          },
          {
            id: "gw-l2-code1",
            type: "code",
            language: "text",
            code: "Contoh Cuplikan Tabel Routing IPv4 Router Cisco / Linux:\n\nDestination        Netmask          Next-Hop         Interface      Metric\n=========================================================================\n192.168.1.0        255.255.255.0    Direct Connected GigabitEthernet0/0  0\n10.0.0.0           255.0.0.0        192.168.1.254    GigabitEthernet0/0  1\n10.20.0.0          255.255.0.0      172.16.1.1       GigabitEthernet0/1  1\n10.20.30.0         255.255.255.0    172.16.2.1       GigabitEthernet0/2  1\n0.0.0.0            0.0.0.0          203.0.113.1      Serial0/0/0         1",
          },
          {
            id: "gw-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Directly Connected Routes",
            content:
              "Rute dengan tanda *Directly Connected* (metric 0) adalah subnet yang kabelnya terhubung langsung ke port router itu sendiri. Router tidak membutuhkan Next-Hop IP untuk rute ini karena router dapat mengirimkan ARP langsung ke host.",
          },
          {
            id: "gw-l2-h2",
            type: "heading",
            level: 2,
            text: "Algoritma Longest Prefix Match (LPM)",
          },
          {
            id: "gw-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Ketika paket dengan IP tujuan tertentu tiba (misalnya `10.20.30.55`), router mencocokkan IP tujuan tersebut dengan seluruh baris rute yang ada di tabel routing.\n\nPerhatikan bahwa IP `10.20.30.55` cocok dengan TIGA rute sekaligus:\n- Rute 1: `10.0.0.0/8` (prefix 8 bit)\n- Rute 2: `10.20.0.0/16` (prefix 16 bit)\n- Rute 3: `10.20.30.0/24` (prefix 24 bit)\n\nRute manakah yang dipilih oleh router? Jawabannya adalah **Longest Prefix Match (LPM)**: Router **SELALU MEMILIH RUTE DENGAN PREFIX MASK TERPANJANG** (paling spesifik), yaitu `/24`! Karena subnet `/24` memberikan informasi lokasi yang jauh lebih akurat dibandingkan `/8` atau `/16`.",
          },
          {
            id: "gw-l2-interactive1",
            type: "interactive",
            interactiveType: "routing_table",
            config: {},
          },
          {
            id: "gw-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "Peran Rute Default 0.0.0.0/0",
            content:
              "Rute `0.0.0.0/0` memiliki panjang prefix 0 bit (paling pendek). Rute ini hanya akan dipilih jika TIDAK ADA SATU PUN rute lain yang cocok di seluruh tabel routing (sebagai jalan keluar terakhir / *Gateway of Last Resort*).",
          },
          {
            id: "gw-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l2-q1",
            question: "Manakah kolom pada tabel routing yang menentukan alamat IP dari perangkat hop berikutnya tempat paket harus diserahkan?",
            options: [
              { id: "opt-a", text: "Destination Network" },
              { id: "opt-b", text: "Netmask" },
              { id: "opt-c", text: "Next-Hop / Gateway" },
              { id: "opt-d", text: "Metric" },
            ],
            explanation:
              "Kolom Next-Hop (Gateway) mencatat alamat IP router tetangga terdekat yang bertugas menerima dan melanjutkan paket tersebut.",
            xpReward: 10,
          },
          {
            id: "gw-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l2-q2",
            question: "Jika sebuah router menerima paket menuju 172.16.5.10 dan memiliki rute 172.16.0.0/16 (via R-A) serta 172.16.5.0/24 (via R-B), rute manakah yang akan dipilih router?",
            options: [
              { id: "opt-a", text: "172.16.0.0/16 via R-A karena cakupan IP-nya lebih luas" },
              { id: "opt-b", text: "172.16.5.0/24 via R-B sesuai prinsip Longest Prefix Match" },
              { id: "opt-c", text: "Router membagi trafik 50:50 secara acak ke kedua router" },
              { id: "opt-d", text: "Paket dibatalkan karena terjadi duplikasi rute" },
            ],
            explanation:
              "Berdasarkan algoritma Longest Prefix Match (LPM), router memilih rute dengan prefix terpanjang (/24 lebih panjang dan lebih spesifik daripada /16).",
            xpReward: 10,
          },
          {
            id: "gw-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l2-q3",
            question: "Apa arti rute tujuan 0.0.0.0 dengan netmask 0.0.0.0 (0.0.0.0/0) pada tabel routing?",
            options: [
              { id: "opt-a", text: "Rute yang memblokir seluruh paket data asing" },
              { id: "opt-b", text: "Rute khusus menuju server lokal router itu sendiri" },
              { id: "opt-c", text: "Default Route (Gateway of Last Resort) untuk paket yang tujuannya tidak terdaftar pada rute spesifik" },
              { id: "opt-d", text: "Rute yang digunakan router untuk mengirim pesan broadcast" },
            ],
            explanation:
              "Rute 0.0.0.0/0 adalah Default Route yang mencocokkan alamat IP mana pun jika tidak ditemukan rute yang lebih spesifik dalam tabel routing.",
            xpReward: 10,
          },
          {
            id: "gw-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 2",
            keyPoints: [
              "Tabel routing berisi peta jalur keluar paket: Destination, Netmask, Next-Hop, Exit Interface, dan Metric.",
              "Rute Directly Connected memiliki prioritas tinggi (metric 0) karena terpasang langsung pada antarmuka fisik/VLAN lokal.",
              "Prinsip Longest Prefix Match (LPM) memastikan router selalu memilih rute dengan netmask terpanjang (paling spesifik).",
              "Default Route (0.0.0.0/0) memiliki prefix terpendek (/0) dan bertindak sebagai jaring pengaman terakhir sebelum paket dibuang.",
            ],
          },
          {
            id: "gw-l2-rew",
            type: "reward",
            xp: 70,
            message: "Luar biasa! Anda telah memahami cara router membaca tabel routing dan menerapkan Longest Prefix Match.",
          },
        ],
      },
    },
  ],
};
