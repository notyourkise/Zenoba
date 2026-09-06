import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Layanan Otomatisasi IP & Resolusi Domain (P4-M3)
 *
 * Covers DHCP DORA mechanics, scope options, DNS tree hierarchy,
 * query resolution recursive/iterative, and core resource records (A, CNAME, MX, PTR).
 */
export const dhcpDnsModuleData: CurriculumModule = {
  id: "module-dhcp-dns",
  slug: "dhcp-dns",
  title: "Layanan Otomatisasi IP & Resolusi Domain (DHCP & DNS)",
  description:
    "Pelajari siklus 4-tahap DHCP (DORA), konfigurasi scope/pool, hierarki Domain Name System (DNS), dan pemetaan record nama ke alamat IP.",
  orderIndex: 3,
  prerequisites: ["static-intervlan"],
  outcomes: [
    {
      id: "SRV-M1",
      text: "Siswa dapat menganalisis pertukaran paket DHCP DORA dan mengonfigurasi parameter IP scope.",
    },
    {
      id: "SRV-M2",
      text: "Siswa dapat menjelaskan hierarki DNS dan mengidentifikasi tipe record DNS dalam resolusi nama domain.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 5: dhcp-dora-process (P4-L05)
    // =========================================================================
    {
      id: "lesson-dhcp-dora-process",
      slug: "dhcp-dora-process",
      title: "Siklus 4-Tahap DHCP (DORA) & Alokasi IP Otomatis",
      description:
        "Menelusuri proses Discover, Offer, Request, Acknowledge pada protokol DHCP (UDP port 67/68) dan penentuan konfigurasi scope (IP pool, mask, gateway, DNS).",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["inter-vlan-routing"],
      outcomes: [
        {
          id: "SRV-L1-A",
          text: "Siswa dapat menelusuri pesan 4-tahap DORA dan menjelaskan fungsi masing-masing tahap pengalamatan IP otomatis.",
        },
        {
          id: "SRV-L1-B",
          text: "Siswa dapat mengidentifikasi parameter wajib yang didistribusikan oleh server DHCP ke klien jaringan.",
        },
      ],
      evidence: [
        {
          outcomeId: "SRV-L1-A",
          teachingBlockIds: ["srv-l1-h1", "srv-l1-txt1", "srv-l1-callout1"],
          activityIds: ["srv-l1-interactive1"],
          assessmentItemIds: ["quiz-srv-l1-q1", "quiz-srv-l1-q2"],
        },
        {
          outcomeId: "SRV-L1-B",
          teachingBlockIds: ["srv-l1-h2", "srv-l1-txt2", "srv-l1-callout2"],
          activityIds: ["srv-l1-code1"],
          assessmentItemIds: ["quiz-srv-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "srv-l1-h1",
            type: "heading",
            level: 2,
            text: "Mengapa DHCP Dibutuhkan & Siklus 4-Tahap DORA",
          },
          {
            id: "srv-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Menetapkan alamat IP secara manual (*static IP*) pada ratusan komputer di sekolah atau kantor sangat memakan waktu dan rawan terjadi *IP address conflict*. **DHCP (Dynamic Host Configuration Protocol)** memecahkan masalah ini dengan meminjamkan (*lease*) konfigurasi IP secara otomatis.\n\nDHCP bekerja di atas protokol **UDP** menggunakan dua port well-known:\n- **Port UDP 67:** Port penerima pada DHCP Server.\n- **Port UDP 68:** Port penerima pada DHCP Client.\n\nSaat klien baru pertama kali menyala dan meminta konfigurasi jaringan, berlangsunglah proses negosiasi 4 tahap yang disingkat **DORA**:\n\n1. **Discover (DHCPDISCOVER):** Klien belum memiliki IP. Klien mengirim broadcast (`0.0.0.0` -> `255.255.255.255`) mencari apakah ada server DHCP di jaringan lokal.\n2. **Offer (DHCPOFFER):** Satu atau beberapa DHCP server merespons dengan pesan penawaran IP yang belum terpakai beserta subnet mask dan lease time.\n3. **Request (DHCPREQUEST):** Klien memilih salah satu tawaran (biasanya tawaran yang tiba pertama) dan menyiarkan broadcast konfirmasi peminjaman IP tersebut.\n4. **Acknowledge (DHCPACK):** Server yang tawarannya disetujui mengirim pesan final persetujuan resmi beserta seluruh parameter pendukung (Gateway, DNS Server, dll.).",
          },
          {
            id: "srv-l1-interactive1",
            type: "interactive",
            interactiveType: "dhcp_dora",
            config: {},
          },
          {
            id: "srv-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Gejala APIPA 169.254.x.x",
            content:
              "Jika klien mengirim DHCPDISCOVER namun tidak ada server DHCP yang membalas dalam batas waktu tertentu, Windows akan otomatis menetapkan alamat **APIPA (Automatic Private IP Addressing)** di rentang `169.254.0.1` s.d. `169.254.255.254`. Ini indikasi kuat bahwa layanan DHCP lokal padam atau kabel LAN tidak terhubung ke segmen server!",
          },
          {
            id: "srv-l1-h2",
            type: "heading",
            level: 2,
            text: "Parameter Scope DHCP: Pool, Gateway, & DNS Server",
          },
          {
            id: "srv-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Server DHCP tidak hanya memberikan sebuah nomor IP! Agar klien dapat langsung berselancar ke Internet, server DHCP harus mendistribusikan sekumpulan parameter konfigurasi yang disebut **DHCP Scope**:\n\n- **IP Address Pool:** Rentang IP yang boleh dipinjamkan (misal: `192.168.1.100` - `192.168.1.200`).\n- **Subnet Mask:** Menentukan batas lokal subnet (misal: `255.255.255.0`).\n- **Default Gateway (Router Option 3):** IP router lokal untuk keluar jaringan (misal: `192.168.1.1`).\n- **DNS Servers (Option 6):** Alamat resolver penunjuk nama domain (misal: `192.168.1.10` atau `8.8.8.8`).\n- **Lease Time:** Durasi peminjaman IP (misal: 2 jam di kafe / 7 hari di kantor).",
          },
          {
            id: "srv-l1-code1",
            type: "code",
            language: "text",
            code: "Contoh Konfigurasi DHCP Server pada Cisco IOS:\n\nRouter(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.9\nRouter(config)# ip dhcp pool TKJ-LAB\nRouter(dhcp-config)# network 192.168.1.0 255.255.255.0\nRouter(dhcp-config)# default-router 192.168.1.1\nRouter(dhcp-config)# dns-server 192.168.1.10 8.8.8.8\nRouter(dhcp-config)# lease 1 0 0\n\nVerifikasi di Klien (Windows Command Prompt):\nC:\\> ipconfig /release\nC:\\> ipconfig /renew",
          },
          {
            id: "srv-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "DHCP Relay Agent (ip helper-address)",
            content:
              "Ingat bahwa paket DHCPDISCOVER adalah Layer 2 broadcast (`FF:FF:FF:FF:FF:FF`). Router secara default TIDAK meneruskan broadcast! Jika server DHCP berada di VLAN atau subnet berbeda, interface router harus diberi perintah `ip helper-address <IP_DHCP_Server>` untuk mengubah broadcast menjadi unicast menuju server.",
          },
          {
            id: "srv-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-srv-l1-q1",
            question: "Manakah urutan kronologis yang benar dari 4 tahap pertukaran pesan DHCP (DORA)?",
            options: [
              { id: "opt-a", text: "Discover -> Offer -> Request -> Acknowledge" },
              { id: "opt-b", text: "Demand -> Offer -> Receive -> Accept" },
              { id: "opt-c", text: "Discover -> Request -> Offer -> Acknowledge" },
              { id: "opt-d", text: "Dial -> Open -> Ready -> Active" },
            ],
            explanation:
              "Siklus DHCP disingkat DORA: Discover (klien mencari), Offer (server menawar), Request (klien meminta), Acknowledge (server menyetujui).",
            xpReward: 10,
          },
          {
            id: "srv-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-srv-l1-q2",
            question: "Protokol transport dan nomor port apakah yang digunakan oleh DHCP Server dan DHCP Client?",
            options: [
              { id: "opt-a", text: "UDP port 67 (Server) dan UDP port 68 (Client)" },
              { id: "opt-b", text: "TCP port 80 (Server) dan TCP port 443 (Client)" },
              { id: "opt-c", text: "UDP port 53 (Server) dan UDP port 53 (Client)" },
              { id: "opt-d", text: "TCP port 21 (Server) dan TCP port 20 (Client)" },
            ],
            explanation:
              "DHCP beroperasi di Layer Transport menggunakan UDP port 67 untuk server dan port 68 untuk klien.",
            xpReward: 10,
          },
          {
            id: "srv-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-srv-l1-q3",
            question: "Ketika laptop siswa dihidupkan, ia mendapatkan alamat IP 169.254.45.88 dan tidak dapat browsing. Apa yang sebenarnya terjadi?",
            options: [
              { id: "opt-a", text: "Laptop gagal menghubungi DHCP Server sehingga Windows memberikan alamat otomatis APIPA" },
              { id: "opt-b", text: "DHCP Server telah berhasil memberikan alamat IP publik global" },
              { id: "opt-c", text: "Kartu jaringan laptop terbakar secara fisik" },
              { id: "opt-d", text: "Router telah mengaktifkan enkripsi VPN IPsec" },
            ],
            explanation:
              "Alamat 169.254.x.x adalah APIPA (Automatic Private IP Addressing) yang aktif saat klien gagal menerima respons DHCP Offer dari server.",
            xpReward: 10,
          },
          {
            id: "srv-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 5",
            keyPoints: [
              "DHCP meminjamkan konfigurasi IP secara dinamis melalui siklus 4-tahap DORA (Discover, Offer, Request, Acknowledge).",
              "DHCP menggunakan protokol UDP port 67 (Server) dan port 68 (Client).",
              "Scope DHCP mendistribusikan parameter krusial: IP Pool, Subnet Mask, Default Gateway, dan DNS Server.",
              "Kegagalan respon DHCP menyebabkan sistem operasi mengaktifkan IP fallback APIPA (169.254.x.x).",
            ],
          },
          {
            id: "srv-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah memahami siklus DORA DHCP dan konfigurasi otomatis IP.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 6: dns-query-resolution (P4-L06)
    // =========================================================================
    {
      id: "lesson-dns-query-resolution",
      slug: "dns-query-resolution",
      title: "Hierarki Domain Name System (DNS) & Resolusi Nama",
      description:
        "Mempelajari struktur pohon hierarki DNS (Root, TLD, Authoritative), rekursi pencarian query, serta jenis-jenis record penting (A, AAAA, CNAME, MX, NS, PTR).",
      orderIndex: 1,
      estimatedMinutes: 15,
      xpReward: 70,
      prerequisites: ["dhcp-dora-process"],
      outcomes: [
        {
          id: "SRV-L2-A",
          text: "Siswa dapat memetakan tingkatan hierarki server DNS mulai dari Root, TLD (.id, .com), hingga Authoritative Name Server.",
        },
        {
          id: "SRV-L2-B",
          text: "Siswa dapat membedakan fungsi berbagai jenis record DNS (A, CNAME, MX, PTR) dalam troubleshooting konektivitas.",
        },
      ],
      evidence: [
        {
          outcomeId: "SRV-L2-A",
          teachingBlockIds: ["srv-l2-h1", "srv-l2-txt1", "srv-l2-callout1"],
          activityIds: ["srv-l2-interactive1"],
          assessmentItemIds: ["quiz-srv-l2-q1", "quiz-srv-l2-q2"],
        },
        {
          outcomeId: "SRV-L2-B",
          teachingBlockIds: ["srv-l2-h2", "srv-l2-txt2", "srv-l2-callout2"],
          activityIds: ["srv-l2-code1"],
          assessmentItemIds: ["quiz-srv-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "srv-l2-h1",
            type: "heading",
            level: 2,
            text: "Struktur Pohon Hierarki DNS: Root, TLD, & Authoritative",
          },
          {
            id: "srv-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Manusia lebih mudah mengingat nama seperti `netloka.biz.id` atau `smkn1.sch.id` dibandingkan deretan angka IP `103.200.4.15`. **Domain Name System (DNS)** bertindak sebagai 'buku telepon internet' yang memetakan nama domain (*Fully Qualified Domain Name / FQDN*) ke alamat IP.\n\nDNS beroperasi menggunakan model database terdistribusi hierarkis berbentuk pohon terbalik (*inverted tree*):\n\n1. **Root Domain (`.`):** Puncak hierarki DNS global, dikelola oleh 13 kumpulan server root berlabel `a.root-servers.net` s.d. `m.root-servers.net`.\n2. **Top-Level Domain (TLD):** Cabang di bawah root, terdiri dari generic TLD (seperti `.com`, `.org`, `.net`) dan country code TLD (seperti `.id` untuk Indonesia, `.jp`, `.uk`).\n3. **Second-Level Domain (SLD):** Nama domain unik yang didaftarkan oleh organisasi atau individu, misalnya `netloka` pada `netloka.biz.id` atau `kemdikbud` pada `kemdikbud.go.id`.\n4. **Subdomain / Hostname:** Pembagian lebih spesifik di dalam domain, misalnya `lms.smkn1.sch.id` atau `mail.google.com`.\n5. **Authoritative Name Server:** Server resmi yang memegang file zona asli (*zone file*) dan berwenang memberikan jawaban pasti atas record domain tersebut.",
          },
          {
            id: "srv-l2-interactive1",
            type: "interactive",
            interactiveType: "dns_query",
            config: {},
          },
          {
            id: "srv-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Recursive Resolver vs Authoritative DNS",
            content:
              "Komputer Anda tidak langsung menghubungi Root Server! Klien meminta bantuan **Recursive Resolver** (seperti DNS ISP atau Google `8.8.8.8`). Resolver inilah yang berkeliling menanyai Root Server -> TLD Server -> Authoritative Server, lalu menyimpan hasilnya di cache lokal.",
          },
          {
            id: "srv-l2-h2",
            type: "heading",
            level: 2,
            text: "Tipe Resource Record DNS: A, AAAA, CNAME, MX, & PTR",
          },
          {
            id: "srv-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Di dalam file zona DNS, informasi disimpan dalam bentuk **Resource Records (RR)**:\n\n- **A Record (Address):** Memetakan nama host ke alamat **IPv4** 32-bit (contoh: `netloka.biz.id` -> `103.200.4.15`).\n- **AAAA Record (Quad-A):** Memetakan nama host ke alamat **IPv6** 128-bit (contoh: `2001:db8::1`).\n- **CNAME Record (Canonical Name):** Membuat nama alias yang menunjuk ke nama domain lain (contoh: `www.netloka.biz.id` adalah alias dari `netloka.biz.id`).\n- **MX Record (Mail Exchange):** Menentukan server penerima email untuk domain bersangkutan beserta prioritasnya.\n- **NS Record (Name Server):** Menentukan server DNS mana yang berwenang (*authoritative*) atas zona domain tersebut.\n- **PTR Record (Pointer):** Digunakan untuk pencarian terbalik (*Reverse DNS lookup*), yaitu memetakan alamat IP kembali ke nama host.",
          },
          {
            id: "srv-l2-code1",
            type: "code",
            language: "text",
            code: "Diagnostik Query DNS Menggunakan Perintah CLI:\n\n1. Memeriksa A Record dengan nslookup (Windows/Linux):\n   C:\\> nslookup netloka.biz.id\n   Server:  dns.google\n   Address:  8.8.8.8\n\n   Non-authoritative answer:\n   Name:    netloka.biz.id\n   Address: 103.200.4.15\n\n2. Memeriksa MX Record dengan dig (Linux):\n   learner@netloka:~$ dig netloka.biz.id MX +short\n   10 mail.netloka.biz.id.",
          },
          {
            id: "srv-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "Kasus Troubleshooting: Bisa Ping IP Tapi Web Tidak Bisa Dibuka",
            content:
              "Jika teknisi bisa melakukan `ping 8.8.8.8` (konektivitas Layer 3 berfungsi sempurna) namun gagal membuka `google.com`, hampir dipastikan 100% masalah berada pada konfigurasi IP DNS Server di komputer atau router!",
          },
          {
            id: "srv-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-srv-l2-q1",
            question: "Manakah server DNS yang memegang basis data zona asli dan berhak memberikan jawaban pasti atas record dari sebuah domain?",
            options: [
              { id: "opt-a", text: "Authoritative Name Server" },
              { id: "opt-b", text: "Recursive Resolver" },
              { id: "opt-c", text: "Root Name Server" },
              { id: "opt-d", text: "Proxy Server" },
            ],
            explanation:
              "Authoritative Name Server adalah server resmi yang menyimpan konfigurasi zona domain aktual dan memberikan respon final definitif atas domain tersebut.",
            xpReward: 10,
          },
          {
            id: "srv-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-srv-l2-q2",
            question: "Manakah tingkatan Top-Level Domain (TLD) pada alamat domain sekolah 'smkn1jakarta.sch.id'?",
            options: [
              { id: "opt-a", text: ".id" },
              { id: "opt-b", text: "sch.id" },
              { id: "opt-c", text: "smkn1jakarta" },
              { id: "opt-d", text: "www" },
            ],
            explanation:
              "Puncak domain setelah tanda titik paling kanan adalah TLD (.id adalah Country Code Top-Level Domain untuk Indonesia).",
            xpReward: 10,
          },
          {
            id: "srv-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-srv-l2-q3",
            question: "Tipe resource record DNS apakah yang digunakan untuk memetakan nama domain ke alamat IPv4 32-bit?",
            options: [
              { id: "opt-a", text: "A Record" },
              { id: "opt-b", text: "AAAA Record" },
              { id: "opt-c", text: "CNAME Record" },
              { id: "opt-d", text: "MX Record" },
            ],
            explanation:
              "A Record (Address Record) memetakan nama host ke alamat IPv4, sedangkan AAAA memetakan ke IPv6.",
            xpReward: 10,
          },
          {
            id: "srv-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 6",
            keyPoints: [
              "DNS menerjemahkan nama domain ramah manusia (FQDN) menjadi alamat IP yang dapat dirutekan oleh jaringan.",
              "Hierarki DNS tersusun dari Root Domain (.), Top-Level Domain (.com, .id), Second-Level Domain, dan Subdomain.",
              "Recursive resolver bertugas menelusuri hierarki server atas nama klien, sedangkan Authoritative Server memegang rekaman resmi.",
              "Record kunci meliputi A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Email), dan PTR (Reverse DNS).",
            ],
          },
          {
            id: "srv-l2-rew",
            type: "reward",
            xp: 70,
            message: "Luar biasa! Anda telah menguasai hierarki DNS dan analisis tipe resource record.",
          },
        ],
      },
    },
  ],
};
