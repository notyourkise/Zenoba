import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Kalkulasi Subnet (P2-M4)
 *
 * Covers mathematical derivation of Network ID, Broadcast Address, Usable Host Range, and /30 to /32 boundaries.
 */
export const subnetCalculationsModuleData: CurriculumModule = {
  id: "module-kalkulasi-subnet",
  slug: "kalkulasi-subnet",
  title: "Kalkulasi Parameter Subnetting",
  description:
    "Menghitung Network ID, Broadcast Address, First Usable Host, Last Usable Host, dan kapasitas host valid secara matematis.",
  orderIndex: 4,
  prerequisites: ["mask-dan-cidr"],
  outcomes: [
    {
      id: "CALC-M1",
      text: "Siswa dapat menghitung Network ID dan Broadcast Address untuk sebarang pasangan IP host dan prefix CIDR.",
    },
    {
      id: "CALC-M2",
      text: "Siswa dapat menentukan rentang host yang dapat digunakan (usable host range) serta kapasitas maksimum host.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 7: network-broadcast (P2-L07)
    // =========================================================================
    {
      id: "lesson-network-broadcast",
      slug: "network-broadcast",
      title: "Menghitung Network ID & Broadcast Address",
      description:
        "Menggunakan konsep ukuran blok (magic number = 256 - mask) untuk menentukan batas awal dan batas akhir subnet.",
      orderIndex: 0,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["cidr-notation"],
      outcomes: [
        {
          id: "CALC-L7-A",
          text: "Siswa dapat menghitung ukuran blok subnet (magic number) dari subnet mask desimal.",
        },
        {
          id: "CALC-L7-B",
          text: "Siswa dapat menentukan Network ID (alamat terendah) dan Broadcast Address (alamat tertinggi) sebuah subnet.",
        },
      ],
      evidence: [
        {
          outcomeId: "CALC-L7-A",
          teachingBlockIds: ["calc-l7-h1", "calc-l7-txt1", "calc-l7-callout1"],
          activityIds: ["calc-l7-act1"],
          assessmentItemIds: ["quiz-calc-l7-q1"],
        },
        {
          outcomeId: "CALC-L7-B",
          teachingBlockIds: ["calc-l7-h2", "calc-l7-txt2", "calc-l7-code1"],
          activityIds: ["calc-l7-act1"],
          assessmentItemIds: ["quiz-calc-l7-q2", "quiz-calc-l7-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "calc-l7-h1",
            type: "heading",
            level: 2,
            text: "Metode Cepat 'Magic Number' (Ukuran Blok Subnet)",
          },
          {
            id: "calc-l7-txt1",
            type: "text",
            format: "markdown",
            content:
              "Menghitung subnet tidak harus selalu mengubah seluruh 32-bit ke deretan biner panjang. Teknisi jaringan berpengalaman menggunakan teknik praktis bernama **Magic Number** (Ukuran Blok):\n\n$$\\text{Magic Number} = 256 - \\text{Nilai Oktet Subnet Mask Aktif}$$\n\nContoh: Diberikan prefix `/26`.\n- Subnet mask oktet ke-4 adalah `192`.\n- Magic Number = $256 - 192 = \\mathbf{64}$.\n- Artinya, subnet-subnet akan melompat dengan kelipatan **64**: `0, 64, 128, 192`.",
          },
          {
            id: "calc-l7-callout1",
            type: "callout",
            variant: "tip",
            title: "Dua Alamat Khusus yang Tidak Boleh Dipakai Komputer",
            content:
              "Di setiap subnet IPv4, selalu ada 2 alamat yang direservasi oleh sistem:\n1. **Network ID**: Alamat pertama (paling rendah). Contoh: `192.168.1.0`. Digunakan router sebagai penunjuk identitas jaringan.\n2. **Broadcast Address**: Alamat terakhir (paling tinggi). Contoh: `192.168.1.63`. Digunakan untuk mengirim pesan ke seluruh host di subnet secara serentak.\n\nKedua alamat ini **TIDAK BOLEH** dipasangkan pada komputer, printer, atau interface router!",
          },
          {
            id: "calc-l7-act1",
            type: "interactive",
            interactiveType: "subnet_calculator",
            config: {
              instruction:
                "Masukkan alamat IP dan pilih prefix CIDR untuk melihat pembongkaran langkah demi langkah perhitungan Network ID dan Broadcast.",
            },
          },
          {
            id: "calc-l7-h2",
            type: "heading",
            level: 3,
            text: "Langkah Menentukan Network & Broadcast untuk IP Acak",
          },
          {
            id: "calc-l7-txt2",
            type: "text",
            format: "markdown",
            content:
              "**Studi Kasus:** Carilah Network ID dan Broadcast Address dari IP `192.168.10.85/26`!\n\n1. **Cari Magic Number:** Prefix `/26` -> Mask `255.255.255.192` -> $256 - 192 = \\mathbf{64}$.\n2. **Tuliskan Kelipatan Blok:** 0, 64, 128, 192.\n3. **Cari Posisi IP (85):** Angka 85 berada di antara **64** dan **128**.\n   - Maka **Network ID = 192.168.10.64** (batas bawah blok).\n   - Blok berikutnya dimulai di 128, maka **Broadcast Address = 192.168.10.127** (satu angka sebelum 128).",
          },
          {
            id: "calc-l7-code1",
            type: "code",
            language: "text",
            code: "Subnet 1: 192.168.10.0   s/d  192.168.10.63   (Broadcast: .63)\nSubnet 2: 192.168.10.64  s/d  192.168.10.127  (Broadcast: .127) <-- IP .85 ADA DI SINI!\nSubnet 3: 192.168.10.128 s/d  192.168.10.191  (Broadcast: .191)\nSubnet 4: 192.168.10.192 s/d  192.168.10.255  (Broadcast: .255)",
          },
          {
            id: "calc-l7-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-calc-l7-q1",
            question: "Berapakah nilai Magic Number (ukuran blok) dari subnet dengan prefix /27 (mask 255.255.255.224)?",
            options: [
              { id: "opt-a", text: "16" },
              { id: "opt-b", text: "32" },
              { id: "opt-c", text: "64" },
              { id: "opt-d", text: "128" },
            ],
            explanation:
              "Magic Number = 256 - nilai oktet mask. 256 - 224 = 32. Artinya setiap subnet berukuran 32 alamat.",
            xpReward: 10,
          },
          {
            id: "calc-l7-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-calc-l7-q2",
            question: "Berapakah Network ID dari alamat host 192.168.1.130/26?",
            options: [
              { id: "opt-a", text: "192.168.1.0" },
              { id: "opt-b", text: "192.168.1.64" },
              { id: "opt-c", text: "192.168.1.128" },
              { id: "opt-d", text: "192.168.1.192" },
            ],
            explanation:
              "/26 memiliki blok kelipatan 64: 0, 64, 128, 192. Nilai 130 berada di antara 128 dan 192, sehingga Network ID-nya adalah 192.168.1.128.",
            xpReward: 10,
          },
          {
            id: "calc-l7-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-calc-l7-q3",
            question: "Berapakah Broadcast Address dari subnet 10.0.50.16/28?",
            options: [
              { id: "opt-a", text: "10.0.50.25" },
              { id: "opt-b", text: "10.0.50.31" },
              { id: "opt-c", text: "10.0.50.32" },
              { id: "opt-d", text: "10.0.50.255" },
            ],
            explanation:
              "Prefix /28 memiliki mask 255.255.255.240. Magic number = 256 - 240 = 16. Subnet berikutnya dimulai di 16 + 16 = 32. Maka broadcast subnet ini adalah 32 - 1 = 10.0.50.31.",
            xpReward: 10,
          },
          {
            id: "calc-l7-sum",
            type: "summary",
            title: "Rangkuman Network & Broadcast",
            keyPoints: [
              "Magic Number (256 - nilai mask) menentukan kelipatan lompatan antar-subnet.",
              "Network ID adalah alamat pertama kelipatan blok dan tidak boleh dipasang ke host.",
              "Broadcast Address adalah alamat terakhir (satu angka sebelum network berikutnya) untuk menyiarkan pesan ke seluruh anggota subnet.",
            ],
          },
          {
            id: "calc-l7-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "Subnet Calculator Pro",
            message: "Hebat! Anda telah menguasai perhitungan Network ID dan Broadcast menggunakan teknik magic number.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 8: host-range (P2-L08)
    // =========================================================================
    {
      id: "lesson-host-range",
      slug: "host-range",
      title: "Rentang Alamat Host & Kapasitas Usable",
      description:
        "Menentukan First/Last Usable IP, rumus kapasitas 2^h - 2, serta batasan khusus pada prefix /30, /31, dan /32.",
      orderIndex: 1,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["network-broadcast"],
      outcomes: [
        {
          id: "CALC-L8-A",
          text: "Siswa dapat menghitung rentang host yang sah (First Usable IP s.d. Last Usable IP).",
        },
        {
          id: "CALC-L8-B",
          text: "Siswa dapat menghitung kapasitas host usable menggunakan rumus 2^h - 2 dan menganalisis batasan prefix /30, /31, /32.",
        },
      ],
      evidence: [
        {
          outcomeId: "CALC-L8-A",
          teachingBlockIds: ["calc-l8-h1", "calc-l8-txt1", "calc-l8-code1"],
          activityIds: ["calc-l8-act1"],
          assessmentItemIds: ["quiz-calc-l8-q1"],
        },
        {
          outcomeId: "CALC-L8-B",
          teachingBlockIds: ["calc-l8-h2", "calc-l8-txt2", "calc-l8-callout1"],
          activityIds: ["calc-l8-act1"],
          assessmentItemIds: ["quiz-calc-l8-q2", "quiz-calc-l8-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "calc-l8-h1",
            type: "heading",
            level: 2,
            text: "Menentukan Rentang Host yang Dapat Digunakan (Usable Range)",
          },
          {
            id: "calc-l8-txt1",
            type: "text",
            format: "markdown",
            content:
              "Setelah mengetahui Network ID dan Broadcast Address, kita dapat menentukan rentang alamat yang boleh dikonfigurasikan pada perangkat komputer, server, atau gateway:\n\n- **First Usable IP:** Alamat tepat satu angka setelah Network ID ($\\text{Network ID} + 1$).\n- **Last Usable IP:** Alamat tepat satu angka sebelum Broadcast Address ($\\text{Broadcast} - 1$).\n\nContoh Subnet `192.168.1.0/26`:\n- Network ID = `192.168.1.0`\n- First Usable IP = `192.168.1.1` (biasanya dialokasikan untuk Default Gateway Router)\n- Last Usable IP = `192.168.1.62`\n- Broadcast Address = `192.168.1.63`",
          },
          {
            id: "calc-l8-code1",
            type: "code",
            language: "text",
            code: "------------------------------------------------------------------------\nSTRUKTUR BLOK SUBNET:\n[Network ID] -> [First Usable IP  s/d  Last Usable IP] -> [Broadcast IP]\n 192.168.1.0 ->  192.168.1.1      s/d  192.168.1.62    ->  192.168.1.63\n------------------------------------------------------------------------",
          },
          {
            id: "calc-l8-h2",
            type: "heading",
            level: 3,
            text: "Rumus Kapasitas Host Usable: 2^h - 2",
          },
          {
            id: "calc-l8-txt2",
            type: "text",
            format: "markdown",
            content:
              "Di mana $h$ adalah jumlah bit host yang tersisa (yaitu $32 - \\text{prefix}$):\n$$\\text{Kapasitas Host Usable} = 2^h - 2$$\n\nContoh perbandingan kapasitas:\n- `/24`: $h = 8$ bit -> $2^8 - 2 = 256 - 2 = \\mathbf{254}$ host.\n- `/26`: $h = 6$ bit -> $2^6 - 2 = 64 - 2 = \\mathbf{62}$ host.\n- `/28`: $h = 4$ bit -> $2^4 - 2 = 16 - 2 = \\mathbf{14}$ host.\n- `/30`: $h = 2$ bit -> $2^2 - 2 = 4 - 2 = \\mathbf{2}$ host.",
          },
          {
            id: "calc-l8-callout1",
            type: "callout",
            variant: "info",
            title: "Kasus Khusus Prefix /30, /31, dan /32",
            content:
              "- **/30 (Link Point-to-Point):** Standar industri untuk menghubungkan dua router (hanya butuh 2 host usable). Menghindari pemborosan IP publik.\n- **/31 (RFC 3021):** Standar khusus kabel point-to-point tanpa network dan broadcast terpisah ($2^1 = 2$ host). Hanya didukung perangkat router tertentu.\n- **/32 (Single Host Route):** Subnet mask `255.255.255.255` (0 bit host). Digunakan untuk interface virtual Loopback router atau route spesifik ke 1 server.",
          },
          {
            id: "calc-l8-act1",
            type: "interactive",
            interactiveType: "subnet_practice",
            config: {
              instruction:
                "Selesaikan tantangan kalkulasi acak di bawah: hitung Network ID, Broadcast, dan Usable Host untuk menguji ketangkasan Anda.",
            },
          },
          {
            id: "calc-l8-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-calc-l8-q1",
            question: "Jika sebuah subnet memiliki Network ID 172.16.10.64/28, berapakah rentang usable IP host yang sah?",
            options: [
              { id: "opt-a", text: "172.16.10.64 s/d 172.16.10.79" },
              { id: "opt-b", text: "172.16.10.65 s/d 172.16.10.78" },
              { id: "opt-c", text: "172.16.10.65 s/d 172.16.10.79" },
              { id: "opt-d", text: "172.16.10.64 s/d 172.16.10.78" },
            ],
            explanation:
              "Prefix /28 berukuran 16 alamat (64 s/d 79). Network ID = .64 dan Broadcast = .79. Rentang host usable adalah dari .65 (Net ID + 1) hingga .78 (Broadcast - 1).",
            xpReward: 10,
          },
          {
            id: "calc-l8-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-calc-l8-q2",
            question: "Sebuah lab komputer sekolah membutuhkan alokasi tepat untuk 28 PC siswa. Manakah prefix CIDR terkecil yang mencukupi kebutuhan tersebut tanpa kekurangan alamat?",
            options: [
              { id: "opt-a", text: "/28 (maksimal 14 host)" },
              { id: "opt-b", text: "/27 (maksimal 30 host)" },
              { id: "opt-c", text: "/26 (maksimal 62 host)" },
              { id: "opt-d", text: "/25 (maksimal 126 host)" },
            ],
            explanation:
              "/28 hanya menyediakan 2^4 - 2 = 14 host (kurang). /27 menyediakan 2^5 - 2 = 30 host (cukup dan paling efisien untuk 28 PC).",
            xpReward: 10,
          },
          {
            id: "calc-l8-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-calc-l8-q3",
            question: "Mengapa teknisi jaringan selalu menggunakan prefix /30 untuk menghubungkan link kabel serial antar dua router?",
            options: [
              { id: "opt-a", text: "Karena router tidak mendukung subnet mask selain /30" },
              { id: "opt-b", text: "Karena /30 menyediakan tepat 2 alamat usable untuk masing-masing ujung router, menghemat alokasi IP" },
              { id: "opt-c", text: "Karena /30 memberikan kecepatan bandwidth tertinggi" },
              { id: "opt-d", text: "Karena kabel jaringan tidak dapat mentransmisikan data jika prefix-nya /24" },
            ],
            explanation:
              "Pada link point-to-point antar 2 router, hanya ada 2 interface yang membutuhkan IP. Prefix /30 menyediakan tepat 2 usable host (2^2 - 2 = 2), sehingga tidak ada pemborosan alamat IP berharga.",
            xpReward: 10,
          },
          {
            id: "calc-l8-sum",
            type: "summary",
            title: "Rangkuman Rentang Host & Kapasitas",
            keyPoints: [
              "Rentang usable host selalu dimulai dari Network ID + 1 hingga Broadcast - 1.",
              "Rumus kapasitas host usable adalah 2^h - 2 karena 2 alamat dipesan untuk Network dan Broadcast.",
              "Prefix /30 menghasilkan 2 usable host dan menjadi standar untuk link point-to-point antar-router.",
            ],
          },
          {
            id: "calc-l8-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "Host Capacity Master",
            message: "Luar biasa! Anda telah memahami rentang usable host dan efisiensi pemilihan prefix CIDR.",
          },
        ],
      },
    },
  ],
};
