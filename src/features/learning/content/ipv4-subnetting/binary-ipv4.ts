import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Biner & Struktur IPv4 (P2-M1)
 *
 * Covers 8-bit binary fundamentals, power-of-two positioning, and 32-bit dotted-decimal anatomy.
 */
export const binaryIpv4ModuleData: CurriculumModule = {
  id: "module-biner-dan-ipv4",
  slug: "biner-dan-ipv4",
  title: "Biner & Anatomi Struktur IPv4",
  description:
    "Pahami dasar sistem biner 8-bit, bobot nilai pangkat dua, serta anatomi 32-bit alamat IPv4 dalam 4 oktet desimal bertitik.",
  orderIndex: 1,
  prerequisites: [],
  outcomes: [
    {
      id: "BIN-M1",
      text: "Siswa dapat mengonversi angka biner 8-bit ke desimal dan sebaliknya menggunakan bobot nilai pangkat dua.",
    },
    {
      id: "BIN-M2",
      text: "Siswa dapat menguraikan struktur 32-bit alamat IPv4 menjadi 4 oktet desimal bertitik dan memvalidasi keabsahan format alamat.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 1: biner-8-bit (P2-L01)
    // =========================================================================
    {
      id: "lesson-biner-8-bit",
      slug: "biner-8-bit",
      title: "Sistem Bilangan Biner 8-Bit",
      description:
        "Mempelajari konsep bit, bobot nilai pangkat 2 (128 s.d. 1), dan teknik konversi cepat biner ke desimal.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: [],
      outcomes: [
        {
          id: "BIN-L1-A",
          text: "Siswa dapat menjelaskan konsep bit dan merepresentasikan bobot posisi 8-bit (128, 64, 32, 16, 8, 4, 2, 1).",
        },
        {
          id: "BIN-L1-B",
          text: "Siswa dapat mengonversi kombinasi biner 8-bit ke nilai desimal (0 s.d. 255) dengan tepat.",
        },
      ],
      evidence: [
        {
          outcomeId: "BIN-L1-A",
          teachingBlockIds: ["bin-l1-h1", "bin-l1-txt1", "bin-l1-callout1"],
          activityIds: ["bin-l1-act1"],
          assessmentItemIds: ["quiz-bin-l1-q1", "quiz-bin-l1-q2"],
        },
        {
          outcomeId: "BIN-L1-B",
          teachingBlockIds: ["bin-l1-txt2", "bin-l1-code1"],
          activityIds: ["bin-l1-act1"],
          assessmentItemIds: ["quiz-bin-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "bin-l1-h1",
            type: "heading",
            level: 2,
            text: "Mengapa Jaringan Menggunakan Sistem Biner?",
          },
          {
            id: "bin-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Di dunia komputer dan jaringan fisik, seluruh sinyal listrik, pulsa cahaya pada serat optik, maupun gelombang radio hanya mengenal dua kondisi dasar: **ada tegangan (1)** atau **tidak ada tegangan (0)**. Setiap digit 0 atau 1 ini disebut sebagai **bit** (*binary digit*).\n\nDalam protokol IPv4, bit-bit ini dikelompokkan ke dalam paket 8 bit yang disebut **oktet** (atau 1 *byte*). Satu oktet mampu merepresentasikan 256 kombinasi angka yang berbeda, mulai dari 0 hingga 255.",
          },
          {
            id: "bin-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Deret Ajaib 8-Bit (Powers of Two)",
            content:
              "Untuk menguasai subnetting dan pengalamatan IP, hafalkan 8 angka bobot posisi bit dari kiri (Most Significant Bit) ke kanan (Least Significant Bit):\n\n**128 — 64 — 32 — 16 — 8 — 4 — 2 — 1**\n\nJika bit bernilai 1, tambahkan nilainya. Jika bit bernilai 0, abaikan!",
          },
          {
            id: "bin-l1-act1",
            type: "interactive",
            interactiveType: "binary_converter",
            config: {
              instruction:
                "Aktifkan bit 1 atau nonaktifkan bit 0 pada kotak di bawah untuk melihat penjumlahan desimal secara langsung.",
            },
          },
          {
            id: "bin-l1-h2",
            type: "heading",
            level: 3,
            text: "Langkah Praktis Konversi Biner ke Desimal",
          },
          {
            id: "bin-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Mari kita ambil contoh pola biner `11000000`:\n- Bit 7 (128) = 1 -> 128\n- Bit 6 (64)  = 1 -> 64\n- Bit 5 s.d. 0 = 0 -> 0\n- **Total:** 128 + 64 = **192**.\n\nContoh kedua: `10101000`:\n- Bit 7 (128) = 1 -> 128\n- Bit 5 (32)  = 1 -> 32\n- Bit 3 (8)   = 1 -> 8\n- **Total:** 128 + 32 + 8 = **168**.\n\nPerhatikan bahwa `192` dan `168` adalah dua angka pertama dari alamat IP lokal yang paling sering Anda jumpai: `192.168.x.x`!",
          },
          {
            id: "bin-l1-code1",
            type: "code",
            language: "text",
            code: "Posisi Bit :  7    6   5   4   3  2  1  0\nBobot (2^n): 128  64  32  16   8  4  2  1\n-----------------------------------------\nContoh A   :  1    1   0   0   0  0  0  0 = 128 + 64 = 192\nContoh B   :  1    0   1   0   1  0  0  0 = 128 + 32 + 8 = 168\nSemua Bit 1:  1    1   1   1   1  1  1  1 = 255 (Maksimum)",
          },
          {
            id: "bin-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-bin-l1-q1",
            question: "Berapa nilai desimal dari pola biner 8-bit 10000000?",
            options: [
              { id: "opt-a", text: "64" },
              { id: "opt-b", text: "128" },
              { id: "opt-c", text: "192" },
              { id: "opt-d", text: "255" },
            ],
            explanation:
              "Bit paling kiri (bit ke-7) bernilai 2^7 = 128. Karena hanya bit ini yang bernilai 1 dan bit lainnya 0, totalnya adalah 128.",
            xpReward: 10,
          },
          {
            id: "bin-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-bin-l1-q2",
            question: "Jika seluruh 8 bit dalam satu oktet bernilai 1 (11111111), berapa nilai total desimalnya?",
            options: [
              { id: "opt-a", text: "256" },
              { id: "opt-b", text: "255" },
              { id: "opt-c", text: "254" },
              { id: "opt-d", text: "128" },
            ],
            explanation:
              "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255. Nilai tertinggi satu oktet adalah 255 (2^8 - 1).",
            xpReward: 10,
          },
          {
            id: "biner-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-bin-l1-q3",
            question: "Manakah kombinasi bit yang menghasilkan nilai desimal 10?",
            options: [
              { id: "opt-a", text: "00001010" },
              { id: "opt-b", text: "00001100" },
              { id: "opt-c", text: "00001001" },
              { id: "opt-d", text: "00010010" },
            ],
            explanation:
              "Angka 10 dibentuk dari penjumlahan bobot 8 + 2. Pada posisi 8 (bit 3) dan posisi 2 (bit 1) bernilai 1 -> 00001010.",
            xpReward: 10,
          },
          {
            id: "bin-l1-sum",
            type: "summary",
            title: "Rangkuman Biner 8-Bit",
            keyPoints: [
              "Satu oktet terdiri dari 8 bit dengan nilai posisi 128, 64, 32, 16, 8, 4, 2, dan 1.",
              "Rentang nilai yang dapat dibentuk oleh satu oktet biner adalah 0 (00000000) hingga 255 (11111111).",
              "Konversi biner ke desimal dilakukan dengan menjumlahkan bobot posisi dari bit-bit yang bernilai 1.",
            ],
          },
          {
            id: "bin-l1-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "Binary Apprentice",
            message: "Hebat! Anda telah menguasai dasar konversi biner 8-bit yang menjadi pondasi utama subnetting.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 2: struktur-ipv4 (P2-L02)
    // =========================================================================
    {
      id: "lesson-struktur-ipv4",
      slug: "struktur-ipv4",
      title: "Anatomi 32-Bit Alamat IPv4",
      description:
        "Menelusuri bagaimana 32 bit biner dipecah menjadi 4 oktet desimal bertitik dengan rentang 0.0.0.0 s.d. 255.255.255.255.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["biner-8-bit"],
      outcomes: [
        {
          id: "BIN-L2-A",
          text: "Siswa dapat menguraikan susunan 32 bit IPv4 ke dalam 4 oktet dan membedakan format biner vs dotted-decimal.",
        },
        {
          id: "BIN-L2-B",
          text: "Siswa dapat mengidentifikasi keabsahan sintaks alamat IPv4 berdasarkan batas nilai oktet (0–255).",
        },
      ],
      evidence: [
        {
          outcomeId: "BIN-L2-A",
          teachingBlockIds: ["bin-l2-h1", "bin-l2-txt1", "bin-l2-code1"],
          activityIds: [],
          assessmentItemIds: ["quiz-bin-l2-q1", "quiz-bin-l2-q2"],
        },
        {
          outcomeId: "BIN-L2-B",
          teachingBlockIds: ["bin-l2-callout1", "bin-l2-txt2"],
          activityIds: [],
          assessmentItemIds: ["quiz-bin-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "bin-l2-h1",
            type: "heading",
            level: 2,
            text: "Struktur dan Format Alamat IPv4",
          },
          {
            id: "bin-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Alamat IPv4 (Internet Protocol version 4) adalah tanda pengenal numerik 32-bit yang diberikan kepada setiap perangkat yang terhubung ke jaringan berbasis IP. Karena susunan 32 angka biner seperti `11000000101010000000000100000001` sangat sulit diingat oleh manusia, alamat ini dibagi menjadi **4 segmen**, yang masing-masing berukuran **8 bit** (1 oktet), lalu dipisahkan dengan tanda titik (*dot*).\n\nFormat penulisan ini dikenal sebagai **Dotted-Decimal Notation** (Notasi Desimal Bertitik), contohnya: `192.168.1.1`.",
          },
          {
            id: "bin-l2-code1",
            type: "code",
            language: "text",
            code: "Format Biner   : 11000000 . 10101000 . 00000001 . 00000001\nSegmen Oktet   :   Oktet 1  .   Oktet 2  .   Oktet 3  .   Oktet 4\nFormat Desimal :     192    .     168    .      1     .      1",
          },
          {
            id: "bin-l2-callout1",
            type: "callout",
            variant: "warning",
            title: "Aturan Absolut: Rentang 0 sampai 255",
            content:
              "Karena setiap oktet hanya memiliki panjang 8 bit, maka nilai desimal minimum adalah `0` (semua bit 0) dan nilai maksimum adalah `255` (semua bit 1).\n\nJika Anda menemukan alamat seperti `192.168.1.256` atau `10.300.0.1`, alamat tersebut **TIDAK VALID** dan akan ditolak oleh sistem operasi mana pun!",
          },
          {
            id: "bin-l2-h2",
            type: "heading",
            level: 3,
            text: "Kapasitas Total Alamat IPv4",
          },
          {
            id: "bin-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Dengan panjang 32 bit, total kombinasi unik alamat IPv4 di seluruh dunia adalah $2^{32} = 4.294.967.296$ (sekitar 4,29 miliar alamat). Angka ini terdengar sangat besar, namun karena lonjakan pesat perangkat komputer, ponsel pintar, IoT, dan server global, alokasi IPv4 publik saat ini telah habis terpakai (*IPv4 exhaustion*).\n\nInilah alasan mengapa pemahaman efisiensi pembagian alamat IP (Subnetting dan VLSM) menjadi keterampilan wajib bagi setiap teknisi jaringan komputer.",
          },
          {
            id: "bin-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-bin-l2-q1",
            question: "Berapa total panjang bit pada sebuah alamat IPv4?",
            options: [
              { id: "opt-a", text: "16 bit" },
              { id: "opt-b", text: "32 bit" },
              { id: "opt-c", text: "64 bit" },
              { id: "opt-d", text: "128 bit" },
            ],
            explanation:
              "IPv4 terdiri dari 32 bit yang terbagi ke dalam 4 oktet (masing-masing 8 bit). Sedangkan 128 bit adalah panjang alamat IPv6.",
            xpReward: 10,
          },
          {
            id: "bin-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-bin-l2-q2",
            question: "Berapa banyak oktet yang membentuk satu alamat IPv4 dalam notasi dotted-decimal?",
            options: [
              { id: "opt-a", text: "2 oktet" },
              { id: "opt-b", text: "4 oktet" },
              { id: "opt-c", text: "8 oktet" },
              { id: "opt-d", text: "16 oktet" },
            ],
            explanation:
              "Alamat IPv4 dibagi menjadi 4 oktet, misalnya A.B.C.D (masing-masing 8 bit, total 4 x 8 = 32 bit).",
            xpReward: 10,
          },
          {
            id: "bin-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-bin-l2-q3",
            question: "Manakah dari alamat IPv4 berikut yang berformat TIDAK VALID?",
            options: [
              { id: "opt-a", text: "10.0.0.1" },
              { id: "opt-b", text: "172.16.254.1" },
              { id: "opt-c", text: "192.168.1.256" },
              { id: "opt-d", text: "192.168.0.255" },
            ],
            explanation:
              "Nilai oktet terakhir pada 192.168.1.256 adalah 256. Nilai maksimal dari 8 bit hanya 255, sehingga angka 256 mustahil direpresentasikan dalam satu oktet IPv4.",
            xpReward: 10,
          },
          {
            id: "bin-l2-sum",
            type: "summary",
            title: "Rangkuman Struktur IPv4",
            keyPoints: [
              "Alamat IPv4 terdiri dari 32 bit yang dibagi menjadi 4 oktet (masing-masing 8 bit).",
              "Format penulisan menggunakan Dotted-Decimal Notation dengan pemisah tanda titik.",
              "Rentang nilai yang sah pada setiap oktet adalah 0 hingga 255.",
              "Kapasitas teoritis total IPv4 adalah 2^32 atau sekitar 4,29 miliar alamat unik.",
            ],
          },
          {
            id: "bin-l2-rew",
            type: "reward",
            xp: 60,
            badgeTitle: "IPv4 Anatomist",
            message: "Luar biasa! Anda telah memahami anatomi 32-bit dan aturan keabsahan penulisan alamat IPv4.",
          },
        ],
      },
    },
  ],
};
