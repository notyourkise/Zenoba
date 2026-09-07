import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Translasi Alamat Jaringan (NAT & PAT) (P4-M4)
 *
 * Covers IPv4 address conservation, Inside/Outside terminology,
 * Static NAT 1-to-1, Dynamic NAT, and Port Address Translation (PAT / NAT Overload).
 */
export const natPatModuleData: CurriculumModule = {
  id: "module-nat-pat",
  slug: "nat-pat",
  title: "Translasi Alamat Jaringan (NAT & PAT)",
  description:
    "Pelajari konsep penyelamat alokasi IPv4: perbedaan Inside/Outside Local & Global, Static NAT 1-to-1, Dynamic NAT, dan Port Address Translation (PAT / NAT Overload).",
  orderIndex: 4,
  prerequisites: ["dhcp-dns"],
  outcomes: [
    {
      id: "NAT-M1",
      text: "Siswa dapat menjelaskan mekanisme translasi alamat IP privat ke publik dan membedakan 4 terminologi alamat NAT.",
    },
    {
      id: "NAT-M2",
      text: "Siswa dapat membandingkan Static NAT dengan PAT (NAT Overload) dan menafsirkan tabel translasi koneksi port Layer 4.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 7: nat-static-dynamic (P4-L07)
    // =========================================================================
    {
      id: "lesson-nat-static-dynamic",
      slug: "nat-static-dynamic",
      title: "Konsep Dasar NAT: Inside/Outside Address & Static NAT",
      description:
        "Memahami mengapa NAT dibutuhkan (krisis kuota IPv4 publik), 4 jenis alamat NAT (Inside Local, Inside Global, Outside Local, Outside Global), dan konfigurasi Static NAT 1-to-1.",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["dns-query-resolution"],
      outcomes: [
        {
          id: "NAT-L1-A",
          text: "Siswa dapat membedakan Inside Local, Inside Global, Outside Local, dan Outside Global dalam skenario perutean enterprise.",
        },
        {
          id: "NAT-L1-B",
          text: "Siswa dapat mengonfigurasi Static NAT 1-to-1 untuk mempublikasikan server lokal ke Internet publik.",
        },
      ],
      evidence: [
        {
          outcomeId: "NAT-L1-A",
          teachingBlockIds: ["nat-l1-h1", "nat-l1-txt1", "nat-l1-callout1"],
          activityIds: ["nat-l1-code1"],
          assessmentItemIds: ["quiz-nat-l1-q1", "quiz-nat-l1-q2"],
        },
        {
          outcomeId: "NAT-L1-B",
          teachingBlockIds: ["nat-l1-h2", "nat-l1-txt2", "nat-l1-callout2"],
          activityIds: ["nat-l1-interactive1"],
          assessmentItemIds: ["quiz-nat-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "nat-l1-h1",
            type: "heading",
            level: 2,
            text: "Mengapa NAT Diciptakan & 4 Terminologi Alamat NAT",
          },
          {
            id: "nat-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ruang alamat IPv4 32-bit hanya memiliki sekitar 4,3 miliar kemungkinan alamat. Dengan ledakan pengguna internet dan perangkat IoT, alamat publik IPv4 telah habis terpakai. Untuk memperpanjang umur IPv4 sebelum adopsi penuh IPv6, diciptakanlah **NAT (Network Address Translation)** yang distandarisasi dalam RFC 1631 dan RFC 3022.\n\nDengan NAT, jaringan lokal dapat menggunakan jutaan alamat **IP Privat** (RFC 1918 seperti `10.0.0.0/8`, `172.16.0.0/12`, dan `192.168.0.0/16`) yang tidak dapat dirutekan di Internet publik. Ketika paket keluar melewati router perbatasan (*border router*), alamat privat tersebut ditranslasikan menjadi alamat **IP Publik** legal.\n\nDalam terminologi NAT Cisco dan industri, terdapat 4 istilah penting:\n\n1. **Inside Local:** Alamat IP privat yang diberikan ke perangkat di dalam jaringan lokal (misal: `192.168.1.50`).\n2. **Inside Global:** Alamat IP publik sah yang mewakili perangkat internal ke dunia luar Internet (misal: `203.0.113.5`).\n3. **Outside Local:** Alamat IP perangkat luar seperti yang dilihat oleh jaringan internal (biasanya sama dengan Outside Global).\n4. **Outside Global:** Alamat IP publik sebenarnya milik server target di Internet (misal: `8.8.8.8`).",
          },
          {
            id: "nat-l1-code1",
            type: "code",
            language: "text",
            code: "Peta Terminologi 4 Alamat NAT:\n\n[ PC Klien ] -------- [ Router NAT ] -------- [ Web Server Internet ]\nInside Local           Perbatasan              Outside Global\n192.168.1.50           Router WAN               203.0.113.80\n      |                     |\n      +-> Ditranslasikan -> +-> Inside Global (203.0.113.5)",
          },
          {
            id: "nat-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Keamanan Alamat Privat",
            content:
              "Karena alamat IP privat tidak pernah disebarkan dalam tabel routing BGP Internet global, host lokal yang berada di balik NAT secara alami terlindungi dari koneksi masuk asing yang tidak diminta (*unsolicited inbound traffic*).",
          },
          {
            id: "nat-l1-h2",
            type: "heading",
            level: 2,
            text: "Static NAT: Pemetaan 1-ke-1 untuk Membuka Server Publik",
          },
          {
            id: "nat-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "**Static NAT** adalah pemetaan permanen satu-ke-satu (*one-to-one mapping*) antara satu alamat IP privat Inside Local dengan satu alamat IP publik Inside Global.\n\nStatic NAT paling sering digunakan ketika sekolah atau instansi memiliki server internal (misalnya Web Server di IP `192.168.1.100`) dan ingin agar server tersebut dapat diakses oleh publik dari seluruh dunia melalui alamat IP publik resmi `203.0.113.10`.\n\nKarakteristik Static NAT:\n- Pemetaan bersifat dua arah (*bidirectional*): klien luar bisa memulai inisiasi koneksi ke IP publik, dan router akan meneruskannya ke IP privat server.\n- Kelemahan: Sangat boros IP publik! Jika ada 10 server, Anda membutuhkan 10 IP publik unik.",
          },
          {
            id: "nat-l1-interactive1",
            type: "interactive",
            interactiveType: "nat_visualizer",
            config: {},
          },
          {
            id: "nat-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "Konfigurasi Antarmuka NAT Inside & Outside",
            content:
              "Pada router Cisco, perintah translasi tidak akan bekerja jika administrator lupa mendefinisikan interface peran: `ip nat inside` pada port LAN dan `ip nat outside` pada port WAN!",
          },
          {
            id: "nat-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-nat-l1-q1",
            question: "Alamat apakah yang dimaksud dengan 'Inside Local' dalam konsep translasi NAT?",
            options: [
              { id: "opt-a", text: "Alamat IP privat yang terpasang pada host di dalam jaringan internal lokal" },
              { id: "opt-b", text: "Alamat IP publik yang diberikan oleh ISP pada interface WAN" },
              { id: "opt-c", text: "Alamat MAC fisik kartu jaringan router" },
              { id: "opt-d", text: "Alamat IP server web remote di Internet" },
            ],
            explanation:
              "Inside Local adalah alamat IP aktual (biasanya alamat privat RFC 1918) yang dikonfigurasikan pada host di dalam jaringan internal.",
            xpReward: 10,
          },
          {
            id: "nat-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-nat-l1-q2",
            question: "Manakah dari alamat IPv4 berikut ini yang termasuk alamat IP Privat RFC 1918 yang TIDAK dapat dirutekan langsung di Internet publik?",
            options: [
              { id: "opt-a", text: "192.168.50.1" },
              { id: "opt-b", text: "8.8.8.8" },
              { id: "opt-c", text: "1.1.1.1" },
              { id: "opt-d", text: "203.0.113.25" },
            ],
            explanation:
              "192.168.0.0/16 adalah salah satu blok IP privat RFC 1918 (bersama 10.0.0.0/8 dan 172.16.0.0/12) yang wajib ditranslasikan oleh NAT untuk mengakses internet.",
            xpReward: 10,
          },
          {
            id: "nat-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-nat-l1-q3",
            question: "Perintah Cisco manakah yang tepat untuk mengonfigurasi Static NAT satu-ke-satu antara Web Server internal 192.168.1.100 dan IP publik 203.0.113.10?",
            options: [
              { id: "opt-a", text: "ip nat inside source static 192.168.1.100 203.0.113.10" },
              { id: "opt-b", text: "ip route 192.168.1.100 255.255.255.255 203.0.113.10" },
              { id: "opt-c", text: "ip nat pool STATIC 192.168.1.100 203.0.113.10" },
              { id: "opt-d", text: "nat enable 192.168.1.100 to 203.0.113.10" },
            ],
            explanation:
              "Sintaks resmi Cisco IOS untuk Static NAT adalah 'ip nat inside source static <inside_local_ip> <inside_global_ip>'.",
            xpReward: 10,
          },
          {
            id: "nat-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 7",
            keyPoints: [
              "NAT diciptakan untuk mengatasi keterbatasan kuota 32-bit IPv4 dengan menerjemahkan IP privat ke IP publik.",
              "Empat terminologi NAT: Inside Local (IP privat klien), Inside Global (IP publik klien), Outside Local, dan Outside Global (IP publik server target).",
              "Alamat privat RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) tidak dapat dirutekan langsung di Internet publik.",
              "Static NAT memetakan satu IP privat ke satu IP publik secara permanen 1-to-1 untuk kebutuhan hosting server publik.",
            ],
          },
          {
            id: "nat-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai terminologi 4 alamat NAT dan konfigurasi Static NAT.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 8: pat-port-address-translation (P4-L08)
    // =========================================================================
    {
      id: "lesson-pat-port-address-translation",
      slug: "pat-port-address-translation",
      title: "Port Address Translation (PAT) / NAT Overload",
      description:
        "Mempelajari bagaimana ribuan perangkat di jaringan privat dapat berbagi SATU alamat IP publik tunggal menggunakan nomor port transport Layer 4 unik (NAT Overload / Masquerade).",
      orderIndex: 1,
      estimatedMinutes: 16,
      xpReward: 70,
      prerequisites: ["nat-static-dynamic"],
      outcomes: [
        {
          id: "NAT-L2-A",
          text: "Siswa dapat menganalisis cara kerja PAT memetakan kombinasi unik IP:Port internal ke IP publik tunggal dengan port berbeda.",
        },
        {
          id: "NAT-L2-B",
          text: "Siswa dapat membaca tabel translasi NAT router dan mendiagnosis kegagalan koneksi keluar saat NAT overload tidak aktif.",
        },
      ],
      evidence: [
        {
          outcomeId: "NAT-L2-A",
          teachingBlockIds: ["nat-l2-h1", "nat-l2-txt1", "nat-l2-callout1"],
          activityIds: ["nat-l2-interactive1"],
          assessmentItemIds: ["quiz-nat-l2-q1", "quiz-nat-l2-q2"],
        },
        {
          outcomeId: "NAT-L2-B",
          teachingBlockIds: ["nat-l2-h2", "nat-l2-txt2", "nat-l2-callout2"],
          activityIds: ["nat-l2-code1"],
          assessmentItemIds: ["quiz-nat-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "nat-l2-h1",
            type: "heading",
            level: 2,
            text: "Bagaimana Ribuan PC Berbagi Satu IP Publik? Mekanisme PAT",
          },
          {
            id: "nat-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Jika sekolah memiliki 500 komputer di laboratorium dan kantor, tidak mungkin sekolah membeli 500 IP publik dari ISP karena biayanya sangat mahal. Solusi pamungkas yang digunakan di hampir semua router rumahan dan kantor di dunia adalah **Port Address Translation (PAT)**, atau sering disebut **NAT Overload** (di MikroTik dikenal sebagai *Action = Masquerade*).\n\nPAT bekerja dengan memanfaatkan **Nomor Port Layer 4 (TCP / UDP)**. Karena nomor port Layer 4 berukuran 16-bit (tersedia hingga 65.535 port), satu IP publik tunggal secara teoritis dapat melayani ribuan sesi koneksi secara simultan!\n\nProses Translasi PAT:\n1. **PC-1** (`192.168.1.10:49152`) mengirim paket HTTP ke Google (`142.250.190.46:80`).\n2. **Router NAT** mengganti IP sumber menjadi IP publik WAN miliknya (`203.0.113.1`) dan memetakan port sumber ke port unik di tabel NAT (misalnya `203.0.113.1:10001`).\n3. **PC-2** (`192.168.1.20:49152`) juga membuka Google. Port internalnya sama (`49152`), namun router memetakannya ke port WAN yang berbeda (`203.0.113.1:10002`).\n4. Saat balasan dari Google tiba di port `10001`, router memeriksa tabel translasi dan tahu persis bahwa paket tersebut milik PC-1! Begitu pula balasan di port `10002` akan diteruskan ke PC-2.",
          },
          {
            id: "nat-l2-interactive1",
            type: "interactive",
            interactiveType: "nat_visualizer",
            config: {},
          },
          {
            id: "nat-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Kata Kunci 'overload' pada Cisco",
            content:
              "Dalam sintaks Cisco IOS, kata kunci `overload` di akhir perintah `ip nat inside source list 1 interface GigabitEthernet0/0 overload` adalah pembeda mutlak antara Dynamic NAT biasa (yang butuh pool banyak IP) dengan PAT (yang hanya memakai 1 IP interface WAN).",
          },
          {
            id: "nat-l2-h2",
            type: "heading",
            level: 2,
            text: "Membaca Tabel Translasi NAT & Troubleshooting Outage",
          },
          {
            id: "nat-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Sebagai teknisi jaringan, Anda dapat memeriksa koneksi aktif yang sedang ditranslasikan oleh router menggunakan perintah `show ip nat translations`:\n\nJika pengguna di LAN mengeluhkan **'Internet tidak bisa diakses sama sekali'**, namun router lokal bisa melakukan ping ke gateway ISP, salah satu penyebab paling sering adalah:\n1. ACL NAT tidak mencakup subnet baru pengguna.\n2. Kata kunci `overload` tertinggal dalam konfigurasi.\n3. Peran `ip nat inside` atau `ip nat outside` terhapus dari interface router.",
          },
          {
            id: "nat-l2-code1",
            type: "code",
            language: "text",
            code: "Tabel Translasi NAT pada Router Cisco (show ip nat translations):\n\nPro  Inside global         Inside local          Outside local         Outside global\ntcp  203.0.113.1:10001     192.168.1.10:49152    142.250.190.46:80     142.250.190.46:80\ntcp  203.0.113.1:10002     192.168.1.20:49152    142.250.190.46:80     142.250.190.46:80\nicmp 203.0.113.1:1         192.168.1.10:1        8.8.8.8:1             8.8.8.8:1\n\nKonfigurasi Lengkap PAT di Cisco IOS:\nRouter(config)# access-list 1 permit 192.168.1.0 0.0.0.255\nRouter(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload",
          },
          {
            id: "nat-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "NAT Table Exhaustion",
            content:
              "Jika jaringan lokal terinfeksi malware yang membuka ribuan koneksi botnet sekaligus, memori router bisa penuh akibat *NAT table exhaustion*, menyebabkan router berhenti merespons paket dari pengguna yang sah.",
          },
          {
            id: "nat-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-nat-l2-q1",
            question: "Komponen Layer 4 apakah yang dimanfaatkan oleh Port Address Translation (PAT) untuk membedakan trafik dari ratusan host internal yang memakai satu IP publik yang sama?",
            options: [
              { id: "opt-a", text: "Nomor Port Sumber (Source Port Number) Layer 4 (TCP/UDP)" },
              { id: "opt-b", text: "Alamat MAC kartu jaringan" },
              { id: "opt-c", text: "Nilai Time to Live (TTL)" },
              { id: "opt-d", text: "Panjang kabel UTP" },
            ],
            explanation:
              "PAT memetakan kombinasi Inside Local IP dan Source Port unik ke satu Inside Global IP dengan port baru yang unik pada Layer 4.",
            xpReward: 10,
          },
          {
            id: "nat-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-nat-l2-q2",
            question: "Apa istilah yang digunakan oleh MikroTik RouterOS untuk fungsi PAT / NAT Overload pada menu firewall NAT?",
            options: [
              { id: "opt-a", text: "action = masquerade" },
              { id: "opt-b", text: "action = passthrough" },
              { id: "opt-c", text: "action = accept" },
              { id: "opt-d", text: "action = drop" },
            ],
            explanation:
              "Di MikroTik RouterOS, aksi 'masquerade' adalah implementasi PAT yang secara dinamis menggunakan alamat IP dari antarmuka keluar.",
            xpReward: 10,
          },
          {
            id: "nat-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-nat-l2-q3",
            question: "Apa yang terjadi jika perintah NAT Cisco 'ip nat inside source list 1 interface GigabitEthernet0/1' dijalankan TANPA menyertakan kata kunci 'overload'?",
            options: [
              { id: "opt-a", text: "Hanya satu host pertama yang dapat mengakses Internet, host berikutnya akan ditolak karena kehabisan IP publik" },
              { id: "opt-b", text: "Router langsung crash dan me-restart sendiri" },
              { id: "opt-c", text: "Seluruh port switch otomatis menjadi trunk" },
              { id: "opt-d", text: "Kecepatan internet otomatis turun menjadi 10 Mbps" },
            ],
            explanation:
              "Tanpa kata kunci 'overload', router memperlakukan konfigurasi sebagai Dynamic NAT 1-to-1 biasa. Karena hanya ada satu IP antarmuka WAN, hanya perangkat pertama yang mendapat translasi.",
            xpReward: 10,
          },
          {
            id: "nat-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 8",
            keyPoints: [
              "Port Address Translation (PAT) / NAT Overload memungkinkan banyak host internal berbagi satu alamat IP publik sah.",
              "PAT membedakan aliran data menggunakan kombinasi nomor port Layer 4 TCP/UDP unik hingga 65.535 sesi.",
              "Kata kunci 'overload' pada Cisco (atau action 'masquerade' pada MikroTik) mengaktifkan translasi berbasis nomor port.",
              "Perintah 'show ip nat translations' menampilkan tabel pemetaan aktif antara socket internal dan socket eksternal.",
            ],
          },
          {
            id: "nat-l2-rew",
            type: "reward",
            xp: 70,
            message: "Luar biasa! Anda telah memahami cara kerja Port Address Translation (PAT) dan manajemen tabel translasi.",
          },
        ],
      },
    },
  ],
};
