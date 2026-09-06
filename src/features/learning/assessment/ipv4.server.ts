/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR IPV4 & SUBNETTING (P2-M1 s.d. P2-M5)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

import type { PrivateQuizQuestion } from "./welcome.server";

export const ipv4FormativeQuestions: PrivateQuizQuestion[] = [
  // =========================================================================
  // Module 1: Biner & Anatomi Struktur IPv4 (P2-M1)
  // =========================================================================

  // Lesson 1: biner-8-bit
  {
    id: "quiz-bin-l1-q1",
    lessonSlug: "biner-8-bit",
    outcomeId: "BIN-L1-A",
    question: "Berapa nilai desimal dari pola biner 8-bit 10000000?",
    options: [
      { id: "opt-a", text: "64" },
      { id: "opt-b", text: "128" },
      { id: "opt-c", text: "192" },
      { id: "opt-d", text: "255" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Bit paling kiri (bit ke-7 dari kanan dengan indeks 0-7) memiliki bobot 2^7 = 128. Karena hanya bit ini yang bernilai 1 dan sisanya 0, totalnya adalah 128.",
    misconceptionFeedback:
      "Ingat urutan deret bobot 8-bit dari kiri ke kanan: 128, 64, 32, 16, 8, 4, 2, 1. Posisi paling kiri adalah 128, bukan 64 atau 255.",
  },
  {
    id: "quiz-bin-l1-q2",
    lessonSlug: "biner-8-bit",
    outcomeId: "BIN-L1-A",
    question: "Jika seluruh 8 bit dalam satu oktet bernilai 1 (11111111), berapa nilai total desimalnya?",
    options: [
      { id: "opt-a", text: "256" },
      { id: "opt-b", text: "255" },
      { id: "opt-c", text: "254" },
      { id: "opt-d", text: "128" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Penjumlahan seluruh 8 bit (128 + 64 + 32 + 16 + 8 + 4 + 2 + 1) menghasilkan 255, yaitu nilai tertinggi dari 2^8 - 1.",
    misconceptionFeedback:
      "256 adalah jumlah total kemungkinan kombinasi (dari 0 s.d. 255), tetapi nilai angka desimal maksimum adalah 255.",
  },
  {
    id: "quiz-bin-l1-q3",
    lessonSlug: "biner-8-bit",
    outcomeId: "BIN-L1-B",
    question: "Manakah kombinasi bit yang menghasilkan nilai desimal 10?",
    options: [
      { id: "opt-a", text: "00001010" },
      { id: "opt-b", text: "00001100" },
      { id: "opt-c", text: "00001001" },
      { id: "opt-d", text: "00010010" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Nilai 10 dibentuk dari penjumlahan 8 + 2. Pada posisi 8 (bit 3) dan posisi 2 (bit 1) aktif bernilai 1: 00001010.",
    misconceptionFeedback:
      "00001100 bernilai 8 + 4 = 12. Untuk mendapatkan 10, cari kombinasi bobot 8 + 2.",
  },

  // Lesson 2: struktur-ipv4
  {
    id: "quiz-bin-l2-q1",
    lessonSlug: "struktur-ipv4",
    outcomeId: "BIN-L2-A",
    question: "Berapa total panjang bit pada sebuah alamat IPv4?",
    options: [
      { id: "opt-a", text: "16 bit" },
      { id: "opt-b", text: "32 bit" },
      { id: "opt-c", text: "64 bit" },
      { id: "opt-d", text: "128 bit" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Alamat IPv4 terdiri dari 32 bit yang terbagi ke dalam 4 oktet (masing-masing 8 bit). Sedangkan 128 bit adalah panjang IPv6.",
    misconceptionFeedback:
      "Jangan tertukar: IPv4 berukuran 32 bit (4 oktet x 8 bit), sedangkan 128 bit adalah panjang alamat IPv6.",
  },
  {
    id: "quiz-bin-l2-q2",
    lessonSlug: "struktur-ipv4",
    outcomeId: "BIN-L2-A",
    question: "Berapa banyak oktet yang membentuk satu alamat IPv4 dalam notasi dotted-decimal?",
    options: [
      { id: "opt-a", text: "2 oktet" },
      { id: "opt-b", text: "4 oktet" },
      { id: "opt-c", text: "8 oktet" },
      { id: "opt-d", text: "16 oktet" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "IPv4 ditulis dalam notasi 4 oktet desimal yang dipisahkan tanda titik (contoh: A.B.C.D).",
    misconceptionFeedback:
      "Ada 4 segmen angka (oktet). Masing-masing segmen bernilai 8 bit, sehingga 4 x 8 = 32 bit.",
  },
  {
    id: "quiz-bin-l2-q3",
    lessonSlug: "struktur-ipv4",
    outcomeId: "BIN-L2-B",
    question: "Manakah dari alamat IPv4 berikut yang berformat TIDAK VALID?",
    options: [
      { id: "opt-a", text: "10.0.0.1" },
      { id: "opt-b", text: "172.16.254.1" },
      { id: "opt-c", text: "192.168.1.256" },
      { id: "opt-d", text: "192.168.0.255" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Setiap oktet IPv4 hanya boleh bernilai antara 0 s.d. 255. Nilai 256 pada oktet ke-4 melebihi kapasitas 8-bit sehingga tidak valid.",
    misconceptionFeedback:
      "Rentang nilai yang sah pada setiap oktet adalah 0 sampai 255. Angka 256 melebihi kapasitas maksimal 8-bit.",
  },

  // =========================================================================
  // Module 2: Klasifikasi & Jenis Alamat IPv4 (P2-M2)
  // =========================================================================

  // Lesson 3: public-private
  {
    id: "quiz-addr-l3-q1",
    lessonSlug: "public-private",
    outcomeId: "ADDR-L3-A",
    question: "Manakah dari alamat IPv4 berikut yang termasuk ke dalam rentang IP PRIVAT RFC 1918?",
    options: [
      { id: "opt-a", text: "8.8.8.8" },
      { id: "opt-b", text: "172.20.10.5" },
      { id: "opt-c", text: "172.35.1.1" },
      { id: "opt-d", text: "202.134.0.155" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Rentang IP privat Kelas B RFC 1918 adalah 172.16.0.0 s.d. 172.31.255.255. Karena oktet kedua 20 berada dalam rentang 16–31, 172.20.10.5 adalah IP privat.",
    misconceptionFeedback:
      "172.35.1.1 adalah IP publik karena oktet keduanya (35) berada di luar batas 172.16 - 172.31. 8.8.8.8 dan 202.134.0.155 juga merupakan IP publik.",
  },
  {
    id: "quiz-addr-l3-q2",
    lessonSlug: "public-private",
    outcomeId: "ADDR-L3-A",
    question: "Apa yang akan dilakukan oleh router ISP di internet jika menerima paket data dengan IP tujuan 192.168.1.100?",
    options: [
      { id: "opt-a", text: "Meneruskan paket ke seluruh rumah di dunia via broadcast" },
      { id: "opt-b", text: "Membuang (drop) paket tersebut karena IP privat tidak dapat dirutekan di internet publik" },
      { id: "opt-c", text: "Menyimpan paket di cloud sampai PC target online" },
      { id: "opt-d", text: "Mengonversi IP secara otomatis menjadi alamat MAC" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Router internet publik tidak memiliki tabel rute untuk blok RFC 1918 dan wajib membuang (drop) paket tersebut secara permanen.",
    misconceptionFeedback:
      "Alamat privat bersifat non-routable di internet publik. ISP tidak akan meneruskan paket dengan IP privat.",
  },
  {
    id: "quiz-addr-l3-q3",
    lessonSlug: "public-private",
    outcomeId: "ADDR-L3-B",
    question: "Teknologi apakah pada router gateway yang menerjemahkan banyak IP privat di LAN ke satu IP publik agar dapat mengakses internet?",
    options: [
      { id: "opt-a", text: "DHCP (Dynamic Host Configuration Protocol)" },
      { id: "opt-b", text: "NAT (Network Address Translation)" },
      { id: "opt-c", text: "DNS (Domain Name System)" },
      { id: "opt-d", text: "ARP (Address Resolution Protocol)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "NAT (Network Address Translation) bertugas mengganti IP privat lokal menjadi IP publik router saat paket melintasi gateway menuju internet.",
    misconceptionFeedback:
      "DHCP memberikan IP otomatis, DNS menerjemahkan nama domain, sedangkan NAT adalah yang menerjemahkan IP privat ke publik.",
  },

  // Lesson 4: loopback-apipa
  {
    id: "quiz-addr-l4-q1",
    lessonSlug: "loopback-apipa",
    outcomeId: "ADDR-L4-A",
    question: "Manakah pernyataan yang paling tepat mengenai fungsi dari alamat loopback 127.0.0.1?",
    options: [
      { id: "opt-a", text: "Alamat untuk menghubungkan komputer ke server gateway internet" },
      { id: "opt-b", text: "Alamat internal untuk menguji apakah stack protokol TCP/IP pada komputer lokal berfungsi dengan benar" },
      { id: "opt-c", text: "Alamat cadangan darurat saat server DHCP mati" },
      { id: "opt-d", text: "Alamat untuk melakukan broadcast ke seluruh perangkat di switch" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "127.0.0.1 memutar balik paket di dalam kernel komputer untuk memverifikasi kesiapan driver kartu jaringan dan stack TCP/IP lokal.",
    misconceptionFeedback:
      "Ping ke 127.0.0.1 tidak mengirimkan sinyal fisik keluar kabel, melainkan hanya menguji software stack TCP/IP internal komputer itu sendiri.",
  },
  {
    id: "quiz-addr-l4-q2",
    lessonSlug: "loopback-apipa",
    outcomeId: "ADDR-L4-B",
    question: "Seorang siswa TKJ menyambungkan PC ke switch lab dan mendapatkan IP 169.254.80.200. Apakah akar masalah yang paling mungkin?",
    options: [
      { id: "opt-a", text: "PC terkena virus yang mengubah konfigurasi IP" },
      { id: "opt-b", text: "Komputer berhasil terhubung langsung ke satelit internet" },
      { id: "opt-c", text: "Komputer gagal berkomunikasi atau tidak mendapatkan respon dari DHCP Server" },
      { id: "opt-d", text: "Kapasitas hard disk komputer telah penuh" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Rentang 169.254.0.0/16 adalah APIPA yang digenerate oleh sistem operasi saat klien DHCP tidak menerima respon penawaran dari DHCP server.",
    misconceptionFeedback:
      "APIPA bukan virus atau alamat acak internet, melainkan mekanisme fallback bawaan OS ketika gagal mendapatkan IP dari DHCP server.",
  },
  {
    id: "quiz-addr-l4-q3",
    lessonSlug: "loopback-apipa",
    outcomeId: "ADDR-L4-B",
    question: "Apakah perangkat yang mendapatkan alamat APIPA (169.254.x.x) dapat mengakses website di internet secara langsung?",
    options: [
      { id: "opt-a", text: "Bisa, karena APIPA adalah IP publik generasi terbaru" },
      { id: "opt-b", text: "Tidak bisa, karena alamat APIPA tidak memiliki konfigurasi Default Gateway yang valid dan tidak dirutekan ke luar" },
      { id: "opt-c", text: "Bisa, asalkan menggunakan kabel serat optik" },
      { id: "opt-d", text: "Bisa, namun kecepatan internet dibatasi maksimal 10 Mbps" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "APIPA hanya berlaku secara link-local antar komputer di satu switch lokal dan tidak memiliki konfigurasi Default Gateway untuk keluar ke internet.",
    misconceptionFeedback:
      "Tanpa gateway yang valid, komputer tidak tahu ke mana harus melempar paket ke luar jaringan lokal, sehingga akses internet mustahil terjadi.",
  },

  // =========================================================================
  // Module 3: Subnet Mask & Notasi CIDR (P2-M3)
  // =========================================================================

  // Lesson 5: subnet-mask
  {
    id: "quiz-mask-l5-q1",
    lessonSlug: "subnet-mask",
    outcomeId: "MASK-L5-A",
    question: "Manakah nilai subnet mask berikut yang TIDAK SAH secara standar protokol IPv4?",
    options: [
      { id: "opt-a", text: "255.255.255.0" },
      { id: "opt-b", text: "255.255.255.128" },
      { id: "opt-c", text: "255.255.0.255" },
      { id: "opt-d", text: "255.255.254.0" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "255.255.0.255 tidak sah karena dalam representasi biner, bit 1 terputus oleh deretan bit 0 di oktet ketiga. Subnet mask wajib tersusun dari angka 1 bersambung dari kiri.",
    misconceptionFeedback:
      "Subnet mask harus berupa bit 1 yang bersambung tanpa putus dari kiri ke kanan. Keberadaan 255 di akhir setelah 0 melanggar aturan kontinuitas mask.",
  },
  {
    id: "quiz-mask-l5-q2",
    lessonSlug: "subnet-mask",
    outcomeId: "MASK-L5-A",
    question: "Pada subnet mask biner, apakah fungsi dari bit-bit yang bernilai 1?",
    options: [
      { id: "opt-a", text: "Menandai porsi Network ID (alamat jaringan)" },
      { id: "opt-b", text: "Menandai porsi Host ID (nomor komputer)" },
      { id: "opt-c", text: "Menandai alamat server DNS" },
      { id: "opt-d", text: "Menandai batas kecepatan bandwidth" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Bit bernilai 1 pada subnet mask mengindikasikan bahwa bit-bit yang bersesuaian pada alamat IP merupakan Network Portion.",
    misconceptionFeedback:
      "Bit bernilai 1 adalah bit Network, sedangkan bit bernilai 0 adalah bit Host.",
  },
  {
    id: "quiz-mask-l5-q3",
    lessonSlug: "subnet-mask",
    outcomeId: "MASK-L5-B",
    question: "Berapa hasil operasi bitwise AND antara IP 10.10.5.20 dengan subnet mask 255.255.0.0?",
    options: [
      { id: "opt-a", text: "10.0.0.0" },
      { id: "opt-b", text: "10.10.0.0" },
      { id: "opt-c", text: "10.10.5.0" },
      { id: "opt-d", text: "10.10.5.20" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Mask 255.255.0.0 mempertahankan 2 oktet pertama (10.10) dan mengubah seluruh bit di 2 oktet terakhir menjadi 0, sehingga Network ID adalah 10.10.0.0.",
    misconceptionFeedback:
      "Operasi AND dengan 255 mempertahankan nilai asli oktet, sedangkan AND dengan 0 selalu menghasilkan 0.",
  },

  // Lesson 6: cidr-notation
  {
    id: "quiz-mask-l6-q1",
    lessonSlug: "cidr-notation",
    outcomeId: "MASK-L6-A",
    question: "Manakah subnet mask desimal bertitik yang setara dengan prefix notasi /26?",
    options: [
      { id: "opt-a", text: "255.255.255.0" },
      { id: "opt-b", text: "255.255.255.128" },
      { id: "opt-c", text: "255.255.255.192" },
      { id: "opt-d", text: "255.255.255.224" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "/26 memiliki 26 bit 1. Tiga oktet pertama bernilai 24 bit (255.255.255), dan 2 bit pada oktet ke-4 bernilai 128 + 64 = 192, sehingga mask-nya adalah 255.255.255.192.",
    misconceptionFeedback:
      "/24 = .0, /25 = .128, /26 = .192 (128 + 64), /27 = .224 (128 + 64 + 32).",
  },
  {
    id: "quiz-mask-l6-q2",
    lessonSlug: "cidr-notation",
    outcomeId: "MASK-L6-A",
    question: "Subnet mask 255.255.255.248 setara dengan prefix CIDR berapakah?",
    options: [
      { id: "opt-a", text: "/27" },
      { id: "opt-b", text: "/28" },
      { id: "opt-c", text: "/29" },
      { id: "opt-d", text: "/30" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "248 dalam biner adalah 11111000 (5 bit 1). Total bit 1 adalah 24 + 5 = 29, sehingga setara dengan /29.",
    misconceptionFeedback:
      "240 adalah /28 (4 bit 1), 248 adalah /29 (5 bit 1), dan 252 adalah /30 (6 bit 1).",
  },
  {
    id: "quiz-mask-l6-q3",
    lessonSlug: "cidr-notation",
    outcomeId: "MASK-L6-B",
    question: "PC 1 memiliki IP 10.0.1.5/24 dan PC 2 memiliki IP 10.0.2.5/24 terhubung pada satu switch unmanaged yang sama tanpa router. Apakah kedua PC dapat saling ping?",
    options: [
      { id: "opt-a", text: "Bisa, karena kedua PC sama-sama berawalan 10.0" },
      { id: "opt-b", text: "Bisa, asalkan menggunakan kabel UTP Cat6" },
      { id: "opt-c", text: "Tidak bisa, karena dengan prefix /24, Network ID PC 1 (10.0.1.0) berbeda dengan Network ID PC 2 (10.0.2.0)" },
      { id: "opt-d", text: "Bisa, namun waktu respon ping sangat lambat (> 500ms)" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Dengan prefix /24, Network ID ditentukan oleh 3 oktet pertama. PC 1 berada di 10.0.1.0/24 dan PC 2 di 10.0.2.0/24. Karena beda subnet dan tanpa gateway perantara, komunikasi Layer 2 tidak dapat terjadi.",
    misconceptionFeedback:
      "Meskipun oktet 1 dan 2 sama (10.0), prefix /24 mencakup 3 oktet. 10.0.1.x dan 10.0.2.x adalah dua jaringan yang berbeda dan butuh router untuk terhubung.",
  },

  // =========================================================================
  // Module 4: Kalkulasi Parameter Subnetting (P2-M4)
  // =========================================================================

  // Lesson 7: network-broadcast
  {
    id: "quiz-calc-l7-q1",
    lessonSlug: "network-broadcast",
    outcomeId: "CALC-L7-A",
    question: "Berapakah nilai Magic Number (ukuran blok) dari subnet dengan prefix /27 (mask 255.255.255.224)?",
    options: [
      { id: "opt-a", text: "16" },
      { id: "opt-b", text: "32" },
      { id: "opt-c", text: "64" },
      { id: "opt-d", text: "128" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Magic Number dihitung dengan 256 - nilai oktet mask: 256 - 224 = 32. Setiap subnet pada prefix /27 melompat dengan interval 32 alamat.",
    misconceptionFeedback:
      "Gunakan rumus 256 - nilai mask aktif. 256 - 224 = 32, bukan 16 atau 64.",
  },
  {
    id: "quiz-calc-l7-q2",
    lessonSlug: "network-broadcast",
    outcomeId: "CALC-L7-B",
    question: "Berapakah Network ID dari alamat host 192.168.1.130/26?",
    options: [
      { id: "opt-a", text: "192.168.1.0" },
      { id: "opt-b", text: "192.168.1.64" },
      { id: "opt-c", text: "192.168.1.128" },
      { id: "opt-d", text: "192.168.1.192" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Prefix /26 memiliki ukuran blok 64 (kelipatan: 0, 64, 128, 192). Angka 130 berada di antara 128 dan 192, sehingga Network ID-nya adalah 192.168.1.128.",
    misconceptionFeedback:
      "Cari kelipatan blok 64 terdekat yang lebih kecil atau sama dengan 130. Kelipatannya adalah 0, 64, 128, 192 -> maka jawabannya 128.",
  },
  {
    id: "quiz-calc-l7-q3",
    lessonSlug: "network-broadcast",
    outcomeId: "CALC-L7-B",
    question: "Berapakah Broadcast Address dari subnet 10.0.50.16/28?",
    options: [
      { id: "opt-a", text: "10.0.50.25" },
      { id: "opt-b", text: "10.0.50.31" },
      { id: "opt-c", text: "10.0.50.32" },
      { id: "opt-d", text: "10.0.50.255" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Prefix /28 memiliki magic number 16 (mask 240, 256 - 240 = 16). Subnet berikutnya dimulai pada 16 + 16 = 32. Broadcast adalah satu angka sebelum subnet berikutnya: 32 - 1 = 10.0.50.31.",
    misconceptionFeedback:
      "Broadcast adalah alamat terakhir sebelum subnet berikutnya dimulai. Subnet berikutnya mulai di 32, sehingga broadcast-nya adalah 31.",
  },

  // Lesson 8: host-range
  {
    id: "quiz-calc-l8-q1",
    lessonSlug: "host-range",
    outcomeId: "CALC-L8-A",
    question: "Jika sebuah subnet memiliki Network ID 172.16.10.64/28, berapakah rentang usable IP host yang sah?",
    options: [
      { id: "opt-a", text: "172.16.10.64 s/d 172.16.10.79" },
      { id: "opt-b", text: "172.16.10.65 s/d 172.16.10.78" },
      { id: "opt-c", text: "172.16.10.65 s/d 172.16.10.79" },
      { id: "opt-d", text: "172.16.10.64 s/d 172.16.10.78" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Subnet /28 berukuran 16 alamat (.64 s/d .79). Network ID (.64) dan Broadcast (.79) tidak boleh dipakai host. Rentang usable adalah dari .65 (Net ID + 1) hingga .78 (Broadcast - 1).",
    misconceptionFeedback:
      "Alamat Network ID (.64) dan Broadcast (.79) tidak boleh dimasukkan ke dalam rentang usable host.",
  },
  {
    id: "quiz-calc-l8-q2",
    lessonSlug: "host-range",
    outcomeId: "CALC-L8-B",
    question: "Sebuah lab komputer sekolah membutuhkan alokasi tepat untuk 28 PC siswa. Manakah prefix CIDR terkecil yang mencukupi kebutuhan tersebut tanpa kekurangan alamat?",
    options: [
      { id: "opt-a", text: "/28 (maksimal 14 host)" },
      { id: "opt-b", text: "/27 (maksimal 30 host)" },
      { id: "opt-c", text: "/26 (maksimal 62 host)" },
      { id: "opt-d", text: "/25 (maksimal 126 host)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Rumus kapasitas host = 2^h - 2. /28 hanya menyediakan 14 host (kurang). /27 menyediakan 2^5 - 2 = 30 host, mencukupi 28 PC dengan sisa 2 host untuk gateway dan printer.",
    misconceptionFeedback:
      "/28 (14 host) tidak cukup untuk 28 PC. /26 mencukupi namun /27 adalah prefix paling hemat dan efisien.",
  },
  {
    id: "quiz-calc-l8-q3",
    lessonSlug: "host-range",
    outcomeId: "CALC-L8-B",
    question: "Mengapa teknisi jaringan selalu menggunakan prefix /30 untuk menghubungkan link kabel serial antar dua router?",
    options: [
      { id: "opt-a", text: "Karena router tidak mendukung subnet mask selain /30" },
      { id: "opt-b", text: "Karena /30 menyediakan tepat 2 alamat usable untuk masing-masing ujung router, menghemat alokasi IP" },
      { id: "opt-c", text: "Karena /30 memberikan kecepatan bandwidth tertinggi" },
      { id: "opt-d", text: "Karena kabel jaringan tidak dapat mentransmisikan data jika prefix-nya /24" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Link point-to-point router hanya memerlukan 2 alamat IP. Prefix /30 menyediakan tepat 2 usable host (2^2 - 2 = 2), sehingga tidak ada pemborosan alamat IP.",
    misconceptionFeedback:
      "Prefix /30 dipilih murni demi efisiensi alokasi IP (menyediakan tepat 2 host usable), bukan karena keterbatasan teknis kabel atau bandwidth.",
  },

  // =========================================================================
  // Module 5: Pembagian Subnet (FLSM) & Desain VLSM (P2-M5)
  // =========================================================================

  // Lesson 9: pembagian-subnet
  {
    id: "quiz-vlsm-l9-q1",
    lessonSlug: "pembagian-subnet",
    outcomeId: "VLSM-L9-A",
    question: "Jika seorang administrator jaringan meminjam 3 bit host dari jaringan /24, berapa banyak subnet baru yang terbentuk dan berapa prefix barunya?",
    options: [
      { id: "opt-a", text: "6 subnet dengan prefix /27" },
      { id: "opt-b", text: "8 subnet dengan prefix /27" },
      { id: "opt-c", text: "8 subnet dengan prefix /26" },
      { id: "opt-d", text: "16 subnet dengan prefix /28" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Jumlah subnet baru = 2^s = 2^3 = 8 subnet. Prefix baru bertambah 3 bit: 24 + 3 = /27.",
    misconceptionFeedback:
      "2 pangkat 3 adalah 8, bukan 6. Dan prefix /24 ditambah 3 bit yang dipinjam menjadi /27.",
  },
  {
    id: "quiz-vlsm-l9-q2",
    lessonSlug: "pembagian-subnet",
    outcomeId: "VLSM-L9-B",
    question: "Apa kelemahan utama dari metode FLSM (Fixed Length Subnet Masking) dalam perancangan jaringan nyata?",
    options: [
      { id: "opt-a", text: "Tidak dapat digunakan pada perangkat switch modern" },
      { id: "opt-b", text: "Seluruh subnet berukuran seragam sehingga terjadi pemborosan IP jika kebutuhan tiap departemen berbeda jauh" },
      { id: "opt-c", text: "Menyebabkan tabrakan paket data di kabel jaringan" },
      { id: "opt-d", text: "Hanya bisa diterapkan pada jaringan internet satelit" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "FLSM memaksa semua subnet memiliki ukuran yang sama. Jika satu lab butuh 50 PC dan link router hanya butuh 2 IP, alokasi /26 akan membuang 60 IP pada link router.",
    misconceptionFeedback:
      "FLSM sepenuhnya kompatibel dengan perangkat modern, namun menyebabkan pemborosan alamat jika ukuran kebutuhan segmen jaringan bervariasi.",
  },
  {
    id: "quiz-vlsm-l9-q3",
    lessonSlug: "pembagian-subnet",
    outcomeId: "VLSM-L9-B",
    question: "Sebuah jaringan 172.16.0.0/16 dibagi menjadi subnet-subnet berukuran /24. Berapakah jumlah subnet /24 yang dapat dibuat dari jaringan tersebut?",
    options: [
      { id: "opt-a", text: "128 subnet" },
      { id: "opt-b", text: "256 subnet" },
      { id: "opt-c", text: "512 subnet" },
      { id: "opt-d", text: "1024 subnet" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Bit yang dipinjam = 24 - 16 = 8 bit. Jumlah subnet terbentuk = 2^8 = 256 subnet (dari 172.16.0.0/24 s.d. 172.16.255.0/24).",
    misconceptionFeedback:
      "Selisih prefix adalah 24 - 16 = 8 bit. 2^8 = 256 subnet.",
  },

  // Lesson 10: vlsm-design
  {
    id: "quiz-vlsm-l10-q1",
    lessonSlug: "vlsm-design",
    outcomeId: "VLSM-L10-A",
    question: "Mengapa dalam perancangan VLSM alokasi subnet harus selalu diurutkan dari kebutuhan host terbesar ke kebutuhan terkecil?",
    options: [
      { id: "opt-a", text: "Untuk mencegah fragmentasi ruang alamat dan memastikan setiap subnet berada pada batas kelipatan blok alaminya" },
      { id: "opt-b", text: "Karena router hanya bisa membaca tabel routing yang disusun secara alfabetis" },
      { id: "opt-c", text: "Agar kabel jaringan tidak mengalami overheating" },
      { id: "opt-d", text: "Karena aturan standar ISO melarang subnet kecil dibuat lebih dulu" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Mengurutkan dari yang terbesar menjamin blok subnet besar dapat ditempatkan pada batas kelipatan alaminya tanpa terpotong oleh subnet kecil, sehingga mencegah tumpang tindih (overlap).",
    misconceptionFeedback:
      "Jika subnet kecil dialokasikan lebih dulu di tengah, batas kelipatan blok untuk subnet besar berikutnya akan rusak dan menyebabkan bentrok alamat (overlap).",
  },
  {
    id: "quiz-vlsm-l10-q2",
    lessonSlug: "vlsm-design",
    outcomeId: "VLSM-L10-B",
    question: "Jika subnet pertama dialokasikan dengan 192.168.10.0/26, pada alamat manakah subnet berikutnya yang berukuran /27 harus dimulai?",
    options: [
      { id: "opt-a", text: "192.168.10.32" },
      { id: "opt-b", text: "192.168.10.64" },
      { id: "opt-c", text: "192.168.10.65" },
      { id: "opt-d", text: "192.168.10.128" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Subnet 192.168.10.0/26 memakai alamat .0 s.d. .63 (broadcast .63). Subnet berikutnya dimulai tepat satu angka setelah broadcast, yaitu 192.168.10.64.",
    misconceptionFeedback:
      ".65 adalah first usable host dari subnet berikutnya, sedangkan Network ID dari subnet berikutnya harus dimulai pada 192.168.10.64.",
  },
  {
    id: "quiz-vlsm-l10-q3",
    lessonSlug: "vlsm-design",
    outcomeId: "VLSM-L10-B",
    question: "Diberikan blok 192.168.10.0/24. Setelah dialokasikan Lab (/26: .0 s/d .63), Guru (/27: .64 s/d .95), TU (/28: .96 s/d .111), Server (/29: .112 s/d .119), dan Link P2P (/30: .120 s/d .123), berapakah sisa alamat IP yang belum terpakai?",
    options: [
      { id: "opt-a", text: "0 IP (habis total)" },
      { id: "opt-b", text: "64 IP" },
      { id: "opt-c", text: "132 IP (mulai dari 192.168.10.124 hingga .255)" },
      { id: "opt-d", text: "256 IP" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Total alamat yang terpakai adalah 64 + 32 + 16 + 8 + 4 = 124 alamat (.0 s/d .123). Dari total 256 alamat (/24), tersisa 256 - 124 = 132 alamat bebas (.124 s/d .255).",
    misconceptionFeedback:
      "Hitung total IP yang terpakai: 64 + 32 + 16 + 8 + 4 = 124 IP. Dari total 256 IP, tersisa 256 - 124 = 132 IP yang masih bebas untuk masa depan.",
  },
];
