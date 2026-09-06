/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR SWITCHING & LAN (P3-M1 s.d. P3-M4)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

import type { PrivateQuizQuestion } from "./welcome.server";

export const switchingFormativeQuestions: PrivateQuizQuestion[] = [
  // =========================================================================
  // Module 1: Ethernet & Alamat MAC (P3-M1)
  // =========================================================================

  // Lesson 1: ethernet-mac-address
  {
    id: "quiz-eth-l1-q1",
    lessonSlug: "ethernet-mac-address",
    outcomeId: "ETH-L1-A",
    question: "Berapa panjang total ukuran sebuah MAC Address dalam representasi bit dan byte?",
    options: [
      { id: "opt-a", text: "32 bit (4 byte)" },
      { id: "opt-b", text: "48 bit (6 byte)" },
      { id: "opt-c", text: "64 bit (8 byte)" },
      { id: "opt-d", text: "128 bit (16 byte)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "MAC Address berukuran 48 bit (6 byte), terdiri dari 24 bit OUI untuk kode manufaktur dan 24 bit ID antarmuka perangkat.",
    misconceptionFeedback:
      "Jangan tertukar dengan alamat IPv4 yang berukuran 32 bit (4 byte) atau IPv6 yang berukuran 128 bit. MAC address selalu berukuran 48 bit (6 byte).",
  },
  {
    id: "quiz-eth-l1-q2",
    lessonSlug: "ethernet-mac-address",
    outcomeId: "ETH-L1-A",
    question: "Apa fungsi utama dari field FCS (Frame Check Sequence) pada frame Ethernet?",
    options: [
      { id: "opt-a", text: "Menentukan kecepatan transmisi port switch (10/100/1000 Mbps)" },
      { id: "opt-b", text: "Mendeteksi kerusakan bit data selama transmisi menggunakan algoritma CRC" },
      { id: "opt-c", text: "Mengatur alamat IP tujuan dari komputer penerima" },
      { id: "opt-d", text: "Membagi frame menjadi potongan paket yang lebih kecil" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "FCS menggunakan algoritma CRC-32 untuk mendeteksi apakah bit-bit di dalam frame mengalami gangguan atau korupsi sinyal saat melintasi kabel.",
    misconceptionFeedback:
      "FCS bertugas sebagai pemeriksa integritas fisik data (error detection). Kecepatan port ditentukan oleh auto-negotiation pada physical layer.",
  },
  {
    id: "quiz-eth-l1-q3",
    lessonSlug: "ethernet-mac-address",
    outcomeId: "ETH-L1-B",
    question: "24 bit pertama dari sebuah MAC address disebut OUI. Siapa yang menerbitkan OUI tersebut?",
    options: [
      { id: "opt-a", text: "IEEE (Institute of Electrical and Electronics Engineers) kepada pabrikan vendor" },
      { id: "opt-b", text: "Administrator jaringan lokal di sekolah/kantor" },
      { id: "opt-c", text: "Router gateway ISP melalui layanan DHCP" },
      { id: "opt-d", text: "Sistem operasi komputer saat pertama kali dinyalakan" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "OUI (Organizationally Unique Identifier) dikelola dan diterbitkan secara resmi oleh IEEE kepada vendor perangkat keras jaringan seperti Cisco, Intel, Realtek, MikroTik, dll.",
    misconceptionFeedback:
      "OUI bukan dibuat oleh administrator lokal atau server DHCP. Alamat fisik MAC diatur secara global oleh organisasi standardisasi IEEE kepada vendor perangkat keras.",
  },

  // Lesson 2: mac-learning-table
  {
    id: "quiz-eth-l2-q1",
    lessonSlug: "mac-learning-table",
    outcomeId: "ETH-L2-A",
    question: "Bagian manakah dari frame Ethernet yang digunakan oleh switch untuk mempelajari dan mengisi tabel MAC-nya?",
    options: [
      { id: "opt-a", text: "Destination MAC Address" },
      { id: "opt-b", text: "Source MAC Address" },
      { id: "opt-c", text: "Field EtherType" },
      { id: "opt-d", text: "Frame Check Sequence (FCS)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Switch belajar dari Source MAC address frame yang masuk pada port tertentu, bukan dari Destination MAC.",
    misconceptionFeedback:
      "Ingat aturan emas switch: Switch BELAJAR dari Source MAC, dan switch MENERUSKAN frame berdasarkan Destination MAC.",
  },
  {
    id: "quiz-eth-l2-q2",
    lessonSlug: "mac-learning-table",
    outcomeId: "ETH-L2-B",
    question: "Apa yang dilakukan switch jika menerima frame unicast dengan Destination MAC yang belum tercatat di tabel CAM?",
    options: [
      { id: "opt-a", text: "Membuang frame seketika (drop frame)" },
      { id: "opt-b", text: "Mengirim frame ke seluruh port aktif kecuali port tempat frame tersebut masuk (flooding)" },
      { id: "opt-c", text: "Mengembalikan frame ke komputer pengirim" },
      { id: "opt-d", text: "Mengubah MAC tujuan menjadi broadcast secara otomatis" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Proses ini disebut Unknown Unicast Flooding. Switch meneruskan frame ke semua port aktif selain port kedatangan agar penerima tetap mendapatkan datanya.",
    misconceptionFeedback:
      "Switch tidak membuang paket jika MAC tujuan belum ada di tabel. Switch melakukan flooding ke semua port lain agar komunikasi tetap tersambung.",
  },
  {
    id: "quiz-eth-l2-q3",
    lessonSlug: "mac-learning-table",
    outcomeId: "ETH-L2-A",
    question: "Mengapa tabel MAC switch memiliki Aging Timer (waktu kedaluwarsa, misal 300 detik)?",
    options: [
      { id: "opt-a", text: "Agar port switch tidak kepanasan akibat beban listrik" },
      { id: "opt-b", text: "Untuk menghapus entri perangkat yang sudah dicabut/pindah port sehingga tabel tetap akurat" },
      { id: "opt-c", text: "Karena kapasitas kabel LAN hanya bisa menyimpan data selama 5 menit" },
      { id: "opt-d", text: "Sebagai standar keamanan wajib untuk memblokir hacker setiap 5 menit" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Aging Timer memastikan bahwa jika komputer dimatikan, kabel dicabut, atau dipindahkan ke port lain, entri lama akan dihapus dan digantikan entri baru.",
    misconceptionFeedback:
      "Aging timer berfungsi menjaga kebersihan dan akurasi tabel memori CAM jika topologi perangkat berubah secara dinamis.",
  },

  // =========================================================================
  // Module 2: Protokol ARP & Resolusi Alamat (P3-M2)
  // =========================================================================

  // Lesson 3: arp-request-reply
  {
    id: "quiz-arp-l1-q1",
    lessonSlug: "arp-request-reply",
    outcomeId: "ARP-L1-A",
    question: "Apa fungsi mendasar dari protokol ARP (Address Resolution Protocol)?",
    options: [
      { id: "opt-a", text: "Menerjemahkan nama domain (seperti google.com) menjadi alamat IP" },
      { id: "opt-b", text: "Menerjemahkan alamat IP yang diketahui menjadi alamat MAC fisik kartu jaringan" },
      { id: "opt-c", text: "Memberikan alamat IP otomatis kepada komputer yang baru tersambung" },
      { id: "opt-d", text: "Mengamankan password login pengguna menggunakan enkripsi" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "ARP bertugas memetakan alamat logika Layer 3 (IPv4) ke alamat perangkat keras fisik Layer 2 (MAC address) dalam satu jaringan lokal.",
    misconceptionFeedback:
      "Menerjemahkan nama domain ke IP adalah tugas DNS. Mengalokasikan IP otomatis adalah tugas DHCP. Tugas utama ARP adalah IP ke MAC address.",
  },
  {
    id: "quiz-arp-l1-q2",
    lessonSlug: "arp-request-reply",
    outcomeId: "ARP-L1-B",
    question: "Alamat Destination MAC apa yang digunakan pada header Ethernet saat komputer mengirimkan ARP Request?",
    options: [
      { id: "opt-a", text: "00:00:00:00:00:00" },
      { id: "opt-b", text: "FF:FF:FF:FF:FF:FF" },
      { id: "opt-c", text: "MAC address Default Gateway" },
      { id: "opt-d", text: "127.0.0.1" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Karena komputer pengirim belum tahu MAC tujuan, ARP Request dikirim ke alamat broadcast Layer 2 yaitu FF:FF:FF:FF:FF:FF agar diterima semua host di LAN.",
    misconceptionFeedback:
      "ARP Request disebarkan ke semua host (broadcast), sehingga alamat tujuan fisiknya harus FF:FF:FF:FF:FF:FF.",
  },
  {
    id: "quiz-arp-l1-q3",
    lessonSlug: "arp-request-reply",
    outcomeId: "ARP-L1-B",
    question: "Bagaimana sifat transmisi paket pesan saat komputer tujuan membalas pesan ARP (ARP Reply)?",
    options: [
      { id: "opt-a", text: "Unicast langsung ke MAC address komputer pemohon (requester)" },
      { id: "opt-b", text: "Broadcast ke seluruh jaringan LAN" },
      { id: "opt-c", text: "Multicast khusus ke router gateway" },
      { id: "opt-d", text: "Disimpan di switch tanpa dikirim balik ke komputer" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Komputer penerima sudah mengetahui MAC pengirim dari pesan ARP Request, sehingga ARP Reply dikirim secara Unicast langsung ke pengirim aslinya.",
    misconceptionFeedback:
      "Balasan ARP Reply tidak perlu di-broadcast lagi karena komputer tujuan sudah membaca Source MAC pengirim dari pesan Request sebelumnya.",
  },

  // Lesson 4: local-remote-destination
  {
    id: "quiz-arp-l2-q1",
    lessonSlug: "local-remote-destination",
    outcomeId: "ARP-L2-A",
    question: "Komputer 192.168.10.5/24 ingin mengirim data ke 192.168.10.88. Apa yang dilakukan komputer tersebut untuk resolusi ARP?",
    options: [
      { id: "opt-a", text: "Mengirim ARP Request untuk mencari MAC address dari 192.168.10.88 secara langsung" },
      { id: "opt-b", text: "Mengirim frame langsung ke MAC address router gateway" },
      { id: "opt-c", text: "Menghubungi server DNS untuk meminta nomor port 192.168.10.88" },
      { id: "opt-d", text: "Membuang paket karena nomor host terlalu besar" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Karena 192.168.10.88 berada dalam subnet yang sama (/24), komputer menganggapnya sebagai tujuan lokal dan langsung melakukan ARP broadcast untuk IP tersebut.",
    misconceptionFeedback:
      "Jika tujuan satu subnet, komputer tidak perlu melewati router gateway. Host langsung menanyakan MAC peer secara mandiri.",
  },
  {
    id: "quiz-arp-l2-q2",
    lessonSlug: "local-remote-destination",
    outcomeId: "ARP-L2-B",
    question: "Komputer 192.168.1.50/24 ingin membuka situs web dengan alamat IP 203.0.113.10. Alamat MAC manakah yang dicari oleh komputer pengirim melalui protokol ARP?",
    options: [
      { id: "opt-a", text: "MAC address dari server web 203.0.113.10" },
      { id: "opt-b", text: "MAC address dari Default Gateway (Router lokal)" },
      { id: "opt-c", text: "MAC address switch terdekat" },
      { id: "opt-d", text: "MAC address broadcast FF:FF:FF:FF:FF:FF secara permanen" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Karena 203.0.113.10 berada di subnet berbeda (remote/internet), komputer harus menyerahkan frame ke Default Gateway lokal. Jadi komputer mencari MAC gateway.",
    misconceptionFeedback:
      "Host lokal tidak bisa melakukan ARP ke server remote di internet. Host mencari MAC Default Gateway lokal untuk menitipkan frame tersebut.",
  },
  {
    id: "quiz-arp-l2-q3",
    lessonSlug: "local-remote-destination",
    outcomeId: "ARP-L2-B",
    question: "Mengapa komputer tidak bisa mengirimkan ARP Request secara langsung ke server di Internet?",
    options: [
      { id: "opt-a", text: "Karena kabel fiber optik internet tidak mendukung sinyal biner" },
      { id: "opt-b", text: "Karena Router secara default memblokir frame broadcast Layer 2 agar tidak merembes ke jaringan luar" },
      { id: "opt-c", text: "Karena ukuran MAC address di internet berbeda dengan di LAN" },
      { id: "opt-d", text: "Karena server di internet tidak memiliki kartu jaringan (NIC)" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Router berfungsi sebagai pembatas broadcast domain. Frame broadcast Layer 2 (termasuk ARP) tidak pernah diteruskan melintasi router ke jaringan publik.",
    misconceptionFeedback:
      "Router adalah pemisah batas broadcast domain. Broadcast Layer 2 tidak diizinkan melintasi router demi mencegah banjir paket global di internet.",
  },

  // =========================================================================
  // Module 3: Konsep VLAN & Segmentasi Trafik (P3-M3)
  // =========================================================================

  // Lesson 5: broadcast-domain-vlan
  {
    id: "quiz-vlan-l1-q1",
    lessonSlug: "broadcast-domain-vlan",
    outcomeId: "VLAN-L1-A",
    question: "Apa pengertian dari Broadcast Domain dalam jaringan komputer?",
    options: [
      { id: "opt-a", text: "Area jaringan di mana frame broadcast yang dikirim satu host akan diterima oleh semua host lain di area tersebut" },
      { id: "opt-b", text: "Jarak maksimum kabel UTP yang diperbolehkan standar IEEE 802.3 (100 meter)" },
      { id: "opt-c", text: "Daftar situs web yang diblokir oleh firewall router" },
      { id: "opt-d", text: "Jumlah kapasitas memori RAM yang digunakan oleh switch untuk tabel MAC" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Broadcast Domain mencakup semua perangkat yang dapat menerima frame broadcast Layer 2 yang dipancarkan oleh salah satu anggotanya.",
    misconceptionFeedback:
      "Broadcast domain mengacu pada wilayah jangkauan penyebaran frame broadcast, bukan jarak fisik kabel atau daftar firewall.",
  },
  {
    id: "quiz-vlan-l1-q2",
    lessonSlug: "broadcast-domain-vlan",
    outcomeId: "VLAN-L1-A",
    question: "Manakah dampak negatif yang terjadi jika sebuah kantor dengan 300 komputer menggunakan Flat Network (tanpa VLAN)?",
    options: [
      { id: "opt-a", text: "Komputer tidak dapat menyala karena kekurangan daya listrik" },
      { id: "opt-b", text: "Trafik broadcast yang berlebihan membebani CPU seluruh komputer dan menurunkan performa jaringan" },
      { id: "opt-c", text: "Kecepatan kabel tembaga otomatis turun menjadi 10 Kbps" },
      { id: "opt-d", text: "Alamat MAC komputer akan berubah menjadi angka desimal" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Di jaringan tanpa segmentasi VLAN, setiap broadcast diproses oleh seluruh 300 komputer, menimbulkan overhead CPU dan risiko kelumpuhan jaringan (*broadcast storm*).",
    misconceptionFeedback:
      "Trafik broadcast berlebih menguras siklus CPU dan bandwidth jaringan di semua host yang terhubung.",
  },
  {
    id: "quiz-vlan-l1-q3",
    lessonSlug: "broadcast-domain-vlan",
    outcomeId: "VLAN-L1-B",
    question: "Bagaimana cara kerja teknologi VLAN dalam menyelesaikan masalah broadcast domain?",
    options: [
      { id: "opt-a", text: "Menghapus seluruh fitur broadcast dari protokol TCP/IP" },
      { id: "opt-b", text: "Memecah satu switch fisik menjadi beberapa segmen jaringan logis yang broadcast-nya terisolasi" },
      { id: "opt-c", text: "Mengganti kabel LAN tembaga menjadi serat optik tanpa switch" },
      { id: "opt-d", text: "Memaksa setiap komputer menggunakan dua kartu jaringan sekaligus" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "VLAN membagi switch fisik menjadi beberapa broadcast domain logis, sehingga broadcast di satu VLAN tidak akan pernah bocor ke VLAN lainnya.",
    misconceptionFeedback:
      "VLAN tidak menghapus broadcast, tetapi membatasi jangkauan broadcast hanya di dalam kelompok VLAN yang bersangkutan.",
  },

  // Lesson 6: vlan-membership
  {
    id: "quiz-vlan-l2-q1",
    lessonSlug: "vlan-membership",
    outcomeId: "VLAN-L2-A",
    question: "Berapakah rentang nomor VLAN ID Normal Range yang umum digunakan untuk konfigurasi jaringan pengguna?",
    options: [
      { id: "opt-a", text: "1 hingga 1005" },
      { id: "opt-b", text: "1 hingga 255" },
      { id: "opt-c", text: "1006 hingga 4094" },
      { id: "opt-d", text: "10 hingga 100" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Normal Range VLAN ID adalah 1 hingga 1005. Nilai 1006 hingga 4094 termasuk dalam Extended Range.",
    misconceptionFeedback:
      "1 hingga 1005 adalah rentang normal VLAN standar enterprise. Jangan tertukar dengan oktet IP 255.",
  },
  {
    id: "quiz-vlan-l2-q2",
    lessonSlug: "vlan-membership",
    outcomeId: "VLAN-L2-A",
    question: "Manakah pernyataan yang BENAR mengenai karakteristik VLAN 1 pada switch manage?",
    options: [
      { id: "opt-a", text: "VLAN 1 dapat dihapus jika administrator tidak menyukainya" },
      { id: "opt-b", text: "Semua port switch secara default adalah anggota VLAN 1 dan tidak dapat dihapus" },
      { id: "opt-c", text: "VLAN 1 hanya bisa digunakan oleh perangkat router Cisco" },
      { id: "opt-d", text: "VLAN 1 memiliki bandwidth lebih cepat daripada VLAN lainnya" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "VLAN 1 adalah Default VLAN pabrikan tempat semua port switch bernaung sebelum dikonfigurasi ulang. VLAN 1 tidak dapat dihapus.",
    misconceptionFeedback:
      "VLAN 1 adalah VLAN default pabrikan sistem yang tidak dapat dihapus atau diganti namanya.",
  },
  {
    id: "quiz-vlan-l2-q3",
    lessonSlug: "vlan-membership",
    outcomeId: "VLAN-L2-B",
    question: "PC A terhubung ke Port 2 (VLAN 10) dan PC B terhubung ke Port 8 (VLAN 20) pada switch Layer 2 yang sama. Mengapa PC A tidak bisa ping ke PC B?",
    options: [
      { id: "opt-a", text: "Karena kabel LAN port 8 terlalu panjang" },
      { id: "opt-b", text: "Karena switch Layer 2 mengisolasi broadcast domain dan komunikasi antar-VLAN berbeda" },
      { id: "opt-c", text: "Karena MAC address kedua PC saling bentrok" },
      { id: "opt-d", text: "Karena switch mendeteksi adanya virus di Port 2" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "VLAN memisahkan jaringan di Layer 2. Komputer di VLAN berbeda terisolasi total dan membutuhkan router (Layer 3) untuk dapat saling berkomunikasi.",
    misconceptionFeedback:
      "Dua port di VLAN berbeda terisolasi secara Layer 2 dan tidak bisa berkomunikasi tanpa bantuan perangkat Layer 3 (Inter-VLAN routing).",
  },

  // =========================================================================
  // Module 4: Konfigurasi Access & Trunk Port (P3-M4)
  // =========================================================================

  // Lesson 7: access-port
  {
    id: "quiz-trk-l1-q1",
    lessonSlug: "access-port",
    outcomeId: "TRK-L1-A",
    question: "Berapa banyak VLAN yang dapat ditampung secara aktif oleh sebuah port switch berstatus mode Access?",
    options: [
      { id: "opt-a", text: "Tepat 1 VLAN saja" },
      { id: "opt-b", text: "Maksimal 10 VLAN" },
      { id: "opt-c", text: "Hingga 4094 VLAN sekaligus" },
      { id: "opt-d", text: "Tergantung kecepatan kabel (Fast Ethernet atau Gigabit)" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Port Access dirancang khusus untuk end-device dan hanya dapat mengalirkan trafik dari satu VLAN saja.",
    misconceptionFeedback:
      "Port access hanya boleh memiliki tepat 1 VLAN aktif. Port yang bisa membawa banyak VLAN sekaligus adalah Trunk port.",
  },
  {
    id: "quiz-trk-l1-q2",
    lessonSlug: "access-port",
    outcomeId: "TRK-L1-A",
    question: "Perangkat manakah di bawah ini yang paling tepat dihubungkan ke port switch bertipe Access?",
    options: [
      { id: "opt-a", text: "Switch distribusi lain yang membawa 5 VLAN" },
      { id: "opt-b", text: "Komputer workstation staf kantor atau printer jaringan" },
      { id: "opt-c", text: "Router backbone ISP" },
      { id: "opt-d", text: "Kabel fiber optik antar-gedung bertingkat" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Port access digunakan untuk perangkat akhir (host endpoint) seperti PC staf, laptop, printer, dan kamera pengawas.",
    misconceptionFeedback:
      "Hubungan antar-switch yang membawa multi-VLAN memerlukan port Trunk. Port Access khusus untuk perangkat klien/endpoint tunggal.",
  },
  {
    id: "quiz-trk-l1-q3",
    lessonSlug: "access-port",
    outcomeId: "TRK-L1-B",
    question: "Apa yang dilakukan oleh switch terhadap frame sebelum dikirimkan keluar melalui port Access menuju ke komputer PC?",
    options: [
      { id: "opt-a", text: "Menambahkan header tag 802.1Q sebesar 4 byte" },
      { id: "opt-b", text: "Mencopot/melepas informasi tag VLAN sehingga frame sampai ke PC sebagai frame untagged biasa" },
      { id: "opt-c", text: "Mengenkripsi seluruh data payload dengan password administrator" },
      { id: "opt-d", text: "Mengubah MAC address pengirim menjadi MAC switch" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Switch memastikan frame keluar port access sebagai untagged frame agar dapat dibaca oleh kartu jaringan komputer biasa.",
    misconceptionFeedback:
      "Tag 802.1Q dicopot oleh switch sebelum sampai ke komputer klien, karena NIC biasa tidak mengenali tag VLAN.",
  },

  // Lesson 8: trunk-8021q
  {
    id: "quiz-trk-l2-q1",
    lessonSlug: "trunk-8021q",
    outcomeId: "TRK-L2-A",
    question: "Berapa ukuran penambahan tag header standar IEEE 802.1Q yang disisipkan pada frame Ethernet?",
    options: [
      { id: "opt-a", text: "4 byte (32 bit)" },
      { id: "opt-b", text: "2 byte (16 bit)" },
      { id: "opt-c", text: "8 byte (64 bit)" },
      { id: "opt-d", text: "20 byte (160 bit)" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Standar IEEE 802.1Q menyisipkan field tag sebesar 4 byte (32 bit) yang memuat TPID (0x8100), Priority, DEI, dan 12-bit VLAN ID.",
    misconceptionFeedback:
      "Tag 802.1Q berukuran tepat 4 byte (32 bit), di mana 12 bit di dalamnya digunakan untuk nomor VLAN ID.",
  },
  {
    id: "quiz-trk-l2-q2",
    lessonSlug: "trunk-8021q",
    outcomeId: "TRK-L2-B",
    question: "Apa fungsi utama dari konfigurasi Allowed VLAN List pada sebuah port Trunk?",
    options: [
      { id: "opt-a", text: "Membatasi nomor VLAN tertentu saja yang diperbolehkan melintasi kabel trunk demi keamanan dan efisiensi" },
      { id: "opt-b", text: "Mengubah nomor MAC address komputer yang melewati trunk" },
      { id: "opt-c", text: "Mempercepat daya hantar listrik pada tembaga kabel LAN" },
      { id: "opt-d", text: "Menghapus paket data yang memiliki ukuran di atas 100 byte" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Allowed VLAN List berfungsi sebagai filter keamanan untuk membatasi hanya VLAN yang diizinkan saja yang boleh melintasi link trunk.",
    misconceptionFeedback:
      "Allowed VLAN membatasi izin lintasan VLAN antar-switch sehingga trafik yang tidak berkepentingan tidak membebani link trunk.",
  },
  {
    id: "quiz-trk-l2-q3",
    lessonSlug: "trunk-8021q",
    outcomeId: "TRK-L2-B",
    question: "Apa yang dimaksud dengan Native VLAN pada link trunk 802.1Q?",
    options: [
      { id: "opt-a", text: "VLAN khusus yang frame datanya dikirimkan tanpa tag (Untagged) saat melintasi jalur trunk" },
      { id: "opt-b", text: "VLAN yang hanya bisa digunakan di negara asal pembuatan switch" },
      { id: "opt-c", text: "VLAN yang otomatis memiliki akses internet gratis tanpa router" },
      { id: "opt-d", text: "VLAN dengan kecepatan bandwidth paling lambat di switch" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Native VLAN adalah satu VLAN yang disepakati untuk tidak dipasangi tag (untagged) saat dikirimkan melintasi jalur trunk 802.1Q.",
    misconceptionFeedback:
      "Native VLAN adalah istilah teknis IEEE 802.1Q untuk frame yang melintasi trunk tanpa disisipi tag 4-byte.",
  },
];
