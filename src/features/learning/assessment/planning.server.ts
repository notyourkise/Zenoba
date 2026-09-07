/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR NETWORK PLANNING & IT CONSULTANT (P6-M1 s.d. P6-M4)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

import type { PrivateQuizQuestion } from "./welcome.server";

export const planningFormativeQuestions: PrivateQuizQuestion[] = [
  // =========================================================================
  // Module 1: Analisis Kebutuhan Jaringan & Wawancara Klien (P6-M1)
  // =========================================================================

  // Lesson 1: wawancara-klien (P6-L01)
  {
    id: "quiz-plan-l1-q1",
    lessonSlug: "wawancara-klien",
    outcomeId: "PLAN-L1-A",
    question:
      "Seorang pemilik restoran meminta Anda memasang 5 unit Access Point enterprise berharga mahal karena kasir sering gagal memproses transaksi EDC online. Berdasarkan prinsip konsultasi, langkah pertama yang tepat adalah:",
    options: [
      {
        id: "opt-1",
        text: "Langsung memesan 5 AP tersebut sesuai permintaan agar klien puas.",
      },
      {
        id: "opt-2",
        text: "Mewawancarai dan menganalisis apakah kegagalan EDC disebabkan oleh interferensi sinyal Wi-Fi, keterbatasan kuota bandwidth, atau ketiadaan isolasi jaringan kasir dari tamu.",
      },
      {
        id: "opt-3",
        text: "Menolak pesanan karena restoran kecil tidak memerlukan Access Point kelas enterprise.",
      },
      {
        id: "opt-4",
        text: "Menyuruh klien mengganti mesin EDC dengan transaksi tunai saja.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Konsultan profesional mendahulukan analisis problem statement. Sering kali mesin EDC gagal bukan karena kurangnya jumlah AP, melainkan karena trafik kasir berebut bandwidth dengan tamu atau mengalami interferensi frekuensi.",
    misconceptionFeedback:
      "Membeli perangkat mahal tanpa verifikasi akar masalah (premature solution) berisiko menghabiskan anggaran klien tanpa memperbaiki masalah transaksi EDC yang sesungguhnya.",
  },
  {
    id: "quiz-plan-l1-q2",
    lessonSlug: "wawancara-klien",
    outcomeId: "PLAN-L1-A",
    question:
      "Mengapa konsultan jaringan harus membedakan 'Problem Statement' (Pernyataan Masalah) dari 'Premature Solution' (Solusi Prematur)?",
    options: [
      {
        id: "opt-1",
        text: "Agar konsultan dapat menjual perangkat yang memiliki margin keuntungan terbesar bagi vendor.",
      },
      {
        id: "opt-2",
        text: "Karena solusi yang diasumsikan klien sering kali keliru menargetkan gejala permukaan tanpa menyelesaikan akar penyebab teknis yang sebenarnya.",
      },
      {
        id: "opt-3",
        text: "Karena klien tidak berhak menentukan kebutuhan jaringan mereka sendiri.",
      },
      {
        id: "opt-4",
        text: "Supaya waktu pengerjaan proyek dapat diperpanjang selama mungkin.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Klien adalah pakar di bidang bisnis mereka, bukan di bidang rekayasa jaringan. Solusi yang mereka usulkan biasanya hanya menebak-nebak perangkat berdasarkan tren atau promosi.",
    misconceptionFeedback:
      "Fokus konsultan adalah menyelesaikan masalah teknis yang mendasari keluhan bisnis, bukan sekadar menjadi juru beli perangkat pesanan klien.",
  },
  {
    id: "quiz-plan-l1-q3",
    lessonSlug: "wawancara-klien",
    outcomeId: "PLAN-L1-B",
    question:
      "Manakah parameter di bawah ini yang tergolong sebagai batasan operasional non-teknis (Physical/Legal Constraint) yang membatasi pilihan arsitektur jaringan?",
    options: [
      {
        id: "opt-1",
        text: "Bangunan kantor berstatus cagar budaya sewaan yang melarang pembongkaran dinding untuk jalur pipa konduit kabel tembaga.",
      },
      {
        id: "opt-2",
        text: "Panjang maksimum kabel Cat6 UTP 100 meter menurut standar TIA/EIA.",
      },
      {
        id: "opt-3",
        text: "Kapasitas tabel routing MikroTik RouterOS.",
      },
      {
        id: "opt-4",
        text: "Ukuran MTU standar Ethernet 1500 byte.",
      },
    ],
    correctAnswer: "opt-1",
    explanation:
      "Batasan fisik bangunan, status sewa gedung, dan regulasi cagar budaya adalah batasan eksternal nyata yang memaksa konsultan mencari rute kabel alternatif atau mengoptimalkan backbone nirkabel/fiber.",
    misconceptionFeedback:
      "Panjang kabel 100 meter, MTU 1500 byte, dan kapasitas tabel routing adalah batasan teknis standar protokol jaringan, bukan batasan fisik/legal lingkungan operasional klien.",
  },

  // Lesson 2: kriteria-keberhasilan (P6-L02)
  {
    id: "quiz-plan-l2-q1",
    lessonSlug: "kriteria-keberhasilan",
    outcomeId: "PLAN-L2-A",
    question:
      "Manakah rumusan Acceptance Criteria yang paling tepat dan profesional untuk dokumen kontrak serah terima jaringan kantor?",
    options: [
      {
        id: "opt-1",
        text: "Jaringan Wi-Fi harus cukup kuat untuk streaming YouTube tanpa buffering di seluruh sudut gedung.",
      },
      {
        id: "opt-2",
        text: "Kekuatan sinyal Wi-Fi di area meja kerja minimal -65 dBm dengan throughput TCP minimal 80 Mbps dan packet loss 0% saat diuji iperf3 ke server lokal.",
      },
      {
        id: "opt-3",
        text: "Jaringan harus sangat cepat dan tidak pernah ada komplain dari pimpinan perusahaan.",
      },
      {
        id: "opt-4",
        text: "Semua komputer terhubung ke internet dan lampu indikator switch menyala hijau.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Acceptance Criteria harus memenuhi prinsip SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Metrik RSSI -65 dBm dan throughput iperf3 80 Mbps dapat diuji dan dibuktikan secara empiris.",
    misconceptionFeedback:
      "Kriteria seperti 'tanpa buffering' atau 'tidak pernah ada komplain' bersifat subjektif dan tidak dapat diukur secara hukum dalam serah terima teknis.",
  },
  {
    id: "quiz-plan-l2-q2",
    lessonSlug: "kriteria-keberhasilan",
    outcomeId: "PLAN-L2-B",
    question:
      "Sebuah kantor memiliki 40 karyawan. Jika perusahaan menerapkan kebijakan BYOD dengan rata-rata 2.5 perangkat per orang, berapakah perkiraan minimum kapasitas alokasi IP DHCP yang wajib disiapkan?",
    options: [
      {
        id: "opt-1",
        text: "40 IP address (cukup subnet /29).",
      },
      {
        id: "opt-2",
        text: "100 IP address (membutuhkan subnet minimal /25 dengan 126 host usable).",
      },
      {
        id: "opt-3",
        text: "400 IP address (membutuhkan subnet /22).",
      },
      {
        id: "opt-4",
        text: "16 IP address saja.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "40 karyawan x 2.5 perangkat = 100 perangkat aktif. Subnet yang mampu menampung 100 host secara efisien adalah /25 (128 alamat total, 126 usable host).",
    misconceptionFeedback:
      "Hanya menyiapkan 40 IP akan menyebabkan DHCP pool starvation saat karyawan membawa smartphone pribadi di samping laptop kantornya.",
  },
  {
    id: "quiz-plan-l2-q3",
    lessonSlug: "kriteria-keberhasilan",
    outcomeId: "PLAN-L2-A",
    question:
      "Dalam protokol User Acceptance Testing (UAT), bagaimana cara membuktikan bahwa isolasi VLAN jaringan tamu (Guest) dari VLAN staf internal telah berhasil secara teknis?",
    options: [
      {
        id: "opt-1",
        text: "Cukup menanyakan kepada tamu apakah mereka bisa browsing Instagram atau tidak.",
      },
      {
        id: "opt-2",
        text: "Melakukan ICMP ping dan pemindaian port TCP dari laptop di subnet Guest ke IP server/PC di subnet Staff, dan memverifikasi bahwa paket diblokir (100% packet loss / connection refused).",
      },
      {
        id: "opt-3",
        text: "Melihat bahwa kabel switch port tamu dan staf menggunakan warna kabel yang berbeda.",
      },
      {
        id: "opt-4",
        text: "Menonaktifkan password Wi-Fi tamu agar mudah diakses siapa saja.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Uji isolasi keamanan membutuhkan bukti empiris penolakan paket Layer 3/Layer 4: ping dan port scan dari segmen tamu ke segmen internal harus gagal secara konsisten.",
    misconceptionFeedback:
      "Warna kabel atau survei lisan bukan bukti teknis bahwa kontrol akses dan pemisahan broadcast domain telah berjalan pada switch dan firewall.",
  },

  // =========================================================================
  // Module 2: Kapasitas Port, AP, PoE & Penyusunan BoQ (P6-M2)
  // =========================================================================

  // Lesson 3: perhitungan-port-ap-poe (P6-L03)
  {
    id: "quiz-plan-l3-q1",
    lessonSlug: "perhitungan-port-ap-poe",
    outcomeId: "PLAN-L3-A",
    question:
      "Sebuah kantor memiliki 18 komputer staf, 2 printer jaringan, 3 unit Access Point, dan 1 link ke router. Berapakah switch standar industri yang paling tepat dipilih untuk mengakomodasi kebutuhan saat ini sekaligus menyisakan growth buffer yang sehat?",
    options: [
      {
        id: "opt-1",
        text: "Switch 16-port (cukup karena tidak semua PC menyala bersamaan).",
      },
      {
        id: "opt-2",
        text: "Switch 24-port (tepat, menampung 24 port dengan sisa port cadangan).",
      },
      {
        id: "opt-3",
        text: "Switch 8-port sebanyak 3 unit di-daisy chain.",
      },
      {
        id: "opt-4",
        text: "Switch 48-port (terlalu boros dan melebihi anggaran kecil).",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Total port aktif saat ini = 18 + 2 + 3 + 1 = 24 port aktif. Dengan memilih switch 24-port, semua port terpakai penuh pada tahap awal (atau jika ada port uplink SFP terpisah, ada cadangan). Namun untuk opsi standar industri terdekat, switch 24-port adalah ukuran minimal wajib.",
    misconceptionFeedback:
      "Switch 16-port jelas mengalami defisit fisik 8 port. Menghubungkan tiga switch 8-port berantai (daisy-chain) adalah anti-pattern yang menurunkan throughput dan menciptakan bottleneck.",
  },
  {
    id: "quiz-plan-l3-q2",
    lessonSlug: "perhitungan-port-ap-poe",
    outcomeId: "PLAN-L3-B",
    question:
      "Apa konsekuensi teknis jika seorang konsultan menghubungkan Access Point Wi-Fi 6 yang membutuhkan standar daya 802.3at (PoE+ 25 Watt) ke switch lama yang hanya mendukung 802.3af (PoE standar 15.4 Watt)?",
    options: [
      {
        id: "opt-1",
        text: "Access Point akan otomatis mengubah tegangan kabel menjadi 220V AC.",
      },
      {
        id: "opt-2",
        text: "Access Point akan kekurangan daya (underpowered), menyebabkan radio 5 GHz mati, reboot berulang kali (boot loop), atau performa throughput anjlok drastis.",
      },
      {
        id: "opt-3",
        text: "Kabel UTP akan langsung terbakar dalam hitungan detik.",
      },
      {
        id: "opt-4",
        text: "Koneksi internet klien akan otomatis menjadi lebih cepat.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Perangkat 802.3at yang dihubungkan ke sumber 802.3af mengalami kondisi underpowered. Sebagian AP akan mematikan radio frekuensi kedua atau terus menerus reboot saat mencoba memancarkan daya transmisi puncak.",
    misconceptionFeedback:
      "Tegangan PoE adalah 48V DC nominal, bukan 220V AC, dan kabel Cat6 standar tidak langsung terbakar namun perangkat aktif akan malfungsi operasional.",
  },
  {
    id: "quiz-plan-l3-q3",
    lessonSlug: "perhitungan-port-ap-poe",
    outcomeId: "PLAN-L3-B",
    question:
      "Anda merancang jaringan dengan 8 unit Access Point PoE+ (konsumsi daya puncak 20 Watt per unit). Berapakah PoE Power Budget switch minimum yang direkomendasikan dengan memperhitungkan safety margin 20%?",
    options: [
      {
        id: "opt-1",
        text: "60 Watt.",
      },
      {
        id: "opt-2",
        text: "160 Watt.",
      },
      {
        id: "opt-3",
        text: "200 Watt (160 Watt kebutuhan puncak + 40 Watt margin pengaman).",
      },
      {
        id: "opt-4",
        text: "1000 Watt.",
      },
    ],
    correctAnswer: "opt-3",
    explanation:
      "8 AP x 20W = 160W daya total perangkat. Dengan safety margin 20% (160W x 1.25 = 200W), power budget switch minimal adalah 200 Watt agar switch tidak overheat atau memutus port saat trafik puncak.",
    misconceptionFeedback:
      "Memilih switch yang persis 160 Watt (tanpa safety margin) berisiko memicu proteksi kelebihan beban (overcurrent) ketika kabel UTP mengalami resistansi rugi daya (cable loss) pada bentangan panjang.",
  },

  // Lesson 4: penyusunan-boq-anggaran (P6-L04)
  {
    id: "quiz-plan-l4-q1",
    lessonSlug: "penyusunan-boq-anggaran",
    outcomeId: "PLAN-L4-A",
    question:
      "Manakah dari daftar item berikut yang seluruhnya tergolong ke dalam kategori Material Pasif (Passive Infrastructure) dalam BoQ jaringan?",
    options: [
      {
        id: "opt-1",
        text: "Router Gateway, Switch Managed, dan Access Point Wi-Fi 6.",
      },
      {
        id: "opt-2",
        text: "Roll kabel UTP Cat6, Patch Panel 24-port RJ45, Faceplate modular, dan Patch Cord.",
      },
      {
        id: "opt-3",
        text: "Server Database, NAS Storage, dan PDU Listrik.",
      },
      {
        id: "opt-4",
        text: "Firewall hardware dan Mikrotik Cloud Router Switch.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Material pasif adalah media transmisi dan terminasi fisik yang tidak memerlukan daya listrik aktif untuk memproses bit data (kabel, patch panel, konektor, faceplate).",
    misconceptionFeedback:
      "Router, switch, server, dan AP adalah perangkat aktif (Active Hardware) karena membutuhkan catu daya listrik dan memproses logika paket.",
  },
  {
    id: "quiz-plan-l4-q2",
    lessonSlug: "penyusunan-boq-anggaran",
    outcomeId: "PLAN-L4-B",
    question:
      "Klien memiliki pagu anggaran Rp 15.000.000. Jika draf BoQ Anda mencapai Rp 16.500.000 (over budget 1.5 juta), langkah optimasi teknis manakah yang paling etis dan profesional?",
    options: [
      {
        id: "opt-1",
        text: "Menghapus router gateway dan membiarkan modem ISP menangani seluruh beban routing dan DHCP.",
      },
      {
        id: "opt-2",
        text: "Mengganti switch full-PoE 24-port berharga mahal dengan switch gigabit non-PoE 24-port ditambah 2 unit adaptor PoE Injector mandiri untuk menyuplai Access Point.",
      },
      {
        id: "opt-3",
        text: "Menggunakan kabel telepon tembaga bekas untuk menghemat biaya kabel data.",
      },
      {
        id: "opt-4",
        text: "Mengurangi jumlah port switch sehingga 6 komputer karyawan tidak bisa terhubung.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Penggunaan PoE Injector mandiri untuk 2 AP pada switch non-PoE adalah teknik Value Engineering standar yang memangkas biaya jutaan rupiah tanpa mengurangi fungsionalitas port kabel maupun kestabilan AP.",
    misconceptionFeedback:
      "Menghilangkan router gateway atau mengorbankan port PC staf merusak konektivitas esensial dan merupakan pelanggaran desain fatal.",
  },
  {
    id: "quiz-plan-l4-q3",
    lessonSlug: "penyusunan-boq-anggaran",
    outcomeId: "PLAN-L4-B",
    question:
      "Mengapa dalam evaluasi proposal IT Consultant Netloka, efisiensi biaya (Cost Efficiency) yang tinggi tidak dapat menyelamatkan proposal yang tidak memiliki Router Gateway?",
    options: [
      {
        id: "opt-1",
        text: "Karena tanpa router gateway, jaringan lokal tidak memiliki penerjemah rute L3 dan NAT untuk mengakses internet, sehingga jaringan gagal berfungsi secara esensial.",
      },
      {
        id: "opt-2",
        text: "Karena router adalah perangkat paling mahal di dalam katalog.",
      },
      {
        id: "opt-3",
        text: "Karena warna router membuat tampilan rak server lebih menarik.",
      },
      {
        id: "opt-4",
        text: "Karena vendor switch mewajibkan pembelian router dari merk yang sama.",
      },
    ],
    correctAnswer: "opt-1",
    explanation:
      "Sesuai prinsip 'budget success cannot conceal missing critical connectivity', jaringan yang murah namun tidak dapat menghubungkan pengguna ke gateway internet adalah solusi yang gagal total.",
    misconceptionFeedback:
      "Scoring konsultan mengutamakan fungsi operasional nyata klien, bukan sekadar harga murah atau aspek estetika perangkat.",
  },

  // =========================================================================
  // Module 3: Desain Topologi Hirarkis, Subnetting & VLAN (P6-M3)
  // =========================================================================

  // Lesson 5: desain-topologi-hirarkis (P6-L05)
  {
    id: "quiz-plan-l5-q1",
    lessonSlug: "desain-topologi-hirarkis",
    outcomeId: "PLAN-L5-A",
    question:
      "Dalam model jaringan 3-tier, lapisan (layer) manakah yang memiliki fungsi utama menghubungkan perangkat komputer pengguna, menerapkan Port Security, dan mengalirkan daya listrik PoE?",
    options: [
      {
        id: "opt-1",
        text: "Core Layer.",
      },
      {
        id: "opt-2",
        text: "Access Layer.",
      },
      {
        id: "opt-3",
        text: "Distribution Layer.",
      },
      {
        id: "opt-4",
        text: "Internet Service Provider (ISP) Layer.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Access Layer adalah gerbang pertama perangkat endpoint (PC, printer, IP phone, AP) masuk ke jaringan. Fitur seperti 802.1X, Port Security, VLAN membership, dan PoE diterapkan di layer ini.",
    misconceptionFeedback:
      "Distribution Layer menangani inter-VLAN routing dan ACL boundary, sedangkan Core Layer murni berfokus pada kecepatan switching backbone antar area.",
  },
  {
    id: "quiz-plan-l5-q2",
    lessonSlug: "desain-topologi-hirarkis",
    outcomeId: "PLAN-L5-B",
    question:
      "Mengapa arsitektur Collapsed Core sangat populer dan direkomendasikan untuk jaringan kantor menengah (SME / Small Office)?",
    options: [
      {
        id: "opt-1",
        text: "Karena arsitektur ini menggabungkan fungsi Core dan Distribution ke dalam satu perangkat yang sama, menghemat biaya pengadaan hardware dan kompleksitas kabel.",
      },
      {
        id: "opt-2",
        text: "Karena arsitektur ini tidak memerlukan switch maupun router.",
      },
      {
        id: "opt-3",
        text: "Karena arsitektur ini secara otomatis melarang penggunaan koneksi internet nirkabel Wi-Fi.",
      },
      {
        id: "opt-4",
        text: "Karena arsitektur ini hanya bisa menggunakan kabel fiber optik 100G.",
      },
    ],
    correctAnswer: "opt-1",
    explanation:
      "Pada jaringan berskala menengah, volume trafik internal belum menjustifikasi pemisahan fisik switch Core dan switch Distribution. Menggabungkannya (Collapsed Core) memberikan efisiensi biaya terbaik tanpa mengorbankan performa.",
    misconceptionFeedback:
      "Arsitektur Collapsed Core tetap menggunakan router dan switch terkelola, namun lapisan agregasi dan backbone-nya berada pada sasis yang sama.",
  },
  {
    id: "quiz-plan-l5-q3",
    lessonSlug: "desain-topologi-hirarkis",
    outcomeId: "PLAN-L5-B",
    question:
      "Sebuah warnet gaming dengan 30 PC mengalami kelumpuhan total setiap kali kabel ISP fiber putus tertabrak truk. Desain redundansi paling hemat biaya untuk mengeliminasi SPOF ini adalah:",
    options: [
      {
        id: "opt-1",
        text: "Membeli 30 unit PC baru.",
      },
      {
        id: "opt-2",
        text: "Memasang router Dual-WAN dengan link ISP sekunder (failover otomatis ke ISP cadangan atau modem seluler 4G/5G).",
      },
      {
        id: "opt-3",
        text: "Menyambung ulang kabel serat optik menggunakan lem kertas.",
      },
      {
        id: "opt-4",
        text: "Mengganti semua switch gigabit menjadi switch fast ethernet 100 Mbps.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Single Point of Failure pada koneksi internet diatasi dengan memasang router berfitur Dual-WAN Failover dan berlangganan ISP kedua dengan jalur fisik yang berbeda.",
    misconceptionFeedback:
      "Membeli PC baru atau mengganti switch tidak menyelesaikan SPOF pada link penyedia internet (WAN).",
  },

  // Lesson 6: perencanaan-ip-dan-vlan (P6-L06)
  {
    id: "quiz-plan-l6-q1",
    lessonSlug: "perencanaan-ip-dan-vlan",
    outcomeId: "PLAN-L6-A",
    question:
      "Departemen Keuangan memiliki 20 PC staf dan membutuhkan keamanan data tinggi. Subnet IPv4 manakah yang paling efisien (hemat IP) namun tetap menyediakan ruang pertumbuhan yang cukup?",
    options: [
      {
        id: "opt-1",
        text: "Subnet /28 (hanya 14 host usable, tidak cukup untuk 20 PC).",
      },
      {
        id: "opt-2",
        text: "Subnet /27 (menyediakan 30 host usable, pas untuk 20 PC + 10 cadangan).",
      },
      {
        id: "opt-3",
        text: "Subnet /24 (254 host usable, terlalu banyak IP terbuang jika ruang alamat terbatas).",
      },
      {
        id: "opt-4",
        text: "Subnet /30 (hanya 2 host usable).",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Prefix /27 memiliki total 32 alamat IP dengan 30 usable host ($2^5 - 2 = 30$). Ini menampung 20 PC dengan sisa 10 host sebagai growth buffer.",
    misconceptionFeedback:
      "Subnet /28 hanya menyediakan 14 IP sehingga 6 PC tidak akan mendapat IP. Subnet /24 terlalu boros (membuang 234 IP) jika ruang subnetting privat terbatas.",
  },
  {
    id: "quiz-plan-l6-q2",
    lessonSlug: "perencanaan-ip-dan-vlan",
    outcomeId: "PLAN-L6-A",
    question:
      "Manakah dari pasangan subnet berikut ini yang mengalami tabrakan pengalamatan (IP Address Overlap) sehingga akan merusak tabel routing jaringan?",
    options: [
      {
        id: "opt-1",
        text: "Subnet A: 192.168.1.0/24 dan Subnet B: 192.168.2.0/24.",
      },
      {
        id: "opt-2",
        text: "Subnet A: 10.0.0.0/23 (rentang 10.0.0.0 - 10.0.1.255) dan Subnet B: 10.0.1.0/24 (rentang 10.0.1.0 - 10.0.1.255).",
      },
      {
        id: "opt-3",
        text: "Subnet A: 172.16.10.0/24 dan Subnet B: 172.16.20.0/24.",
      },
      {
        id: "opt-4",
        text: "Subnet A: 192.168.10.0/25 dan Subnet B: 192.168.10.128/25.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Subnet 10.0.0.0/23 mencakup seluruh rentang dari 10.0.0.0 hingga 10.0.1.255. Oleh karena itu, subnet 10.0.1.0/24 berada di dalam rentang Subnet A (terjadi IP overlap fatal).",
    misconceptionFeedback:
      "192.168.10.0/25 dan 192.168.10.128/25 adalah partisi bersih dari /24 dan tidak bertumpang tindih sama sekali.",
  },
  {
    id: "quiz-plan-l6-q3",
    lessonSlug: "perencanaan-ip-dan-vlan",
    outcomeId: "PLAN-L6-B",
    question:
      "Mengapa konsultan jaringan profesional wajib menempatkan Access Point Wi-Fi tamu (Guest SSID) pada VLAN terpisah dari komputer kerja staf kantor?",
    options: [
      {
        id: "opt-1",
        text: "Agar tamu tidak dapat memindai (scan) port terbuka, mengakses file sharing rahasia, maupun menyebarkan malware ke workstation staf internal.",
      },
      {
        id: "opt-2",
        text: "Agar sinyal Wi-Fi tamu bisa memancarkan warna lampu LED yang berbeda pada Access Point.",
      },
      {
        id: "opt-3",
        text: "Karena protokol TCP/IP tidak mendukung koneksi nirkabel tanpa VLAN.",
      },
      {
        id: "opt-4",
        text: "Hanya untuk menghabiskan stok nomor VLAN pada switch.",
      },
    ],
    correctAnswer: "opt-1",
    explanation:
      "Pemisahan VLAN Guest mencegah penyerang di jaringan publik menjangkau port SMB, RDP, atau database internal kantor, mengisolasi potensi ancaman keamanan.",
    misconceptionFeedback:
      "VLAN beroperasi pada Layer 2 Ethernet, tidak ada hubungannya dengan warna lampu LED AP fisik atau batasan bawaan Wi-Fi.",
  },

  // =========================================================================
  // Module 4: Dokumentasi Teknis Proposal & Review Desain (P6-M4)
  // =========================================================================

  // Lesson 7: dokumentasi-teknis-jaringan (P6-L07)
  {
    id: "quiz-plan-l7-q1",
    lessonSlug: "dokumentasi-teknis-jaringan",
    outcomeId: "PLAN-L7-A",
    question:
      "Siapakah target pembaca utama dari bagian Ringkasan Eksekutif (Executive Summary) dalam dokumen proposal jaringan?",
    options: [
      {
        id: "opt-1",
        text: "Teknisi instalasi kabel junior di lapangan.",
      },
      {
        id: "opt-2",
        text: "Pengambil keputusan strategis atau pemilik bisnis (Direktur, Notaris, Finance) yang membutuhkan gambaran nilai bisnis, mitigasi risiko, dan estimasi total investasi.",
      },
      {
        id: "opt-3",
        text: "Customer service dari pihak penyedia layanan internet (ISP).",
      },
      {
        id: "opt-4",
        text: "Pihak produsen pabrik perangkat keras di luar negeri.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Executive Summary dirancang untuk eksekutif dan pemilik bisnis yang tidak memiliki latar belakang teknik mendalam, agar mereka memahami mengapa investasi ini layak disetujui.",
    misconceptionFeedback:
      "Teknisi lapangan membaca bagian diagram topologi fisik dan detail terminasi patch panel, bukan Executive Summary ringkas.",
  },
  {
    id: "quiz-plan-l7-q2",
    lessonSlug: "dokumentasi-teknis-jaringan",
    outcomeId: "PLAN-L7-A",
    question:
      "Mengapa klausul Out-of-Scope (Hal yang Tidak Termasuk) wajib dicantumkan secara eksplisit dalam dokumen proposal?",
    options: [
      {
        id: "opt-1",
        text: "Untuk membatasi ekspektasi klien dan mencegah pembengkakan cakupan kerja sepihak (*scope creep*) tanpa tambahan biaya yang wajar.",
      },
      {
        id: "opt-2",
        text: "Agar konsultan tidak perlu melakukan konfigurasi router.",
      },
      {
        id: "opt-3",
        text: "Hanya untuk memenuhi jumlah minimal halaman dokumen agar terlihat tebal.",
      },
      {
        id: "opt-4",
        text: "Supaya konsultan bisa pulang lebih awal dari jadwal yang ditentukan.",
      },
    ],
    correctAnswer: "opt-1",
    explanation:
      "Klausul Out-of-Scope melindungi konsultan dari permintaan pekerjaan di luar kesepakatan awal (misal memperbaiki printer rusak atau instalasi OS PC) tanpa anggaran tambahan.",
    misconceptionFeedback:
      "Konfigurasi router tetap merupakan kewajiban In-Scope jika termasuk dalam desain jaringan yang disepakati.",
  },
  {
    id: "quiz-plan-l7-q3",
    lessonSlug: "dokumentasi-teknis-jaringan",
    outcomeId: "PLAN-L7-B",
    question:
      "Manakah pasangan artefak teknis berikut yang wajib sinkron dan tidak boleh saling bertentangan dalam satu dokumen proposal?",
    options: [
      {
        id: "opt-1",
        text: "Tabel BoQ mencantumkan switch 24-port PoE, namun diagram topologi dan teks narasi menggambarkan switch 8-port unmanaged.",
      },
      {
        id: "opt-2",
        text: "Diagram topologi, tabel IP/VLAN, dan BoQ perangkat yang konsisten dalam jumlah interface, nomor VLAN ID, dan kuantitas perangkat yang dibeli.",
      },
      {
        id: "opt-3",
        text: "Nama klien di halaman depan berbeda dengan nama klien di halaman kesimpulan.",
      },
      {
        id: "opt-4",
        text: "Kabel UTP tercatat 1 meter namun topologi menghubungkan 2 gedung terpisah sejauh 1 kilometer.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Konsistensi artefak adalah bukti profesionalisme: jumlah port di topologi harus cocok dengan spesifikasi SKU di BoQ dan alokasi VLAN di tabel pengalamatan IP.",
    misconceptionFeedback:
      "Opsi 1, 3, dan 4 adalah contoh inkonsistensi fatal yang merusak kredibilitas konsultan di mata klien.",
  },

  // Lesson 8: review-desain-dan-revisi (P6-L08)
  {
    id: "quiz-plan-l8-q1",
    lessonSlug: "review-desain-dan-revisi",
    outcomeId: "PLAN-L8-A",
    question:
      "Sebuah proposal jaringan kantor meraih skor efisiensi biaya maksimal (20/20) dan skalabilitas tinggi (20/20), namun perancang tidak memasukkan Router Gateway ke dalam BoQ. Menurut standar scoring Netloka Consultant, apakah status kelulusan proposal tersebut?",
    options: [
      {
        id: "opt-1",
        text: "Lulus dengan predikat cumlaude karena anggarannya sangat hemat.",
      },
      {
        id: "opt-2",
        text: "Tidak Lulus (GAGAL), karena ketiadaan Router Gateway merupakan pelanggaran konektivitas esensial kritis yang tidak dapat ditoleransi.",
      },
      {
        id: "opt-3",
        text: "Lulus bersyarat dengan potongan nilai 5 poin saja.",
      },
      {
        id: "opt-4",
        text: "Tergantung apakah klien menyadari ketiadaan router tersebut atau tidak.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Konektivitas kritis tidak dapat dikompromikan dengan harga murah. Tanpa router gateway, jaringan kantor terisolasi total dari internet.",
    misconceptionFeedback:
      "Skor tinggi pada dimensi lain tidak dapat menutupi kegagalan fungsi dasar infrastruktur.",
  },
  {
    id: "quiz-plan-l8-q2",
    lessonSlug: "review-desain-dan-revisi",
    outcomeId: "PLAN-L8-B",
    question:
      "Klien sekolah membutuhkan jaringan untuk 35 komputer laboratorium. Perancang mengusulkan 1 unit switch 24-port dan 1 unit switch 8-port (total 32 port). Apa temuan audit teknis Anda terhadap proposal ini?",
    options: [
      {
        id: "opt-1",
        text: "Proposal sempurna dan siap dipasang.",
      },
      {
        id: "opt-2",
        text: "Proposal mengalami defisit port fatal: total port (32) lebih sedikit daripada komputer klien (35), belum termasuk port uplink router, sehingga 3+ komputer tidak akan bisa terkoneksi.",
      },
      {
        id: "opt-3",
        text: "Switch 24-port terlalu cepat untuk lingkungan sekolah.",
      },
      {
        id: "opt-4",
        text: "Kabel jaringan sekolah seharusnya menggunakan kabel telepon.",
      },
    ],
    correctAnswer: "opt-2",
    explanation:
      "Kapasitas port switch fisik (32) defisit terhadap jumlah PC (35). Proposal yang kekurangan port akses otomatis gagal memenuhi kebutuhan dasar klien.",
    misconceptionFeedback:
      "Switch 24-port + 8-port hanya menyediakan 32 port (bahkan berkurang lagi untuk port interlink antar switch), sehingga tidak memenuhi kebutuhan 35 PC.",
  },
  {
    id: "quiz-plan-l8-q3",
    lessonSlug: "review-desain-dan-revisi",
    outcomeId: "PLAN-L8-B",
    question:
      "Jika klien kantor logistik mensyaratkan segmentasi data antara jaringan staf gudang dan jaringan tamu, perbaikan desain manakah yang wajib dilakukan pada pengadaan switch?",
    options: [
      {
        id: "opt-1",
        text: "Menggunakan Switch Managed yang mendukung tagging IEEE 802.1Q dan mendefinisikan tabel alokasi VLAN ID.",
      },
      {
        id: "opt-2",
        text: "Membeli switch unmanaged berharga murah sebanyak mungkin.",
      },
      {
        id: "opt-3",
        text: "Mematikan fitur Wi-Fi kantor selamanya.",
      },
      {
        id: "opt-4",
        text: "Menyambungkan semua komputer ke satu hub broadcast yang sama.",
      },
    ],
    correctAnswer: "opt-1",
    explanation:
      "Segmentasi VLAN memerlukan dukungan perangkat keras Switch Managed (802.1Q) agar paket data dapat diberi tag VLAN dan diisolasi per domain broadcast.",
    misconceptionFeedback:
      "Switch unmanaged tidak mengenali tag VLAN 802.1Q dan akan meneruskan paket broadcast ke seluruh port tanpa isolasi.",
  },
];
