/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR WELCOME TO NETWORKING (P1-M1)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

export interface PrivateQuizOption {
  id: string;
  text: string;
}

export interface PrivateQuizQuestion {
  id: string;
  lessonSlug: string;
  outcomeId: string;
  question: string;
  options: PrivateQuizOption[];
  correctAnswer: string; // ID of the correct option
  explanation: string;
  misconceptionFeedback: string;
}

export interface PrivateFinalConceptQuestion {
  id: string;
  outcomeId: string;
  question: string;
  options: PrivateQuizOption[];
  correctAnswer: string;
  explanation: string;
}

export interface TopologyLink {
  from: string;
  to: string;
  status: "connected" | "disconnected";
}

export interface PracticalSubmissionState {
  links: TopologyLink[];
  ispUplinkConnected: boolean;
  verifiedPrints: {
    client: string;
    target: string;
    success: boolean;
  }[];
}

export interface PracticalCriterionResult {
  id: string;
  title: string;
  passed: boolean;
  reason?: string;
}

// ==========================================
// 12 Formative Quiz Items (3 per lesson)
// ==========================================

export const welcomeFormativeQuestions: PrivateQuizQuestion[] = [
  // Lesson 1: intro-to-networking
  {
    id: "quiz-wn-l1-q1",
    lessonSlug: "intro-to-networking",
    outcomeId: "WN-L1-A",
    question:
      "Manakah kondisi yang paling tepat menggambarkan bahwa sebuah komputer telah menjadi bagian dari jaringan komputer?",
    options: [
      { id: "opt-a", text: "Komputer menyala dengan spesifikasi RAM dan prosesor yang tinggi." },
      {
        id: "opt-b",
        text: "Komputer terhubung ke perangkat lain melalui media transmisi kabel atau nirkabel sehingga dapat saling bertukar data.",
      },
      { id: "opt-c", text: "Komputer memiliki monitor layar sentuh dan keyboard nirkabel." },
      { id: "opt-d", text: "Komputer mampu menyimpan ribuan file di dalam harddisk internalnya." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Jaringan komputer didefinisikan sebagai dua atau lebih perangkat yang terhubung melalui media transmisi untuk bertukar data dan berbagi sumber daya.",
    misconceptionFeedback:
      "Perangkat periferal pribadi (seperti keyboard nirkabel atau layar sentuh) bukan merupakan jaringan komputer tanpa adanya koneksi data ke perangkat lain.",
  },
  {
    id: "quiz-wn-l1-q2",
    lessonSlug: "intro-to-networking",
    outcomeId: "WN-L1-B",
    question:
      "Di lab sekolah dengan 20 komputer mandiri (standalone), siswa harus memindahkan tugas menggunakan satu flashdisk bergantian. Apa manfaat utama yang dirasakan jika ke-20 komputer tersebut dihubungkan dalam satu jaringan komputer?",
    options: [
      { id: "opt-a", text: "Komputer tidak lagi memerlukan sistem operasi untuk bekerja." },
      { id: "opt-b", text: "Kecepatan mengetik dokumen siswa bertambah secara otomatis." },
      {
        id: "opt-c",
        text: "Siswa dapat saling mengirim dan mengakses berkas tugas langsung tanpa perlu mencolokkan flashdisk fisik berulang kali.",
      },
      { id: "opt-d", text: "Kapasitas memori RAM setiap komputer akan berlipat ganda." },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Berbagi berkas (file sharing) melalui jaringan menghilangkan kebutuhan pemindahan media fisik (flashdisk/sneaker-net) dan mencegah risiko virus.",
    misconceptionFeedback:
      "Jaringan komputer memfasilitasi komunikasi dan transfer data, bukan meningkatkan spesifikasi hardware seperti RAM.",
  },
  {
    id: "quiz-wn-l1-q3",
    lessonSlug: "intro-to-networking",
    outcomeId: "WN-L1-B",
    question:
      "Sebuah kantor memiliki 5 ruangan kerja dan membeli 1 unit printer laser berkualitas tinggi. Bagaimana konsep jaringan komputer membantu kantor tersebut secara efisien?",
    options: [
      { id: "opt-a", text: "Kantor harus membeli kabel listrik tambahan untuk setiap ruangan." },
      {
        id: "opt-b",
        text: "Kelima ruangan dapat berbagi akses ke printer yang sama melalui jaringan tanpa harus memindahkan fisik printer ke tiap ruangan.",
      },
      { id: "opt-c", text: "Printer akan mencetak dokumen lima kali lebih tebal dari biasanya." },
      { id: "opt-d", text: "Kantor diwajibkan membeli 5 printer tambahan agar adil bagi setiap ruangan." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Berbagi printer (printer sharing) memungkinkan satu perangkat keras bersama dimanfaatkan oleh banyak pengguna di berbagai ruangan secara efisien.",
    misconceptionFeedback:
      "Tujuan utama jaringan adalah efisiensi sumber daya bersama, meniadakan kebutuhan membeli printer terpisah untuk setiap ruangan.",
  },

  // Lesson 2: everyday-networks
  {
    id: "quiz-wn-l2-q1",
    lessonSlug: "everyday-networks",
    outcomeId: "WN-L2-A",
    question:
      "Di sebuah lab komputer SMK, terdapat PC siswa, laptop guru, kabel UTP, printer jaringan, dan sinyal Wi-Fi. Manakah kelompok yang seluruhnya merupakan perangkat akhir (end devices)?",
    options: [
      { id: "opt-a", text: "Kabel UTP dan sinyal Wi-Fi" },
      { id: "opt-b", text: "PC siswa, laptop guru, dan printer jaringan" },
      { id: "opt-c", text: "Kabel UTP dan printer jaringan" },
      { id: "opt-d", text: "Sinyal Wi-Fi dan PC siswa" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Perangkat akhir (end devices) adalah perangkat asal atau tujuan transmisi data yang berinteraksi dengan pengguna (PC, laptop, printer).",
    misconceptionFeedback:
      "Kabel UTP dan sinyal radio Wi-Fi merupakan media koneksi/transmisi penghantar data, bukan perangkat akhir.",
  },
  {
    id: "quiz-wn-l2-q2",
    lessonSlug: "everyday-networks",
    outcomeId: "WN-L2-B",
    question:
      "Saat modem penyedia internet di sekolah sedang mengalami gangguan massal dan koneksi internet padam total, Pak Budi tetap berhasil mencetak dokumen dari laptopnya ke printer yang terhubung ke switch lab yang sama. Mengapa hal ini dimungkinkan?",
    options: [
      { id: "opt-a", text: "Printer secara ajaib memiliki koneksi internet satelit sendiri." },
      {
        id: "opt-b",
        text: "Mencetak dokumen di jaringan lokal hanya membutuhkan komunikasi LAN yang masih aktif, tanpa perlu melewati jalur internet luar.",
      },
      { id: "opt-c", text: "Pak Budi mencetak dokumen menggunakan tenaga baterai laptop." },
      { id: "opt-d", text: "Gangguan internet hanya berlaku untuk siswa, bukan untuk guru." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Jaringan Lokal (LAN) beroperasi independen dari Internet. Layanan lokal seperti print server tetap bekerja selama switch dan koneksi lokal aktif.",
    misconceptionFeedback:
      "Layanan printer lokal tidak memerlukan paket internet ISP karena data tidak keluar dari jaringan lokal gedung sekolah.",
  },
  {
    id: "quiz-wn-l2-q3",
    lessonSlug: "everyday-networks",
    outcomeId: "WN-L2-B",
    question:
      "Di smartphone muncul ikon Wi-Fi penuh, namun ada tanda seru kecil bertuliskan 'Connected without internet' dan aplikasi media sosial tidak bisa memuat data baru. Apa arti sebenarnya dari status tersebut?",
    options: [
      { id: "opt-a", text: "Smartphone mengalami kerusakan pada chip prosesornya." },
      {
        id: "opt-b",
        text: "Smartphone berhasil terhubung ke access point lokal melalui gelombang radio, namun jaringan lokal tersebut tidak memiliki jalur keluar menuju Internet.",
      },
      { id: "opt-c", text: "Sinyal Wi-Fi di rumah pasti palsu dan tidak memancarkan frekuensi apa pun." },
      { id: "opt-d", text: "Seluruh kabel di dalam smartphone terputus." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Wi-Fi adalah media transmisi nirkabel lokal. Sinyal Wi-Fi penuh hanya membuktikan koneksi radio ke router lokal berhasil, tetapi uplink router ke ISP bisa saja terputus.",
    misconceptionFeedback:
      "Ikon Wi-Fi bukan indikator ketersediaan koneksi internet global, melainkan kualitas tautan radio lokal.",
  },

  // Lesson 3: sharing-network-resources
  {
    id: "quiz-wn-l3-q1",
    lessonSlug: "sharing-network-resources",
    outcomeId: "WN-L3-A",
    question:
      "Seorang instruktur lab ingin memastikan 30 siswa dapat membaca modul praktikum yang sama setiap sesi tanpa perlu menggandakan kertas fotokopi. Sumber daya jaringan apa yang paling tepat disiapkan?",
    options: [
      { id: "opt-a", text: "Kabel listrik tambahan di setiap meja praktikum." },
      {
        id: "opt-b",
        text: "Folder berkas bersama (shared folder) di jaringan lokal yang berisi file modul digital.",
      },
      { id: "opt-c", text: "Mouse cadangan di laci instruktur." },
      { id: "opt-d", text: "Mengubah warna cat dinding lab agar terlihat modern." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Folder berkas bersama (shared folder) memungkinkan satu sumber data digital diakses bersama oleh seluruh pengguna jaringan lokal.",
    misconceptionFeedback:
      "Sumber daya jaringan yang relevan dengan pembagian dokumen adalah layanan berbagi berkas (file sharing).",
  },
  {
    id: "quiz-wn-l3-q2",
    lessonSlug: "sharing-network-resources",
    outcomeId: "WN-L3-B",
    question:
      "Andi duduk di depan PC-05 lab komputer dan menekan tombol cetak pada aplikasi pengolah kata ke printer jaringan yang berada di meja depan. Dalam transaksi komunikasi ini, siapa yang berperan sebagai peminta (client / requester)?",
    options: [
      { id: "opt-a", text: "Printer jaringan di meja depan" },
      { id: "opt-b", text: "Kertas yang keluar dari mesin printer" },
      { id: "opt-c", text: "PC-05 yang digunakan oleh Andi" },
      { id: "opt-d", text: "Meja tempat printer diletakkan" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Peminta (client/requester) adalah pihak yang menginisiasi permintaan layanan. Dalam hal ini, PC-05 milik Andi meminta layanan pencetakan.",
    misconceptionFeedback:
      "Printer bertindak sebagai penyedia layanan (provider/server) cetak, sedangkan PC pemohon adalah klien.",
  },
  {
    id: "quiz-wn-l3-q3",
    lessonSlug: "sharing-network-resources",
    outcomeId: "WN-L3-B",
    question:
      "Dina membagikan folder tugas kelompok dari laptopnya agar teman satu kelompoknya, Eko, dapat mengunduh dokumen laporan. Dalam pertukaran berkas tersebut, laptop Dina menjalankan peran sebagai apa?",
    options: [
      { id: "opt-a", text: "Perangkat perantara pasif tanpa peran" },
      { id: "opt-b", text: "Penyedia layanan (server / provider) berkas" },
      { id: "opt-c", text: "Peminta layanan (client / requester)" },
      { id: "opt-d", text: "Penghalang koneksi data" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Peran server/provider tidak bergantung pada bentuk fisik casing komputer, melainkan fungsi: laptop Dina menyediakan dan melayani permintaan berkas.",
    misconceptionFeedback:
      "Komputer biasa dapat berperan sebagai server selama ia menyediakan sumber daya yang diminta oleh perangkat lain.",
  },

  // Lesson 4: simple-network-communication
  {
    id: "quiz-wn-l4-q1",
    lessonSlug: "simple-network-communication",
    outcomeId: "WN-L4-A",
    question:
      "Manakah urutan tahapan yang benar pada komunikasi jaringan dua arah ketika sebuah laptop meminta berkas dari komputer penyedia?",
    options: [
      {
        id: "opt-a",
        text: "Laptop menerima berkas -> Laptop meminta -> Komputer penyedia mengirim respons -> Media terhubung",
      },
      {
        id: "opt-b",
        text: "Laptop membuat permintaan -> Permintaan dikirim melalui media transmisi -> Komputer penyedia menerima & memproses -> Komputer penyedia mengirim respons balik",
      },
      {
        id: "opt-c",
        text: "Komputer penyedia mengirim berkas sebelum ada permintaan -> Laptop mematikan kabel -> Transaksi selesai",
      },
      {
        id: "opt-d",
        text: "Media transmisi mengirim berkas sendiri tanpa ada perangkat pengirim",
      },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Urutan komunikasi standar adalah: Request dibuat -> Transmisi via media -> Penerimaan & pemrosesan oleh server -> Response balik ke klien.",
    misconceptionFeedback:
      "Komunikasi tidak bisa menerima hasil sebelum ada permintaan yang dibuat dan ditransmisikan.",
  },
  {
    id: "quiz-wn-l4-q2",
    lessonSlug: "simple-network-communication",
    outcomeId: "WN-L4-B",
    question:
      "PC-A dan PC-B terhubung ke switch yang sama di lab. PC-A dapat mencetak dokumen ke printer jaringan, namun PC-B selalu gagal. Setelah diperiksa ke belakang meja, kabel jaringan PC-B tidak tercolok ke port LAN. Kesimpulan teknis apa yang paling tepat?",
    options: [
      { id: "opt-a", text: "Printer lab rusak total dan harus segera dibuang." },
      {
        id: "opt-b",
        text: "Kegagalan komunikasi hanya terjadi pada PC-B karena kabel cabangnya terputus, sedangkan printer dan PC-A bekerja normal.",
      },
      { id: "opt-c", text: "Seluruh kabel jaringan di sekolah terkena petir." },
      { id: "opt-d", text: "PC-B tidak menyukai printer tersebut." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Keberhasilan PC-A membuktikan printer dan switch berfungsi normal. Kerusakan terlokalisasi pada kabel koneksi cabang PC-B yang lepas.",
    misconceptionFeedback:
      "Jangan menyimpulkan kerusakan printer jika komputer lain terbukti masih bisa mencetak.",
  },
  {
    id: "quiz-wn-l4-q3",
    lessonSlug: "simple-network-communication",
    outcomeId: "WN-L4-B",
    question:
      "Berdasarkan temuan kabel PC-B yang lepas pada skenario di atas, tindakan perbaikan terarah apa yang harus dilakukan pertama kali oleh petugas IT Support?",
    options: [
      { id: "opt-a", text: "Menginstal ulang seluruh sistem operasi di PC-A dan PC-B." },
      { id: "opt-b", text: "Mengganti switch lab dengan switch baru yang lebih mahal." },
      {
        id: "opt-c",
        text: "Menancapkan kembali kabel jaringan PC-B ke port LAN hingga terkunci rapat lalu memverifikasi koneksi.",
      },
      { id: "opt-d", text: "Menghubungi penyedia jasa internet (ISP) untuk komplain kecepatan internet." },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Troubleshooting jaringan yang efektif dimulai dari perbaikan fisik paling terarah yang telah terbukti lepas sebelum langkah drastis.",
    misconceptionFeedback:
      "Re-install OS atau komplain ke ISP tidak menyelesaikan masalah fisik kabel LAN lokal yang tercabut.",
  },
];

// ==========================================
// 10 Final Assessment Concept Questions (F01–F10)
// ==========================================

export const welcomeFinalConceptQuestions: PrivateFinalConceptQuestion[] = [
  {
    id: "final-wn-f01",
    outcomeId: "WN-M1",
    question:
      "Apakah tujuan paling mendasar dari pembentukan jaringan komputer di lingkungan perpustakaan sekolah?",
    options: [
      { id: "opt-a", text: "Memastikan semua komputer menggunakan tipe keyboard yang sama." },
      {
        id: "opt-b",
        text: "Menghubungkan perangkat komputasi agar dapat saling berkomunikasi, bertukar informasi, dan memanfaatkan sumber daya bersama secara terpadu.",
      },
      { id: "opt-c", text: "Mengurangi daya konsumsi listrik PLN secara otomatis." },
      { id: "opt-d", text: "Menghapus kebutuhan petugas perpustakaan." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Esensi utama jaringan komputer adalah komunikasi data dan pemanfaatan sumber daya bersama antar perangkat.",
  },
  {
    id: "final-wn-f02",
    outcomeId: "WN-M1",
    question:
      "Di masa lalu sebelum ada jaringan, petugas memindahkan daftar peminjam buku antar komputer menggunakan flashdisk. Manakah risiko utama metode manual (standalone) ini yang dapat diatasi oleh jaringan komputer?",
    options: [
      {
        id: "opt-a",
        text: "Flashdisk mudah hilang, rentan tertular virus, dan data menjadi tidak sinkron antar komputer.",
      },
      { id: "opt-b", text: "Layar monitor komputer menjadi buram." },
      { id: "opt-c", text: "Komputer menolak untuk dinyalakan di pagi hari." },
      { id: "opt-d", text: "Biaya pembelian buku perpustakaan meningkat drastis." },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Pemindahan manual via flashdisk rawan inkonsistensi data dan ancaman malware. Jaringan menyediakan pertukaran data yang tersinkronisasi dan aman.",
  },
  {
    id: "final-wn-f03",
    outcomeId: "WN-M2",
    question:
      "Di ruang perpustakaan terdapat: PC-Katalog, Switch LAN, Kabel UTP, Printer Barcode, dan Laptop Petugas. Manakah yang dikategorikan sebagai perangkat akhir (end devices)?",
    options: [
      { id: "opt-a", text: "Switch LAN dan Kabel UTP" },
      { id: "opt-b", text: "PC-Katalog, Printer Barcode, dan Laptop Petugas" },
      { id: "opt-c", text: "Kabel UTP saja" },
      { id: "opt-d", text: "Switch LAN saja" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "PC-Katalog, Printer Barcode, dan Laptop adalah perangkat akhir (endpoints). Switch adalah perangkat perantara (intermediary) dan kabel UTP adalah media transmisi.",
  },
  {
    id: "final-wn-f04",
    outcomeId: "WN-M2",
    question:
      "Petugas perpustakaan ingin menghubungkan PC-Katalog dan PC-Sirkulasi yang posisinya tetap di atas meja kerja permanen. Media koneksi apa yang paling tepat dipilih untuk stabilitas koneksi tinggi dan bebas interferensi?",
    options: [
      { id: "opt-a", text: "Kabel tembaga Ethernet (UTP) langsung ke switch lokal." },
      { id: "opt-b", text: "Sinyal inframerah remote TV." },
      { id: "opt-c", text: "Menggunakan kabel audio AUX." },
      { id: "opt-d", text: "Mengandalkan sinyal radio FM." },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Kabel Ethernet (UTP) memberikan stabilitas tinggi, latensi rendah, dan tidak mudah terganggu oleh interferensi frekuensi udara pada perangkat desktop statis.",
  },
  {
    id: "final-wn-f05",
    outcomeId: "WN-M2",
    question:
      "Ketika PC-Sirkulasi membuka database buku yang tersimpan pada folder bersama di komputer utama, perangkat manakah yang bertindak sebagai penyedia layanan (server / provider)?",
    options: [
      { id: "opt-a", text: "PC-Sirkulasi yang meminta data" },
      { id: "opt-b", text: "Komputer utama yang menyimpan dan menyajikan berkas database" },
      { id: "opt-c", text: "Mouse yang digerakkan oleh petugas" },
      { id: "opt-d", text: "Lampu penerangan ruangan" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Komputer utama berperan sebagai penyedia (provider/server) karena melayani permohonan data dari PC-Sirkulasi.",
  },
  {
    id: "final-wn-f06",
    outcomeId: "WN-M3",
    question:
      "Pagi ini hujan badai menyebabkan kabel fiber optik milik ISP putus total sehingga seluruh sekolah kehilangan akses Internet. Petugas perpustakaan panik karena harus mencetak label barcode untuk 50 buku baru ke Printer Barcode lokal yang terhubung ke switch LAN. Apa yang sebenarnya terjadi?",
    options: [
      { id: "opt-a", text: "Printer Barcode tidak bisa digunakan sama sekali karena tidak ada Internet." },
      {
        id: "opt-b",
        text: "Printer Barcode tetap dapat digunakan normal karena komunikasi antara PC-Sirkulasi dan Printer berlangsung di dalam jaringan lokal (LAN).",
      },
      { id: "opt-c", text: "Seluruh komputer di perpustakaan akan meledak jika dinyalakan." },
      { id: "opt-d", text: "Komputer hanya bisa mencetak jika terhubung ke Google Drive." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Koneksi LAN internal tidak bergantung pada uplink ISP luar. Selama switch lokal aktif, PC-Sirkulasi tetap dapat mengirim data cetak ke Printer Barcode lokal.",
  },
  {
    id: "final-wn-f07",
    outcomeId: "WN-M3",
    question:
      "Siswa yang membawa laptop ke perpustakaan mengeluh: 'Laptop saya terhubung ke Wi-Fi perpustakaan dengan sinyal sangat kuat, tetapi mengapa tidak bisa membuka website berita?'. Penjelasan teknis apa yang paling logis?",
    options: [
      {
        id: "opt-a",
        text: "Sinyal radio Wi-Fi lokal dari access point sangat baik, namun router perpustakaan tidak memiliki koneksi aktif ke jaringan Internet luar.",
      },
      { id: "opt-b", text: "Laptop siswa tersebut tidak kompatibel dengan lantai perpustakaan." },
      { id: "opt-c", text: "Sinyal Wi-Fi yang kuat otomatis menjamin kecepatan download super cepat." },
      { id: "opt-d", text: "Website berita tersebut diblokir oleh pembuat laptop." },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Sinyal Wi-Fi penuh hanya membuktikan kualitas tautan nirkabel antara laptop dan access point lokal. Jika router tidak memiliki uplink ke ISP, akses Internet tetap tidak tersedia.",
  },
  {
    id: "final-wn-f08",
    outcomeId: "WN-M4",
    question:
      "Bagaimana urutan aliran data yang benar ketika PC-Katalog mengirimkan perintah cek status ke Printer Barcode?",
    options: [
      { id: "opt-a", text: "Printer mencetak -> PC-Katalog membuat perintah -> Switch mengirim kabel" },
      {
        id: "opt-b",
        text: "PC-Katalog membuat permintaan -> Permintaan dikirim lewat kabel ke Switch lalu diteruskan ke Printer -> Printer memproses -> Printer mengirimkan respons status kembali ke PC-Katalog",
      },
      { id: "opt-c", text: "Switch membuat dokumen sendiri -> Mengirim ke kedua komputer" },
      { id: "opt-d", text: "Printer mengirim perintah cek status ke PC-Katalog" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Alur request-response: Pembuatan permintaan oleh klien -> Transmisi via switch -> Pemrosesan oleh target -> Pengiriman respons balik ke klien.",
  },
  {
    id: "final-wn-f09",
    outcomeId: "WN-M4",
    question:
      "PC-Katalog berhasil melakukan pencarian data di server lokal, tetapi PC-Sirkulasi sama sekali tidak bisa terhubung ke server maupun printer. Lampu port kabel LAN di belakang PC-Sirkulasi tampak mati gelap. Apa hipotesis awal yang paling masuk akal?",
    options: [
      { id: "opt-a", text: "Server lokal mengalami kerusakan hardware fatal." },
      { id: "opt-b", text: "Switch perpustakaan mati total." },
      { id: "opt-c", text: "Kabel koneksi antara PC-Sirkulasi dan switch longgar, lepas, atau putus." },
      { id: "opt-d", text: "Listrik di seluruh gedung sekolah padam." },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Lampu port mati dan isolasi kegagalan pada PC-Sirkulasi saja (sementara PC-Katalog normal) mengindikasikan masalah fisik pada kabel koneksi PC-Sirkulasi.",
  },
  {
    id: "final-wn-f10",
    outcomeId: "WN-M4",
    question:
      "Jika kabel cabang yang menghubungkan PC-Katalog ke switch dicabut, bagaimana dampaknya terhadap operasional PC-Sirkulasi dan Printer Barcode?",
    options: [
      { id: "opt-a", text: "Seluruh sistem jaringan perpustakaan lumpuh total." },
      {
        id: "opt-b",
        text: "PC-Sirkulasi dan Printer Barcode tetap dapat saling berkomunikasi normal karena masing-masing memiliki jalur kabel tersendiri ke switch.",
      },
      { id: "opt-c", text: "PC-Sirkulasi akan otomatis berganti nama menjadi PC-Katalog." },
      { id: "opt-d", text: "Printer Barcode akan mencetak kertas kosong terus menerus." },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Pada topologi star, pemutusan salah satu kabel cabang hanya memutus perangkat di cabang tersebut; perangkat lain di cabang terpisah tetap berfungsi normal.",
  },
];

// ==========================================
// 3 Practical Evaluation Criteria (P01–P03)
// ==========================================

/**
 * Server-authoritative evaluator for the beginner connectivity practical simulation.
 */
export function evaluatePracticalConnectivity(
  state: PracticalSubmissionState
): {
  allPassed: boolean;
  criteriaResults: PracticalCriterionResult[];
} {
  // P01: Physical Reachability
  // All three essential endpoints must have an active connection to the switch
  const hasKatalogLink = state.links.some(
    (l) =>
      ((l.from === "pc-katalog" && l.to === "switch-perpus") ||
        (l.from === "switch-perpus" && l.to === "pc-katalog")) &&
      l.status === "connected"
  );

  const hasSirkulasiLink = state.links.some(
    (l) =>
      ((l.from === "pc-sirkulasi" && l.to === "switch-perpus") ||
        (l.from === "switch-perpus" && l.to === "pc-sirkulasi")) &&
      l.status === "connected"
  );

  const hasPrinterLink = state.links.some(
    (l) =>
      ((l.from === "printer-barcode" && l.to === "switch-perpus") ||
        (l.from === "switch-perpus" && l.to === "printer-barcode")) &&
      l.status === "connected"
  );

  const p01Passed = hasKatalogLink && hasSirkulasiLink && hasPrinterLink;

  // P02: Fault Isolation & Repair
  // Specifically: pc-sirkulasi was repaired without breaking pc-katalog or printer
  const p02Passed = hasSirkulasiLink && hasKatalogLink && hasPrinterLink;

  // P03: Local Service Verification Without Internet
  // ISP uplink must remain offline/disconnected, yet print tests from both PCs must succeed
  const katalogPrintSuccess = state.verifiedPrints.some(
    (p) =>
      p.client === "pc-katalog" &&
      p.target === "printer-barcode" &&
      p.success === true
  );

  const sirkulasiPrintSuccess = state.verifiedPrints.some(
    (p) =>
      p.client === "pc-sirkulasi" &&
      p.target === "printer-barcode" &&
      p.success === true
  );

  const p03Passed =
    !state.ispUplinkConnected &&
    katalogPrintSuccess &&
    sirkulasiPrintSuccess &&
    p01Passed;

  const criteriaResults: PracticalCriterionResult[] = [
    {
      id: "P01",
      title: "Jalur Fisik Lengkap (Physical Reachability)",
      passed: p01Passed,
      reason: p01Passed
        ? "Seluruh perangkat kerja lokal terhubung fisik ke switch perpustakaan."
        : "Ada perangkat kerja lokal yang belum terhubung ke switch.",
    },
    {
      id: "P02",
      title: "Restorasi Cabang Rusak (Fault Isolation & Repair)",
      passed: p02Passed,
      reason: p02Passed
        ? "Kabel cabang PC-Sirkulasi berhasil dipasang kembali tanpa mengganggu cabang lain."
        : "Kabel cabang PC-Sirkulasi masih belum terpasang dengan benar.",
    },
    {
      id: "P03",
      title: "Verifikasi Layanan Lokal Mandiri (Local Service Verification)",
      passed: p03Passed,
      reason: p03Passed
        ? "Uji cetak dari kedua PC berhasil diverifikasi meskipun uplink Internet sedang padam."
        : "Uji cetak lokal belum berhasil diverifikasi pada kondisi offline Internet.",
    },
  ];

  const allPassed = criteriaResults.every((c) => c.passed);

  return {
    allPassed,
    criteriaResults,
  };
}
