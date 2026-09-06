import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Konsep VLAN & Segmentasi Trafik (P3-M3)
 *
 * Covers Broadcast Domains, VLAN fundamentals, traffic isolation,
 * and port assignment into VLAN IDs.
 */
export const vlanSegmentationModuleData: CurriculumModule = {
  id: "module-vlan-dan-segmentasi",
  slug: "vlan-dan-segmentasi",
  title: "Konsep VLAN & Segmentasi Trafik",
  description:
    "Pelajari mengapa jaringan modern membutuhkan VLAN untuk membatasi broadcast storm, mengamankan data antar-departemen, serta mempartisi switch fisik secara logis.",
  orderIndex: 3,
  prerequisites: ["module-arp-dan-broadcast"],
  outcomes: [
    {
      id: "VLAN-M1",
      text: "Siswa dapat menjelaskan batasan broadcast domain dan alasan teknis pemisahan departemen/keamanan jaringan menggunakan VLAN.",
    },
    {
      id: "VLAN-M2",
      text: "Siswa dapat mengelompokkan port switch ke dalam ID VLAN tertentu (1-4094) dan memverifikasi isolasi trafik Layer 2 antar-VLAN.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 5: broadcast-domain-vlan (P3-L05)
    // =========================================================================
    {
      id: "lesson-broadcast-domain-vlan",
      slug: "broadcast-domain-vlan",
      title: "Broadcast Domain & Mengapa Butuh VLAN",
      description:
        "Memahami definisi broadcast domain, bahaya broadcast storm di LAN besar, dan bagaimana VLAN memecah domain broadcast secara logis.",
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["local-remote-destination"],
      outcomes: [
        {
          id: "VLAN-L1-A",
          text: "Siswa dapat mendefinisikan batas broadcast domain pada switch fisik dan menganalisis dampak negatif ukuran broadcast domain yang terlalu besar.",
        },
        {
          id: "VLAN-L1-B",
          text: "Siswa dapat menjelaskan fungsi VLAN (Virtual Local Area Network) dalam membagi switch fisik menjadi beberapa jaringan logis yang terisolasi.",
        },
      ],
      evidence: [
        {
          outcomeId: "VLAN-L1-A",
          teachingBlockIds: ["vlan-l1-h1", "vlan-l1-txt1", "vlan-l1-callout1"],
          activityIds: ["vlan-l1-act1"],
          assessmentItemIds: ["quiz-vlan-l1-q1", "quiz-vlan-l1-q2"],
        },
        {
          outcomeId: "VLAN-L1-B",
          teachingBlockIds: ["vlan-l1-h2", "vlan-l1-txt2", "vlan-l1-callout2"],
          activityIds: ["vlan-l1-act1"],
          assessmentItemIds: ["quiz-vlan-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "vlan-l1-h1",
            type: "heading",
            level: 2,
            text: "Apa Itu Broadcast Domain?",
          },
          {
            id: "vlan-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "**Broadcast Domain** adalah area jangkauan jaringan di mana jika satu komputer memancarkan frame broadcast (seperti ARP request atau DHCP discover), seluruh komputer lain di dalam area tersebut akan menerima dan memproses salinan frame tersebut.\n\nPada switch biasa tanpa konfigurasi khusus (*flat network*), **seluruh port switch berada di dalam 1 broadcast domain yang sama**. Jika ada 100 komputer tersambung pada switch tersebut, satu broadcast dari PC 1 akan mengganggu dan membebani CPU dari 99 komputer lainnya!",
          },
          {
            id: "vlan-l1-callout1",
            type: "callout",
            variant: "warning",
            title: "Bahaya Broadcast Storm & Kelemahan Flat Network",
            content:
              "1. **Penurunan Performa (Overhead CPU):** Setiap kartu jaringan dipaksa menyela CPU host untuk membaca paket broadcast yang seringkali bukan untuk dirinya.\n2. **Ketiadaan Keamanan:** Siswa di lab komputer sekolah dapat menyadap (*sniffing*) atau membanjiri trafik komputer guru dan ruang Tata Usaha jika berada dalam satu broadcast domain.\n3. **Broadcast Storm:** Jika terjadi loop kabel atau virus yang membanjiri broadcast, seluruh jaringan sekolah bisa lumpuh seketika.",
          },
          {
            id: "vlan-l1-act1",
            type: "interactive",
            interactiveType: "vlan_builder",
            config: {
              title: "Simulator Segmentasi Port VLAN",
            },
          },
          {
            id: "vlan-l1-h2",
            type: "heading",
            level: 2,
            text: "Solusi Cerdas: Virtual Local Area Network (VLAN)",
          },
          {
            id: "vlan-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Di masa lalu, memisahkan broadcast domain harus membeli switch fisik baru yang berbeda untuk tiap departemen. Cara ini sangat boros biaya dan kabel.\n\nDengan **VLAN** (*Virtual LAN*), kita dapat membagi **satu switch fisik tunggal** menjadi beberapa switch logis yang sepenuhnya independen dan terisolasi. Port 1-10 bisa menjadi switch untuk Guru, dan Port 11-24 menjadi switch untuk Siswa!",
          },
          {
            id: "vlan-l1-callout2",
            type: "callout",
            variant: "info",
            title: "Aturan Emas VLAN: 1 VLAN = 1 Broadcast Domain = 1 Subnet IP",
            content:
              "Dalam praktik arsitektur jaringan standar:\n- Setiap VLAN memiliki **nomor ID VLAN** yang unik.\n- Setiap VLAN membentuk **1 broadcast domain** tersendiri.\n- Setiap VLAN diasosiasikan dengan **1 subnet IP khusus** (misal VLAN 10 = `192.168.10.0/24`, VLAN 20 = `192.168.20.0/24`).",
          },
          {
            id: "vlan-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlan-l1-q1",
            question: "Apa pengertian dari Broadcast Domain dalam jaringan komputer?",
            options: [
              { id: "opt-a", text: "Area jaringan di mana frame broadcast yang dikirim satu host akan diterima oleh semua host lain di area tersebut" },
              { id: "opt-b", text: "Jarak maksimum kabel UTP yang diperbolehkan standar IEEE 802.3 (100 meter)" },
              { id: "opt-c", text: "Daftar situs web yang diblokir oleh firewall router" },
              { id: "opt-d", text: "Jumlah kapasitas memori RAM yang digunakan oleh switch untuk tabel MAC" },
            ],
            explanation:
              "Broadcast Domain mencakup semua perangkat yang dapat menerima frame broadcast Layer 2 yang dipancarkan oleh salah satu anggotanya.",
            xpReward: 10,
          },
          {
            id: "vlan-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlan-l1-q2",
            question: "Manakah dampak negatif yang terjadi jika sebuah kantor dengan 300 komputer menggunakan Flat Network (tanpa VLAN)?",
            options: [
              { id: "opt-a", text: "Komputer tidak dapat menyala karena kekurangan daya listrik" },
              { id: "opt-b", text: "Trafik broadcast yang berlebihan membebani CPU seluruh komputer dan menurunkan performa jaringan" },
              { id: "opt-c", text: "Kecepatan kabel tembaga otomatis turun menjadi 10 Kbps" },
              { id: "opt-d", text: "Alamat MAC komputer akan berubah menjadi angka desimal" },
            ],
            explanation:
              "Di jaringan tanpa segmentasi VLAN, setiap broadcast diproses oleh seluruh 300 komputer, menimbulkan overhead CPU dan risiko kelumpuhan jaringan (*broadcast storm*).",
            xpReward: 10,
          },
          {
            id: "vlan-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlan-l1-q3",
            question: "Bagaimana cara kerja teknologi VLAN dalam menyelesaikan masalah broadcast domain?",
            options: [
              { id: "opt-a", text: "Menghapus seluruh fitur broadcast dari protokol TCP/IP" },
              { id: "opt-b", text: "Memecah satu switch fisik menjadi beberapa segmen jaringan logis yang broadcast-nya terisolasi" },
              { id: "opt-c", text: "Mengganti kabel LAN tembaga menjadi serat optik tanpa switch" },
              { id: "opt-d", text: "Memaksa setiap komputer menggunakan dua kartu jaringan sekaligus" },
            ],
            explanation:
              "VLAN membagi switch fisik menjadi beberapa broadcast domain logis, sehingga broadcast di satu VLAN tidak akan pernah bocor ke VLAN lainnya.",
            xpReward: 10,
          },
          {
            id: "vlan-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 5",
            keyPoints: [
              "Secara default, seluruh port switch berada di dalam satu broadcast domain yang sama.",
              "Ukuran broadcast domain yang terlalu besar menyebabkan degradasi performa dan kerentanan keamanan.",
              "VLAN memungkinkan pemisahan broadcast domain secara logis di dalam satu switch fisik.",
              "Prinsip best practice: 1 VLAN mewakili 1 broadcast domain dan diasosiasikan dengan 1 subnet IP tersendiri.",
            ],
          },
          {
            id: "vlan-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda memahami fungsi penting VLAN dalam membatasi broadcast domain.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 6: vlan-membership (P3-L06)
    // =========================================================================
    {
      id: "lesson-vlan-membership",
      slug: "vlan-membership",
      title: "VLAN ID, Penamaan, dan Pengelompokan Port",
      description:
        "Mempelajari rentang VLAN ID (1-4094), aturan VLAN default (VLAN 1), penamaan departemen, dan pembuktian isolasi Layer 2.",
      orderIndex: 1,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["broadcast-domain-vlan"],
      outcomes: [
        {
          id: "VLAN-L2-A",
          text: "Siswa dapat mengidentifikasi rentang VLAN ID (Normal Range 1-1005, Extended Range 1006-4094, dan VLAN 1 default).",
        },
        {
          id: "VLAN-L2-B",
          text: "Siswa dapat memverifikasi bahwa dua perangkat yang berada pada switch yang sama tetapi berbeda VLAN tidak dapat berkomunikasi secara Layer 2.",
        },
      ],
      evidence: [
        {
          outcomeId: "VLAN-L2-A",
          teachingBlockIds: ["vlan-l2-h1", "vlan-l2-txt1", "vlan-l2-callout1"],
          activityIds: ["vlan-l2-code1"],
          assessmentItemIds: ["quiz-vlan-l2-q1", "quiz-vlan-l2-q2"],
        },
        {
          outcomeId: "VLAN-L2-B",
          teachingBlockIds: ["vlan-l2-h2", "vlan-l2-txt2", "vlan-l2-callout2"],
          activityIds: ["vlan-l2-code2"],
          assessmentItemIds: ["quiz-vlan-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "vlan-l2-h1",
            type: "heading",
            level: 2,
            text: "Rentang VLAN ID & Karakteristik VLAN 1",
          },
          {
            id: "vlan-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Setiap VLAN diidentifikasi oleh angka integer 12-bit bernama **VLAN ID** (VID), yang memiliki rentang kemungkinan dari **1 hingga 4094**.\n\nRentang ini secara industri dibagi menjadi dua kategori:\n- **Normal Range (1 s.d. 1005):** Digunakan di jaringan skala kecil hingga enterprise umum. VLAN 1002-1005 dicadangkan untuk legacy (Token Ring/FDDI).\n- **Extended Range (1006 s.d. 4094):** Digunakan oleh penyedia layanan (ISP) dan data center berskala besar.",
          },
          {
            id: "vlan-l2-code1",
            type: "code",
            language: "text",
            code: "Rentang VLAN ID (Standard IEEE 802.1Q):\n+-------------+-----------------------------------------------------------+\n| VLAN ID     | Keterangan Penggunaan                                     |\n+-------------+-----------------------------------------------------------+\n| 0, 4095     | Dicadangkan untuk keperluan protokol sistem internal.    |\n| 1           | Default VLAN (Semua port switch bawaan berada di sini).  |\n| 2 - 1001    | Normal Range untuk user / departemen kustom.              |\n| 1002 - 1005 | Dicadangkan untuk Token Ring & FDDI.                      |\n| 1006 - 4094 | Extended Range untuk ISP / Enterprise skala besar.       |\n+-------------+-----------------------------------------------------------+",
          },
          {
            id: "vlan-l2-callout1",
            type: "callout",
            variant: "warning",
            title: "Fakta Penting Mengenai VLAN 1",
            content:
              "- Saat switch baru dinyalakan dari pabrik, **seluruh port berstatus anggota VLAN 1**.\n- VLAN 1 **tidak bisa dihapus** dan **tidak bisa diganti namanya**.\n- Untuk keamanan terbaik di sekolah atau kantor, jangan gunakan VLAN 1 untuk workstation pengguna biasa!",
          },
          {
            id: "vlan-l2-h2",
            type: "heading",
            level: 2,
            text: "Pengelompokan Port & Isolasi Layer 2",
          },
          {
            id: "vlan-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Ketika administrator mengonfigurasi switch:\n- Port 1 s.d. 12 dimasukkan ke **VLAN 10 (Nama: GURU)**.\n- Port 13 s.d. 24 dimasukkan ke **VLAN 20 (Nama: SISWA)**.\n\nSecara arsitektur Layer 2:\n- Komputer Guru di Port 1 bisa ping ke Komputer Guru di Port 2 (keduanya di VLAN 10).\n- Komputer Guru di Port 1 **TIDAK BISA** ping ke Komputer Siswa di Port 13, meskipun tertancap di satu fisik switch yang sama dan berjarak hanya 2 centimeter!\n- Switch menolak meneruskan frame antar-VLAN di Layer 2.",
          },
          {
            id: "vlan-l2-code2",
            type: "code",
            language: "text",
            code: "Tabel Konfigurasi VLAN Sekolah:\n+---------+-------------+--------------------+----------------+\n| VLAN ID |  Nama VLAN  | Subnet IPv4        | Anggota Port   |\n+---------+-------------+--------------------+----------------+\n|   10    | GURU_STAFF  | 192.168.10.0/24    | Fa0/1 - Fa0/12 |\n|   20    | SISWA_LAB   | 192.168.20.0/24    | Fa0/13 - Fa0/24|\n+---------+-------------+--------------------+----------------+\nUji Komunikasi Layer 2 murni:\n- PC Port 1 (VLAN 10) ---> PC Port 5 (VLAN 10) : TERHUBUNG (Success)\n- PC Port 1 (VLAN 10) ---> PC Port 15 (VLAN 20): TERISOLASI (Unreachable)",
          },
          {
            id: "vlan-l2-callout2",
            type: "callout",
            variant: "info",
            title: "Bagaimana Jika Guru dan Siswa Perlu Berkomunikasi?",
            content:
              "Jika staf guru ingin mengirim data ke siswa, lalu lintas **HARUS melalui perangkat Layer 3** (seperti Router atau Layer-3 Switch) yang disebut **Inter-VLAN Routing**. Switch murni Layer 2 tidak akan pernah bisa menghubungkan dua VLAN berbeda secara mandiri!",
          },
          {
            id: "vlan-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlan-l2-q1",
            question: "Berapakah rentang nomor VLAN ID Normal Range yang umum digunakan untuk konfigurasi jaringan pengguna?",
            options: [
              { id: "opt-a", text: "1 hingga 1005" },
              { id: "opt-b", text: "1 hingga 255" },
              { id: "opt-c", text: "1006 hingga 4094" },
              { id: "opt-d", text: "10 hingga 100" },
            ],
            explanation:
              "Normal Range VLAN ID adalah 1 hingga 1005. Nilai 1006 hingga 4094 termasuk dalam Extended Range.",
            xpReward: 10,
          },
          {
            id: "vlan-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlan-l2-q2",
            question: "Manakah pernyataan yang BENAR mengenai karakteristik VLAN 1 pada switch manage?",
            options: [
              { id: "opt-a", text: "VLAN 1 dapat dihapus jika administrator tidak menyukainya" },
              { id: "opt-b", text: "Semua port switch secara default adalah anggota VLAN 1 dan tidak dapat dihapus" },
              { id: "opt-c", text: "VLAN 1 hanya bisa digunakan oleh perangkat router Cisco" },
              { id: "opt-d", text: "VLAN 1 memiliki bandwidth lebih cepat daripada VLAN lainnya" },
            ],
            explanation:
              "VLAN 1 adalah Default VLAN pabrikan tempat semua port switch bernaung sebelum dikonfigurasi ulang. VLAN 1 tidak dapat dihapus.",
            xpReward: 10,
          },
          {
            id: "vlan-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlan-l2-q3",
            question: "PC A terhubung ke Port 2 (VLAN 10) dan PC B terhubung ke Port 8 (VLAN 20) pada switch Layer 2 yang sama. Mengapa PC A tidak bisa ping ke PC B?",
            options: [
              { id: "opt-a", text: "Karena kabel LAN port 8 terlalu panjang" },
              { id: "opt-b", text: "Karena switch Layer 2 mengisolasi broadcast domain dan komunikasi antar-VLAN berbeda" },
              { id: "opt-c", text: "Karena MAC address kedua PC saling bentrok" },
              { id: "opt-d", text: "Karena switch mendeteksi adanya virus di Port 2" },
            ],
            explanation:
              "VLAN memisahkan jaringan di Layer 2. Komputer di VLAN berbeda terisolasi total dan membutuhkan router (Layer 3) untuk dapat saling berkomunikasi.",
            xpReward: 10,
          },
          {
            id: "vlan-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 6",
            keyPoints: [
              "VLAN ID bernilai 12-bit (rentang 1 hingga 4094), dengan normal range 1 s.d. 1005.",
              "VLAN 1 adalah default VLAN pabrikan di mana seluruh port berada pada awalnya, dan tidak dapat dihapus.",
              "Port switch dikelompokkan ke dalam VLAN ID tertentu sesuai kebutuhan departemen.",
              "Perangkat pada VLAN berbeda pada switch Layer 2 murni terisolasi dan memerlukan perangkat Layer 3 untuk Inter-VLAN routing.",
            ],
          },
          {
            id: "vlan-l2-rew",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda memahami pengelompokan port VLAN dan prinsip isolasi Layer 2.",
          },
        ],
      },
    },
  ],
};
