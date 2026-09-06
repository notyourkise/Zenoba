import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Protokol ARP & Resolusi Alamat (P3-M2)
 *
 * Covers ARP operation, Request/Reply lifecycle, ARP cache,
 * and destination decision logic (local peer vs Default Gateway).
 */
export const arpBroadcastModuleData: CurriculumModule = {
  id: "module-arp-dan-broadcast",
  slug: "arp-dan-broadcast",
  title: "Protokol ARP & Resolusi Alamat",
  description:
    "Pelajari jembatan antara Layer 3 (IP) dan Layer 2 (MAC), siklus ARP Request & Reply, tabel ARP cache, serta keputusan resolusi lokal vs gateway.",
  orderIndex: 2,
  prerequisites: ["module-ethernet-dan-mac"],
  outcomes: [
    {
      id: "ARP-M1",
      text: "Siswa dapat menelusuri siklus request broadcast dan reply unicast protokol ARP dalam memetakan IP ke MAC address.",
    },
    {
      id: "ARP-M2",
      text: "Siswa dapat menentukan kapan host melakukan ARP resolusi langsung ke peer lokal vs kapan harus menargetkan MAC default gateway saat berkomunikasi lintas subnet.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 3: arp-request-reply (P3-L03)
    // =========================================================================
    {
      id: "lesson-arp-request-reply",
      slug: "arp-request-reply",
      title: "Siklus ARP: Request Broadcast & Reply Unicast",
      description:
        "Memahami fungsi protokol ARP, format pesan request broadcast FF:FF:FF:FF:FF:FF, dan respons unicast dari pemilik IP tujuan.",
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["mac-learning-table"],
      outcomes: [
        {
          id: "ARP-L1-A",
          text: "Siswa dapat menjelaskan tujuan protokol ARP dalam menerjemahkan alamat logika IPv4 ke alamat fisik MAC di jaringan LAN Ethernet.",
        },
        {
          id: "ARP-L1-B",
          text: "Siswa dapat mengidentifikasi karakteristik ARP Request sebagai frame broadcast dan ARP Reply sebagai frame unicast langsung.",
        },
      ],
      evidence: [
        {
          outcomeId: "ARP-L1-A",
          teachingBlockIds: ["arp-l1-h1", "arp-l1-txt1", "arp-l1-callout1"],
          activityIds: ["arp-l1-act1"],
          assessmentItemIds: ["quiz-arp-l1-q1", "quiz-arp-l1-q2"],
        },
        {
          outcomeId: "ARP-L1-B",
          teachingBlockIds: ["arp-l1-h2", "arp-l1-txt2", "arp-l1-callout2"],
          activityIds: ["arp-l1-act1"],
          assessmentItemIds: ["quiz-arp-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "arp-l1-h1",
            type: "heading",
            level: 2,
            text: "Mengapa Kita Membutuhkan ARP?",
          },
          {
            id: "arp-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika Anda membuka browser dan mengakses komputer lain di lab (misal `192.168.1.50`), aplikasi Anda hanya mengetahui **alamat IP**. Namun di lapisan kabel Ethernet, switch dan kartu jaringan **hanya mengerti MAC Address**!\n\nUntuk mengirimkan paket IP, komputer harus membungkusnya ke dalam frame Ethernet dengan field *Destination MAC*. Bagaimana komputer tahu berapa nomor MAC dari IP `192.168.1.50`? Di sinilah peran **ARP** (*Address Resolution Protocol*).",
          },
          {
            id: "arp-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Kerja ARP",
            content:
              "ARP bekerja dengan pertanyaan sederhana:\n> *\"Siapa di antara kalian yang memiliki IP 192.168.1.50? Tolong beri tahu komputer saya (192.168.1.10) berapa MAC address Anda!\"*",
          },
          {
            id: "arp-l1-act1",
            type: "interactive",
            interactiveType: "arp_visualizer",
            config: {
              title: "Simulator Alur Resolusi ARP",
            },
          },
          {
            id: "arp-l1-h2",
            type: "heading",
            level: 2,
            text: "2 Fase Siklus ARP: Broadcast Request & Unicast Reply",
          },
          {
            id: "arp-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Proses resolusi ARP terdiri dari 2 langkah utama:\n\n1. **ARP Request (Broadcast):**\n   Komputer pengirim mengirim pesan dengan Destination MAC berupa **`FF:FF:FF:FF:FF:FF`** (alamat broadcast Layer 2). Switch akan menyebarkan frame ini ke seluruh port aktif dalam VLAN yang sama. Semua komputer menerima frame ini dan memeriksa field *Target IP*.\n\n2. **ARP Reply (Unicast):**\n   Komputer yang IP-nya TIDAK cocok akan membuang frame secara diam-diam. Komputer yang IP-nya COCOK akan membuat pesan balasan dan mengirimkannya secara **Unicast** langsung ke MAC address komputer pengirim.",
          },
          {
            id: "arp-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "ARP Table (ARP Cache)",
            content:
              "Setelah menerima ARP Reply, komputer pengirim menyimpan pasangan IP-ke-MAC di dalam memori sementaranya yang disebut **ARP Table** (bisa dilihat di command prompt dengan perintah `arp -a`). Untuk komunikasi berikutnya, komputer tidak perlu broadcast ARP lagi karena sudah tersimpan di cache!",
          },
          {
            id: "arp-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-arp-l1-q1",
            question: "Apa fungsi mendasar dari protokol ARP (Address Resolution Protocol)?",
            options: [
              { id: "opt-a", text: "Menerjemahkan nama domain (seperti google.com) menjadi alamat IP" },
              { id: "opt-b", text: "Menerjemahkan alamat IP yang diketahui menjadi alamat MAC fisik kartu jaringan" },
              { id: "opt-c", text: "Memberikan alamat IP otomatis kepada komputer yang baru tersambung" },
              { id: "opt-d", text: "Mengamankan password login pengguna menggunakan enkripsi" },
            ],
            explanation:
              "ARP bertugas memetakan alamat logika Layer 3 (IPv4) ke alamat perangkat keras fisik Layer 2 (MAC address) dalam satu jaringan lokal.",
            xpReward: 10,
          },
          {
            id: "arp-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-arp-l1-q2",
            question: "Alamat Destination MAC apa yang digunakan pada header Ethernet saat komputer mengirimkan ARP Request?",
            options: [
              { id: "opt-a", text: "00:00:00:00:00:00" },
              { id: "opt-b", text: "FF:FF:FF:FF:FF:FF" },
              { id: "opt-c", text: "MAC address Default Gateway" },
              { id: "opt-d", text: "127.0.0.1" },
            ],
            explanation:
              "Karena komputer pengirim belum tahu MAC tujuan, ARP Request dikirim ke alamat broadcast Layer 2 yaitu FF:FF:FF:FF:FF:FF agar diterima semua host di LAN.",
            xpReward: 10,
          },
          {
            id: "arp-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-arp-l1-q3",
            question: "Bagaimana sifat transmisi paket pesan saat komputer tujuan membalas pesan ARP (ARP Reply)?",
            options: [
              { id: "opt-a", text: "Unicast langsung ke MAC address komputer pemohon (requester)" },
              { id: "opt-b", text: "Broadcast ke seluruh jaringan LAN" },
              { id: "opt-c", text: "Multicast khusus ke router gateway" },
              { id: "opt-d", text: "Disimpan di switch tanpa dikirim balik ke komputer" },
            ],
            explanation:
              "Komputer penerima sudah mengetahui MAC pengirim dari pesan ARP Request, sehingga ARP Reply dikirim secara Unicast langsung ke pengirim aslinya.",
            xpReward: 10,
          },
          {
            id: "arp-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 3",
            keyPoints: [
              "ARP adalah protokol penghubung antara pengalamatan Layer 3 (IP) dan pengiriman fisik Layer 2 (MAC).",
              "ARP Request dikirimkan secara Broadcast (FF:FF:FF:FF:FF:FF) ke seluruh host dalam LAN.",
              "Komputer pemilik IP tujuan merespons dengan ARP Reply secara Unicast langsung ke pengirim.",
              "Hasil resolusi disimpan di ARP Cache (ARP Table) untuk mempercepat transmisi paket berikutnya.",
            ],
          },
          {
            id: "arp-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah memahami proses resolusi paket ARP di jaringan Ethernet.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 4: local-remote-destination (P3-L04)
    // =========================================================================
    {
      id: "lesson-local-remote-destination",
      slug: "local-remote-destination",
      title: "Resolusi MAC Lokal vs MAC Default Gateway",
      description:
        "Menentukan kapan host melakukan resolusi ARP langsung ke komputer kawan (satu subnet) vs kapan harus mengirim frame ke MAC Default Gateway (beda subnet).",
      orderIndex: 1,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["arp-request-reply"],
      outcomes: [
        {
          id: "ARP-L2-A",
          text: "Siswa dapat menganalisis logika keputusan host menggunakan subnet mask untuk membedakan tujuan lokal (same subnet) vs tujuan remote (different subnet).",
        },
        {
          id: "ARP-L2-B",
          text: "Siswa dapat menjelaskan bahwa untuk tujuan remote/Internet, Destination MAC pada header Ethernet adalah MAC Default Gateway, bukan MAC host remote.",
        },
      ],
      evidence: [
        {
          outcomeId: "ARP-L2-A",
          teachingBlockIds: ["arp-l2-h1", "arp-l2-txt1", "arp-l2-callout1"],
          activityIds: ["arp-l2-code1"],
          assessmentItemIds: ["quiz-arp-l2-q1", "quiz-arp-l2-q2"],
        },
        {
          outcomeId: "ARP-L2-B",
          teachingBlockIds: ["arp-l2-h2", "arp-l2-txt2", "arp-l2-callout2"],
          activityIds: ["arp-l2-code2"],
          assessmentItemIds: ["quiz-arp-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "arp-l2-h1",
            type: "heading",
            level: 2,
            text: "Logika Keputusan Host: Lokal atau Remote?",
          },
          {
            id: "arp-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika komputer Anda ingin mengirim data ke suatu alamat IP tujuan, hal pertama yang dilakukan oleh TCP/IP stack sistem operasi adalah:\n> **Membandingkan Subnet Pengirim dengan Subnet Tujuan menggunakan Subnet Mask lokal.**\n\nHasil perbandingan ini membagi tujuan menjadi dua kemungkinan mutlak:\n1. **Tujuan Lokal (Same Subnet):** IP tujuan berada di subnet yang sama dengan komputer pengirim.\n2. **Tujuan Remote (Different Subnet / Internet):** IP tujuan berada di subnet yang berbeda atau di jaringan luar/internet.",
          },
          {
            id: "arp-l2-code1",
            type: "code",
            language: "text",
            code: "Studi Kasus PC A (IP: 192.168.1.10 /24, Gateway: 192.168.1.1):\n\nKasus 1: Mengirim ke 192.168.1.25 (PC B di ruang yang sama)\n- Network Asal   : 192.168.1.0/24\n- Network Tujuan : 192.168.1.0/24\n- KEPUTUSAN      : TUJUAN LOKAL!\n- Tindakan ARP   : Host mencari MAC 192.168.1.25 secara langsung!\n\nKasus 2: Mengirim ke 8.8.8.8 (Google DNS di Internet)\n- Network Asal   : 192.168.1.0/24\n- Network Tujuan : 8.8.8.0/24\n- KEPUTUSAN      : TUJUAN REMOTE!\n- Tindakan ARP   : Host mencari MAC Default Gateway (192.168.1.1)!",
          },
          {
            id: "arp-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Kenapa Tidak Bisa ARP Langsung ke 8.8.8.8?",
            content:
              "Pesan ARP Request adalah **Broadcast Layer 2** (`FF:FF:FF:FF:FF:FF`). Router secara default memblokir paket broadcast agar tidak bocor ke luar. Oleh karena itu, komputer Anda tidak akan pernah bisa melakukan ARP broadcast ke server di luar jaringan lokal!",
          },
          {
            id: "arp-l2-h2",
            type: "heading",
            level: 2,
            text: "Kombinasi Paket: IP Remote, Namun MAC Gateway",
          },
          {
            id: "arp-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Inilah konsep paling sering disalahpahami oleh teknisi pemula saat menganalisis Wireshark:\n\nSaat PC mengirim frame ke server di internet (`8.8.8.8`):\n- **Header IP (Layer 3):**\n  - Source IP: `192.168.1.10`\n  - Destination IP: **`8.8.8.8`** (IP tujuan akhir TIDAK berubah!)\n- **Header Ethernet (Layer 2):**\n  - Source MAC: MAC PC pengirim\n  - Destination MAC: **MAC ROUTER GATEWAY** (Bukan MAC server Google!)\n\nFrame diserahkan ke router gateway, lalu router yang akan membuka frame tersebut, membaca IP tujuan, dan meneruskannya ke hop berikutnya.",
          },
          {
            id: "arp-l2-code2",
            type: "code",
            language: "text",
            code: "Pemeriksaan Frame Saat Keluar dari Kabel Komputer Menuju Internet:\n+-----------------------------+-----------------------------+\n| LAYER 2 ETHERNET HEADER     | LAYER 3 IP PACKET HEADER    |\n+-----------------------------+-----------------------------+\n| Dest MAC : [ MAC GATEWAY ]  | Dest IP   : [ 8.8.8.8 ]     |\n| Src MAC  : [ MAC PC-A ]     | Src IP    : [ 192.168.1.10 ]|\n+-----------------------------+-----------------------------+\n                           | \n                           v\n                      [ ROUTER ]\n(Router mengganti MAC hop-by-hop, tetapi IP tujuan tetap 8.8.8.8)",
          },
          {
            id: "arp-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "Apa yang Terjadi Jika Gateway Salah Dikonfigurasi?",
            content:
              "Jika alamat IP gateway salah atau mati, komputer tidak bisa melakukan resolusi ARP untuk gateway tersebut. Akibatnya, frame tidak pernah bisa dibuat dan komputer akan melaporkan: *'Destination Host Unreachable'*.",
          },
          {
            id: "arp-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-arp-l2-q1",
            question: "Komputer 192.168.10.5/24 ingin mengirim data ke 192.168.10.88. Apa yang dilakukan komputer tersebut untuk resolusi ARP?",
            options: [
              { id: "opt-a", text: "Mengirim ARP Request untuk mencari MAC address dari 192.168.10.88 secara langsung" },
              { id: "opt-b", text: "Mengirim frame langsung ke MAC address router gateway" },
              { id: "opt-c", text: "Menghubungi server DNS untuk meminta nomor port 192.168.10.88" },
              { id: "opt-d", text: "Membuang paket karena nomor host terlalu besar" },
            ],
            explanation:
              "Karena 192.168.10.88 berada dalam subnet yang sama (/24), komputer menganggapnya sebagai tujuan lokal dan langsung melakukan ARP broadcast untuk IP tersebut.",
            xpReward: 10,
          },
          {
            id: "arp-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-arp-l2-q2",
            question: "Komputer 192.168.1.50/24 ingin membuka situs web dengan alamat IP 203.0.113.10. Alamat MAC manakah yang dicari oleh komputer pengirim melalui protokol ARP?",
            options: [
              { id: "opt-a", text: "MAC address dari server web 203.0.113.10" },
              { id: "opt-b", text: "MAC address dari Default Gateway (Router lokal)" },
              { id: "opt-c", text: "MAC address switch terdekat" },
              { id: "opt-d", text: "MAC address broadcast FF:FF:FF:FF:FF:FF secara permanen" },
            ],
            explanation:
              "Karena 203.0.113.10 berada di subnet berbeda (remote/internet), komputer harus menyerahkan frame ke Default Gateway lokal. Jadi komputer mencari MAC gateway.",
            xpReward: 10,
          },
          {
            id: "arp-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-arp-l2-q3",
            question: "Mengapa komputer tidak bisa mengirimkan ARP Request secara langsung ke server di Internet?",
            options: [
              { id: "opt-a", text: "Karena kabel fiber optik internet tidak mendukung sinyal biner" },
              { id: "opt-b", text: "Karena Router secara default memblokir frame broadcast Layer 2 agar tidak merembes ke jaringan luar" },
              { id: "opt-c", text: "Karena ukuran MAC address di internet berbeda dengan di LAN" },
              { id: "opt-d", text: "Karena server di internet tidak memiliki kartu jaringan (NIC)" },
            ],
            explanation:
              "Router berfungsi sebagai pembatas broadcast domain. Frame broadcast Layer 2 (termasuk ARP) tidak pernah diteruskan melintasi router ke jaringan publik.",
            xpReward: 10,
          },
          {
            id: "arp-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 4",
            keyPoints: [
              "Komputer menggunakan subnet mask untuk menentukan apakah IP tujuan berada di subnet lokal atau subnet remote.",
              "Untuk tujuan lokal, host melakukan ARP langsung untuk mendapatkan MAC kawan.",
              "Untuk tujuan remote atau Internet, host melakukan ARP untuk mendapatkan MAC Default Gateway.",
              "Pada frame keluar menuju internet, Destination MAC adalah MAC Router Gateway, sedangkan Destination IP tetap IP server tujuan asli.",
            ],
          },
          {
            id: "arp-l2-rew",
            type: "reward",
            xp: 60,
            message: "Sempurna! Anda memahami perbedaan krusial antara komunikasi lokal dan pengiriman data ke gateway.",
          },
        ],
      },
    },
  ],
};
