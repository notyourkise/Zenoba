import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Protokol Transport & Diagnostik Layanan Jaringan (P4-M5)
 *
 * Covers TCP 3-way handshake, UDP mechanics, ICMP diagnostics (Echo / TTL Exceeded),
 * Well-Known Port mapping, and Layer 3 vs Layer 4/7 troubleshooting methodology.
 */
export const transportServicesModuleData: CurriculumModule = {
  id: "module-transport-services",
  slug: "transport-services",
  title: "Protokol Transport & Diagnostik Layanan Jaringan",
  description:
    "Pelajari protokol transport Layer 4: TCP 3-way handshake (SYN, SYN-ACK, ACK), keandalan vs latensi UDP, diagnostik ICMP (Ping & Traceroute), dan pemecahan masalah port well-known.",
  orderIndex: 5,
  prerequisites: ["nat-pat"],
  outcomes: [
    {
      id: "TRN-M1",
      text: "Siswa dapat membandingkan karakteristik TCP vs UDP dan menganalisis peran paket diagnostik ICMP.",
    },
    {
      id: "TRN-M2",
      text: "Siswa dapat mengidentifikasi nomor port layanan standar dan membedakan kegagalan reachability Layer 3 vs service blockage Layer 4/7.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 9: tcp-udp-icmp (P4-L09)
    // =========================================================================
    {
      id: "lesson-tcp-udp-icmp",
      slug: "tcp-udp-icmp",
      title: "TCP 3-Way Handshake, UDP, & Diagnostik ICMP",
      description:
        "Menganalisis perbedaan connection-oriented TCP (3-way handshake, sequencing, flow control) vs connectionless UDP, serta peran pesan ICMP Type 8/0 dan Type 11.",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["pat-port-address-translation"],
      outcomes: [
        {
          id: "TRN-L1-A",
          text: "Siswa dapat membedakan keandalan TCP dengan 3-way handshake (SYN, SYN-ACK, ACK) versus kecepatan transmisi UDP tanpa garansi pengiriman.",
        },
        {
          id: "TRN-L1-B",
          text: "Siswa dapat menjelaskan fungsi kontrol pesan ICMP dalam utilitas ping (Echo Request/Reply) dan traceroute (TTL Exceeded).",
        },
      ],
      evidence: [
        {
          outcomeId: "TRN-L1-A",
          teachingBlockIds: ["trn-l1-h1", "trn-l1-txt1", "trn-l1-callout1"],
          activityIds: ["trn-l1-code1"],
          assessmentItemIds: ["quiz-trn-l1-q1", "quiz-trn-l1-q2"],
        },
        {
          outcomeId: "TRN-L1-B",
          teachingBlockIds: ["trn-l1-h2", "trn-l1-txt2", "trn-l1-callout2"],
          activityIds: ["trn-l1-interactive1"],
          assessmentItemIds: ["quiz-trn-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "trn-l1-h1",
            type: "heading",
            level: 2,
            text: "TCP (Handshake & Keandalan) vs UDP (Kecepatan & Ringan)",
          },
          {
            id: "trn-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Lapisan Transport (Layer 4) bertanggung jawab atas transfer data end-to-end antar aplikasi. Dua protokol utama yang mendominasi Layer 4 adalah **TCP (Transmission Control Protocol)** dan **UDP (User Datagram Protocol)**.\n\n1. **TCP (Connection-Oriented):**\n   - Membuka sesi komunikasi sebelum mengirim data melalui **TCP 3-Way Handshake**:\n     - **Langkah 1 (SYN):** Klien mengirim paket kontrol berflag SYN (*Synchronize*) dengan Sequence Number awal.\n     - **Langkah 2 (SYN-ACK):** Server membalas dengan flag SYN dan ACK (*Acknowledgment*).\n     - **Langkah 3 (ACK):** Klien mengirimkan paket final ACK. Sesi siap digunakan!\n   - Menyediakan garansi pengiriman data: jika sebuah segmen hilang di jalan, TCP akan mengirimkan ulang (*retransmission*).\n   - Digunakan oleh: Web (HTTP/HTTPS), Transfer File (FTP/SFTP), Remote Terminal (SSH), dan Email (SMTP/IMAP).\n\n2. **UDP (Connectionless):**\n   - Protokol *Best-Effort*: tidak ada proses handshake pembukaan sesi dan tidak ada konfirmasi pengiriman (*no ACK*).\n   - Ukuran header sangat kecil (hanya 8 byte dibandingkan header TCP minimum 20 byte) sehingga latensinya sangat rendah.\n   - Digunakan oleh: Voice over IP (VoIP), Video Streaming Langsung, Game Online Realtime, DNS Query, dan DHCP.",
          },
          {
            id: "trn-l1-code1",
            type: "code",
            language: "text",
            code: "Diagram Alur TCP 3-Way Handshake:\n\nClient                               Server\n  |                                    |\n  | --------- [ SYN, Seq=100 ] ------> | (Client inisiasi koneksi)\n  |                                    |\n  | <--- [ SYN-ACK, Seq=300, Ack=101 ] | (Server setuju & beri ACK)\n  |                                    |\n  | --------- [ ACK, Ack=301 ] ------> | (Client konfirmasi akhir)\n  |                                    |\n  ======================================\n        Sesi Koneksi TCP Terbuka\n         (ESTABLISHED State)",
          },
          {
            id: "trn-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Pemilihan Protokol",
            content:
              "Gunakan TCP saat keutuhan data adalah harga mati (dokumen tidak boleh ada 1 huruf pun yang hilang). Gunakan UDP saat kecepatan dan ketepatan waktu lebih penting daripada kehilangan beberapa frame video/suara sepersekian detik.",
          },
          {
            id: "trn-l1-h2",
            type: "heading",
            level: 2,
            text: "Peran Diagnostik ICMP: Ping & Traceroute",
          },
          {
            id: "trn-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "**ICMP (Internet Control Message Protocol)** adalah protokol pendamping Layer 3 yang bertugas memberikan pesan kontrol kesalahan dan diagnostik operasional jaringan.\n\nPeran penting pesan ICMP:\n- **Ping (ICMP Type 8 & Type 0):** Utilitas ping mengirim paket **Echo Request (Type 8)** ke host target. Jika host hidup dan tidak memblokir ICMP di firewall-nya, host akan membalas dengan **Echo Reply (Type 0)**.\n- **Traceroute (ICMP Type 11 - Time Exceeded):** Utilitas traceroute mengirim paket dengan nilai **TTL (Time to Live)** bertingkat (mulai dari TTL=1, TTL=2, dst.). Setiap kali router hop perantara mengurangi TTL menjadi 0, router tersebut membuang paket dan mengirim kembali pesan balasan **ICMP Time-to-Live Exceeded (Type 11)** ke komputer pengirim. Dari pesan inilah kita mengetahui nama dan IP setiap router di sepanjang jalur!",
          },
          {
            id: "trn-l1-interactive1",
            type: "interactive",
            interactiveType: "icmp_ping",
            config: {},
          },
          {
            id: "trn-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "Miskonsepsi: Ping Gagal != Server Mati",
            content:
              "Banyak server enterprise (seperti `microsoft.com`) sengaja mengonfigurasi firewall untuk membuang paket ICMP Echo Request demi mencegah serangan DoS (Ping of Death). Jadi, jika `ping` Request Timed Out (RTO), belum tentu server tersebut mati; Anda harus memeriksa port layanannya langsung (misal port 443 HTTPS)!",
          },
          {
            id: "trn-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trn-l1-q1",
            question: "Manakah urutan bendera (flag) kontrol yang benar pada proses pembukaan koneksi TCP 3-Way Handshake?",
            options: [
              { id: "opt-a", text: "SYN -> SYN-ACK -> ACK" },
              { id: "opt-b", text: "ACK -> SYN -> FIN" },
              { id: "opt-c", text: "SYN -> ACK -> RST" },
              { id: "opt-d", text: "HELLO -> READY -> CONNECT" },
            ],
            explanation:
              "Proses TCP 3-Way Handshake dimulai dari SYN (klien), dibalas SYN-ACK (server), dan diselesaikan oleh ACK (klien).",
            xpReward: 10,
          },
          {
            id: "trn-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trn-l1-q2",
            question: "Mengapa aplikasi komunikasi suara real-time (VoIP) dan video streaming langsung lebih memilih protokol UDP daripada TCP?",
            options: [
              { id: "opt-a", text: "Karena UDP tidak memiliki overhead transmisi ulang (retransmission) sehingga meminimalkan latensi dan jeda waktu" },
              { id: "opt-b", text: "Karena paket UDP dijamin 100% tidak akan pernah hilang oleh switch" },
              { id: "opt-c", text: "Karena UDP mengenkripsi data secara otomatis menggunakan algoritma AES-256" },
              { id: "opt-d", text: "Karena ukuran MTU UDP dua kali lebih besar dari TCP" },
            ],
            explanation:
              "UDP adalah protokol connectionless yang memprioritaskan latensi rendah tanpa mekanisme pengiriman ulang yang dapat menyebabkan lag suara.",
            xpReward: 10,
          },
          {
            id: "trn-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trn-l1-q3",
            question: "Pesan ICMP apakah yang dihasilkan oleh router perantara saat nilai Time to Live (TTL) dari paket IP mencapai angka 0, yang dimanfaatkan oleh perintah traceroute?",
            options: [
              { id: "opt-a", text: "ICMP Type 11 (Time-to-Live Exceeded)" },
              { id: "opt-b", text: "ICMP Type 8 (Echo Request)" },
              { id: "opt-c", text: "ICMP Type 0 (Echo Reply)" },
              { id: "opt-d", text: "ICMP Type 3 (Destination Unreachable)" },
            ],
            explanation:
              "Ketika nilai TTL paket berkurang menjadi 0 di sebuah router hop, router tersebut membuang paket dan mengirim balik pesan ICMP Type 11 (Time Exceeded).",
            xpReward: 10,
          },
          {
            id: "trn-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 9",
            keyPoints: [
              "TCP bersifat connection-oriented, andal, dan melakukan negosiasi 3-way handshake (SYN, SYN-ACK, ACK).",
              "UDP bersifat connectionless, ringan, dan cocok untuk aplikasi waktu nyata berlatensi rendah tanpa garansi pengiriman.",
              "ICMP bertugas sebagai mekanisme diagnostik dan kontrol kesalahan operasional Layer 3.",
              "Perintah ping menggunakan ICMP Echo Request (Type 8) & Reply (Type 0); traceroute memanfaatkan balasan Time Exceeded (Type 11).",
            ],
          },
          {
            id: "trn-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai mekanisme TCP, performa UDP, dan diagnostik ICMP.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 10: port-dan-layanan (P4-L10)
    // =========================================================================
    {
      id: "lesson-port-dan-layanan",
      slug: "port-dan-layanan",
      title: "Nomor Port Layanan (Well-Known Ports) & Analisis Outage",
      description:
        "Mempelajari pengelompokan nomor port (Well-Known 0-1023, Registered 1024-49151, Dynamic 49152-65535), kombinasi soket (IP:Port), dan metodologi troubleshooting terstruktur.",
      orderIndex: 1,
      estimatedMinutes: 16,
      xpReward: 70,
      prerequisites: ["tcp-udp-icmp"],
      outcomes: [
        {
          id: "TRN-L2-A",
          text: "Siswa dapat mengidentifikasi pasangan port standar protokol esensial: HTTP (80), HTTPS (443), DNS (53), SSH (22), DHCP (67/68).",
        },
        {
          id: "TRN-L2-B",
          text: "Siswa dapat membedakan insiden kegagalan Layer 3 (ICMP unreachable) versus kegagalan Layer 4/7 (koneksi ditolak / port tertutup firewall).",
        },
      ],
      evidence: [
        {
          outcomeId: "TRN-L2-A",
          teachingBlockIds: ["trn-l2-h1", "trn-l2-txt1", "trn-l2-callout1"],
          activityIds: ["trn-l2-code1"],
          assessmentItemIds: ["quiz-trn-l2-q1", "quiz-trn-l2-q2"],
        },
        {
          outcomeId: "TRN-L2-B",
          teachingBlockIds: ["trn-l2-h2", "trn-l2-txt2", "trn-l2-callout2"],
          activityIds: ["trn-l2-interactive1"],
          assessmentItemIds: ["quiz-trn-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "trn-l2-h1",
            type: "heading",
            level: 2,
            text: "Hierarki Nomor Port: Well-Known, Registered, & Ephemeral",
          },
          {
            id: "trn-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika sebuah server web menerima ribuan paket, bagaimana sistem operasi tahu paket mana yang ditujukan untuk web server (Apache/Nginx), server email (Postfix), atau server file (FTP)? Jawabannya adalah **Nomor Port Layer 4**.\n\nKombinasi antara **Alamat IP + Nomor Port** disebut sebagai **Socket** (contoh: `103.200.4.15:443`).\n\nIANA (Internet Assigned Numbers Authority) membagi rentang nomor port 0 s.d. 65.535 ke dalam tiga kelompok:\n\n1. **Well-Known Ports (0 – 1023):** Direservasi untuk layanan sistem dan protokol standar internet:\n   - **Port 21:** FTP (File Transfer Protocol - Control)\n   - **Port 22:** SSH (Secure Shell - Remote Manajemen Aman)\n   - **Port 23:** Telnet (Remote Terminal Teks Biasa)\n   - **Port 25:** SMTP (Simple Mail Transfer Protocol)\n   - **Port 53:** DNS (Domain Name System - UDP/TCP)\n   - **Port 67 / 68:** DHCP Server & Client\n   - **Port 80:** HTTP (Hypertext Transfer Protocol - Web tidak terenkripsi)\n   - **Port 110:** POP3 (Post Office Protocol v3)\n   - **Port 143:** IMAP (Internet Message Access Protocol)\n   - **Port 443:** HTTPS (HTTP Secure - Web dengan enkripsi TLS/SSL)\n2. **Registered Ports (1024 – 49151):** Didaftarkan oleh vendor untuk aplikasi khusus (contoh: MySQL `3306`, PostgreSQL `5432`, MikroTik Winbox `8291`).\n3. **Dynamic / Private / Ephemeral Ports (49152 – 65535):** Nomor port acak yang dialokasikan otomatis oleh sistem operasi klien untuk sesi outbound.",
          },
          {
            id: "trn-l2-code1",
            type: "code",
            language: "text",
            code: "Tabel Pasangan Layanan & Nomor Port Standar:\n\nProtokol    Port      Transport     Fungsi Utama\n=========================================================================\nSSH         22        TCP           Remote Login Terenkripsi\nDNS         53        UDP/TCP       Resolusi Nama Domain\nDHCP Server 67        UDP           Alokasi IP Otomatis (Server)\nDHCP Client 68        UDP           Penerima Alokasi IP (Client)\nHTTP        80        TCP           Layanan Web Polos\nHTTPS       443       TCP           Layanan Web Terenkripsi (TLS)\nMySQL       3306      TCP           Basis Data Relasional",
          },
          {
            id: "trn-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Penting: DNS Menggunakan UDP dan TCP",
            content:
              "Query resolusi nama standar menggunakan UDP port 53 untuk kecepatan. Namun jika ukuran respon melebihi 512 byte (seperti DNSSEC) atau saat transfer zona domain antar-server (*DNS Zone Transfer*), DNS akan beralih menggunakan TCP port 53.",
          },
          {
            id: "trn-l2-h2",
            type: "heading",
            level: 2,
            text: "Metodologi Analisis Gangguan Jaringan (Layer 3 vs Layer 4/7)",
          },
          {
            id: "trn-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Dalam praktik lapangan, teknisi jaringan SMK sering kali dihadapkan pada keluhan samar: **'Aplikasi web tidak bisa dibuka'**. Untuk menyelesaikannya secara cepat, terapkan metode *Divide-and-Conquer* berbasis layer OSI:\n\n1. **Uji Layer 3 (Network Reachability):**\n   - Jalankan `ping <IP_Server>`.\n   - **Jika Ping Reply:** Artinya koneksi fisik, switch VLAN, IP address, dan rute router berfungsi normal! Jangan buang waktu membongkar kabel atau tabel routing.\n   - **Jika Ping RTO:** Masalah berada pada Layer 1-3 (kabel lepas, gateway salah, rute hilang, atau ICMP diblokir).\n\n2. **Uji Layer 4 (Transport / Port Open):**\n   - Gunakan perintah `curl`, `nc` (*netcat*), atau `Test-NetConnection` di PowerShell:\n     `Test-NetConnection -ComputerName 192.168.1.100 -Port 80`\n   - **Jika TcpTestSucceeded: False:** Artinya server hidup, namun service web server (Apache/Nginx) mati, atau Firewall (iptables / Windows Defender) memblokir port 80/443!\n\n3. **Uji Resolusi Nama (DNS):**\n   - Jika akses via IP berhasil (`http://192.168.1.100`) namun akses via domain gagal (`http://server.sekolah.sch.id`), maka letak kerusakannya adalah di DNS resolver!",
          },
          {
            id: "trn-l2-interactive1",
            type: "interactive",
            interactiveType: "terminal",
            config: {},
          },
          {
            id: "trn-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "Diagnostik Port Aktif dengan netstat",
            content:
              "Pada server Linux atau Windows, gunakan perintah `netstat -tuln` atau `ss -tuln` untuk memastikan apakah aplikasi web server benar-benar sedang mendengarkan (*LISTENING*) di port 80/443.",
          },
          {
            id: "trn-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trn-l2-q1",
            question: "Nomor port standar berapakah yang digunakan oleh layanan web terenkripsi HTTPS (Hypertext Transfer Protocol Secure)?",
            options: [
              { id: "opt-a", text: "Port 443" },
              { id: "opt-b", text: "Port 80" },
              { id: "opt-c", text: "Port 22" },
              { id: "opt-d", text: "Port 8080" },
            ],
            explanation:
              "HTTPS menggunakan TCP port 443 secara default, sedangkan HTTP biasa tanpa enkripsi menggunakan TCP port 80.",
            xpReward: 10,
          },
          {
            id: "trn-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trn-l2-q2",
            question: "Kombinasi antara alamat IP dan nomor port pada sistem operasi (contoh: 192.168.1.10:80) disebut sebagai apa?",
            options: [
              { id: "opt-a", text: "Socket" },
              { id: "opt-b", text: "Netmask" },
              { id: "opt-c", text: "Sub-interface" },
              { id: "opt-d", text: "Trunk" },
            ],
            explanation:
              "Socket adalah kombinasi unik dari alamat IP dan nomor port yang mengidentifikasi titik akhir proses komunikasi pada host.",
            xpReward: 10,
          },
          {
            id: "trn-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trn-l2-q3",
            question: "Seorang administrator dapat melakukan ping ke IP server web (ICMP reply normal), namun saat membuka web browser muncul pesan 'Connection Refused'. Apa kemungkinan besar penyebabnya?",
            options: [
              { id: "opt-a", text: "Layanan web server (Apache/Nginx) sedang mati atau port 80/443 ditutup oleh firewall lokal server" },
              { id: "opt-b", text: "Kabel UTP antara switch dan router terputus total" },
              { id: "opt-c", text: "Subnet mask pada kartu jaringan server salah ketik" },
              { id: "opt-d", text: "Default Gateway di server belum diisi" },
            ],
            explanation:
              "Keberhasilan ping membuktikan Layer 1 sampai Layer 3 (IP, rute, kabel) berfungsi normal. Pesan 'Connection Refused' menandakan tidak ada proses aplikasi di server yang mendengarkan di port web yang dituju.",
            xpReward: 10,
          },
          {
            id: "trn-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 10",
            keyPoints: [
              "Port Layer 4 mengarahkan data masuk ke proses atau aplikasi yang tepat pada sistem operasi host.",
              "Well-Known Ports (0-1023) menampung protokol standar: 22 (SSH), 53 (DNS), 67/68 (DHCP), 80 (HTTP), 443 (HTTPS).",
              "Soket (IP:Port) merepresentasikan titik akhir koneksi komunikasi transport.",
              "Membedakan hasil ICMP ping (konektivitas Layer 3) dan pengujian soket port (ketersediaan layanan Layer 4/7) adalah kunci troubleshooting profesional.",
            ],
          },
          {
            id: "trn-l2-rew",
            type: "reward",
            xp: 70,
            message: "Selamat! Anda telah menyelesaikan seluruh 10 materi kurikulum Routing & Layanan Jaringan!",
          },
        ],
      },
    },
  ],
};
