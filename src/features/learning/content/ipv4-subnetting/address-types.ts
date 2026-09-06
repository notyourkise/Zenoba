import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Jenis Alamat (P2-M2)
 *
 * Covers Public vs Private IP (RFC 1918) and Special Diagnostic Addresses (Loopback & APIPA).
 */
export const addressTypesModuleData: CurriculumModule = {
  id: "module-jenis-alamat",
  slug: "jenis-alamat",
  title: "Klasifikasi & Jenis Alamat IPv4",
  description:
    "Mengenal pembagian alamat publik vs privat (RFC 1918), serta fungsi alamat khusus seperti Loopback dan APIPA.",
  orderIndex: 2,
  prerequisites: ["biner-dan-ipv4"],
  outcomes: [
    {
      id: "ADDR-M1",
      text: "Siswa dapat mengklasifikasikan alamat IPv4 ke dalam kategori publik atau privat berdasarkan rentang RFC 1918.",
    },
    {
      id: "ADDR-M2",
      text: "Siswa dapat menganalisis fungsi diagnostik alamat khusus (Loopback dan APIPA) dalam troubleshooting jaringan.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 3: public-private (P2-L03)
    // =========================================================================
    {
      id: "lesson-public-private",
      slug: "public-private",
      title: "Alamat IP Publik vs Privat (RFC 1918)",
      description:
        "Memahami 3 blok alamat privat (Kelas A, B, C) untuk LAN dan mengapa router internet memblokir alamat privat tanpa NAT.",
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["struktur-ipv4"],
      outcomes: [
        {
          id: "ADDR-L3-A",
          text: "Siswa dapat menghafal dan membedakan 3 rentang IP privat standar RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).",
        },
        {
          id: "ADDR-L3-B",
          text: "Siswa dapat menjelaskan fungsi Network Address Translation (NAT) dalam menjembatani IP privat ke internet publik.",
        },
      ],
      evidence: [
        {
          outcomeId: "ADDR-L3-A",
          teachingBlockIds: ["addr-l3-h1", "addr-l3-txt1", "addr-l3-code1", "addr-l3-callout1"],
          activityIds: [],
          assessmentItemIds: ["quiz-addr-l3-q1", "quiz-addr-l3-q2"],
        },
        {
          outcomeId: "ADDR-L3-B",
          teachingBlockIds: ["addr-l3-h2", "addr-l3-txt2"],
          activityIds: [],
          assessmentItemIds: ["quiz-addr-l3-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "addr-l3-h1",
            type: "heading",
            level: 2,
            text: "Kebutuhan Pemisahan IP Publik dan IP Privat",
          },
          {
            id: "addr-l3-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika internet berkembang pesat, disadari bahwa alokasi 4,29 miliar IPv4 tidak akan cukup jika setiap laptop, smartphone, dan printer di dunia diberikan alamat unik global. Untuk menghemat alamat publik, IETF menerbitkan dokumen standar **RFC 1918** yang memesan tiga blok alamat khusus untuk digunakan secara bebas di jaringan lokal (LAN).\n\nAlamat-alamat ini disebut **Alamat IP Privat**. Karakteristik utamanya: alamat privat **tidak dapat dirutekan di internet publik** (*non-routable*). Seluruh router di tulang punggung internet (ISP) akan langsung membuang (*drop*) paket yang memiliki IP asal atau tujuan privat.",
          },
          {
            id: "addr-l3-code1",
            type: "code",
            language: "text",
            code: "========================================================================\n3 RENTANG IP PRIVAT STANDAR RFC 1918 (WAJIB DIHAFAL TEKNISI TKJ)\n========================================================================\n1. Kelas A : 10.0.0.0      s/d  10.255.255.255    (/8  - 16,7 Juta Host)\n2. Kelas B : 172.16.0.0    s/d  172.31.255.255    (/12 - 1,04 Juta Host)\n3. Kelas C : 192.168.0.0   s/d  192.168.255.255   (/16 - 65.536 Host)\n========================================================================",
          },
          {
            id: "addr-l3-callout1",
            type: "callout",
            variant: "info",
            title: "Penerapan di Lingkungan Sekolah & Rumah",
            content:
              "Setiap sekolah atau rumah di Indonesia dapat secara bebas menggunakan rentang `192.168.1.0/24` atau `10.10.0.0/16` secara bersamaan tanpa takut tabrakan IP, karena jaringan LAN Anda terisolasi dari LAN orang lain di balik router gateway.",
          },
          {
            id: "addr-l3-h2",
            type: "heading",
            level: 3,
            text: "Bagaimana PC Ber-IP Privat Mengakses Internet? Peran NAT",
          },
          {
            id: "addr-l3-txt2",
            type: "text",
            format: "markdown",
            content:
              "Jika router ISP membuang IP privat, bagaimana PC lab sekolah Anda dapat membuka Google atau YouTube?\n\nJawabannya adalah **NAT (Network Address Translation)**. Router perbatasan (seperti modem IndiHome atau router MikroTik sekolah) memiliki satu **IP Publik** yang diberikan oleh penyedia ISP. Saat PC siswa mengirim request ke internet, router akan mengganti alamat IP privat PC dengan IP publik miliknya sebelum mengirimkan data ke dunia luar. Ketika balasan tiba, router memetakan kembali paket tersebut ke PC siswa yang tepat.",
          },
          {
            id: "addr-l3-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-addr-l3-q1",
            question: "Manakah dari alamat IPv4 berikut yang termasuk ke dalam rentang IP PRIVAT RFC 1918?",
            options: [
              { id: "opt-a", text: "8.8.8.8" },
              { id: "opt-b", text: "172.20.10.5" },
              { id: "opt-c", text: "172.35.1.1" },
              { id: "opt-d", text: "202.134.0.155" },
            ],
            explanation:
              "Rentang privat Kelas B adalah 172.16.0.0 s.d. 172.31.255.255. Karena angka oktet kedua 20 berada di antara 16 dan 31, maka 172.20.10.5 adalah IP privat. Sedangkan 172.35.1.1 dan 8.8.8.8 adalah IP publik.",
            xpReward: 10,
          },
          {
            id: "addr-l3-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-addr-l3-q2",
            question: "Apa yang akan dilakukan oleh router ISP di internet jika menerima paket data dengan IP tujuan 192.168.1.100?",
            options: [
              { id: "opt-a", text: "Meneruskan paket ke seluruh rumah di dunia via broadcast" },
              { id: "opt-b", text: "Membuang (drop) paket tersebut karena IP privat tidak dapat dirutekan di internet publik" },
              { id: "opt-c", text: "Menyimpan paket di cloud sampai PC target online" },
              { id: "opt-d", text: "Mengonversi IP secara otomatis menjadi alamat MAC" },
            ],
            explanation:
              "Sesuai standar RFC 1918, seluruh router internet publik tidak memiliki entri tabel routing untuk alamat privat dan wajib membuang (drop) paket tersebut demi keamanan dan efisiensi rute global.",
            xpReward: 10,
          },
          {
            id: "addr-l3-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-addr-l3-q3",
            question: "Teknologi apakah pada router gateway yang menerjemahkan banyak IP privat di LAN ke satu IP publik agar dapat mengakses internet?",
            options: [
              { id: "opt-a", text: "DHCP (Dynamic Host Configuration Protocol)" },
              { id: "opt-b", text: "NAT (Network Address Translation)" },
              { id: "opt-c", text: "DNS (Domain Name System)" },
              { id: "opt-d", text: "ARP (Address Resolution Protocol)" },
            ],
            explanation:
              "NAT (Network Address Translation) atau PAT bertugas menerjemahkan alamat IP privat lokal menjadi alamat IP publik yang sah di internet.",
            xpReward: 10,
          },
          {
            id: "addr-l3-sum",
            type: "summary",
            title: "Rangkuman Alamat Publik dan Privat",
            keyPoints: [
              "IP Privat dipesan oleh RFC 1918 untuk jaringan internal LAN: 10.0.0.0/8, 172.16.0.0/12, dan 192.168.0.0/16.",
              "IP Privat bersifat non-routable di internet dan dapat digunakan berulang kali di lokasi organisasi yang berbeda.",
              "IP Publik dialokasikan oleh IANA/APNIC dan harus unik di seluruh dunia agar dapat diakses via internet.",
              "NAT pada router gateway menerjemahkan alamat privat ke publik saat perangkat LAN berkomunikasi ke internet.",
            ],
          },
          {
            id: "addr-l3-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "RFC 1918 Specialist",
            message: "Hebat! Anda kini dapat membedakan alamat IP publik vs privat serta fungsi vital NAT pada gateway.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 4: loopback-apipa (P2-L04)
    // =========================================================================
    {
      id: "lesson-loopback-apipa",
      slug: "loopback-apipa",
      title: "Alamat Khusus: Loopback dan APIPA",
      description:
        "Mempelajari peran diagnostik Loopback (127.0.0.1) untuk pengujian software stack lokal dan APIPA (169.254.x.x) saat DHCP gagal.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["public-private"],
      outcomes: [
        {
          id: "ADDR-L4-A",
          text: "Siswa dapat menjelaskan fungsi rentang Loopback (127.0.0.0/8) untuk memverifikasi kesiapan software stack TCP/IP internal.",
        },
        {
          id: "ADDR-L4-B",
          text: "Siswa dapat mendiagnosis kemunculan alamat APIPA (169.254.0.0/16) sebagai indikasi kegagalan komunikasi dengan server DHCP.",
        },
      ],
      evidence: [
        {
          outcomeId: "ADDR-L4-A",
          teachingBlockIds: ["addr-l4-h1", "addr-l4-txt1", "addr-l4-callout1"],
          activityIds: [],
          assessmentItemIds: ["quiz-addr-l4-q1"],
        },
        {
          outcomeId: "ADDR-L4-B",
          teachingBlockIds: ["addr-l4-h2", "addr-l4-txt2", "addr-l4-code1"],
          activityIds: [],
          assessmentItemIds: ["quiz-addr-l4-q2", "quiz-addr-l4-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "addr-l4-h1",
            type: "heading",
            level: 2,
            text: "Loopback Address: 127.0.0.1 (Self-Test TCP/IP)",
          },
          {
            id: "addr-l4-txt1",
            type: "text",
            format: "markdown",
            content:
              "Seluruh blok alamat yang diawali dengan angka **127** (yaitu rentang `127.0.0.0` s/d `127.255.255.255` atau `127.0.0.0/8`) dipesan secara khusus sebagai **Loopback Address**.\n\nAlamat loopback yang paling terkenal adalah `127.0.0.1` (sering kali dialiaskan sebagai hostname `localhost`). Ketika komputer mengirim paket ke alamat ini, sistem operasi tidak akan mengirim sinyal listrik apa pun keluar melalui kartu jaringan (NIC). Paket langsung diputar balik (*loop back*) di dalam kernel sistem operasi.",
          },
          {
            id: "addr-l4-callout1",
            type: "callout",
            variant: "tip",
            title: "Tips Troubleshooting Teknisi: Ping 127.0.0.1",
            content:
              "Jika sebuah komputer mengalami masalah jaringan, langkah awal diagnosis adalah mengetik `ping 127.0.0.1` di terminal/CMD:\n- Jika **Reply**: Stack driver protokol TCP/IP dan kartu jaringan software dalam kondisi sehat.\n- Jika **Request Timed Out** atau Error: Driver kartu jaringan rusak atau sistem operasi mengalami kerusakan konfigurasi TCP/IP.",
          },
          {
            id: "addr-l4-h2",
            type: "heading",
            level: 3,
            text: "APIPA: 169.254.0.0/16 (Tanda Kegagalan DHCP)",
          },
          {
            id: "addr-l4-txt2",
            type: "text",
            format: "markdown",
            content:
              "Pernahkah Anda melihat laptop Windows menampilkan tanda seru kuning dengan status *No Internet Access*, dan ketika diperiksa di CMD dengan `ipconfig`, alamat IP-nya adalah `169.254.45.180`?\n\nAlamat ini adalah **APIPA (Automatic Private IP Addressing)** atau *Link-Local Address* (`169.254.0.0/16`). Ini adalah mekanisme darurat sistem operasi saat komputer dikonfigurasi menggunakan DHCP (otomatis), namun komputer **gagal menghubungi server DHCP** (misalnya kabel LAN putus, router mati, atau pool IP DHCP habis).",
          },
          {
            id: "addr-l4-code1",
            type: "code",
            language: "text",
            code: "C:\\> ipconfig\n\nEthernet adapter Ethernet 1:\n   Connection-specific DNS Suffix  . :\n   Autoconfiguration IPv4 Address. . : 169.254.120.45  <-- ALAMAT APIPA!\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . :                 <-- KOSONG!",
          },
          {
            id: "addr-l4-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-addr-l4-q1",
            question: "Manakah pernyataan yang paling tepat mengenai fungsi dari alamat loopback 127.0.0.1?",
            options: [
              { id: "opt-a", text: "Alamat untuk menghubungkan komputer ke server gateway internet" },
              { id: "opt-b", text: "Alamat internal untuk menguji apakah stack protokol TCP/IP pada komputer lokal berfungsi dengan benar" },
              { id: "opt-c", text: "Alamat cadangan darurat saat server DHCP mati" },
              { id: "opt-d", text: "Alamat untuk melakukan broadcast ke seluruh perangkat di switch" },
            ],
            explanation:
              "127.0.0.1 adalah alamat loopback lokal yang memutar balik paket di dalam komputer untuk memverifikasi fungsi stack TCP/IP tanpa mengirim data ke kabel fisik.",
            xpReward: 10,
          },
          {
            id: "addr-l4-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-addr-l4-q2",
            question: "Seorang siswa TKJ menyambungkan PC ke switch lab dan mendapatkan IP 169.254.80.200. Apakah akar masalah yang paling mungkin?",
            options: [
              { id: "opt-a", text: "PC terkena virus yang mengubah konfigurasi IP" },
              { id: "opt-b", text: "Komputer berhasil terhubung langsung ke satelit internet" },
              { id: "opt-c", text: "Komputer gagal berkomunikasi atau tidak mendapatkan respon dari DHCP Server" },
              { id: "opt-d", text: "Kapasitas hard disk komputer telah penuh" },
            ],
            explanation:
              "Rentang 169.254.x.x adalah APIPA (Automatic Private IP Addressing) yang digenerate otomatis oleh Windows saat klien DHCP tidak menerima respon penawaran IP dari server DHCP.",
            xpReward: 10,
          },
          {
            id: "addr-l4-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-addr-l4-q3",
            question: "Apakah perangkat yang mendapatkan alamat APIPA (169.254.x.x) dapat mengakses website di internet secara langsung?",
            options: [
              { id: "opt-a", text: "Bisa, karena APIPA adalah IP publik generasi terbaru" },
              { id: "opt-b", text: "Tidak bisa, karena alamat APIPA tidak memiliki konfigurasi Default Gateway yang valid dan tidak dirutekan ke luar" },
              { id: "opt-c", text: "Bisa, asalkan menggunakan kabel serat optik" },
              { id: "opt-d", text: "Bisa, namun kecepatan internet dibatasi maksimal 10 Mbps" },
            ],
            explanation:
              "Alamat APIPA bersifat link-local tanpa Default Gateway, sehingga hanya dapat berkomunikasi dengan sesama host di satu segmen lokal yang sama dan tidak dapat mengakses internet.",
            xpReward: 10,
          },
          {
            id: "addr-l4-sum",
            type: "summary",
            title: "Rangkuman Alamat Khusus",
            keyPoints: [
              "Blok 127.0.0.0/8 (terutama 127.0.0.1) adalah Loopback untuk uji mandiri software stack TCP/IP perangkat lokal.",
              "Blok 169.254.0.0/16 adalah APIPA yang ditetapkan sistem operasi saat gagal berkomunikasi dengan server DHCP.",
              "Kemunculan alamat APIPA adalah bukti diagnostik jelas bahwa jalur fisik ke DHCP server terputus atau pool DHCP habis.",
            ],
          },
          {
            id: "addr-l4-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "Diagnostic Detective",
            message: "Keren! Anda kini dapat mendiagnosis loopback stack internal dan kegagalan DHCP melalui APIPA.",
          },
        ],
      },
    },
  ],
};
