import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Mask & CIDR (P2-M3)
 *
 * Covers subnet mask bitmasking, bitwise AND logic, CIDR prefix notation (/8 to /30), and same-subnet reachability.
 */
export const maskCidrModuleData: CurriculumModule = {
  id: "module-mask-dan-cidr",
  slug: "mask-dan-cidr",
  title: "Subnet Mask & Notasi CIDR",
  description:
    "Memahami logika pemisahan network dan host portion melalui subnet mask bitmasking dan notasi prefix panjang CIDR.",
  orderIndex: 3,
  prerequisites: ["jenis-alamat"],
  outcomes: [
    {
      id: "MASK-M1",
      text: "Siswa dapat membedakan porsi network dan host pada alamat IPv4 menggunakan subnet mask biner.",
    },
    {
      id: "MASK-M2",
      text: "Siswa dapat mengonversi notasi CIDR prefix panjang (/8 s/d /30) ke subnet mask desimal dan sebaliknya.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 5: subnet-mask (P2-L05)
    // =========================================================================
    {
      id: "lesson-subnet-mask",
      slug: "subnet-mask",
      title: "Konsep Subnet Mask & Operasi Bitwise AND",
      description:
        "Menjelaskan aturan bitmasking di mana bit 1 berurutan menandai Network dan bit 0 menandai Host, serta logika gerbang AND.",
      orderIndex: 0,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["loopback-apipa"],
      outcomes: [
        {
          id: "MASK-L5-A",
          text: "Siswa dapat mengidentifikasi bit network (bernilai 1 berurutan) dan bit host (bernilai 0) pada subnet mask.",
        },
        {
          id: "MASK-L5-B",
          text: "Siswa dapat melakukan operasi logika bitwise AND antara IP host dan subnet mask untuk mencari Network ID.",
        },
      ],
      evidence: [
        {
          outcomeId: "MASK-L5-A",
          teachingBlockIds: ["mask-l5-h1", "mask-l5-txt1", "mask-l5-callout1"],
          activityIds: [],
          assessmentItemIds: ["quiz-mask-l5-q1"],
        },
        {
          outcomeId: "MASK-L5-B",
          teachingBlockIds: ["mask-l5-h2", "mask-l5-txt2", "mask-l5-code1"],
          activityIds: [],
          assessmentItemIds: ["quiz-mask-l5-q2", "quiz-mask-l5-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "mask-l5-h1",
            type: "heading",
            level: 2,
            text: "Mengapa Alamat IP Selalu Memerlukan Subnet Mask?",
          },
          {
            id: "mask-l5-txt1",
            type: "text",
            format: "markdown",
            content:
              "Alamat IPv4 seperti `192.168.1.10` tidak dapat berdiri sendiri. Tanpa **Subnet Mask**, komputer dan router tidak dapat mengetahui mana bagian yang menunjukkan **identitas jaringan (Network Portion)** dan mana bagian yang menunjukkan **identitas nomor perangkat (Host Portion)**.\n\nIbaratkan alamat rumah: *Jl. Merdeka No. 45*. Subnet mask adalah pembatas yang memberi tahu tukang pos bahwa *Jl. Merdeka* adalah nama wilayah jalannya, sedangkan *No. 45* adalah nomor rumah spesifik di jalan tersebut.",
          },
          {
            id: "mask-l5-callout1",
            type: "callout",
            variant: "warning",
            title: "Aturan Wajib Subnet Mask: Bit 1 Tidak Boleh Putus",
            content:
              "Dalam bentuk biner 32-bit, subnet mask HARUS selalu berupa deretan angka **1 yang bersambung tanpa putus dari kiri**, diikuti oleh deretan angka **0 hingga akhir**.\n\nContoh Subnet Mask Sah:\n- `255.255.255.0` -> `11111111.11111111.11111111.00000000` (24 bit angka 1)\n- `255.255.255.192` -> `11111111.11111111.11111111.11000000` (26 bit angka 1)\n\nMask seperti `255.255.0.255` adalah **TIDAK SAH** karena bit 1 terputus oleh angka 0 di tengah!",
          },
          {
            id: "mask-l5-h2",
            type: "heading",
            level: 3,
            text: "Bagaimana Komputer Menemukan Network ID? (Bitwise AND)",
          },
          {
            id: "mask-l5-txt2",
            type: "text",
            format: "markdown",
            content:
              "Setiap kali komputer hendak mengirim paket data, kartu jaringan menjalankan operasi logika **Bitwise AND** antara Alamat IP tujuan dengan Subnet Mask miliknya:\n- Aturan Gerbang AND: Hasil hanya `1` jika kedua bit bernilai `1`. Jika salah satu atau keduanya `0`, hasilnya adalah `0`.\n\nPerhatikan contoh kalkulasi biner di bawah ini:",
          },
          {
            id: "mask-l5-code1",
            type: "code",
            language: "text",
            code: "Alamat IP   : 192.168.  1. 10 -> 11000000.10101000.00000001.00001010\nSubnet Mask : 255.255.255.  0 -> 11111111.11111111.11111111.00000000\n------------------------------------------------------------------------- (AND)\nNetwork ID  : 192.168.  1.  0 -> 11000000.10101000.00000001.00000000\n\nHasil: Seluruh bit di bawah angka mask 1 tetap utuh, sedangkan bit di bawah angka mask 0 menjadi 0.",
          },
          {
            id: "mask-l5-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mask-l5-q1",
            question: "Manakah nilai subnet mask berikut yang TIDAK SAH secara standar protokol IPv4?",
            options: [
              { id: "opt-a", text: "255.255.255.0" },
              { id: "opt-b", text: "255.255.255.128" },
              { id: "opt-c", text: "255.255.0.255" },
              { id: "opt-d", text: "255.255.254.0" },
            ],
            explanation:
              "Subnet mask 255.255.0.255 dalam biner adalah 11111111.11111111.00000000.11111111. Mask ini tidak sah karena bit angka 1 terputus oleh deretan angka 0 di oktet ketiga.",
            xpReward: 10,
          },
          {
            id: "mask-l5-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mask-l5-q2",
            question: "Pada subnet mask biner, apakah fungsi dari bit-bit yang bernilai 1?",
            options: [
              { id: "opt-a", text: "Menandai porsi Network ID (alamat jaringan)" },
              { id: "opt-b", text: "Menandai porsi Host ID (nomor komputer)" },
              { id: "opt-c", text: "Menandai alamat server DNS" },
              { id: "opt-d", text: "Menandai batas kecepatan bandwidth" },
            ],
            explanation:
              "Bit bernilai 1 pada subnet mask menandai porsi Network, sedangkan bit bernilai 0 menandai porsi Host.",
            xpReward: 10,
          },
          {
            id: "mask-l5-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mask-l5-q3",
            question: "Berapa hasil operasi bitwise AND antara IP 10.10.5.20 dengan subnet mask 255.255.0.0?",
            options: [
              { id: "opt-a", text: "10.0.0.0" },
              { id: "opt-b", text: "10.10.0.0" },
              { id: "opt-c", text: "10.10.5.0" },
              { id: "opt-d", text: "10.10.5.20" },
            ],
            explanation:
              "Subnet mask 255.255.0.0 menyalin dua oktet pertama (10.10) dan me-nolkan dua oktet terakhir (5.20 -> 0.0), menghasilkan Network ID 10.10.0.0.",
            xpReward: 10,
          },
          {
            id: "mask-l5-sum",
            type: "summary",
            title: "Rangkuman Subnet Mask",
            keyPoints: [
              "Subnet mask memisahkan alamat IPv4 menjadi Network Portion dan Host Portion.",
              "Bit bernilai 1 pada mask selalu bersambung dari kiri dan menandai porsi jaringan.",
              "Operasi logika bitwise AND antara IP dan Mask digunakan kartu jaringan untuk menghitung Network ID.",
            ],
          },
          {
            id: "mask-l5-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "Bitmask Champion",
            message: "Hebat! Anda telah menguasai aturan penulisan subnet mask dan mekanisme bitwise AND.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 6: cidr-notation (P2-L06)
    // =========================================================================
    {
      id: "lesson-cidr-notation",
      slug: "cidr-notation",
      title: "Notasi CIDR (Classless Inter-Domain Routing)",
      description:
        "Mengonversi notasi prefix slash (/8 s/d /30) ke desimal bertitik dan mengevaluasi apakah dua perangkat berada dalam satu subnet.",
      orderIndex: 1,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["subnet-mask"],
      outcomes: [
        {
          id: "MASK-L6-A",
          text: "Siswa dapat mengonversi representasi prefix CIDR (/8 s/d /30) ke subnet mask desimal bertitik.",
        },
        {
          id: "MASK-L6-B",
          text: "Siswa dapat menentukan apakah dua perangkat dapat berkomunikasi langsung di Layer 2 berdasarkan kesamaan subnet.",
        },
      ],
      evidence: [
        {
          outcomeId: "MASK-L6-A",
          teachingBlockIds: ["mask-l6-h1", "mask-l6-txt1", "mask-l6-code1"],
          activityIds: [],
          assessmentItemIds: ["quiz-mask-l6-q1", "quiz-mask-l6-q2"],
        },
        {
          outcomeId: "MASK-L6-B",
          teachingBlockIds: ["mask-l6-h2", "mask-l6-txt2"],
          activityIds: [],
          assessmentItemIds: ["quiz-mask-l6-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "mask-l6-h1",
            type: "heading",
            level: 2,
            text: "Dari Era Classful ke Notasi CIDR (Prefix-Length)",
          },
          {
            id: "mask-l6-txt1",
            type: "text",
            format: "markdown",
            content:
              "Pada era awal internet (tahun 1980-an), alamat IP dibagi kaku dalam sistem **Classful**: Kelas A (/8), Kelas B (/16), dan Kelas C (/24). Sistem ini sangat boros. Misalnya sebuah perusahaan yang membutuhkan 300 komputer terpaksa diberikan blok Kelas B yang berkapasitas 65.534 IP, membuang lebih dari 65.000 IP secara sia-sia!\n\nTahun 1993, diperkenalkan standar **CIDR (Classless Inter-Domain Routing)** via RFC 1519. CIDR mengizinkan pemotongan subnet pada panjang bit berapapun, direpresentasikan dengan tanda garis miring (**/**) diikuti jumlah bit 1 pada subnet mask (*prefix length*), contohnya: `192.168.1.0/24`.",
          },
          {
            id: "mask-l6-code1",
            type: "code",
            language: "text",
            code: "TABEL KONVERSI CIDR KE SUBNET MASK DESIMAL (OKTET TERAKHIR):\n------------------------------------------------------------\nPrefix | Subnet Mask Biner (Oktet 4) | Nilai Desimal | Sisa Host Bit\n------------------------------------------------------------\n/24    | 00000000                    | .0            | 8 bit\n/25    | 10000000                    | .128          | 7 bit\n/26    | 11000000                    | .192          | 6 bit\n/27    | 11100000                    | .224          | 5 bit\n/28    | 11110000                    | .240          | 4 bit\n/29    | 11111000                    | .248          | 3 bit\n/30    | 11111100                    | .252          | 2 bit (Link P2P Router)\n------------------------------------------------------------",
          },
          {
            id: "mask-l6-h2",
            type: "heading",
            level: 3,
            text: "Evaluasi Komunikasi Lokal Antar-Host",
          },
          {
            id: "mask-l6-txt2",
            type: "text",
            format: "markdown",
            content:
              "Dua perangkat yang terhubung ke switch yang sama hanya dapat saling mengirim paket data secara langsung (Layer 2) **jika dan hanya jika kedua host memiliki Network ID yang sama**:\n\n- **Host A:** `192.168.1.10/24` -> Network ID: `192.168.1.0`\n- **Host B:** `192.168.1.50/24` -> Network ID: `192.168.1.0`\n  -> **DAPAT TERHUBUNG LANGSUNG** tanpa router.\n\n- **Host C:** `192.168.2.10/24` -> Network ID: `192.168.2.0`\n  -> **TIDAK BISA TERHUBUNG LANGSUNG**, memerlukan Router (Default Gateway) untuk merutekan paket antar-subnet.",
          },
          {
            id: "mask-l6-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mask-l6-q1",
            question: "Manakah subnet mask desimal bertitik yang setara dengan prefix notasi /26?",
            options: [
              { id: "opt-a", text: "255.255.255.0" },
              { id: "opt-b", text: "255.255.255.128" },
              { id: "opt-c", text: "255.255.255.192" },
              { id: "opt-d", text: "255.255.255.224" },
            ],
            explanation:
              "/26 memiliki 26 bit angka 1. Pada oktet ke-4 terdapat 2 bit angka 1 (11000000 biner = 128 + 64 = 192), sehingga subnet mask-nya adalah 255.255.255.192.",
            xpReward: 10,
          },
          {
            id: "mask-l6-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mask-l6-q2",
            question: "Subnet mask 255.255.255.248 setara dengan prefix CIDR berapakah?",
            options: [
              { id: "opt-a", text: "/27" },
              { id: "opt-b", text: "/28" },
              { id: "opt-c", text: "/29" },
              { id: "opt-d", text: "/30" },
            ],
            explanation:
              "248 dalam biner adalah 11111000 (5 bit angka 1). Ditambah 24 bit dari 3 oktet pertama: 24 + 5 = /29.",
            xpReward: 10,
          },
          {
            id: "mask-l6-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mask-l6-q3",
            question: "PC 1 memiliki IP 10.0.1.5/24 dan PC 2 memiliki IP 10.0.2.5/24 terhubung pada satu switch unmanaged yang sama tanpa router. Apakah kedua PC dapat saling ping?",
            options: [
              { id: "opt-a", text: "Bisa, karena kedua PC sama-sama berawalan 10.0" },
              { id: "opt-b", text: "Bisa, asalkan menggunakan kabel UTP Cat6" },
              { id: "opt-c", text: "Tidak bisa, karena dengan prefix /24, Network ID PC 1 (10.0.1.0) berbeda dengan Network ID PC 2 (10.0.2.0)" },
              { id: "opt-d", text: "Bisa, namun waktu respon ping sangat lambat (> 500ms)" },
            ],
            explanation:
              "Dengan prefix /24, 3 oktet pertama adalah network portion. PC 1 berada di jaringan 10.0.1.0/24 sedangkan PC 2 di 10.0.2.0/24. Karena beda subnet dan tidak ada router, komunikasi langsung Layer 2 akan gagal.",
            xpReward: 10,
          },
          {
            id: "mask-l6-sum",
            type: "summary",
            title: "Rangkuman Notasi CIDR",
            keyPoints: [
              "Notasi CIDR (/n) menunjukkan jumlah bit angka 1 pada subnet mask dari total 32 bit.",
              "CIDR menghilangkan batas kaku sistem classful dan memungkinkan pembagian subnet yang fleksibel.",
              "Dua host hanya dapat berkomunikasi langsung di Layer 2 jika memiliki Network ID yang sama.",
            ],
          },
          {
            id: "mask-l6-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "CIDR Navigator",
            message: "Luar biasa! Anda telah menguasai konversi notasi CIDR dan evaluasi keterjangkauan lokal.",
          },
        ],
      },
    },
  ],
};
