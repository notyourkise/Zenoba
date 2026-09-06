import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Subnetting & VLSM (P2-M5)
 *
 * Covers Fixed Length Subnet Masking (FLSM), borrowing host bits, and Variable Length Subnet Masking (VLSM) allocation.
 */
export const vlsmDesignModuleData: CurriculumModule = {
  id: "module-subnetting-dan-vlsm",
  slug: "subnetting-dan-vlsm",
  title: "Pembagian Subnet (FLSM) & Desain VLSM",
  description:
    "Menerapkan teknik Fixed Length Subnet Masking (FLSM) dan Variable Length Subnet Masking (VLSM) untuk alokasi alamat jaringan efisien.",
  orderIndex: 5,
  prerequisites: ["kalkulasi-subnet"],
  outcomes: [
    {
      id: "VLSM-M1",
      text: "Siswa dapat membagi satu blok jaringan menjadi beberapa subnet berkapasitas sama (FLSM).",
    },
    {
      id: "VLSM-M2",
      text: "Siswa dapat merancang skema pengalamatan VLSM bertingkat berdasarkan kebutuhan host menurun tanpa terjadi tumpang tindih (zero overlap).",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 9: pembagian-subnet (P2-L09)
    // =========================================================================
    {
      id: "lesson-pembagian-subnet",
      slug: "pembagian-subnet",
      title: "Pembagian Subnet Sama Rata (FLSM)",
      description:
        "Konsep meminjam bit host untuk membuat sejumlah subnet bernilai sama rata, misal membagi /24 menjadi empat /26.",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["host-range"],
      outcomes: [
        {
          id: "VLSM-L9-A",
          text: "Siswa dapat menghitung jumlah subnet baru yang tercipta menggunakan rumus 2^s di mana s adalah jumlah bit yang dipinjam.",
        },
        {
          id: "VLSM-L9-B",
          text: "Siswa dapat menyusun tabel pembagian subnet FLSM dengan interval seragam.",
        },
      ],
      evidence: [
        {
          outcomeId: "VLSM-L9-A",
          teachingBlockIds: ["vlsm-l9-h1", "vlsm-l9-txt1", "vlsm-l9-callout1"],
          activityIds: [],
          assessmentItemIds: ["quiz-vlsm-l9-q1"],
        },
        {
          outcomeId: "VLSM-L9-B",
          teachingBlockIds: ["vlsm-l9-h2", "vlsm-l9-txt2", "vlsm-l9-code1"],
          activityIds: [],
          assessmentItemIds: ["quiz-vlsm-l9-q2", "quiz-vlsm-l9-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "vlsm-l9-h1",
            type: "heading",
            level: 2,
            text: "Konsep Meminjam Bit Host untuk Membuat Subnet (FLSM)",
          },
          {
            id: "vlsm-l9-txt1",
            type: "text",
            format: "markdown",
            content:
              "Subnetting adalah proses memecah satu jaringan besar menjadi beberapa sub-jaringan yang lebih kecil dan independen. Pada **FLSM (Fixed Length Subnet Masking)**, seluruh sub-jaringan yang dibuat memiliki ukuran panjang prefix dan jumlah host yang **persis sama**.\n\nPrinsip dasarnya adalah **meminjam $s$ bit dari porsi host** untuk dijadikan porsi network tambahan:\n- Jumlah Subnet Terbentuk = $2^s$\n- Jumlah Host per Subnet = $2^{(h - s)} - 2$",
          },
          {
            id: "vlsm-l9-callout1",
            type: "callout",
            variant: "info",
            title: "Hubungan Tarik-Ulur: Subnet vs Host",
            content:
              "Dalam subnetting berlaku hukum kekekalan bit: **Semakin banyak bit yang dipinjam untuk subnet, semakin sedikit bit yang tersisa untuk host.**\n- Jika pinjam 1 bit: dapat 2 subnet, masing-masing 126 host.\n- Jika pinjam 2 bit: dapat 4 subnet, masing-masing 62 host.\n- Jika pinjam 3 bit: dapat 8 subnet, masing-masing 30 host.",
          },
          {
            id: "vlsm-l9-h2",
            type: "heading",
            level: 3,
            text: "Contoh Kasus: Membagi 192.168.1.0/24 Menjadi 4 Subnet",
          },
          {
            id: "vlsm-l9-txt2",
            type: "text",
            format: "markdown",
            content:
              "Sebuah SMK ingin membagi jaringan lab `192.168.1.0/24` untuk 4 ruangan lab yang masing-masing memiliki 30 PC:\n1. Butuh 4 subnet -> $2^s \\ge 4$ -> $s = 2$ bit dipinjam.\n2. Prefix baru = $/24 + 2 = \\mathbf{/26}$ (Mask: `255.255.255.192`).\n3. Magic number = $256 - 192 = \\mathbf{64}$.\n4. Kapasitas host per subnet = $2^6 - 2 = \\mathbf{62}$ host (mencukupi 30 PC).",
          },
          {
            id: "vlsm-l9-code1",
            type: "code",
            language: "text",
            code: "Tabel Pembagian 4 Subnet FLSM (/26):\n------------------------------------------------------------------------\nSubnet | Network ID     | Usable Host Range            | Broadcast\n------------------------------------------------------------------------\nLab A  | 192.168.1.0    | 192.168.1.1  - 192.168.1.62   | 192.168.1.63\nLab B  | 192.168.1.64   | 192.168.1.65 - 192.168.1.126  | 192.168.1.127\nLab C  | 192.168.1.128  | 192.168.1.129 - 192.168.1.190 | 192.168.1.191\nLab D  | 192.168.1.192  | 192.168.1.193 - 192.168.1.254 | 192.168.1.255\n------------------------------------------------------------------------",
          },
          {
            id: "vlsm-l9-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlsm-l9-q1",
            question: "Jika seorang administrator jaringan meminjam 3 bit host dari jaringan /24, berapa banyak subnet baru yang terbentuk dan berapa prefix barunya?",
            options: [
              { id: "opt-a", text: "6 subnet dengan prefix /27" },
              { id: "opt-b", text: "8 subnet dengan prefix /27" },
              { id: "opt-c", text: "8 subnet dengan prefix /26" },
              { id: "opt-d", text: "16 subnet dengan prefix /28" },
            ],
            explanation:
              "Jumlah subnet = 2^s = 2^3 = 8 subnet. Prefix baru = 24 + 3 = /27.",
            xpReward: 10,
          },
          {
            id: "vlsm-l9-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlsm-l9-q2",
            question: "Apa kelemahan utama dari metode FLSM (Fixed Length Subnet Masking) dalam perancangan jaringan nyata?",
            options: [
              { id: "opt-a", text: "Tidak dapat digunakan pada perangkat switch modern" },
              { id: "opt-b", text: "Seluruh subnet berukuran seragam sehingga terjadi pemborosan IP jika kebutuhan tiap departemen berbeda jauh" },
              { id: "opt-c", text: "Menyebabkan tabrakan paket data di kabel jaringan" },
              { id: "opt-d", text: "Hanya bisa diterapkan pada jaringan internet satelit" },
            ],
            explanation:
              "Kelemahan FLSM adalah semua subnet dipaksa berukuran sama. Misalnya, link antar-router yang hanya butuh 2 host tetap diberi blok /26 (62 host), membuang 60 IP secara percuma.",
            xpReward: 10,
          },
          {
            id: "vlsm-l9-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlsm-l9-q3",
            question: "Sebuah jaringan 172.16.0.0/16 dibagi menjadi subnet-subnet berukuran /24. Berapakah jumlah subnet /24 yang dapat dibuat dari jaringan tersebut?",
            options: [
              { id: "opt-a", text: "128 subnet" },
              { id: "opt-b", text: "256 subnet" },
              { id: "opt-c", text: "512 subnet" },
              { id: "opt-d", text: "1024 subnet" },
            ],
            explanation:
              "Bit yang dipinjam = 24 - 16 = 8 bit. Jumlah subnet terbentuk = 2^8 = 256 subnet.",
            xpReward: 10,
          },
          {
            id: "vlsm-l9-sum",
            type: "summary",
            title: "Rangkuman FLSM",
            keyPoints: [
              "FLSM membagi jaringan menjadi beberapa subnet dengan panjang mask dan kapasitas yang seragam.",
              "Rumus pembagian: 2^s menghasilkan jumlah subnet baru dari s bit yang dipinjam.",
              "Kelemahan FLSM adalah pemborosan IP ketika kebutuhan host antar-ruangan tidak seimbang.",
            ],
          },
          {
            id: "vlsm-l9-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "FLSM Architect",
            message: "Hebat! Anda telah menguasai konsep dasar pembagian subnet seragam (FLSM).",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 10: vlsm-design (P2-L10)
    // =========================================================================
    {
      id: "lesson-vlsm-design",
      slug: "vlsm-design",
      title: "Desain Jaringan Fleksibel dengan VLSM",
      description:
        "Strategi pengalamatan hemat alamat IP dengan mengalokasikan subnet dari kebutuhan terbesar ke terkecil tanpa overlap.",
      orderIndex: 1,
      estimatedMinutes: 20,
      xpReward: 60,
      prerequisites: ["pembagian-subnet"],
      outcomes: [
        {
          id: "VLSM-L10-A",
          text: "Siswa dapat mengurutkan kebutuhan departemen dari yang terbesar ke terkecil sebagai aturan emas VLSM.",
        },
        {
          id: "VLSM-L10-B",
          text: "Siswa dapat mengalokasikan prefix CIDR yang berbeda-beda secara berurutan dan mengidentifikasi sisa ruang alamat yang belum terpakai.",
        },
      ],
      evidence: [
        {
          outcomeId: "VLSM-L10-A",
          teachingBlockIds: ["vlsm-l10-h1", "vlsm-l10-txt1", "vlsm-l10-callout1"],
          activityIds: [],
          assessmentItemIds: ["quiz-vlsm-l10-q1"],
        },
        {
          outcomeId: "VLSM-L10-B",
          teachingBlockIds: ["vlsm-l10-h2", "vlsm-l10-txt2", "vlsm-l10-code1"],
          activityIds: [],
          assessmentItemIds: ["quiz-vlsm-l10-q2", "quiz-vlsm-l10-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "vlsm-l10-h1",
            type: "heading",
            level: 2,
            text: "Aturan Emas VLSM: Urutkan Kebutuhan Terbesar ke Terkecil",
          },
          {
            id: "vlsm-l10-txt1",
            type: "text",
            format: "markdown",
            content:
              "**VLSM (Variable Length Subnet Masking)** adalah teknik membagi satu blok jaringan dengan panjang prefix yang berbeda-beda sesuai kebutuhan nyata setiap segmen. Ini adalah solusi atas pemborosan FLSM.\n\nDalam merancang VLSM, ada satu aturan wajib yang tidak boleh dilanggar:\n\n**Selalu alokasikan subnet dari kebutuhan host TERBESAR menuju kebutuhan host TERKECIL!**\n\nJika Anda memulai alokasi dari subnet kecil di tengah-tengah ruang alamat, blok alamat akan terpecah-pecah (*fragmented*) dan subnet besar berikutnya tidak akan muat pada batas kelipatan blok yang sah, menyebabkan **tumpang tindih (overlap)**.",
          },
          {
            id: "vlsm-l10-callout1",
            type: "callout",
            variant: "tip",
            title: "Prinsip Batas Blok Alami (Natural Boundaries)",
            content:
              "Sebuah subnet berukuran 64 (/26) HANYA boleh berawal pada kelipatan 64 (`.0, .64, .128, .192`). Subnet /26 TIDAK BISA dimulai pada `.16` atau `.32`. Dengan mengurutkan dari kebutuhan terbesar, batas blok alami akan selalu terpenuhi secara otomatis!",
          },
          {
            id: "vlsm-l10-h2",
            type: "heading",
            level: 3,
            text: "Studi Kasus Nyata: Desain Jaringan Sekolah SMK (192.168.10.0/24)",
          },
          {
            id: "vlsm-l10-txt2",
            type: "text",
            format: "markdown",
            content:
              "Diberikan jaringan dasar `192.168.10.0/24` (256 alamat). Buatlah alokasi untuk 5 kebutuhan berikut:\n1. **Lab Komputer:** 50 host -> Butuh $2^6 - 2 = 62$ host -> **Prefix /26** (Ukuran 64)\n2. **Ruang Guru:** 25 host -> Butuh $2^5 - 2 = 30$ host -> **Prefix /27** (Ukuran 32)\n3. **Ruang Tata Usaha:** 12 host -> Butuh $2^4 - 2 = 14$ host -> **Prefix /28** (Ukuran 16)\n4. **Server & Manajemen:** 5 host -> Butuh $2^3 - 2 = 6$ host -> **Prefix /29** (Ukuran 8)\n5. **Link Router-ke-Firewall:** 2 host -> Butuh $2^2 - 2 = 2$ host -> **Prefix /30** (Ukuran 4)",
          },
          {
            id: "vlsm-l10-code1",
            type: "code",
            language: "text",
            code: "HASIL ALOKASI VLSM TERURUT (ZERO OVERLAP):\n-------------------------------------------------------------------------\nDepartemen   | Butuh | Prefix | Network ID      | Usable Range  | Broadcast\n-------------------------------------------------------------------------\nLab Komputer | 50    | /26    | 192.168.10.0    | .1   - .62    | .63\nRuang Guru   | 25    | /27    | 192.168.10.64   | .65  - .94    | .95\nRuang TU     | 12    | /28    | 192.168.10.96   | .97  - .110   | .111\nServer       | 5     | /29    | 192.168.10.112  | .113 - .118   | .119\nLink P2P     | 2     | /30    | 192.168.10.120  | .121 - .122   | .123\n-------------------------------------------------------------------------\nSISA ALAMAT BEBAS (UNALLOCATED) : 192.168.10.124 s/d 192.168.10.255 (132 IP)",
          },
          {
            id: "vlsm-l10-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlsm-l10-q1",
            question: "Mengapa dalam perancangan VLSM alokasi subnet harus selalu diurutkan dari kebutuhan host terbesar ke kebutuhan terkecil?",
            options: [
              { id: "opt-a", text: "Untuk mencegah fragmentasi ruang alamat dan memastikan setiap subnet berada pada batas kelipatan blok alaminya" },
              { id: "opt-b", text: "Karena router hanya bisa membaca tabel routing yang disusun secara alfabetis" },
              { id: "opt-c", text: "Agar kabel jaringan tidak mengalami overheating" },
              { id: "opt-d", text: "Karena aturan standar ISO melarang subnet kecil dibuat lebih dulu" },
            ],
            explanation:
              "Mengurutkan dari yang terbesar menjamin setiap blok subnet berada pada kelipatan ukurannya masing-masing (boundary alignment) dan mencegah terjadinya tumpang tindih alamat (IP overlap).",
            xpReward: 10,
          },
          {
            id: "vlsm-l10-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlsm-l10-q2",
            question: "Jika subnet pertama dialokasikan dengan 192.168.10.0/26, pada alamat manakah subnet berikutnya yang berukuran /27 harus dimulai?",
            options: [
              { id: "opt-a", text: "192.168.10.32" },
              { id: "opt-b", text: "192.168.10.64" },
              { id: "opt-c", text: "192.168.10.65" },
              { id: "opt-d", text: "192.168.10.128" },
            ],
            explanation:
              "Subnet /26 menggunakan rentang 192.168.10.0 s/d 192.168.10.63. Alamat tepat setelah broadcast .63 adalah 192.168.10.64, yang merupakan awal Network ID untuk subnet berikutnya.",
            xpReward: 10,
          },
          {
            id: "vlsm-l10-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-vlsm-l10-q3",
            question: "Berdasarkan tabel alokasi studi kasus di atas, berapakah sisa alamat IP yang belum terpakai (unallocated) dari blok 192.168.10.0/24?",
            options: [
              { id: "opt-a", text: "0 IP (habis total)" },
              { id: "opt-b", text: "64 IP" },
              { id: "opt-c", text: "132 IP (mulai dari 192.168.10.124 hingga .255)" },
              { id: "opt-d", text: "256 IP" },
            ],
            explanation:
              "Alamat yang digunakan adalah dari .0 hingga .123 (total 124 alamat). Sisa alamat adalah dari 192.168.10.124 hingga 192.168.10.255, yaitu sebanyak 132 alamat IP bebas untuk pengembangan masa depan.",
            xpReward: 10,
          },
          {
            id: "vlsm-l10-sum",
            type: "summary",
            title: "Rangkuman Desain VLSM",
            keyPoints: [
              "VLSM memberikan efisiensi maksimal dengan menyesuaikan panjang prefix pada setiap subnet.",
              "Wajib mengurutkan kebutuhan host dari terbesar ke terkecil untuk mencegah overlap dan fragmentasi.",
              "Sisa alamat yang tidak terpakai (unallocated space) dapat direservasi untuk ekspansi jaringan di masa mendatang.",
            ],
          },
          {
            id: "vlsm-l10-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "VLSM Master Engineer",
            message: "Selamat! Anda telah menguasai perancangan VLSM tingkat lanjut yang siap diuji pada Capstone Path 2.",
          },
        ],
      },
    },
  ],
};
