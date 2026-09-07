import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Alat Diagnostik Jaringan & CLI (P5-M3)
 *
 * Covers essential network command-line utilities:
 * ipconfig/all & ip addr (APIPA detection, adapter state),
 * ping (ICMP echo interpretation: RTO, Host Unreachable, TTL),
 * nslookup (DNS resolution triage), arp -a (L2 bindings),
 * traceroute/tracert (hop latency & routing fault isolation),
 * and netstat -an (listening ports and connection state).
 */
export const diagnosticToolsModuleData: CurriculumModule = {
  id: "module-diagnostic-tools",
  slug: "diagnostic-tools",
  title: "Alat Diagnostik Jaringan & CLI",
  description:
    "Kuasai baris perintah diagnostik jaringan standar industri: ipconfig, ping, arp, tracert/traceroute, nslookup, dan netstat untuk mengumpulkan bukti faktual saat troubleshooting.",
  orderIndex: 3,
  prerequisites: ["wireless-security"],
  outcomes: [
    {
      id: "DIAG-M1",
      text: "Siswa dapat menganalisis output ipconfig dan ping untuk mendeteksi anomali konfigurasi IP (seperti APIPA 169.254.x.x) dan menginterpretasi status konektivitas Layer 3.",
    },
    {
      id: "DIAG-M2",
      text: "Siswa dapat memilih dan menjalankan perintah diagnostik yang relevan (nslookup, arp, tracert, netstat) berdasarkan pertanyaan investigasi yang sedang dihadapi.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 5: ipconfig-ping-diagnostic (P5-L05)
    // =========================================================================
    {
      id: "lesson-ipconfig-ping-diagnostic",
      slug: "ipconfig-ping-diagnostic",
      title: "Diagnostik Dasar: ipconfig/ip addr & ping",
      description:
        "Menganalisis konfigurasi antarmuka jaringan komputer, mendeteksi alamat APIPA 169.254.x.x, serta menguji keterjangkauan Layer 3 dan menginterpretasi respon ICMP.",
      orderIndex: 0,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["guest-network-isolation"],
      outcomes: [
        {
          id: "DIAG-L5-A",
          text: "Siswa dapat membaca parameter output ipconfig /all (IPv4, mask, gateway, DNS, status DHCP) dan mengenali indikator kegagalan seperti alamat APIPA 169.254.x.x.",
        },
        {
          id: "DIAG-L5-B",
          text: "Siswa dapat membedakan arti respon ping: Reply, Request Timed Out, Destination Host Unreachable, dan TTL Expired in Transit.",
        },
      ],
      evidence: [
        {
          outcomeId: "DIAG-L5-A",
          teachingBlockIds: ["diag-l5-h1", "diag-l5-txt1", "diag-l5-callout1"],
          activityIds: ["diag-l5-code1"],
          assessmentItemIds: ["quiz-diag-l5-q1", "quiz-diag-l5-q2"],
        },
        {
          outcomeId: "DIAG-L5-B",
          teachingBlockIds: ["diag-l5-h2", "diag-l5-txt2", "diag-l5-callout2"],
          activityIds: ["diag-l5-interactive1"],
          assessmentItemIds: ["quiz-diag-l5-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "diag-l5-h1",
            type: "heading",
            level: 2,
            text: "Langkah Pertama Troubleshooting: Memeriksa Konfigurasi Lokal dengan ipconfig",
          },
          {
            id: "diag-l5-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika pengguna melaporkan keluhan 'Internet mati', langkah investigasi ilmiah pertama seorang teknisi jaringan **bukanlah** langsung merestart router! Langkah pertama adalah memeriksa konfigurasi adapter perangkat lokal menggunakan perintah `ipconfig` (Windows) atau `ip addr` (Linux).\n\nGunakan opsi `ipconfig /all` untuk melihat detail lengkap:\n\n- **IPv4 Address:** Alamat logis komputer saat ini.\n- **Subnet Mask:** Penentu batasan jaringan lokal (NetID).\n- **Default Gateway:** Pintu gerbang keluar subnet (IP router).\n- **DHCP Server & DNS Servers:** Server pemberi sewa IP dan penerjemah nama domain.\n\n### Indikator Bahaya: Alamat APIPA (169.254.x.x)\nJika komputer disetel untuk meminta IP otomatis via DHCP namun pada output `ipconfig` tertera IP dengan awalan **`169.254.x.x`** dan subnet mask `255.255.0.0`, sistem operasi sedang menggunakan **APIPA (Automatic Private IP Addressing)**!\n\nIni adalah bukti mutlak bahwa komputer gagal mendapatkan jawaban DHCP Discover/Request dari DHCP Server (misalnya kabel putus ke server DHCP, server DHCP mati, atau kuota IP pool DHCP telah habis).",
          },
          {
            id: "diag-l5-code1",
            type: "code",
            language: "text",
            code: "C:\\Users\\Netloka> ipconfig /all\n\nEthernet adapter Local Area Connection:\n   DHCP Enabled. . . . . . . . . . . : Yes\n   Autoconfiguration IPv4 Address. . : 169.254.12.88(Preferred)  <-- GEJALA APIPA!\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . : \n   DNS Servers . . . . . . . . . . . : \n\n* Analisis: Komputer tidak memiliki Default Gateway dan tidak mendapat IP dari router!\n* Root Cause Terduga: DHCP Pool Exhaustion atau masalah konektivitas fisik ke router.",
          },
          {
            id: "diag-l5-callout1",
            type: "callout",
            variant: "warning",
            title: "Jangan Sampai Terkecoh Alamat APIPA",
            content:
              "Ketika mendapatkan IP 169.254.x.x, Windows mungkin menampilkan ikon 'Connected', namun dengan tanda seru kuning 'No Internet'. Komputer memang terhubung secara fisik, tetapi tidak memiliki konfigurasi Layer 3 yang valid untuk keluar jaringan.",
          },
          {
            id: "diag-l5-h2",
            type: "heading",
            level: 2,
            text: "Menguji Keterjangkauan dengan ping dan Membaca Respon ICMP",
          },
          {
            id: "diag-l5-txt2",
            type: "text",
            format: "markdown",
            content:
              "Perintah `ping <ip_tujuan>` mengirimkan pesan **ICMP Echo Request** (Type 8) dan mengharapkan balasan **ICMP Echo Reply** (Type 0). Empat respon umum ping memiliki makna diagnostik berbeda:\n\n1. **Reply from <IP>: bytes=32 time=5ms TTL=64:**\n   - Jalur Layer 1 hingga Layer 3 berfungsi sempurna dua arah (round-trip) dan target aktif.\n2. **Request timed out (RTO):**\n   - Paket berhasil dikirim keluar, namun tidak ada jawaban kembali sebelum batas waktu (timeout). Penyebab: Firewall pada target memblokir ICMP, routing arah balik (return route) hilang, atau kabel putus di dekat target.\n3. **Destination host unreachable:**\n   - Router lokal atau router perantara secara eksplisit menyatakan bahwa ia tidak tahu rute menuju IP tujuan, atau gagal melakukan resolusi ARP ke MAC target pada subnet lokal.\n4. **TTL expired in transit:**\n   - Paket terjebak dalam lingkaran routing tak berujung (**Routing Loop**) antar dua router hingga nilai Hop Count/TTL habis menjadi 0.",
          },
          {
            id: "diag-l5-interactive1",
            type: "interactive",
            interactiveType: "terminal",
            config: {
              initialHost: "NETLOKA-WORKSTATION",
              allowedCommands: ["ipconfig", "ipconfig /all", "ping 127.0.0.1", "ping 192.168.1.1", "ping 8.8.8.8", "help", "clear"],
            },
          },
          {
            id: "diag-l5-callout2",
            type: "callout",
            variant: "tip",
            title: "Urutan Uji Ping Bertahap (Bottom-Up)",
            content:
              "Selalu uji dengan urutan: (1) `ping 127.0.0.1` (menguji stack TCP/IP internal PC), (2) `ping <IP_Lokal_Sendiri>` (menguji adapter NIC), (3) `ping <Default_Gateway>` (menguji kabel LAN dan router lokal), (4) `ping 8.8.8.8` (menguji koneksi WAN ISP), (5) `ping google.com` (menguji fungsi resolusi DNS).",
          },
          {
            id: "diag-l5-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-diag-l5-q1",
            question:
              "Jika hasil ipconfig pada laptop seorang staf kantor menunjukkan IPv4 Address '169.254.20.15' dan Default Gateway kosong, apa kesimpulan investigasi yang paling akurat?",
            options: [
              {
                id: "opt-a",
                text: "Laptop mengalami masalah APIPA karena gagal menerima penawaran alamat IP dari DHCP Server",
              },
              {
                id: "opt-b",
                text: "Laptop telah diretas oleh pihak luar sehingga IP-nya diubah",
              },
              {
                id: "opt-c",
                text: "Kartu Wi-Fi laptop terbakar dan harus segera diganti",
              },
              {
                id: "opt-d",
                text: "Koneksi internet kantor sedang berjalan pada kecepatan maksimum",
              },
            ],
            explanation:
              "Rentang IP 169.254.0.0/16 adalah alamat otomatis APIPA yang dialokasikan sistem operasi saat request DHCP tidak memperoleh balasan DHCPOFFER.",
            xpReward: 10,
          },
          {
            id: "quiz-diag-l5-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-diag-l5-q2",
            question:
              "Seorang teknisi melakukan ping ke IP gateway lokal (192.168.1.1) dan mendapatkan balasan 'Destination host unreachable'. Apa arti teknis dari pesan ini?",
            options: [
              {
                id: "opt-a",
                text: "Perangkat pengirim tidak dapat menemukan MAC address tujuan melalui ARP, atau router lokal menyatakan tidak ada jalur ke subnet tersebut",
              },
              {
                id: "opt-b",
                text: "Paket berhasil sampai ke server tujuan namun ditolak oleh aplikasi web",
              },
              {
                id: "opt-c",
                text: "Kabel jaringan pengirim dicabut dari laptop",
              },
              {
                id: "opt-d",
                text: "Server DNS sedang mengalami pemeliharaan rutin",
              },
            ],
            explanation:
              "Pesan 'Destination Host Unreachable' dipicu oleh kegagalan resolusi ARP pada subnet lokal atau router yang tidak memiliki entri rute menuju tujuan.",
            xpReward: 10,
          },
          {
            id: "quiz-diag-l5-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-diag-l5-q3",
            question:
              "Ketika melakukan ping ke alamat internet, terminal memunculkan pesan 'TTL expired in transit'. Apa penyebab pasti dari gejala ini?",
            options: [
              {
                id: "opt-a",
                text: "Terjadi loop routing (lingkaran perutean tak berujung) antar router sehingga nilai TTL paket habis menjadi 0 sebelum sampai",
              },
              {
                id: "opt-b",
                text: "Pengguna terlambat membayar tagihan internet bulanan",
              },
              {
                id: "opt-c",
                text: "Kabel fiber optik putus di tengah laut",
              },
              {
                id: "opt-d",
                text: "Komputer target membalas paket lebih cepat dari kecepatan cahaya",
              },
            ],
            explanation:
              "Setiap hop router mengurangi nilai TTL sebesar 1. Jika dua router saling mengembalikan paket (loop), TTL akan terdeplesi hingga 0 dan router membuang paket sambil membalas ICMP TTL Expired in Transit.",
            xpReward: 10,
          },
          {
            id: "diag-l5-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 5",
            keyPoints: [
              "Perintah ipconfig /all memverifikasi parameter IP, Subnet Mask, Gateway, dan status sewa DHCP adapter.",
              "Alamat IPv4 169.254.x.x (APIPA) menandakan kegagalan komunikasi total dengan DHCP Server.",
              "Respon ping 'Request Timed Out' berbeda dari 'Destination Host Unreachable': RTO berarti paket terkirim tanpa balasan, sedangkan Unreachable berarti router tidak menemukan rute atau gagal ARP.",
              "Metode bottom-up ping (Loopback -> IP Lokal -> Gateway -> ISP -> Domain) mengisolasi titik kegagalan jaringan secara cepat dan sistematis.",
            ],
          },
          {
            id: "diag-l5-rew",
            type: "reward",
            xp: 60,
            message:
              "Bagus sekali! Anda telah menguasai diagnostik dasar CLI dengan ipconfig dan pembacaan kode respon ICMP ping.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 6: nslookup-arp-traceroute (P5-L06)
    // =========================================================================
    {
      id: "lesson-nslookup-arp-traceroute",
      slug: "nslookup-arp-traceroute",
      title: "Diagnostik Lanjutan: nslookup, arp, traceroute & netstat",
      description:
        "Memilih dan menjalankan alat diagnostik CLI tingkat lanjut: uji resolusi nama DNS dengan nslookup, inspeksi tabel ARP Layer 2, isolasi hop kegagalan rute dengan tracert/traceroute, serta pemantauan port dan soket dengan netstat.",
      orderIndex: 1,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["ipconfig-ping-diagnostic"],
      outcomes: [
        {
          id: "DIAG-L6-A",
          text: "Siswa dapat menggunakan nslookup untuk mendiagnosis kegagalan resolusi nama DNS dan menggunakan arp -a untuk memeriksa asosiasi IP-to-MAC pada Layer 2.",
        },
        {
          id: "DIAG-L6-B",
          text: "Siswa dapat menganalisis output traceroute/tracert untuk menentukan hop router lokasi kegagalan jalur dan menggunakan netstat -an untuk memverifikasi port layanan yang aktif.",
        },
      ],
      evidence: [
        {
          outcomeId: "DIAG-L6-A",
          teachingBlockIds: ["diag-l6-h1", "diag-l6-txt1", "diag-l6-callout1"],
          activityIds: ["diag-l6-code1"],
          assessmentItemIds: ["quiz-diag-l6-q1", "quiz-diag-l6-q2"],
        },
        {
          outcomeId: "DIAG-L6-B",
          teachingBlockIds: ["diag-l6-h2", "diag-l6-txt2", "diag-l6-callout2"],
          activityIds: ["diag-l6-interactive1"],
          assessmentItemIds: ["quiz-diag-l6-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "diag-l6-h1",
            type: "heading",
            level: 2,
            text: "Uji Resolusi DNS (nslookup) dan Pemetaan MAC (arp -a)",
          },
          {
            id: "diag-l6-txt1",
            type: "text",
            format: "markdown",
            content:
              "Sering kali pengguna mengeluh 'Internet mati', namun ketika Anda melakukan `ping 8.8.8.8`, ping berhasil dengan lancar! Ini adalah indikasi klasik bahwa koneksi Layer 3 internet normal, tetapi sistem **DNS (Domain Name System)** yang bermasalah.\n\n### 1. nslookup (Name Server Lookup)\nPerintah `nslookup <nama_domain>` digunakan untuk menguji server DNS secara langsung:\n\n- Menguji apakah DNS Server lokal (misal `192.168.1.1` atau `1.1.1.1`) aktif merespons query.\n- Mendeteksi apakah domain tertentu mengembalikan record IP yang valid atau menghasilkan pesan `*** UnKnown can't find domain: Non-existent domain (NXDOMAIN)` atau `DNS request timed out`.\n\n### 2. arp -a (Address Resolution Protocol Table)\nPerintah `arp -a` menampilkan tabel cache ARP lokal:\n\n- Memverifikasi apakah IP Default Gateway berhasil dipetakan ke MAC address fisik router.\n- Mendeteksi indikasi serangan **ARP Spoofing**, yaitu jika dua alamat IP berbeda (misal IP Gateway dan IP penyerang) memiliki alamat MAC fisik yang identik!",
          },
          {
            id: "diag-l6-code1",
            type: "code",
            language: "text",
            code: "Contoh Output Diagnostik:\n\nC:\\> nslookup belajar.smk.sch.id\nServer:  one.one.one.one\nAddress: 1.1.1.1\n\nNon-authoritative answer:\nName:    belajar.smk.sch.id\nAddress: 103.20.188.5\n\nC:\\> arp -a\nInterface: 192.168.1.100 --- 0xb\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-50-56-c0-00-01     dynamic   <-- Gateway valid!\n  192.168.1.20          00-0c-29-8a-1f-9b     dynamic\n  192.168.1.255         ff-ff-ff-ff-ff-ff     static",
          },
          {
            id: "diag-l6-callout1",
            type: "callout",
            variant: "info",
            title: "Trik Diagnostik: Memaksa DNS Tertentu dengan nslookup",
            content:
              "Anda dapat menguji apakah server DNS ISP yang error dengan menambahkan alamat DNS alternatif di belakang perintah, contoh: `nslookup google.com 8.8.8.8`. Jika query ke 8.8.8.8 berhasil sedangkan query standar gagal, maka resolver DNS lokal Anda yang rusak.",
          },
          {
            id: "diag-l6-h2",
            type: "heading",
            level: 2,
            text: "Menemukan Hop Titik Putus (tracert) & Status Port (netstat)",
          },
          {
            id: "diag-l6-txt2",
            type: "text",
            format: "markdown",
            content:
              "Ketika lalu lintas data harus melintasi banyak router (misalnya antar kantor cabang melewati ISP), kita membutuhkan alat untuk mengetahui di router mana paket berhenti.\n\n### 1. traceroute / tracert\nPerintah `tracert <target>` (Windows) atau `traceroute <target>` (Linux/Cisco) memetakan setiap hop router yang dilewati dengan memanfaatkan manipulasi nilai **TTL (Time to Live)** dari 1, 2, 3, dan seterusnya:\n\n- Hop 1: Router lokal (Default Gateway).\n- Hop 2: Router distribusi / BTS / OLT ISP.\n- Hop 3: Core router backbone internet.\n- Jika pada Hop 3 output menampilkan deretan tanda bintang `* * * Request timed out`, maka gangguan terletak di antara Hop 2 dan Hop 3 (misalnya jalur antar-router putus atau firewall ISP memblokir ICMP).\n\n### 2. netstat -an\nPerintah `netstat -an` menampilkan seluruh soket koneksi jaringan aktif pada komputer:\n\n- Memeriksa apakah port layanan server (misal port 80 HTTP, 443 HTTPS, 53 DNS, 22 SSH) berstatus **`LISTENING`** (siap menerima koneksi).\n- Memeriksa koneksi TCP yang sedang aktif (**`ESTABLISHED`**) atau menunggu (**`TIME_WAIT`**).",
          },
          {
            id: "diag-l6-interactive1",
            type: "interactive",
            interactiveType: "terminal",
            config: {
              initialHost: "NETLOKA-WORKSTATION",
              allowedCommands: [
                "nslookup google.com",
                "nslookup portal.internal",
                "arp -a",
                "tracert 8.8.8.8",
                "traceroute 8.8.8.8",
                "netstat -an",
                "help",
                "clear",
              ],
            },
          },
          {
            id: "diag-l6-callout2",
            type: "callout",
            variant: "tip",
            title: "Miskonsepsi Tanda Bintang pada Tracert",
            content:
              "Tanda bintang `* * *` pada hop tertentu tidak selalu berarti jaringan putus jika hop sesudahnya tetap membalas dengan normal. Beberapa router core enterprise sengaja menolak merespon pesan ICMP Time Exceeded demi alasan performa dan keamanan.",
          },
          {
            id: "diag-l6-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-diag-l6-q1",
            question:
              "Seorang pengguna dapat melakukan ping ke alamat '8.8.8.8' dengan sukses, namun gagal membuka situs 'google.com' di web browser. Perintah CLI manakah yang paling tepat untuk menginvestigasi masalah ini?",
            options: [
              {
                id: "opt-a",
                text: "nslookup google.com untuk memeriksa apakah server DNS lokal berhasil menerjemahkan domain tersebut menjadi alamat IP",
              },
              {
                id: "opt-b",
                text: "format c: untuk menginstal ulang sistem operasi",
              },
              {
                id: "opt-c",
                text: "ping 127.0.0.1 untuk menguji kartu jaringan",
              },
              {
                id: "opt-d",
                text: "color a untuk mengubah tampilan layar terminal menjadi hijau",
              },
            ],
            explanation:
              "Bisa ping ke IP publik (8.8.8.8) tetapi tidak bisa membuka nama domain membuktikan bahwa Layer 1-3 berfungsi normal, dan kerusakan berada pada sistem resolusi DNS.",
            xpReward: 10,
          },
          {
            id: "quiz-diag-l6-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-diag-l6-q2",
            question:
              "Saat menjalankan perintah 'arp -a', seorang administrator menemukan bahwa IP Default Gateway (192.168.1.1) dan IP sebuah laptop asing (192.168.1.55) memiliki Physical Address MAC yang sama persis. Apa yang sedang terjadi?",
            options: [
              {
                id: "opt-a",
                text: "Terjadi serangan ARP Spoofing / Poisoning di mana laptop asing memalsukan diri sebagai router untuk menyadap lalu lintas",
              },
              {
                id: "opt-b",
                text: "Router dan laptop tersebut diproduksi di pabrik yang sama pada hari yang sama",
              },
              {
                id: "opt-c",
                text: "Switch jaringan sedang melakukan backup konfigurasi otomatis",
              },
              {
                id: "opt-d",
                text: "Kedua perangkat saling bertukar antena Wi-Fi secara nirkabel",
              },
            ],
            explanation:
              "Dua alamat IP berbeda tidak boleh memiliki satu MAC address yang sama pada satu LAN kecuali terjadi pemalsuan balasan ARP (ARP Spoofing/Poisoning Man-in-the-Middle).",
            xpReward: 10,
          },
          {
            id: "quiz-diag-l6-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-diag-l6-q3",
            question:
              "Ketika menjalankan 'tracert 10.10.20.5', Hop 1 (192.168.1.1) membalas 1ms, Hop 2 (10.0.0.1) membalas 5ms, namun Hop 3 dan seterusnya hanya menampilkan '* * * Request timed out'. Apa kesimpulan teknisnya?",
            options: [
              {
                id: "opt-a",
                text: "Paket berhasil melewati router lokal dan router Hop 2, namun terputus atau diblokir pada tautan menuju Hop 3",
              },
              {
                id: "opt-b",
                text: "Kabel LAN di laptop pengguna dicabut pada saat Hop 3 berlangsung",
              },
              {
                id: "opt-c",
                text: "Server DNS mematikan sambungan listrik di Hop 3",
              },
              {
                id: "opt-d",
                text: "Komputer pengguna kehabisan memori RAM",
              },
            ],
            explanation:
              "Hasil tracert membuktikan paket berhasil melintasi Hop 1 dan 2, sehingga titik putus konektivitas terlokalisir secara presisi pada interface keluar Hop 2 atau link menuju Hop 3.",
            xpReward: 10,
          },
          {
            id: "diag-l6-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 6",
            keyPoints: [
              "Perintah nslookup memastikan apakah kegagalan browsing disebabkan oleh kendala resolusi nama DNS atau masalah keterjangkauan IP.",
              "Perintah arp -a memeriksa tabel asosiasi Layer 2 untuk memastikan frame lokal dapat diarahkan ke alamat fisik MAC gateway yang benar.",
              "Perintah tracert/traceroute mengidentifikasi router perantara hop-by-hop untuk menemukan lokasi persis rute yang mengalami kegagalan.",
              "Perintah netstat -an memverifikasi apakah port layanan di komputer server sedang aktif mendengarkan (LISTENING) permintaan koneksi klien.",
            ],
          },
          {
            id: "diag-l6-rew",
            type: "reward",
            xp: 60,
            message:
              "Hebat! Anda telah menguasai alat diagnostik lanjutan: nslookup, arp, traceroute, dan netstat.",
          },
        ],
      },
    },
  ],
};
