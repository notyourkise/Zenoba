/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR NETWORK FOUNDATIONS (P1-M2 s.d. P1-M8)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

import type { PrivateQuizQuestion } from "./welcome.server";

export const foundationsFormativeQuestions: PrivateQuizQuestion[] = [
  // =========================================================================
  // Module 2: Types of Networks (P1-M2)
  // =========================================================================

  // Lesson 5: lan-man-wan
  {
    id: "quiz-ton-l5-q1",
    lessonSlug: "lan-man-wan",
    outcomeId: "TON-L5-A",
    question: "Manakah karakteristik utama yang membedakan LAN dari WAN?",
    options: [
      { id: "opt-a", text: "LAN menggunakan kabel sedangkan WAN selalu nirkabel satelit" },
      {
        id: "opt-b",
        text: "LAN terbatas pada area lokal privat, sedangkan WAN melintasi area geografis luas melalui penyedia publik",
      },
      { id: "opt-c", text: "LAN hanya dapat menghubungkan maksimal 10 komputer saja" },
      { id: "opt-d", text: "LAN tidak memerlukan alamat IP untuk berkomunikasi" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "LAN mencakup area terbatas milik organisasi privat, sedangkan WAN melintasi wilayah luas via provider telekomunikasi.",
    misconceptionFeedback:
      "Media kabel maupun nirkabel dapat digunakan di LAN maupun WAN. Pembeda utamanya adalah cakupan geografis dan kepemilikan infrastruktur.",
  },
  {
    id: "quiz-ton-l5-q2",
    lessonSlug: "lan-man-wan",
    outcomeId: "TON-L5-A",
    question:
      "Jaringan yang menghubungkan kantor dinas pendidikan kabupaten dengan seluruh SMP dan SMA di wilayah kota tersebut paling tepat diklasifikasikan sebagai:",
    options: [
      { id: "opt-a", text: "PAN (Personal Area Network)" },
      { id: "opt-b", text: "MAN (Metropolitan Area Network)" },
      { id: "opt-c", text: "LAN (Local Area Network)" },
      { id: "opt-d", text: "SAN (Storage Area Network)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Jaringan skala satu kota metropolitan yang menghubungkan instansi antarlokasi disebut MAN.",
    misconceptionFeedback:
      "Karena mencakup satu wilayah kota atau kabupaten dan melintasi batas gedung sekolah, jaringan ini bukan LAN melainkan MAN (Metropolitan Area Network).",
  },
  {
    id: "quiz-ton-l5-q3",
    lessonSlug: "lan-man-wan",
    outcomeId: "TON-L5-B",
    question:
      "Sebuah SMK membuka lab ujian berbasis komputer dengan 40 PC terhubung ke switch gigabit tanpa koneksi luar. Ini adalah contoh murni dari:",
    options: [
      { id: "opt-a", text: "WAN privat" },
      { id: "opt-b", text: "LAN lokal mandiri (Isolated LAN)" },
      { id: "opt-c", text: "Internet publik" },
      { id: "opt-d", text: "MAN antarsekolah" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Koneksi 40 PC di dalam ruangan yang terhubung ke switch lokal adalah Local Area Network (LAN).",
    misconceptionFeedback:
      "Jaringan lokal tidak memerlukan sambungan keluar atau internet untuk disebut sebagai LAN. Koneksi terisolasi dalam satu lab adalah isolated LAN.",
  },

  // Lesson 6: network-contexts-home-school-enterprise
  {
    id: "quiz-ton-l6-q1",
    lessonSlug: "network-contexts-home-school-enterprise",
    outcomeId: "TON-L6-A",
    question:
      "Mengapa jaringan Enterprise umumnya memisahkan Router, Switch, dan Firewall ke perangkat terpisah dibanding perangkat all-in-one seperti di rumah?",
    options: [
      { id: "opt-a", text: "Agar teknisi terlihat memiliki lebih banyak pekerjaan kabel" },
      {
        id: "opt-b",
        text: "Untuk menangani beban trafik tinggi, memudahkan skalabilitas, dan memberikan keandalan performa khusus",
      },
      { id: "opt-c", text: "Karena perangkat all-in-one dilarang oleh aturan pemerintah" },
      { id: "opt-d", text: "Agar komputer pengguna tidak memerlukan kartu jaringan" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Perangkat khusus (dedicated) mampu memproses jutaan paket per detik dengan fitur keamanan canggih dan stabilitas tinggi.",
    misconceptionFeedback:
      "Pemisahan perangkat bukan alasan estetika atau aturan, melainkan kebutuhan kapasitas komputasi, keandalan (reliability), dan manajemen beban kerja korporasi.",
  },
  {
    id: "quiz-ton-l6-q2",
    lessonSlug: "network-contexts-home-school-enterprise",
    outcomeId: "TON-L6-A",
    question:
      "Prioritas utama teknisi TKJ saat mengonfigurasi jaringan lab komputer sekolah untuk pelaksanaan Asesmen/Ujian Berbasis Komputer adalah:",
    options: [
      { id: "opt-a", text: "Mengaktifkan kecepatan unduh maksimal untuk streaming video 4K" },
      {
        id: "opt-b",
        text: "Memastikan stabilitas koneksi lokal ke server ujian dan membatasi akses keluar yang tidak diperlukan",
      },
      { id: "opt-c", text: "Membuka seluruh port firewall agar koneksi bebas tanpa hambatan" },
      { id: "opt-d", text: "Mengganti semua kabel LAN menjadi koneksi Bluetooth" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Kestabilan koneksi lokal dan pembatasan trafik liar adalah kunci kelancaran ujian berbasis komputer di sekolah.",
    misconceptionFeedback:
      "Ujian berbasis komputer memerlukan latensi rendah, stabilitas lokal, dan pembatasan akses internet yang tidak relevan agar ujian aman dan tidak lag.",
  },
  {
    id: "quiz-ton-l6-q3",
    lessonSlug: "network-contexts-home-school-enterprise",
    outcomeId: "TON-L6-B",
    question:
      "Sebuah kantor konsultan hukum dengan 15 karyawan membutuhkan jaringan untuk berbagi file kerja dan printer. Skenario ini paling tepat dikategorikan sebagai:",
    options: [
      { id: "opt-a", text: "Jaringan SOHO (Small Office Home Office)" },
      { id: "opt-b", text: "Jaringan Backbone Antarbenua (WAN)" },
      { id: "opt-c", text: "Jaringan Satelit Maritim" },
      { id: "opt-d", text: "Jaringan Data Center Tier-4" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Kantor kecil dengan 10–20 karyawan termasuk ke dalam kategori SOHO (Small Office / Home Office).",
    misconceptionFeedback:
      "Skala kantor kecil dengan belasan pengguna tidak memerlukan data center tier-4 atau jaringan antarbenua, melainkan masuk kategori arsitektur SOHO.",
  },

  // =========================================================================
  // Module 3: Client, Server & Communication (P1-M3)
  // =========================================================================

  // Lesson 7: client-server-roles
  {
    id: "quiz-csc-l7-q1",
    lessonSlug: "client-server-roles",
    outcomeId: "CSC-L7-A",
    question:
      "Apa kriteria utama yang menentukan apakah suatu perangkat bertindak sebagai Client dalam komunikasi data?",
    options: [
      { id: "opt-a", text: "Ukurannya harus lebih kecil daripada komputer lain" },
      { id: "opt-b", text: "Perangkat tersebut yang menginisiasi permintaan layanan kepada penyedia" },
      { id: "opt-c", text: "Perangkat tersebut harus menggunakan sistem operasi Linux" },
      { id: "opt-d", text: "Perangkat tersebut tidak boleh memiliki media penyimpanan hard disk" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Client adalah pihak yang memulai koneksi dan mengajukan permintaan layanan kepada server.",
    misconceptionFeedback:
      "Peran client tidak ditentukan oleh dimensi fisik atau OS, melainkan aksi inisiasi permintaan layanan (request).",
  },
  {
    id: "quiz-csc-l7-q2",
    lessonSlug: "client-server-roles",
    outcomeId: "CSC-L7-A",
    question:
      "Dapatkah sebuah smartphone Android bertindak sebagai server dalam jaringan lokal?",
    options: [
      { id: "opt-a", text: "Tidak bisa, karena smartphone bukan komputer server rak" },
      {
        id: "opt-b",
        text: "Bisa, jika smartphone menjalankan aplikasi web server atau file sharing yang melayani permintaan dari perangkat lain",
      },
      { id: "opt-c", text: "Hanya bisa jika smartphone dihubungkan dengan kabel fiber optic" },
      { id: "opt-d", text: "Tidak bisa, karena Android tidak mendukung jaringan TCP/IP" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Peran server ditentukan oleh perangkat lunak layanan yang mendengarkan dan merespons request, bukan bentuk fisik perangkat.",
    misconceptionFeedback:
      "Server adalah fungsi perangkat lunak. Siapa pun yang mendengarkan port jaringan dan melayani permintaan klien bertindak sebagai server.",
  },
  {
    id: "quiz-csc-l7-q3",
    lessonSlug: "client-server-roles",
    outcomeId: "CSC-L7-B",
    question:
      "Dua orang siswa TKJ menghubungkan dua laptop menggunakan satu kabel LAN untuk saling bertukar file tugas tanpa server dedicated. Model ini disebut:",
    options: [
      { id: "opt-a", text: "Mainframe Computing" },
      { id: "opt-b", text: "Peer-to-Peer (P2P)" },
      { id: "opt-c", text: "Cloud Data Center" },
      { id: "opt-d", text: "Wide Area Network" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Jaringan langsung antarperangkat yang setara tanpa server pusat adalah model Peer-to-Peer (P2P).",
    misconceptionFeedback:
      "Hubungan langsung antar-node setara tanpa pengatur sentral merupakan konsep fundamental arsitektur Peer-to-Peer.",
  },

  // Lesson 8: request-response-cycle
  {
    id: "quiz-csc-l8-q1",
    lessonSlug: "request-response-cycle",
    outcomeId: "CSC-L8-A",
    question:
      "Manakah urutan kronologis yang benar saat seorang siswa membuka halaman ujian di server lokal sekolah?",
    options: [
      { id: "opt-a", text: "Server kirim data -> Siswa kirim request -> Server proses data" },
      {
        id: "opt-b",
        text: "Browser buat request -> Jaringan kirim paket -> Server proses data -> Server kirim response -> Browser tampilkan halaman",
      },
      { id: "opt-c", text: "Browser render halaman -> Server buat database -> Jaringan restart" },
      { id: "opt-d", text: "Kabel UTP memproses request -> Switch membuat halaman web -> Browser menyimpan file" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Siklus dimulai dari inisiasi request oleh client, transmisi, pemrosesan server, dan pengiriman response kembali.",
    misconceptionFeedback:
      "Browser tidak dapat merender sebelum response diterima dari server. Siklus request-response selalu diawali oleh pengirim permintaan.",
  },
  {
    id: "quiz-csc-l8-q2",
    lessonSlug: "request-response-cycle",
    outcomeId: "CSC-L8-A",
    question:
      "Jika browser menampilkan pesan 'Request Timeout', apa kemungkinan teknis yang terjadi di lapisan jaringan?",
    options: [
      {
        id: "opt-a",
        text: "Client tidak menerima respon apa pun dari server dalam batas waktu tunggu yang ditentukan",
      },
      { id: "opt-b", text: "Server berhasil mengirimkan halaman dalam waktu kurang dari 1 milidetik" },
      { id: "opt-c", text: "Komputer siswa kehabisan kuota baterai" },
      { id: "opt-d", text: "Server menghapus semua data di hard disk pengguna" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Timeout berarti client menunggu respon tetapi tidak ada balasan dari server dalam jangka waktu tertentu (karena jalur putus atau server mati).",
    misconceptionFeedback:
      "Timeout terjadi saat timer batas waktu tunggu klien kedaluwarsa tanpa ada paket jawaban dari pihak server.",
  },
  {
    id: "quiz-csc-l8-q3",
    lessonSlug: "request-response-cycle",
    outcomeId: "CSC-L8-B",
    question:
      "Siswa menerima balasan '404 File Not Found' dari server ujian sekolah. Kesimpulan teknis yang tepat adalah:",
    options: [
      { id: "opt-a", text: "Kabel LAN siswa putus dan switch sekolah rusak total" },
      {
        id: "opt-b",
        text: "Jaringan terhubung normal ke server, namun berkas yang diminta tidak tersedia di server",
      },
      { id: "opt-c", text: "Modem ISP sekolah terbakar petir" },
      { id: "opt-d", text: "Kartu jaringan laptop siswa tidak terpasang" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Pesan 404 membuktikan bahwa koneksi jaringan ke server berhasil, namun path atau dokumen yang diminta tidak ditemukan di server.",
    misconceptionFeedback:
      "Jika kabel putus atau switch rusak, klien tidak akan pernah menerima kode 404. Kode 404 dikirim langsung oleh server web yang aktif.",
  },

  // =========================================================================
  // Module 4: Network Topology (P1-M4)
  // =========================================================================

  // Lesson 9: bus-star-ring
  {
    id: "quiz-top-l9-q1",
    lessonSlug: "bus-star-ring",
    outcomeId: "TOP-L9-A",
    question: "Manakah ciri fisik utama dari jaringan yang menggunakan topologi Star?",
    options: [
      { id: "opt-a", text: "Semua perangkat dihubungkan secara melingkar tanpa titik akhir" },
      { id: "opt-b", text: "Setiap perangkat memiliki kabel tersendiri yang terhubung ke satu switch/hub pusat" },
      { id: "opt-c", text: "Semua komputer berbagi satu kabel tembaga lurus dengan terminator di ujungnya" },
      { id: "opt-d", text: "Setiap komputer wajib memiliki antena satelit sendiri" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Topologi Star menghubungkan semua node secara individual ke perangkat pusat konsentrator (switch).",
    misconceptionFeedback:
      "Kabel melingkar adalah Ring, kabel lurus tunggal adalah Bus. Bintang (Star) mencirikan koneksi node ke satu simpul konsentrator.",
  },
  {
    id: "quiz-top-l9-q2",
    lessonSlug: "bus-star-ring",
    outcomeId: "TOP-L9-A",
    question:
      "Apa kelemahan paling fatal pada topologi Bus jika kabel tulang punggung (backbone) terpotong?",
    options: [
      { id: "opt-a", text: "Hanya komputer yang terpotong yang mati, komputer lain otomatis beralih ke Star" },
      {
        id: "opt-b",
        text: "Seluruh jaringan lumpuh total karena sinyal memantul dan sirkuit terbuka tanpa terminator",
      },
      { id: "opt-c", text: "Kecepatan transfer data justru meningkat dua kali lipat" },
      { id: "opt-d", text: "Semua komputer otomatis terformat ulang" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Pada topologi bus, putusnya kabel utama menghilangkan resistansi terminasi dan melumpuhkan komunikasi seluruh jaringan.",
    misconceptionFeedback:
      "Ketiadaan terminasi akibat putusnya kabel bus menyebabkan gelombang sinyal terpantul (reflection) yang menghancurkan semua transmisi di kabel.",
  },
  {
    id: "quiz-top-l9-q3",
    lessonSlug: "bus-star-ring",
    outcomeId: "TOP-L9-B",
    question:
      "Mengapa teknisi lab TKJ memilih memasang topologi Star dibanding topologi Bus?",
    options: [
      { id: "opt-a", text: "Karena topologi Star tidak memerlukan switch sama sekali" },
      {
        id: "opt-b",
        text: "Karena jika kabel satu komputer siswa rusak atau tercabut, komputer lain tidak terganggu",
      },
      { id: "opt-c", text: "Karena kabel topologi Star tidak menggunakan konektor tembaga" },
      { id: "opt-d", text: "Karena topologi Star hanya bisa digunakan untuk 3 komputer saja" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Isolasi gangguan adalah keunggulan terbesar topologi Star: masalah pada kabel individual tidak merusak komunikasi node lainnya.",
    misconceptionFeedback:
      "Topologi Star justru memerlukan switch. Alasan pemilihannya adalah ketahanan isolasi gangguan antarnode kabel cabang.",
  },

  // Lesson 10: topology-fault-impact
  {
    id: "quiz-top-l10-q1",
    lessonSlug: "topology-fault-impact",
    outcomeId: "TOP-L10-A",
    question:
      "Pada lab sekolah yang menggunakan topologi Star dengan 1 switch 24-port, komponen manakah yang menjadi Single Point of Failure (SPOF)?",
    options: [
      { id: "opt-a", text: "Mouse pada komputer PC-05" },
      { id: "opt-b", text: "Switch 24-port utama yang menghubungkan semua komputer" },
      { id: "opt-c", text: "Kabel UTP pendek yang menuju ke komputer PC-12" },
      { id: "opt-d", text: "Monitor di meja guru" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Switch pusat adalah SPOF pada topologi star; jika switch mati, seluruh PC di lab kehilangan koneksi bersamaan.",
    misconceptionFeedback:
      "Kabel individual hanya memutus 1 host. Titik tunggal kegagalan (SPOF) yang melumpuhkan seluruh lab adalah switch sentral.",
  },
  {
    id: "quiz-top-l10-q2",
    lessonSlug: "topology-fault-impact",
    outcomeId: "TOP-L10-A",
    question:
      "Seorang siswa di PC-03 tidak sengaja menendang kabel LAN hingga terlepas dari port switch. Apa yang terjadi pada PC-01 dan PC-02 di lab tersebut?",
    options: [
      { id: "opt-a", text: "PC-01 dan PC-02 ikut mati dan tidak bisa mengakses server" },
      { id: "opt-b", text: "PC-01 dan PC-02 tetap terhubung normal dan dapat bertukar data seperti biasa" },
      { id: "opt-c", text: "Switch otomatis terbakar karena sirkuit terbuka" },
      { id: "opt-d", text: "Semua komputer langsung restart otomatis" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Pada topologi star, pemutusan kabel satu endpoint terisolasi secara sempurna dan tidak memengaruhi endpoint lain.",
    misconceptionFeedback:
      "Pada topologi star kabel cabang bersifat independen. Lepasnya kabel PC-03 tidak berpengaruh terhadap PC-01 dan PC-02.",
  },
  {
    id: "quiz-top-l10-q3",
    lessonSlug: "topology-fault-impact",
    outcomeId: "TOP-L10-B",
    question:
      "Langkah terbaik untuk mencegah seluruh kantor lumpuh saat switch core utama mendadak rusak adalah:",
    options: [
      { id: "opt-a", text: "Kembali menggunakan topologi Bus tanpa switch" },
      {
        id: "opt-b",
        text: "Menerapkan redundansi perangkat (switch cadangan dengan konfigurasi identik / failover)",
      },
      { id: "opt-c", text: "Mengurangi kecepatan jaringan menjadi 10 Mbps" },
      { id: "opt-d", text: "Menghapus semua alamat IP di komputer karyawan" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Redundansi perangkat dan jalur (hardware failover) adalah solusi standar industri untuk mengeliminasi dampak SPOF.",
    misconceptionFeedback:
      "Menurunkan kecepatan atau topologi bus tidak mengatasi ketiadaan cadangan. Redundansi failover adalah mitigasi SPOF profesional.",
  },

  // =========================================================================
  // Module 5: Network Devices (P1-M5)
  // =========================================================================

  // Lesson 11: nic-switch-router-ap
  {
    id: "quiz-dev-l11-q1",
    lessonSlug: "nic-switch-router-ap",
    outcomeId: "DEV-L11-A",
    question:
      "Perangkat manakah yang bertugas menghubungkan jaringan lokal (LAN) sekolah ke jaringan Internet global?",
    options: [
      { id: "opt-a", text: "Unmanaged Switch" },
      { id: "opt-b", text: "Router" },
      { id: "opt-c", text: "Kabel Patch Cord UTP" },
      { id: "opt-d", text: "Mouse Wireless" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Router adalah perangkat yang dirancang khusus untuk merutekan paket data antarjaringan yang berbeda, seperti menghubungkan LAN ke Internet.",
    misconceptionFeedback:
      "Switch hanya mendistribusikan data di dalam satu segmen LAN yang sama. Untuk menyeberang ke jaringan internet luar dibutuhkan Router.",
  },
  {
    id: "quiz-dev-l11-q2",
    lessonSlug: "nic-switch-router-ap",
    outcomeId: "DEV-L11-A",
    question: "Fungsi utama dari kartu antarmuka jaringan (NIC) pada setiap komputer adalah:",
    options: [
      { id: "opt-a", text: "Mendinginkan prosesor saat komputer bekerja berat" },
      {
        id: "opt-b",
        text: "Menghubungkan komputer secara fisik ke media jaringan dan menyediakan alamat MAC unik",
      },
      { id: "opt-c", text: "Menyimpan file sistem operasi Windows atau Linux" },
      { id: "opt-d", text: "Mencetak dokumen langsung tanpa kabel" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "NIC adalah gerbang fisik host ke media transmisi data yang memiliki identitas perangkat keras unik (MAC Address).",
    misconceptionFeedback:
      "NIC (Network Interface Card) bertugas mengubah representasi data komputer menjadi sinyal transmisi pada kabel atau gelombang Wi-Fi.",
  },
  {
    id: "quiz-dev-l11-q3",
    lessonSlug: "nic-switch-router-ap",
    outcomeId: "DEV-L11-B",
    question:
      "Sekolah ingin menambah 20 komputer baru di ruang multimedia yang sudah memiliki switch penuh. Perangkat apa yang harus dibeli untuk menambah port LAN lokal tersebut?",
    options: [
      { id: "opt-a", text: "Switch tambahan (misalnya switch 24-port)" },
      { id: "opt-b", text: "Printer laser jaringan" },
      { id: "opt-c", text: "Modem dial-up eksternal" },
      { id: "opt-d", text: "Mikrofon nirkabel" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Untuk memperbanyak sambungan port kabel di segmen LAN lokal yang sama, solusi teknis yang benar adalah menambah Switch.",
    misconceptionFeedback:
      "Untuk memperluas jumlah sambungan port kabel di segmen jaringan lokal yang sama, perangkat yang tepat adalah Switch.",
  },

  // Lesson 12: modem-firewall-server
  {
    id: "quiz-dev-l12-q1",
    lessonSlug: "modem-firewall-server",
    outcomeId: "DEV-L12-A",
    question:
      "Perangkat apa yang dipasang di sekolah untuk mengubah sinyal pulsa cahaya dari kabel fiber optic ISP Indihome/Biznet menjadi kabel tembaga LAN?",
    options: [
      { id: "opt-a", text: "ONT (Optical Network Terminal)" },
      { id: "opt-b", text: "Unmanaged Hub 10 Mbps" },
      { id: "opt-c", text: "Kabel VGA Komputer" },
      { id: "opt-d", text: "Stabilizer Listrik" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "ONT adalah perangkat terminal optik yang mengubah sinyal cahaya serat optik ISP menjadi sinyal listrik Ethernet UTP.",
    misconceptionFeedback:
      "Perangkat konversi ujung serat optik ISP di rumah/sekolah disebut ONT (Optical Network Terminal) atau ONU.",
  },
  {
    id: "quiz-dev-l12-q2",
    lessonSlug: "modem-firewall-server",
    outcomeId: "DEV-L12-A",
    question: "Fungsi utama Firewall dalam topologi perbatasan jaringan sekolah adalah:",
    options: [
      { id: "opt-a", text: "Meningkatkan resolusi monitor komputer pengguna" },
      {
        id: "opt-b",
        text: "Menyaring dan mengontrol paket data yang keluar-masuk berdasarkan aturan keamanan",
      },
      { id: "opt-c", text: "Menggandakan kapasitas memori RAM komputer" },
      { id: "opt-d", text: "Mematikan listrik seluruh gedung saat malam hari" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Firewall bertugas memeriksa lalu lintas data dan memblokir paket berbahaya sesuai aturan kebijakan keamanan jaringan.",
    misconceptionFeedback:
      "Firewall tidak ada hubungannya dengan spesifikasi monitor atau RAM; tugas utamanya menyaring lalu lintas paket sesuai kebijakan keamanan.",
  },
  {
    id: "quiz-dev-l12-q3",
    lessonSlug: "modem-firewall-server",
    outcomeId: "DEV-L12-B",
    question:
      "Manakah urutan alur fisik kabel koneksi Internet dari ISP yang masuk ke jaringan lokal sekolah?",
    options: [
      { id: "opt-a", text: "PC Siswa -> Fiber ISP -> ONT -> Switch" },
      { id: "opt-b", text: "Fiber ISP -> ONT -> Router/Firewall -> Switch -> PC Siswa" },
      { id: "opt-c", text: "Switch -> ONT -> PC Siswa -> Fiber ISP" },
      { id: "opt-d", text: "Router -> Fiber ISP -> Switch -> ONT" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Urutan yang benar: Fiber optik dari ISP masuk ke ONT, lalu ke Router/Firewall, didistribusikan lewat Switch, dan sampai ke PC Siswa.",
    misconceptionFeedback:
      "Sinyal fiber dari luar masuk ke terminal ONT terlebih dahulu, dilanjutkan ke router/firewall untuk routing dan keamanan, lalu disebar lewat switch ke PC.",
  },

  // =========================================================================
  // Module 6: Physical Media & Cabling (P1-M6)
  // =========================================================================

  // Lesson 13: copper-twisted-pair-wireless
  {
    id: "quiz-pmc-l13-q1",
    lessonSlug: "copper-twisted-pair-wireless",
    outcomeId: "PMC-L13-A",
    question:
      "Berapa batas panjang bentangan maksimum standar untuk satu segmen kabel UTP Ethernet dari switch ke komputer?",
    options: [
      { id: "opt-a", text: "25 meter" },
      { id: "opt-b", text: "100 meter" },
      { id: "opt-c", text: "500 meter" },
      { id: "opt-d", text: "1.000 meter (1 km)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Batas panjang maksimum standar IEEE untuk kabel UTP Cat5e/Cat6 adalah 100 meter.",
    misconceptionFeedback:
      "Standar IEEE 802.3 untuk kabel tembaga twisted pair membatasi bentangan maksimal 100 meter (90m horizontal + 10m patch cord).",
  },
  {
    id: "quiz-pmc-l13-q2",
    lessonSlug: "copper-twisted-pair-wireless",
    outcomeId: "PMC-L13-A",
    question:
      "Kabel twisted pair jenis STP (Shielded Twisted Pair) paling disarankan digunakan pada kondisi lingkungan:",
    options: [
      { id: "opt-a", text: "Di bawah kasur kamar tidur yang tenang" },
      {
        id: "opt-b",
        text: "Di area industri/pabrik yang dekat dengan motor listrik besar bertegangan tinggi",
      },
      { id: "opt-c", text: "Hanya untuk menghubungkan printer mini Bluetooth" },
      { id: "opt-d", text: "Di dalam akuarium air tawar" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Lapisan pelindung logam foil (shielding) pada STP melindungi sinyal dari radiasi interferensi elektromagnetik (EMI) di pabrik/mesin listrik.",
    misconceptionFeedback:
      "STP memiliki pelindung foil khusus untuk meredam kebisingan interferensi elektromagnetik (EMI) di sekitar mesin bertegangan tinggi.",
  },
  {
    id: "quiz-pmc-l13-q3",
    lessonSlug: "copper-twisted-pair-wireless",
    outcomeId: "PMC-L13-B",
    question:
      "Mengapa untuk PC desktop server ujian sekolah lebih direkomendasikan menggunakan kabel UTP dibanding koneksi Wi-Fi?",
    options: [
      { id: "opt-a", text: "Karena kabel UTP membuat komputer tidak memerlukan listrik PLN" },
      {
        id: "opt-b",
        text: "Karena kabel tembaga memberikan koneksi stabil tanpa gangguan interferensi frekuensi udara dan latensi rendah",
      },
      { id: "opt-c", text: "Karena sinyal Wi-Fi dilarang masuk ke dalam ruang kelas" },
      { id: "opt-d", text: "Karena kabel UTP harganya jutaan rupiah per meter" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Koneksi kabel tembaga menawarkan stabilitas transmisi konsisten bebas interferensi gelombang radio.",
    misconceptionFeedback:
      "Wi-Fi rentan terhadap tabrakan gelombang radio dan fluktuasi sinyal. Kabel tembaga dedicated memberikan stabilitas latensi yang konsisten.",
  },

  // Lesson 14: rj45-crimping-t568ab
  {
    id: "quiz-pmc-l14-q1",
    lessonSlug: "rj45-crimping-t568ab",
    outcomeId: "PMC-L14-A",
    question: "Manakah urutan 3 pin pertama pada standar pemasangan kabel UTP T568B?",
    options: [
      { id: "opt-a", text: "Putih Hijau, Hijau, Putih Oranye" },
      { id: "opt-b", text: "Putih Oranye, Oranye, Putih Hijau" },
      { id: "opt-c", text: "Biru, Putih Biru, Cokelat" },
      { id: "opt-d", text: "Putih Cokelat, Cokelat, Hijau" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Urutan T568B diawali dengan Pin 1: Putih Oranye, Pin 2: Oranye, Pin 3: Putih Hijau.",
    misconceptionFeedback:
      "Standar T568B dimulai dengan pasangan oranye: Putih Oranye (Pin 1), Oranye (Pin 2), dan disusul Putih Hijau (Pin 3).",
  },
  {
    id: "quiz-pmc-l14-q2",
    lessonSlug: "rj45-crimping-t568ab",
    outcomeId: "PMC-L14-A",
    question: "Kabel LAN yang kedua ujungnya dipasang dengan standar T568B disebut jenis kabel:",
    options: [
      { id: "opt-a", text: "Kabel Crossover" },
      { id: "opt-b", text: "Kabel Straight-Through" },
      { id: "opt-c", text: "Kabel Rollover Konsol" },
      { id: "opt-d", text: "Kabel Koaksial RG-58" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Kabel yang kedua ujungnya memiliki susunan standar yang sama (T568B di kedua ujung) adalah kabel Straight-Through.",
    misconceptionFeedback:
      "Kedua ujung kabel yang memakai standar yang sama (T568B ke T568B atau T568A ke T568A) menghasilkan kabel Straight-Through.",
  },
  {
    id: "quiz-pmc-l14-q3",
    lessonSlug: "rj45-crimping-t568ab",
    outcomeId: "PMC-L14-B",
    question:
      "Untuk menghubungkan komputer PC siswa langsung ke port switch di lab tanpa router, jenis kabel yang digunakan adalah:",
    options: [
      { id: "opt-a", text: "Kabel Straight-Through" },
      { id: "opt-b", text: "Kabel Crossover khusus" },
      { id: "opt-c", text: "Kabel HDMI" },
      { id: "opt-d", text: "Kabel USB Tipe C" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Menghubungkan dua perangkat berbeda level fungsi (Host/PC ke Switch) menggunakan kabel Straight-Through.",
    misconceptionFeedback:
      "Koneksi antara perangkat beda peran seperti PC Host ke Switch adalah kasus penggunaan standar untuk kabel Straight-Through.",
  },

  // Lesson 15: fiber-optic-intro
  {
    id: "quiz-pmc-l15-q1",
    lessonSlug: "fiber-optic-intro",
    outcomeId: "PMC-L15-A",
    question:
      "Media fisik apakah yang digunakan oleh kabel serat optik (fiber optic) untuk mentransmisikan data digital?",
    options: [
      { id: "opt-a", text: "Aliran elektron listrik pada kawat tembaga" },
      { id: "opt-b", text: "Pulsa cahaya di dalam inti kaca silika murni" },
      { id: "opt-c", text: "Tekanan udara di dalam pipa vakum" },
      { id: "opt-d", text: "Gelombang suara ultrasonik" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Serat optik menggunakan modulasi pulsa cahaya laser/LED di dalam inti kaca (core).",
    misconceptionFeedback:
      "Fiber optik menggunakan foton pulsa cahaya di dalam tabung kaca silika, bukan elektron listrik tembaga.",
  },
  {
    id: "quiz-pmc-l15-q2",
    lessonSlug: "fiber-optic-intro",
    outcomeId: "PMC-L15-A",
    question:
      "Sekolah ingin menghubungkan jaringan lab TKJ di Gedung Barat ke ruang guru di Gedung Timur dengan jarak bentangan 250 meter melewati taman terbuka. Solusi media yang paling tepat adalah:",
    options: [
      { id: "opt-a", text: "Satu kabel UTP biasa yang ditarik kencang" },
      { id: "opt-b", text: "Kabel Serat Optik (Fiber Optic) outdoor antargedung" },
      { id: "opt-c", text: "Kabel VGA sepanjang 250 meter" },
      { id: "opt-d", text: "Menghubungkan dua mouse USB berantai" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Karena jarak 250 meter melebihi batas 100 meter kabel tembaga UTP, penggunaan kabel Fiber Optik adalah standar wajib.",
    misconceptionFeedback:
      "Jarak 250 meter melampaui limit fisik 100 meter kabel UTP tembaga, sehingga kabel serat optik (fiber optic) adalah satu-satunya pilihan standar.",
  },
  {
    id: "quiz-pmc-l15-q3",
    lessonSlug: "fiber-optic-intro",
    outcomeId: "PMC-L15-B",
    question:
      "Apa keunggulan terbesar kabel fiber optic saat dipasang berdampingan dengan kabel listrik utama gardu PLN?",
    options: [
      { id: "opt-a", text: "Dapat menyerap daya listrik PLN untuk menyalakan komputer" },
      { id: "opt-b", text: "Kebal 100% dari induksi interferensi elektromagnetik (EMI)" },
      { id: "opt-c", text: "Lebih mudah ditekuk dengan sudut tajam 90 derajat" },
      { id: "opt-d", text: "Dapat disambung hanya dengan menggunakan selotip kertas" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Karena transmisi menggunakan media kaca dan cahaya, fiber optic sama sekali tidak terpengaruh medan magnet atau induksi listrik.",
    misconceptionFeedback:
      "Kaca adalah isolator listrik murni. Sinyal cahaya di dalamnya kebal total dari induksi elektromagnetik yang dipancarkan kabel listrik daya PLN.",
  },

  // =========================================================================
  // Module 7: How Data Travels (P1-M7)
  // =========================================================================

  // Lesson 16: bits-frames-packets
  {
    id: "quiz-hdt-l16-q1",
    lessonSlug: "bits-frames-packets",
    outcomeId: "HDT-L16-A",
    question:
      "Satuan data protokol (PDU) yang memuat alamat MAC pengirim dan MAC tujuan untuk diproses oleh Switch disebut:",
    options: [
      { id: "opt-a", text: "Bit" },
      { id: "opt-b", text: "Frame" },
      { id: "opt-c", text: "Packet" },
      { id: "opt-d", text: "Segment" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Frame adalah PDU Layer 2 (Data Link) yang memuat alamat fisik perangkat keras (MAC Address).",
    misconceptionFeedback:
      "Packet memuat alamat IP (Layer 3), sedangkan satuan data yang memuat MAC address di Layer 2 adalah Frame.",
  },
  {
    id: "quiz-hdt-l16-q2",
    lessonSlug: "bits-frames-packets",
    outcomeId: "HDT-L16-A",
    question:
      "Perangkat Router membaca informasi pada header untuk menentukan jalur rute terbaik. Informasi apakah yang diperiksa pada header paket?",
    options: [
      { id: "opt-a", text: "Warna kabel yang dicolokkan" },
      { id: "opt-b", text: "Alamat IP Tujuan (Destination IP Address)" },
      { id: "opt-c", text: "Nama pemilik akun media sosial" },
      { id: "opt-d", text: "Jumlah kapasitas hard disk router" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Router bekerja di Layer 3 dan memeriksa Alamat IP Tujuan pada header paket untuk mencocokkannya dengan tabel routing.",
    misconceptionFeedback:
      "Router menggunakan tabel routing untuk mencocokkan IP tujuan (Destination IP) di header paket layer 3.",
  },
  {
    id: "quiz-hdt-l16-q3",
    lessonSlug: "bits-frames-packets",
    outcomeId: "HDT-L16-B",
    question:
      "Ketika data keluar dari kartu jaringan melewati kabel tembaga UTP menuju switch, data tersebut ditransmisikan dalam bentuk fisik berupa:",
    options: [
      { id: "opt-a", text: "Aliran pulsa sinyal voltase listrik digital (Bit 0 dan 1)" },
      { id: "opt-b", text: "File teks Microsoft Word utuh" },
      { id: "opt-c", text: "Cairan kimia penghantar data" },
      { id: "opt-d", text: "Huruf alfabet yang dicetak pada kawat" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Di media kabel tembaga fisik, data ditransmisikan sebagai variasi pulsa tegangan listrik yang merepresentasikan bit digital.",
    misconceptionFeedback:
      "Di level kabel fisik (Layer 1), struktur dokumen telah dikonversi menjadi barisan bit digital yang dihantarkan lewat pulsa tegangan listrik.",
  },

  // Lesson 17: unicast-broadcast-multicast
  {
    id: "quiz-hdt-l17-q1",
    lessonSlug: "unicast-broadcast-multicast",
    outcomeId: "HDT-L17-A",
    question:
      "Ketika komputer baru pertama kali menyala dan mencari server DHCP untuk meminta IP address, metode transmisi apa yang digunakan?",
    options: [
      { id: "opt-a", text: "Unicast langsung ke alamat server yang sudah dihafal" },
      { id: "opt-b", text: "Broadcast ke seluruh jaringan lokal (DHCP Discover)" },
      { id: "opt-c", text: "Multicast ke komputer teman sebangku" },
      { id: "opt-d", text: "Panggilan telepon analog" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Karena komputer baru belum tahu di mana dan siapa server DHCP, ia mengirim pesan broadcast (satu ke semua) untuk menemukan server.",
    misconceptionFeedback:
      "Host yang baru aktif belum memiliki konfigurasi IP atau informasi server, sehingga wajib menggunakan broadcast untuk menyapa seluruh perangkat lokal.",
  },
  {
    id: "quiz-hdt-l17-q2",
    lessonSlug: "unicast-broadcast-multicast",
    outcomeId: "HDT-L17-A",
    question:
      "Apa yang dilakukan oleh perangkat Router ketika menerima paket broadcast dari jaringan lokal switch?",
    options: [
      { id: "opt-a", text: "Meneruskannya ke seluruh dunia dan satelit" },
      {
        id: "opt-b",
        text: "Menghentikan (memblokir/drop) paket broadcast tersebut agar tidak bocor ke jaringan lain",
      },
      { id: "opt-c", text: "Menggandakan paket menjadi jutaan salinan" },
      { id: "opt-d", text: "Mengubah paket broadcast menjadi file PDF" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Router membatasi batas broadcast domain; router tidak meneruskan broadcast lokal ke jaringan luar.",
    misconceptionFeedback:
      "Salah satu fungsi esensial Router adalah membatasi broadcast domain; router tidak akan meneruskan paket broadcast ke antarmuka jaringan lainnya.",
  },
  {
    id: "quiz-hdt-l17-q3",
    lessonSlug: "unicast-broadcast-multicast",
    outcomeId: "HDT-L17-B",
    question:
      "Pengiriman siaran video pembelajaran secara bersamaan hanya kepada 30 siswa yang terdaftar di kelas daring tanpa membebani siswa lain di luar kelas menggunakan metode:",
    options: [
      { id: "opt-a", text: "Broadcast massal" },
      { id: "opt-b", text: "Multicast" },
      { id: "opt-c", text: "Bluetooth pairing" },
      { id: "opt-d", text: "Dial-up suara" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Multicast mendistribusikan satu aliran data secara efisien hanya kepada kelompok host yang berlangganan/terdaftar.",
    misconceptionFeedback:
      "Broadcast akan membebani seluruh pengguna jaringan termasuk yang tidak berkepentingan. Metode khusus satu ke kelompok terdaftar adalah Multicast.",
  },

  // =========================================================================
  // Module 8: OSI & TCP/IP Foundations (P1-M8)
  // =========================================================================

  // Lesson 18: osi-seven-layers
  {
    id: "quiz-osi-l18-q1",
    lessonSlug: "osi-seven-layers",
    outcomeId: "OSI-L18-A",
    question:
      "Lapisan pada model OSI yang bertugas menentukan rute terbaik (routing) dan menangani pengalamatan IP adalah:",
    options: [
      { id: "opt-a", text: "Layer 1 - Physical" },
      { id: "opt-b", text: "Layer 2 - Data Link" },
      { id: "opt-c", text: "Layer 3 - Network" },
      { id: "opt-d", text: "Layer 7 - Application" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Layer 3 (Network) bertanggung jawab atas pengalamatan logis (IP Address) dan perutean paket (routing).",
    misconceptionFeedback:
      "Layer 2 bertanggung jawab atas MAC address fisik. Pengalamatan logis IP dan routing adalah tanggung jawab Layer 3 (Network).",
  },
  {
    id: "quiz-osi-l18-q2",
    lessonSlug: "osi-seven-layers",
    outcomeId: "OSI-L18-A",
    question:
      "Sebuah kabel LAN UTP terinjak roda kursi hingga patah dan lampu indikator pada switch padam. Gangguan ini terjadi pada lapisan OSI:",
    options: [
      { id: "opt-a", text: "Layer 1 - Physical" },
      { id: "opt-b", text: "Layer 4 - Transport" },
      { id: "opt-c", text: "Layer 6 - Presentation" },
      { id: "opt-d", text: "Layer 7 - Application" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Kerusakan fisik kabel dan hilangnya sinyal listrik adalah masalah murni di Layer 1 (Physical).",
    misconceptionFeedback:
      "Komponen kabel tembaga, konektor RJ45, dan sinyal listrik merupakan bagian dari Layer 1 (Physical).",
  },
  {
    id: "quiz-osi-l18-q3",
    lessonSlug: "osi-seven-layers",
    outcomeId: "OSI-L18-B",
    question:
      "Komputer siswa bisa melakukan tes ping ke alamat IP server lokal, tetapi gagal membuka halaman web karena browser salah membaca nama domain. Pada lapisan manakah masalah tersebut?",
    options: [
      { id: "opt-a", text: "Layer 1 - Kabel terputus" },
      { id: "opt-b", text: "Layer 7 - Application (Layanan DNS / Web)" },
      { id: "opt-c", text: "Konektor RJ-45 kotor" },
      { id: "opt-d", text: "Switch kekurangan daya listrik" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Karena ping (Layer 3) sukses, koneksi fisik dan IP terbukti normal. Masalah nama domain berada di Layer 7 (Application - DNS).",
    misconceptionFeedback:
      "Ping sukses membuktikan Layer 1 sampai 3 bekerja sempurna. Masalah resolusi nama domain DNS berada di Layer 7 (Application).",
  },

  // Lesson 19: tcp-ip-and-encapsulation
  {
    id: "quiz-osi-l19-q1",
    lessonSlug: "tcp-ip-and-encapsulation",
    outcomeId: "OSI-L19-A",
    question:
      "Manakah pasangan lapisan model 4-Layer TCP/IP yang tepat dari urutan atas ke bawah?",
    options: [
      { id: "opt-a", text: "Physical -> Data Link -> Network -> Transport" },
      { id: "opt-b", text: "Application -> Transport -> Internet -> Network Access" },
      { id: "opt-c", text: "Internet -> Application -> Network Access -> Transport" },
      { id: "opt-d", text: "Session -> Presentation -> Physical -> Hardware" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Urutan 4 Layer TCP/IP dari atas ke bawah: Application, Transport, Internet, dan Network Access.",
    misconceptionFeedback:
      "Model TCP/IP 4 lapis menyederhanakan arsitektur menjadi: Application (atas), Transport, Internet, dan Network Access (bawah).",
  },
  {
    id: "quiz-osi-l19-q2",
    lessonSlug: "tcp-ip-and-encapsulation",
    outcomeId: "OSI-L19-A",
    question: "Apa yang dimaksud dengan proses Enkapsulasi dalam pengiriman data jaringan?",
    options: [
      { id: "opt-a", text: "Penghapusan seluruh data pengguna agar file menjadi ringan" },
      {
        id: "opt-b",
        text: "Penambahan informasi header protokol secara bertahap pada setiap lapisan saat data bergerak turun ke media fisik",
      },
      { id: "opt-c", text: "Pemasangan kabel ke dalam pipa pipa tembok" },
      { id: "opt-d", text: "Proses pembersihan virus di dalam hard disk" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Enkapsulasi adalah proses pembungkusan data dengan header protokol pada setiap lapisan saat hendak ditransmisikan.",
    misconceptionFeedback:
      "Enkapsulasi adalah pembungkusan paket data dengan header protokol berlapis (Transport header, IP header, Frame header) saat data turun menuju media fisik.",
  },
  {
    id: "quiz-osi-l19-q3",
    lessonSlug: "tcp-ip-and-encapsulation",
    outcomeId: "OSI-L19-B",
    question:
      "Ketika data tiba di komputer server penerima, proses membuka dan melepas header satu per satu dari lapisan terbawah hingga data disajikan ke aplikasi disebut:",
    options: [
      { id: "opt-a", text: "Dekapsulasi (Decapsulation)" },
      { id: "opt-b", text: "Formatting ulang" },
      { id: "opt-c", text: "Crimping" },
      { id: "opt-d", text: "Subnetting" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Dekapsulasi adalah kebalikan dari enkapsulasi: membuka dan memvalidasi header lapis demi lapis di sisi penerima.",
    misconceptionFeedback:
      "Pelepasan header berlapis di sisi penerima dari Layer 1/2 hingga Layer 7 aplikasi disebut proses Dekapsulasi (Decapsulation).",
  },
];
