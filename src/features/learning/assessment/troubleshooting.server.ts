/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR WIRELESS & TROUBLESHOOTING (P5-M1 s.d. P5-M4)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

import type { PrivateQuizQuestion } from "./welcome.server";

export const troubleshootingFormativeQuestions: PrivateQuizQuestion[] = [
  // =========================================================================
  // Module 1: Dasar Wireless & Propagasi Gelombang Radio (P5-M1)
  // =========================================================================

  // Lesson 1: band-frekuensi-wifi (P5-L01)
  {
    id: "quiz-wls-l1-q1",
    lessonSlug: "band-frekuensi-wifi",
    outcomeId: "WLS-L1-A",
    question:
      "Mengapa sinyal Wi-Fi frekuensi 2.4 GHz mampu menjangkau ruangan di balik dinding bata lebih baik dibanding 5 GHz?",
    options: [
      {
        id: "opt-a",
        text: "Panjang gelombang 2.4 GHz lebih panjang sehingga mengalami redaman penyerapan energi (attenuation) lebih kecil pada materi padat",
      },
      {
        id: "opt-b",
        text: "Daya pancar pemancar 2.4 GHz diatur 10 kali lebih kuat oleh standar regulasi internasional",
      },
      {
        id: "opt-c",
        text: "Frekuensi 2.4 GHz secara otomatis membelokkan gelombang melalui kabel listrik gedung",
      },
      {
        id: "opt-d",
        text: "Frekuensi 5 GHz menggunakan enkripsi digital yang menolak tembus dinding bata",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Secara hukum fisika propagasi elektromagnetik, gelombang frekuensi lebih rendah memiliki panjang gelombang lebih panjang (~12.5 cm pada 2.4 GHz vs ~6 cm pada 5 GHz), sehingga energi gelombang diserap lebih sedikit oleh partisi fisik padat.",
    misconceptionFeedback:
      "Daya pancar (Tx power) diatur ketat oleh regulasi (EIRP) dan dibatasi setara untuk semua frekuensi tanpa izin khusus; kemampuan tembus rintangan murni disebabkan oleh sifat redaman fisik panjang gelombang.",
  },
  {
    id: "quiz-wls-l1-q2",
    lessonSlug: "band-frekuensi-wifi",
    outcomeId: "WLS-L1-B",
    question:
      "Jika lab komputer sekolah membutuhkan transfer file video 4K antar laptop dengan delay minimal di satu ruangan terbuka tanpa sekat, pita manakah yang paling ideal?",
    options: [
      {
        id: "opt-a",
        text: "5 GHz atau 6 GHz karena mendukung lebar kanal 40/80/160 MHz dengan throughput data jauh lebih tinggi",
      },
      {
        id: "opt-b",
        text: "2.4 GHz karena frekuensi rendah menghasilkan koneksi yang paling tahan interferensi",
      },
      {
        id: "opt-c",
        text: "Pita 900 MHz karena hanya diperuntukkan bagi transmisi data video",
      },
      {
        id: "opt-d",
        text: "Pita Bluetooth karena tidak membutuhkan Access Point sama sekali",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Di ruangan tanpa sekat, redaman dinding tidak menjadi kendala. Pita 5 GHz dan 6 GHz menyediakan spektrum kanal yang jauh lebih lebar untuk mencapai throughput transfer gigabit.",
    misconceptionFeedback:
      "Pita 2.4 GHz memiliki kapasitas kanal sempit (maksimal 20 MHz efektif) yang sangat rentan mengalami kongesti kecepatan jika digunakan untuk transfer file besar oleh banyak laptop secara simultan.",
  },
  {
    id: "quiz-wls-l1-q3",
    lessonSlug: "band-frekuensi-wifi",
    outcomeId: "WLS-L1-B",
    question:
      "Apa fungsi utama dari mekanisme Band Steering pada Access Point enterprise?",
    options: [
      {
        id: "opt-a",
        text: "Mendorong klien dual-band untuk memprioritaskan koneksi ke pita 5 GHz demi mengurangi kepadatan di pita 2.4 GHz",
      },
      {
        id: "opt-b",
        text: "Mempercepat putaran antena motorik di dalam casing Access Point",
      },
      {
        id: "opt-c",
        text: "Mengubah frekuensi 2.4 GHz menjadi 5 GHz secara instan saat sinyal melemah",
      },
      {
        id: "opt-d",
        text: "Memblokir semua perangkat smartphone agar hanya laptop yang dapat terhubung",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Band Steering bekerja dengan merespons probe request klien dual-band hanya pada frekuensi 5 GHz, memaksa perangkat berkemampuan tinggi meninggalkan pita 2.4 GHz yang padat.",
    misconceptionFeedback:
      "Band Steering adalah fitur manajemen asosiasi berbasis perangkat lunak pada AP, bukan mekanisme pengubahan frekuensi radio secara fisik atau rotasi mekanik antena.",
  },

  // Lesson 2: channel-dan-interferensi (P5-L02)
  {
    id: "quiz-wls-l2-q1",
    lessonSlug: "channel-dan-interferensi",
    outcomeId: "WLS-L2-A",
    question:
      "Berapakah kombinasi kanal non-overlapping yang menjadi standar internasional pada pita frekuensi 2.4 GHz dengan lebar kanal 20 MHz?",
    options: [
      { id: "opt-a", text: "Kanal 1, Kanal 6, dan Kanal 11" },
      { id: "opt-b", text: "Kanal 1, Kanal 2, dan Kanal 3" },
      { id: "opt-c", text: "Kanal 2, Kanal 4, dan Kanal 8" },
      { id: "opt-d", text: "Kanal 1, Kanal 5, Kanal 9, dan Kanal 13" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Dengan lebar kanal 20 MHz dan separasi antar kanal 5 MHz, hanya kanal 1, 6, dan 11 yang memiliki jarak 25 MHz antar frekuensi tengah sehingga tidak saling tumpang tindih sama sekali.",
    misconceptionFeedback:
      "Memilih kanal berurutan seperti 1, 2, 3 menimbulkan tumpang tindih frekuensi parah karena setiap kanal 2.4 GHz membutuhkan ruang selebar 20-22 MHz.",
  },
  {
    id: "quiz-wls-l2-q2",
    lessonSlug: "channel-dan-interferensi",
    outcomeId: "WLS-L2-B",
    question:
      "Apa akibat teknis jika seorang teknisi menyetel AP Ruang Guru pada Kanal 3 di samping AP Ruang Kelas yang menggunakan Kanal 1?",
    options: [
      {
        id: "opt-a",
        text: "Terjadi Adjacent Channel Interference (ACI) parah karena frekuensi saling bertumpuk sebagian, menimbulkan RF noise dan frame corruption",
      },
      {
        id: "opt-b",
        text: "Kecepatan kedua AP otomatis bertambah dua kali lipat karena frekuensi saling menguatkan",
      },
      {
        id: "opt-c",
        text: "Kedua AP secara otomatis melakukan bonding kanal menjadi 40 MHz",
      },
      {
        id: "opt-d",
        text: "AP pada Kanal 3 otomatis mengubah frekuensinya menjadi 5 GHz",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Kanal 3 bertumpang tindih sebagian dengan Kanal 1. Sinyal yang tumpang tindih sebagian tidak dapat didekode oleh CSMA/CA melainkan dianggap derau (noise), memicu retransmisi dan packet loss tinggi.",
    misconceptionFeedback:
      "Frekuensi radio yang saling tumpang tindih sebagian tidak saling menguatkan melainkan mendistorsi bentuk gelombang (destructive noise interference).",
  },
  {
    id: "quiz-wls-l2-q3",
    lessonSlug: "channel-dan-interferensi",
    outcomeId: "WLS-L2-B",
    question:
      "Mengapa Co-Channel Interference (CCI) masih dianggap lebih aman bagi integritas paket dibanding Adjacent Channel Interference (ACI)?",
    options: [
      {
        id: "opt-a",
        text: "Karena pada CCI perangkat memahami protokol CSMA/CA dan menunda transmisi secara teratur, bukan menghasilkan distorsi noise acak",
      },
      {
        id: "opt-b",
        text: "Karena CCI menggunakan kabel fisik di udara untuk mengalirkan data",
      },
      {
        id: "opt-c",
        text: "Karena CCI tidak memerlukan antena nirkabel pada laptop klien",
      },
      {
        id: "opt-d",
        text: "Karena CCI secara otomatis mengenkripsi data dengan kunci 256-bit",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Pada kanal yang sama (CCI), perangkat dapat mendeteksi frame preamble perangkat lain dan melakukan backoff antrean (contention), sehingga data tidak rusak meskipun throughput terbagi.",
    misconceptionFeedback:
      "CCI terjadi pada media nirkabel yang sama persis (bukan kabel); yang membuatnya lebih baik adalah kepatuhan perangkat pada mekanisme antre CSMA/CA (Clear Channel Assessment).",
  },

  // =========================================================================
  // Module 2: Keamanan Jaringan Nirkabel & Segmentasi (P5-M2)
  // =========================================================================

  // Lesson 3: keamanan-wpa2-wpa3 (P5-L03)
  {
    id: "quiz-sec-l3-q1",
    lessonSlug: "keamanan-wpa2-wpa3",
    outcomeId: "SEC-L3-A",
    question:
      "Mengapa seorang penyerang dapat melakukan cracking password WPA2-Personal di rumahnya sendiri tanpa terhubung ke Access Point korban?",
    options: [
      {
        id: "opt-a",
        text: "Karena penyerang telah merekam paket 4-Way Handshake dari udara dan mengujinya secara offline dengan wordlist lokal menggunakan GPU",
      },
      {
        id: "opt-b",
        text: "Karena WPA2 tidak menggunakan sandi saat mengirim data",
      },
      {
        id: "opt-c",
        text: "Karena Access Point secara sukarela mengirimkan file konfigurasi ke penyerang",
      },
      {
        id: "opt-d",
        text: "Karena sinyal Wi-Fi WPA2 dapat dibaca oleh satelit cuaca",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Kelemahan terbesar 4-Way Handshake WPA2 adalah paket pertukaran kunci yang terekam di udara memuat cryptographic hash yang dapat diuji jutaan kali per detik secara offline tanpa perlu terhubung kembali ke AP korban.",
    misconceptionFeedback:
      "WPA2 menggunakan sandi (PSK) dan enkripsi AES yang kuat, namun kelemahannya terletak pada verifikasi hash handshake yang dapat diproses secara offline tanpa interaksi real-time dengan AP.",
  },
  {
    id: "quiz-sec-l3-q2",
    lessonSlug: "keamanan-wpa2-wpa3",
    outcomeId: "SEC-L3-A",
    question:
      "Fitur keamanan utama apakah yang diperkenalkan oleh WPA3-Personal melalui protokol SAE (Dragonfly) untuk menangkal cracking?",
    options: [
      {
        id: "opt-a",
        text: "Mekanisme zero-knowledge proof di mana tebakan salah tidak dapat diverifikasi secara offline tanpa berkomunikasi langsung dengan AP",
      },
      {
        id: "opt-b",
        text: "Penghapusan seluruh gelombang elektromagnetik radio di udara",
      },
      {
        id: "opt-c",
        text: "Kewajiban memasukkan nomor KTP setiap kali ingin browsing web",
      },
      {
        id: "opt-d",
        text: "Perubahan otomatis alamat MAC laptop klien setiap 1 detik",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "SAE (Simultaneous Authentication of Equals) mengharuskan interaksi aktif dengan AP untuk setiap kali tebakan sandi, sehingga penyerang tidak dapat menjalankan dictionary attack offline.",
    misconceptionFeedback:
      "WPA3 tidak menghapus gelombang radio atau mewajibkan identitas kependudukan; proteksi didapatkan dari algoritma matematika pertukaran kunci Dragonfly.",
  },
  {
    id: "quiz-sec-l3-q3",
    lessonSlug: "keamanan-wpa2-wpa3",
    outcomeId: "SEC-L3-B",
    question:
      "Di sebuah sekolah SMK dengan 50 guru dan 600 siswa, mengapa mode WPA-Enterprise (802.1X + RADIUS) jauh lebih direkomendasikan dibanding WPA-Personal (PSK)?",
    options: [
      {
        id: "opt-a",
        text: "Karena setiap siswa dan staf memiliki akun username/password unik sehingga jika ada yang lulus, akun dapat dicabut di server tanpa mengganti sandi seluruh sekolah",
      },
      {
        id: "opt-b",
        text: "Karena WPA-Enterprise membuat jangkauan antena router bertambah hingga 10 kilometer",
      },
      {
        id: "opt-c",
        text: "Karena WPA-Enterprise tidak memerlukan Access Point nirkabel di setiap ruangan",
      },
      {
        id: "opt-d",
        text: "Karena WPA-Enterprise otomatis menggratiskan tagihan langganan ISP bulanan",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "WPA-Enterprise memisahkan identitas tiap pengguna. Penggantian kata sandi atau pencabutan akses seorang siswa tidak memengaruhi kredensial ratusan pengguna lainnya.",
    misconceptionFeedback:
      "WPA-Enterprise adalah arsitektur autentikasi jaringan tingkat perangkat lunak/server, bukan penguat daya jangkauan fisik pemancar nirkabel.",
  },

  // Lesson 4: guest-network-isolation (P5-L04)
  {
    id: "quiz-sec-l4-q1",
    lessonSlug: "guest-network-isolation",
    outcomeId: "SEC-L4-A",
    question:
      "Apa yang terjadi ketika dua laptop terhubung ke Wi-Fi kafe yang mengaktifkan fitur AP Client Isolation dan salah satu laptop mencoba melakukan ping ke laptop lainnya?",
    options: [
      {
        id: "opt-a",
        text: "Ping akan gagal (Request Timed Out / Dropped) karena Access Point memblokir seluruh komunikasi Layer 2 antar perangkat nirkabel lokal",
      },
      {
        id: "opt-b",
        text: "Kedua laptop akan langsung terputus dari listrik gedung",
      },
      {
        id: "opt-c",
        text: "Kecepatan internet kedua laptop akan otomatis menjadi 0 Kbps permanen",
      },
      {
        id: "opt-d",
        text: "Access Point akan me-restart dirinya sendiri",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Dengan AP Client Isolation, Access Point melarang forwarding frame ethernet antar-stasiun wireless asosiasinya, sehingga klien tidak bisa saling ping atau bertukar data.",
    misconceptionFeedback:
      "Fitur isolasi tidak mematikan daya listrik atau merusak koneksi internet klien; fitur ini hanya memfilter paket peer-to-peer antar perangkat nirkabel.",
  },
  {
    id: "quiz-sec-l4-q2",
    lessonSlug: "guest-network-isolation",
    outcomeId: "SEC-L4-B",
    question:
      "Mengapa mengaktifkan Client Isolation pada AP saja belum cukup untuk melindungi server database internal perusahaan dari perangkat tamu?",
    options: [
      {
        id: "opt-a",
        text: "Karena Client Isolation hanya bekerja antar perangkat nirkabel di AP yang sama; tamu masih bisa menjangkau IP server via perutean router jika tidak ada firewall/ACL pemisah VLAN",
      },
      {
        id: "opt-b",
        text: "Karena server database selalu terhubung via satelit luar angkasa",
      },
      {
        id: "opt-c",
        text: "Karena Client Isolation otomatis dinonaktifkan setiap malam hari",
      },
      {
        id: "opt-d",
        text: "Karena protokol TCP menolak mematuhi aturan Client Isolation",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Client Isolation hanya bekerja di Layer 2 nirkabel AP. Jika paket tamu diteruskan ke router dan router mengizinkan routing antar-subnet, tamu tetap bisa menjangkau server LAN kabel.",
    misconceptionFeedback:
      "Client Isolation adalah fitur Layer 2 pada wireless radio. Paket yang menuju Default Gateway tetap diteruskan, sehingga router memerlukan ACL Layer 3 untuk memblokir akses ke server kabel.",
  },
  {
    id: "quiz-sec-l4-q3",
    lessonSlug: "guest-network-isolation",
    outcomeId: "SEC-L4-B",
    question:
      "Kombinasi konfigurasi ideal manakah yang harus diterapkan untuk menyediakan Wi-Fi tamu yang aman di lingkungan sekolah?",
    options: [
      {
        id: "opt-a",
        text: "Multi-SSID dipetakan ke VLAN Tamu terpisah, aktifkan AP Client Isolation, dan terapkan ACL firewall blokir ke seluruh subnet internal",
      },
      {
        id: "opt-b",
        text: "Satu SSID bersama dengan satu password pendek yang ditempel di dinding lobi",
      },
      {
        id: "opt-c",
        text: "Menghubungkan AP tamu langsung ke port switch yang sama dengan server nilai siswa tanpa VLAN",
      },
      {
        id: "opt-d",
        text: "Mematikan fungsi DHCP agar semua tamu harus menebak IP server secara manual",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Pemisahan VLAN, Client Isolation, dan ACL firewall membatasi tamu hanya bisa mengakses gateway Internet dan menutup rapat jalur menuju resource internal sekolah.",
    misconceptionFeedback:
      "Menempelkan password bersama di dinding tanpa isolasi memberikan akses penuh bagi pihak luar untuk memindai port dan menyebarkan malware ke komputer staf sekolah.",
  },

  // =========================================================================
  // Module 3: Alat Diagnostik Jaringan & CLI (P5-M3)
  // =========================================================================

  // Lesson 5: ipconfig-ping-diagnostic (P5-L05)
  {
    id: "quiz-diag-l5-q1",
    lessonSlug: "ipconfig-ping-diagnostic",
    outcomeId: "DIAG-L5-A",
    question:
      "Jika hasil ipconfig pada laptop seorang staf kantor menunjukkan IPv4 Address '169.254.20.15' dan Default Gateway kosong, apa kesimpulan investigasi yang paling akurat?",
    options: [
      {
        id: "opt-a",
        text: "Laptop mengalami masalah APIPA karena gagal menerima penawaran alamat IP dari DHCP Server",
      },
      {
        id: "opt-b",
        text: "Laptop telah diretas oleh pihak luar sehingga IP-nya diubah",
      },
      {
        id: "opt-c",
        text: "Kartu Wi-Fi laptop terbakar dan harus segera diganti",
      },
      {
        id: "opt-d",
        text: "Koneksi internet kantor sedang berjalan pada kecepatan maksimum",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Rentang IP 169.254.0.0/16 adalah alamat otomatis APIPA yang dialokasikan sistem operasi saat request DHCP tidak memperoleh balasan DHCPOFFER.",
    misconceptionFeedback:
      "Alamat 169.254.x.x bukan disebabkan oleh virus atau peretasan, melainkan mekanisme bawaan sistem operasi Windows saat tidak ada respons dari DHCP Server.",
  },
  {
    id: "quiz-diag-l5-q2",
    lessonSlug: "ipconfig-ping-diagnostic",
    outcomeId: "DIAG-L5-B",
    question:
      "Seorang teknisi melakukan ping ke IP gateway lokal (192.168.1.1) dan mendapatkan balasan 'Destination host unreachable'. Apa arti teknis dari pesan ini?",
    options: [
      {
        id: "opt-a",
        text: "Perangkat pengirim tidak dapat menemukan MAC address tujuan melalui ARP, atau router lokal menyatakan tidak ada jalur ke subnet tersebut",
      },
      {
        id: "opt-b",
        text: "Paket berhasil sampai ke server tujuan namun ditolak oleh aplikasi web",
      },
      {
        id: "opt-c",
        text: "Kabel jaringan pengirim dicabut dari laptop",
      },
      {
        id: "opt-d",
        text: "Server DNS sedang mengalami pemeliharaan rutin",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Pesan 'Destination Host Unreachable' dipicu oleh kegagalan resolusi ARP pada subnet lokal atau router yang tidak memiliki entri rute menuju tujuan.",
    misconceptionFeedback:
      "Jika kabel dicabut, status adapter adalah 'Media disconnected'. Jika paket mencapai web server namun ditolak, itu adalah kegagalan Layer 7, bukan ICMP Unreachable.",
  },
  {
    id: "quiz-diag-l5-q3",
    lessonSlug: "ipconfig-ping-diagnostic",
    outcomeId: "DIAG-L5-B",
    question:
      "Ketika melakukan ping ke alamat internet, terminal memunculkan pesan 'TTL expired in transit'. Apa penyebab pasti dari gejala ini?",
    options: [
      {
        id: "opt-a",
        text: "Terjadi loop routing (lingkaran perutean tak berujung) antar router sehingga nilai TTL paket habis menjadi 0 sebelum sampai",
      },
      {
        id: "opt-b",
        text: "Pengguna terlambat membayar tagihan internet bulanan",
      },
      {
        id: "opt-c",
        text: "Kabel fiber optik putus di tengah laut",
      },
      {
        id: "opt-d",
        text: "Komputer target membalas paket lebih cepat dari kecepatan cahaya",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Setiap hop router mengurangi nilai TTL sebesar 1. Jika dua router saling mengembalikan paket (loop), TTL akan terdeplesi hingga 0 dan router membuang paket sambil membalas ICMP TTL Expired in Transit.",
    misconceptionFeedback:
      "Kabel fiber optik yang putus menghasilkan 'Request timed out' atau 'Destination Net Unreachable', bukan 'TTL expired in transit'.",
  },

  // Lesson 6: nslookup-arp-traceroute (P5-L06)
  {
    id: "quiz-diag-l6-q1",
    lessonSlug: "nslookup-arp-traceroute",
    outcomeId: "DIAG-L6-A",
    question:
      "Seorang pengguna dapat melakukan ping ke alamat '8.8.8.8' dengan sukses, namun gagal membuka situs 'google.com' di web browser. Perintah CLI manakah yang paling tepat untuk menginvestigasi masalah ini?",
    options: [
      {
        id: "opt-a",
        text: "nslookup google.com untuk memeriksa apakah server DNS lokal berhasil menerjemahkan domain tersebut menjadi alamat IP",
      },
      {
        id: "opt-b",
        text: "format c: untuk menginstal ulang sistem operasi",
      },
      {
        id: "opt-c",
        text: "ping 127.0.0.1 untuk menguji kartu jaringan",
      },
      {
        id: "opt-d",
        text: "color a untuk mengubah tampilan layar terminal menjadi hijau",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Bisa ping ke IP publik (8.8.8.8) tetapi tidak bisa membuka nama domain membuktikan bahwa Layer 1-3 berfungsi normal, dan kerusakan berada pada sistem resolusi DNS.",
    misconceptionFeedback:
      "Menguji ping 127.0.0.1 tidak relevan karena konektivitas internet luar sudah terbukti hidup melalui ping ke 8.8.8.8.",
  },
  {
    id: "quiz-diag-l6-q2",
    lessonSlug: "nslookup-arp-traceroute",
    outcomeId: "DIAG-L6-A",
    question:
      "Saat menjalankan perintah 'arp -a', seorang administrator menemukan bahwa IP Default Gateway (192.168.1.1) dan IP sebuah laptop asing (192.168.1.55) memiliki Physical Address MAC yang sama persis. Apa yang sedang terjadi?",
    options: [
      {
        id: "opt-a",
        text: "Terjadi serangan ARP Spoofing / Poisoning di mana laptop asing memalsukan diri sebagai router untuk menyadap lalu lintas",
      },
      {
        id: "opt-b",
        text: "Router dan laptop tersebut diproduksi di pabrik yang sama pada hari yang sama",
      },
      {
        id: "opt-c",
        text: "Switch jaringan sedang melakukan backup konfigurasi otomatis",
      },
      {
        id: "opt-d",
        text: "Kedua perangkat saling bertukar antena Wi-Fi secara nirkabel",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Dua alamat IP berbeda tidak boleh memiliki satu MAC address yang sama pada satu LAN kecuali terjadi pemalsuan balasan ARP (ARP Spoofing/Poisoning Man-in-the-Middle).",
    misconceptionFeedback:
      "Setiap kartu jaringan memiliki MAC address pabrik yang unik secara global (OUI vendor). Dua IP dengan MAC yang sama di satu switch adalah tanda pasti serangan keracunan ARP.",
  },
  {
    id: "quiz-diag-l6-q3",
    lessonSlug: "nslookup-arp-traceroute",
    outcomeId: "DIAG-L6-B",
    question:
      "Ketika menjalankan 'tracert 10.10.20.5', Hop 1 (192.168.1.1) membalas 1ms, Hop 2 (10.0.0.1) membalas 5ms, namun Hop 3 dan seterusnya hanya menampilkan '* * * Request timed out'. Apa kesimpulan teknisnya?",
    options: [
      {
        id: "opt-a",
        text: "Paket berhasil melewati router lokal dan router Hop 2, namun terputus atau diblokir pada tautan menuju Hop 3",
      },
      {
        id: "opt-b",
        text: "Kabel LAN di laptop pengguna dicabut pada saat Hop 3 berlangsung",
      },
      {
        id: "opt-c",
        text: "Server DNS mematikan sambungan listrik di Hop 3",
      },
      {
        id: "opt-d",
        text: "Komputer pengguna kehabisan memori RAM",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Hasil tracert membuktikan paket berhasil melintasi Hop 1 dan 2, sehingga titik putus konektivitas terlokalisir secara presisi pada interface keluar Hop 2 atau link menuju Hop 3.",
    misconceptionFeedback:
      "Jika kabel LAN pengguna dicabut, maka Hop 1 pun tidak akan pernah membalas 1ms sejak awal pengujian.",
  },

  // =========================================================================
  // Module 4: Metodologi Troubleshooting Sistematis (P5-M4)
  // =========================================================================

  // Lesson 7: observasi-dan-hipotesis (P5-L07)
  {
    id: "quiz-mth-l7-q1",
    lessonSlug: "observasi-dan-hipotesis",
    outcomeId: "MTH-L7-A",
    question:
      "Seorang teknisi memulai investigasi keluhan jaringan dengan melakukan ping ke IP gateway lokal untuk menentukan apakah masalah berada di Layer 1-3 atau Layer 4-7. Strategi model OSI apakah yang digunakan?",
    options: [
      { id: "opt-a", text: "Pendekatan Divide-and-Conquer" },
      { id: "opt-b", text: "Pendekatan Bottom-Up" },
      { id: "opt-c", text: "Pendekatan Top-Down" },
      { id: "opt-d", text: "Pendekatan Random Trial and Error" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Divide-and-Conquer memulai pengujian pada lapisan tengah (Layer 3 Network) via ping untuk membelah cakupan penyelidikan menjadi dua arah logis.",
    misconceptionFeedback:
      "Pendekatan Bottom-Up selalu dimulai dari pengecekan fisik kabel dan tegangan listrik (Layer 1), bukan langsung mengeksekusi ping IP di Layer 3.",
  },
  {
    id: "quiz-mth-l7-q2",
    lessonSlug: "observasi-dan-hipotesis",
    outcomeId: "MTH-L7-B",
    question:
      "Karyawan mengeluh: 'Aplikasi ERP tidak bisa dibuka sama sekali, pasti jaringan kantor terserang virus ransomware'. Tindakan pertama apa yang paling tepat dilakukan oleh staf IT?",
    options: [
      {
        id: "opt-a",
        text: "Mengumpulkan bukti faktual secara tenang: memeriksa link adapter, menjalankan ipconfig, menguji ping ke IP server ERP, dan memeriksa status port di server",
      },
      {
        id: "opt-b",
        text: "Langsung mematikan seluruh generator listrik gedung untuk menghentikan virus",
      },
      {
        id: "opt-c",
        text: "Menyetujui klaim pengguna dan langsung memformat ulang harddisk server",
      },
      {
        id: "opt-d",
        text: "Mengumumkan bahwa hari itu kantor diliburkan",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Teknisi harus selalu mendahulukan pengumpulan bukti faktual dan observasi teknis obyektif sebelum mengambil tindakan apapun.",
    misconceptionFeedback:
      "Klaim pengguna sering kali didasari kepanikan atau asumsi tanpa dasar teknis; bertindak tanpa bukti observasi berisiko menimbulkan downtime yang jauh lebih parah.",
  },
  {
    id: "quiz-mth-l7-q3",
    lessonSlug: "observasi-dan-hipotesis",
    outcomeId: "MTH-L7-B",
    question:
      "Di antara gejala berikut, manakah yang merupakan bukti observasi teknis objektif (faktual) dan bukan opini subjektif?",
    options: [
      {
        id: "opt-a",
        text: "Output ipconfig menunjukkan Autoconfiguration IPv4 169.254.12.88 dengan Subnet Mask 255.255.0.0",
      },
      {
        id: "opt-b",
        text: "Pengguna merasa internet hari ini lebih lambat dari hari kemarin",
      },
      {
        id: "opt-c",
        text: "Staf menduga ada kabel yang dimakan tikus di atas plafon",
      },
      {
        id: "opt-d",
        text: "Pengguna yakin router kantor sudah terlalu tua",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Output CLI ipconfig adalah data kuantitatif dan teknis yang dapat diverifikasi ulang tanpa bias perasaan subjektif pengguna.",
    misconceptionFeedback:
      "Perasaan lambat, dugaan tikus, dan keyakinan router tua adalah asumsi subjektif yang belum diverifikasi dengan alat ukur atau data teknis.",
  },

  // Lesson 8: perbaikan-dan-verifikasi (P5-L08)
  {
    id: "quiz-mth-l8-q1",
    lessonSlug: "perbaikan-dan-verifikasi",
    outcomeId: "MTH-L8-A",
    question:
      "Mengapa seorang administrator jaringan diwajibkan hanya mengubah satu konfigurasi pada satu waktu saat proses troubleshooting?",
    options: [
      {
        id: "opt-a",
        text: "Agar dapat mengetahui secara pasti konfigurasi mana yang benar-benar menjadi solusi dan tidak memperparah kekacauan sistem",
      },
      {
        id: "opt-b",
        text: "Karena perangkat router hanya memiliki memori untuk memproses satu huruf per menit",
      },
      {
        id: "opt-c",
        text: "Agar teknisi terlihat bekerja lebih lama di depan atasan",
      },
      {
        id: "opt-d",
        text: "Karena peraturan pemerintah melarang perubahan lebih dari satu baris kode",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Isolasi variabel memastikan kita dapat mengatribusikan keberhasilan atau kegagalan kepada satu parameter spesifik yang diuji.",
    misconceptionFeedback:
      "Mengubah banyak setelan sekaligus membuat teknisi kehilangan jejak penyebab perbaikan dan berisiko menciptakan cacat konfigurasi tersembunyi.",
  },
  {
    id: "quiz-mth-l8-q2",
    lessonSlug: "perbaikan-dan-verifikasi",
    outcomeId: "MTH-L8-A",
    question:
      "Seorang teknisi baru saja mengaktifkan rute statis baru di router cabang namun ping ke server tetap gagal. Apa tindakan yang harus segera diambil sesuai SOP troubleshooting?",
    options: [
      {
        id: "opt-a",
        text: "Melakukan rollback (menghapus rute statis yang baru ditambahkan) sebelum mencoba opsi atau hipotesis berikutnya",
      },
      {
        id: "opt-b",
        text: "Menambahkan 10 rute statis baru secara acak ke seluruh port",
      },
      {
        id: "opt-c",
        text: "Membeli router baru di toko online",
      },
      {
        id: "opt-d",
        text: "Mematikan router dan meninggalkannya begitu saja",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Rollback wajib dilakukan segera setelah suatu hipotesis terbukti salah agar konfigurasi perangkat tidak tertumpuk dengan setelan yang salah.",
    misconceptionFeedback:
      "Menumpuk perubahan baru tanpa membatalkan perubahan sebelumnya yang tidak efektif akan memperparah disorientasi dan menyulitkan pelacakan masalah asli.",
  },
  {
    id: "quiz-mth-l8-q3",
    lessonSlug: "perbaikan-dan-verifikasi",
    outcomeId: "MTH-L8-B",
    question:
      "Setelah memperbaiki konfigurasi VLAN switch, tes ping dari PC pengguna ke server aplikasi berhasil 100%. Mengapa teknisi belum boleh menutup tiket gangguan?",
    options: [
      {
        id: "opt-a",
        text: "Karena harus memverifikasi bahwa pengguna dapat membuka web browser, login, dan menjalankan transaksi di aplikasi tersebut secara fungsional (Layer 7)",
      },
      {
        id: "opt-b",
        text: "Karena ping harus diulang sebanyak satu juta kali terlebih dahulu",
      },
      {
        id: "opt-c",
        text: "Karena switch harus didiamkan selama 3 hari agar suhu dingin",
      },
      {
        id: "opt-d",
        text: "Karena ping ICMP merusak kabel tembaga jika tidak dihentikan secara manual",
      },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Konektivitas ICMP (Layer 3) tidak menjamin port aplikasi web (Layer 4/7) dapat diakses atau otorisasi login berjalan dengan benar. Verifikasi menyeluruh mutlak diperlukan.",
    misconceptionFeedback:
      "Ping hanya membuktikan paket ICMP Layer 3 berhasil bolak-balik; tiket baru sah ditutup jika aplikasi bisnis di Layer 7 benar-benar dapat digunakan oleh user.",
  },
];
