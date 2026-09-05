# Naskah Pembelajaran & Asesmen: Welcome to Networking (P1-M1)

**Jalur:** Path 1 — Network Foundations  
**Modul:** Welcome to Networking (`welcome-to-networking`)  
**Status:** Dokumen Kurikulum Resmi & Spesifikasi Konten Percontohan  
**Bahasa:** Bahasa Indonesia  
**Target Pembaca:** Siswa SMK TKJ, Pemula Jaringan Komputer, dan Calon IT Support  
**Waktu Rilis:** 2026-09-05 WITA  

---

## 1. Ikhtisar Modul & Capaian Pembelajaran Modul (CPM)

Modul **Welcome to Networking** dirancang sebagai langkah awal siswa memasuki dunia teknik komputer dan jaringan tanpa membebani mereka dengan hafalan biner, kalkulasi IP, atau konfigurasi terminal yang abstrak. Fokus utama adalah membangun intuisi fisik dan logis tentang bagaimana perangkat saling terhubung, bertukar sumber daya, serta membedakan jaringan lokal dengan Internet global.

### Capaian Pembelajaran Modul:
1. **WN-M1:** Siswa dapat menjelaskan jaringan komputer sebagai kumpulan perangkat yang saling terhubung untuk berkomunikasi dan berbagi sumber daya.
2. **WN-M2:** Siswa dapat mengidentifikasi perangkat akhir, media koneksi, dan sumber daya bersama pada jaringan rumah atau sekolah.
3. **WN-M3:** Siswa dapat membedakan jaringan lokal dari akses Internet pada skenario operasional sehari-hari.
4. **WN-M4:** Siswa dapat memprediksi dampak gangguan pada satu koneksi terhadap komunikasi lokal melalui analisis bukti dan simulasi terarah.

---

## 2. Rincian Materi Per Pelajaran

---

### Pelajaran 1: Apa Itu Jaringan Komputer?
- **Slug:** `intro-to-networking`
- **Estimasi Durasi:** 7–10 menit
- **Prasyarat:** Kemampuan dasar mengoperasikan komputer atau ponsel cerdas.

#### Capaian Pembelajaran Pelajaran (CPP):
- **WN-L1-A:** Siswa dapat membedakan kumpulan perangkat yang terhubung (*networked*) dan perangkat yang berdiri sendiri (*standalone*).
- **WN-L1-B:** Siswa dapat menjelaskan dua manfaat jaringan dari skenario berbagi berkas (*file sharing*) dan berbagi mesin cetak (*printer sharing*).

#### Naskah Pembelajaran:
1. **Pendahuluan & Masalah Nyata:**
   Bayangkan kamu berada di ruang lab komputer sekolah. Ada 10 komputer siswa dan hanya tersedia 1 unit printer yang terpasang pada komputer guru di sudut depan. Jika kamu ingin mencetak tugas, apa yang biasa dilakukan? Menyalin file ke flashdisk, berjalan ke komputer guru, mencolokkan flashdisk, lalu mencetak. Bagaimana jika ada 30 siswa yang ingin mencetak secara bersamaan? Waktu habis hanya untuk mengantre flashdisk. Di sinilah jaringan komputer hadir untuk memecahkan masalah.

2. **Konsep Kunci (Perangkat Mandiri vs Berjaringan):**
   - **Perangkat Mandiri (*Standalone*):** Komputer yang bekerja secara terisolasi. Komputer ini bisa menyala, mengetik dokumen, dan membuka aplikasi, namun tidak memiliki kabel atau sinyal nirkabel yang menghubungkannya ke perangkat lain. Untuk memindahkan data, kita bergantung pada media fisik seperti flashdisk (*sneaker net*).
   - **Perangkat Berjaringan (*Networked*):** Komputer yang terhubung ke media transmisi (kabel tembaga atau sinyal Wi-Fi) dan mampu bertukar data langsung dengan perangkat lain secara elektronik.
   - **Jaringan Komputer:** Dua atau lebih perangkat komputasi yang saling terhubung menggunakan media transmisi untuk tujuan komunikasi dan berbagi sumber daya.

3. **Contoh Nyata Berbagi Sumber Daya:**
   - **Berbagi Berkas (*File Sharing*):** Guru menaruh file materi di folder bersama (*shared folder*). Seluruh siswa di lab dapat langsung membuka file tersebut dari meja masing-masing dalam hitungan detik tanpa perlu memindahkan flashdisk fisik yang rawan membawa virus.
   - **Berbagi Printer (*Printer Sharing*):** Printer dihubungkan ke jaringan lab. Komputer Siswa 1 di pojok kiri dan Komputer Siswa 10 di pojok kanan dapat sama-sama mengirim perintah cetak langsung ke printer tersebut.

4. **Aktivitas Interaktif (Saklar Konektivitas):**
   Siswa disajikan visual dua komputer: PC-A dan PC-B. Terdapat kabel di antara keduanya yang dapat dihubungkan (*connected*) atau diputus (*disconnected*). Siswa memprediksi apakah pengiriman pesan teks dapat berhasil pada masing-masing status kabel, lalu menguji prediksinya.

5. **Kuis Formatif (3 Soal — Wajib Benar Semua untuk Lulus):**
   - **Soal 1 (WN-L1-A | ID: `quiz-wn-l1-q1`):**
     *Pertanyaan:* Manakah kondisi yang paling tepat menggambarkan bahwa sebuah komputer telah menjadi bagian dari jaringan komputer?
     - A. Komputer menyala dengan spesifikasi RAM dan prosesor yang tinggi.
     - B. Komputer terhubung ke perangkat lain melalui media transmisi kabel atau nirkabel sehingga dapat saling bertukar data. *(KUNCI: BENAR)*
     - C. Komputer memiliki monitor layar sentuh dan keyboard nirkabel.
     - D. Komputer mampu menyimpan ribuan file di dalam harddisk internalnya.
     *Umpan Balik Miskonsepsi:* Memiliki perangkat keras canggih atau aksesoris nirkabel pribadi (seperti mouse bluetooth) belum tentu membuat komputer tersebut berada dalam jaringan komputer yang saling berbagi data dengan komputer lain.
   - **Soal 2 (WN-L1-B | ID: `quiz-wn-l1-q2`):**
     *Pertanyaan:* Di lab sekolah dengan 20 komputer mandiri (*standalone*), siswa harus memindahkan tugas menggunakan satu flashdisk bergantian. Apa manfaat utama yang dirasakan jika ke-20 komputer tersebut dihubungkan dalam satu jaringan komputer?
     - A. Komputer tidak lagi memerlukan sistem operasi untuk bekerja.
     - B. Kecepatan mengetik dokumen siswa bertambah secara otomatis.
     - C. Siswa dapat saling mengirim dan mengakses berkas tugas langsung tanpa perlu mencolokkan flashdisk fisik berulang kali. *(KUNCI: BENAR)*
     - D. Kapasitas memori RAM setiap komputer akan berlipat ganda.
     *Umpan Balik Miskonsepsi:* Jaringan komputer memfasilitasi pertukaran data dan akses sumber daya bersama, bukan meningkatkan performa komputasi internal hardware seperti RAM atau kecepatan mengetik.
   - **Soal 3 (WN-L1-B | ID: `quiz-wn-l1-q3`):**
     *Pertanyaan:* Sebuah kantor memiliki 5 ruangan kerja dan membeli 1 unit printer laser berkualitas tinggi. Bagaimana konsep jaringan komputer membantu kantor tersebut secara efisien?
     - A. Kantor harus membeli kabel listrik tambahan untuk setiap ruangan.
     - B. Kelima ruangan dapat berbagi akses ke printer yang sama melalui jaringan tanpa harus memindahkan fisik printer ke tiap ruangan. *(KUNCI: BENAR)*
     - C. Printer akan mencetak dokumen lima kali lebih tebal dari biasanya.
     - D. Kantor diwajibkan membeli 5 printer tambahan agar adil bagi setiap ruangan.
     *Umpan Balik Miskonsepsi:* Berbagi sumber daya (*resource sharing*) justru menekan biaya pengadaan perangkat keras karena satu perangkat mahal (seperti printer) dapat dimanfaatkan bersama oleh banyak pengguna.

6. **Rangkuman Pelajaran 1:**
   - Perangkat mandiri (*standalone*) bekerja sendiri tanpa koneksi ke komputer lain.
   - Jaringan terbentuk ketika dua atau lebih perangkat terhubung melalui media transmisi dan dapat saling bertukar data.
   - Berbagi file dan berbagi printer adalah dua contoh nyata efisiensi yang dihadirkan oleh jaringan komputer.

---

### Pelajaran 2: Perangkat Jaringan di Sekitar Kita
- **Slug:** `everyday-networks`
- **Estimasi Durasi:** 7–10 menit
- **Prasyarat:** Pelajaran 1 (`intro-to-networking`).

#### Capaian Pembelajaran Pelajaran (CPP):
- **WN-L2-A:** Siswa dapat mengidentifikasi perangkat akhir (*end devices*) dan media koneksi (kabel vs nirkabel) pada jaringan rumah atau sekolah.
- **WN-L2-B:** Siswa dapat membedakan layanan lokal yang tetap berfungsi ketika koneksi Internet ke penyedia layanan (ISP) terputus.

#### Naskah Pembelajaran:
1. **Pendahuluan & Masalah Nyata:**
   Pernahkah kamu mengalami saat lampu indikator "Internet" pada router di rumahmu berkedip merah dan kamu tidak bisa menonton YouTube? Namun, anehnya kamu masih bisa mencetak tugas ke printer Wi-Fi di ruang tengah. Mengapa hal itu bisa terjadi? Apakah jaringan rumahmu mati total, atau hanya akses ke dunia luar yang terganggu?

2. **Konsep Kunci:**
   - **Perangkat Akhir (*End Devices / Endpoints*):** Perangkat yang menjadi sumber data atau tujuan akhir data yang digunakan oleh manusia. Contoh: Komputer (PC), Laptop, Smartphone, Tablet, Smart TV, dan Printer Jaringan.
   - **Media Koneksi (*Transmission Media*):** Jalur fisik penghubung yang membawa sinyal data antar perangkat.
     - *Kabel (Wired):* Menggunakan kabel tembaga (seperti kabel Ethernet/UTP) yang stabil dan cepat.
     - *Nirkabel (Wireless / Wi-Fi):* Menggunakan gelombang radio di udara sehingga perangkat fleksibel bergerak.
   - **Jaringan Lokal (LAN) vs Internet:**
     - *Jaringan Lokal:* Komunikasi antar perangkat di dalam satu area terbatas (ruang lab, rumah, atau kantor). Jaringan ini milik kamu dan dikelola sendiri.
     - *Internet:* Jaringan raksasa berskala global yang menghubungkan miliaran jaringan lokal di seluruh dunia melalui Penyedia Jasa Internet (ISP).

3. **Contoh Nyata (Layanan Lokal Tanpa Internet):**
   Ketika kabel serat optik penyedia internet di jalan raya terputus tertimpa pohon:
   - Akses keluar (YouTube, Google, WhatsApp) **mati** karena jalur ke ISP terputus.
   - Namun, komunikasi lokal di rumahmu (Laptop mengirim file ke Smart TV atau mencetak ke Printer lokal) **tetap berfungsi normal** selama router/switch lokal di rumahmu tetap menyala.

4. **Aktivitas Interaktif (Uplink vs Local Link):**
   Siswa mengeksplorasi visual topologi rumah: Laptop -> Wi-Fi Router -> Printer Lokal & Jalur Uplink ISP. Siswa mencoba memutus kabel Uplink ISP, lalu memverifikasi bahwa transfer file lokal ke printer tetap berhasil, sedangkan akses web luar gagal.

5. **Kuis Formatif (3 Soal — Wajib Benar Semua untuk Lulus):**
   - **Soal 1 (WN-L2-A | ID: `quiz-wn-l2-q1`):**
     *Pertanyaan:* Di sebuah lab komputer SMK, terdapat PC siswa, laptop guru, kabel UTP, printer jaringan, dan sinyal Wi-Fi. Manakah kelompok yang seluruhnya merupakan perangkat akhir (*end devices*)?
     - A. Kabel UTP dan sinyal Wi-Fi
     - B. PC siswa, laptop guru, dan printer jaringan *(KUNCI: BENAR)*
     - C. Kabel UTP dan printer jaringan
     - D. Sinyal Wi-Fi dan PC siswa
     *Umpan Balik Miskonsepsi:* Kabel UTP dan gelombang Wi-Fi adalah media transmisi (penghantar sinyal), bukan perangkat akhir yang mengolah data pengguna.
   - **Soal 2 (WN-L2-B | ID: `quiz-wn-l2-q2`):**
     *Pertanyaan:* Saat modem penyedia internet di sekolah sedang mengalami gangguan massal dan koneksi internet padam total, Pak Budi tetap berhasil mencetak dokumen dari laptopnya ke printer yang terhubung ke switch lab yang sama. Mengapa hal ini dimungkinkan?
     - A. Printer secara ajaib memiliki koneksi internet satelit sendiri.
     - B. Mencetak dokumen di jaringan lokal hanya membutuhkan komunikasi LAN yang masih aktif, tanpa perlu melewati jalur internet luar. *(KUNCI: BENAR)*
     - C. Pak Budi mencetak dokumen menggunakan tenaga baterai laptop.
     - D. Gangguan internet hanya berlaku untuk siswa, bukan untuk guru.
     *Umpan Balik Miskonsepsi:* Komunikasi data di dalam jaringan lokal (LAN) berjalan independen dari jaringan Internet global selama perangkat penghubung lokal tetap beroperasi.
   - **Soal 3 (WN-L2-B | ID: `quiz-wn-l2-q3`):**
     *Pertanyaan:* Di smartphone muncul ikon Wi-Fi penuh, namun ada tanda seru kecil bertuliskan "Connected without internet" dan aplikasi media sosial tidak bisa memuat data baru. Apa arti sebenarnya dari status tersebut?
     - A. Smartphone mengalami kerusakan pada chip prosesornya.
     - B. Smartphone berhasil terhubung ke access point lokal melalui gelombang radio, namun jaringan lokal tersebut tidak memiliki jalur keluar menuju Internet. *(KUNCI: BENAR)*
     - C. Sinyal Wi-Fi di rumah pasti palsu dan tidak memancarkan frekuensi apa pun.
     - D. Seluruh kabel di dalam smartphone terputus.
     *Umpan Balik Miskonsepsi:* Ikon Wi-Fi hanya menunjukkan kekuatan sinyal koneksi nirkabel antara perangkatmu dan router lokal, bukan jaminan bahwa router tersebut sedang terhubung ke Internet.

6. **Rangkuman Pelajaran 2:**
   - Perangkat akhir (*end devices*) adalah alat yang digunakan manusia untuk membuat, mengirim, atau menerima data.
   - Media koneksi menghubungkan perangkat akhir, baik melalui kabel tembaga maupun sinyal nirkabel (Wi-Fi).
   - Jaringan lokal (LAN) dapat tetap melayani komunikasi antar perangkat di dalam gedung meskipun koneksi ke Internet sedang terputus.

---

### Pelajaran 3: Berbagi Sumber Daya dalam Jaringan
- **Slug:** `sharing-network-resources`
- **Estimasi Durasi:** 7–10 menit
- **Prasyarat:** Pelajaran 2 (`everyday-networks`).

#### Capaian Pembelajaran Pelajaran (CPP):
- **WN-L3-A:** Siswa dapat memilih sumber daya jaringan yang tepat untuk kebutuhan berbagi berkas atau mencetak bersama.
- **WN-L3-B:** Siswa dapat mengidentifikasi peminta layanan (*requester / client*) dan penyedia layanan (*provider / server*) pada satu transaksi sederhana.

#### Naskah Pembelajaran:
1. **Pendahuluan & Masalah Nyata:**
   Di sebuah kantor arsitektur, 5 orang drafter sedang mendesain gedung bertingkat. Setiap file gambar berukuran ratusan megabyte. Jika setiap orang menyimpan file di laptopnya masing-masing, versi gambar mana yang paling baru? Jika drafter B ingin mencetak denah lantai 2, ke mana ia harus mengirimkan berkasnya? Pengelolaan sumber daya bersama secara terpusat menjadi kunci kerja sama tim.

2. **Konsep Kunci:**
   - **Sumber Daya Jaringan (*Network Resources*):** Segala bentuk data, perangkat keras, atau kapasitas komputasi yang dapat diakses bersama melalui jaringan.
     - *Sumber Daya Data:* Berkas dokumen, folder bersama, database perpustakaan.
     - *Sumber Daya Perangkat Keras:* Printer jaringan, mesin pemindai (*scanner*), media penyimpanan terpusat (*storage*).
   - **Peran Peminta (*Client / Requester*):** Perangkat atau aplikasi yang memulai komunikasi dengan mengajukan permohonan untuk menggunakan atau mengambil suatu sumber daya.
   - **Peran Penyedia (*Server / Provider*):** Perangkat atau aplikasi yang menunggu permohonan, melayani, dan merespons permintaan tersebut dengan menyediakan sumber daya yang diminta.
   - *Catatan Penting:* "Server" pada level dasar bukan semata-mata bentuk fisiknya yang berupa lemari rak besi, melainkan **peran fungsionalnya** dalam transaksi komunikasi tersebut. Komputer biasa di lab bisa bertindak sebagai server jika ia membagikan folder filenya ke komputer lain.

3. **Contoh Nyata Transaksi Berbagi:**
   - **Skenario Unduh Modul:** Komputer Siswa (Peminta/Client) meminta file modul `modul-tkj.pdf` dari Komputer Guru yang membuka folder publik (Penyedia/Server). Komputer Guru mengirimkan file tersebut ke Komputer Siswa.
   - **Skenario Cetak Tugas:** Laptop Siswa (Peminta/Client) mengirimkan data halaman tugas ke Printer Jaringan (Penyedia Layanan Cetak/Server).

4. **Aktivitas Interaktif (Pencocokan Peran):**
   Siswa disajikan skenario: Siswa A membuka katalog buku perpustakaan digital sekolah. Siswa diminta menandai: Siapa yang bertindak sebagai peminta (Client)? Dan perangkat mana yang bertindak sebagai penyedia (Server)?

5. **Kuis Formatif (3 Soal — Wajib Benar Semua untuk Lulus):**
   - **Soal 1 (WN-L3-A | ID: `quiz-wn-l3-q1`):**
     *Pertanyaan:* Seorang instruktur lab ingin memastikan 30 siswa dapat membaca modul praktikum yang sama setiap sesi tanpa perlu menggandakan kertas fotokopi. Sumber daya jaringan apa yang paling tepat disiapkan?
     - A. Kabel listrik tambahan di setiap meja praktikum.
     - B. Folder berkas bersama (*shared folder*) di jaringan lokal yang berisi file modul digital. *(KUNCI: BENAR)*
     - C. Mouse cadangan di laci instruktur.
     - D. Mengubah warna cat dinding lab agar terlihat modern.
     *Umpan Balik Miskonsepsi:* Berbagi berkas secara digital (*file sharing*) melalui folder bersama adalah solusi tepat untuk mendistribusikan data tanpa biaya kertas dan tanpa flashdisk.
   - **Soal 2 (WN-L3-B | ID: `quiz-wn-l3-q2`):**
     *Pertanyaan:* Andi duduk di depan PC-05 lab komputer dan menekan tombol cetak pada aplikasi pengolah kata ke printer jaringan yang berada di meja depan. Dalam transaksi komunikasi ini, siapa yang berperan sebagai peminta (*client / requester*)?
     - A. Printer jaringan di meja depan
     - B. Kertas yang keluar dari mesin printer
     - C. PC-05 yang digunakan oleh Andi *(KUNCI: BENAR)*
     - D. Meja tempat printer diletakkan
     *Umpan Balik Miskonsepsi:* Peminta (*client*) adalah perangkat atau aplikasi yang menginisiasi permintaan layanan—dalam hal ini PC-05 milik Andi yang mengirim permintaan cetak.
   - **Soal 3 (WN-L3-B | ID: `quiz-wn-l3-q3`):**
     *Pertanyaan:* Dina membagikan folder tugas kelompok dari laptopnya agar teman satu kelompoknya, Eko, dapat mengunduh dokumen laporan. Dalam pertukaran berkas tersebut, laptop Dina menjalankan peran sebagai apa?
     - A. Perangkat perantara pasif tanpa peran
     - B. Penyedia layanan (*server / provider*) berkas *(KUNCI: BENAR)*
     - C. Peminta layanan (*client / requester*)
     - D. Penghalang koneksi data
     *Umpan Balik Miskonsepsi:* Karena laptop Dina menyimpan berkas dan melayani permintaan unduh dari Eko, laptop Dina berfungsi sebagai penyedia layanan (*file provider/server*) pada transaksi tersebut.

6. **Rangkuman Pelajaran 3:**
   - Sumber daya jaringan mencakup berkas data dan perangkat keras fisik yang dibagikan.
   - Komunikasi jaringan selalu melibatkan peran peminta (*client*) dan penyedia (*server*).
   - Peran client dan server ditentukan oleh siapa yang meminta dan siapa yang melayani pada saat transaksi berlangsung.

---

### Pelajaran 4: Bagaimana Perangkat Saling Berbicara?
- **Slug:** `simple-network-communication`
- **Estimasi Durasi:** 8–12 menit
- **Prasyarat:** Pelajaran 3 (`sharing-network-resources`).

#### Capaian Pembelajaran Pelajaran (CPP):
- **WN-L4-A:** Siswa dapat mengurutkan 4 tahapan komunikasi sederhana: pembuatan permintaan, pengiriman melalui media, penerimaan oleh target, dan pengiriman respons.
- **WN-L4-B:** Siswa dapat memilih koneksi yang menyebabkan kegagalan komunikasi berdasarkan analisis diagram dan hasil simulasi.

#### Naskah Pembelajaran:
1. **Pendahuluan & Masalah Nyata:**
   Di ruang tata usaha sekolah, Komputer Staf 1 dan Komputer Staf 2 sama-sama terhubung menggunakan kabel ke satu switch lokal. Keduanya biasa mencetak ke Printer TU. Suatu siang, Komputer Staf 1 lancar mencetak surat edaran, tetapi Komputer Staf 2 selalu memunculkan pesan error "Printer not responding". Staf 2 langsung menyimpulkan: "Wah, printernya rusak atau internet sekolah mati!". Benarkah kesimpulan tersebut? Mengapa Staf 1 bisa mencetak jika printernya rusak?

2. **Konsep Kunci:**
   - **Siklus Request & Response (Permintaan & Jawaban):**
     Komunikasi jaringan yang berhasil mengikuti 4 urutan pasti:
     1. *Pembuatan Permintaan:* Pengirim menyiapkan pesan atau instruksi (misalnya: "Tolong cetak dokumen A").
     2. *Pengiriman Melalui Media:* Pesan dikirim melalui kabel atau gelombang radio menuju target.
     3. *Penerimaan & Pemrosesan:* Perangkat tujuan menerima pesan dan mengeksekusi instruksi.
     4. *Pengiriman Respons Balik:* Perangkat tujuan mengirimkan konfirmasi balik ke pengirim (misalnya: "Dokumen berhasil dicetak" atau "Kertas habis").
   - **Jalur Cabang Independen:**
     Pada topologi jaringan lokal modern, setiap perangkat memiliki kabel cabang masing-masing menuju perangkat penghubung (seperti switch). Jika kabel cabang milik Komputer Staf 2 longgar atau terlepas, hanya Komputer Staf 2 yang kehilangan akses. Komputer Staf 1 dan Printer tetap terhubung dan dapat berkomunikasi normal.

3. **Contoh Nyata Pemecahan Masalah (*Troubleshooting* Awal):**
   Sebagai calon tenaga IT Support yang cerdas:
   - Jika satu komputer gagal tapi komputer lain berhasil, **jangan langsung menyalahkan printer atau jaringan utama**.
   - Periksa terlebih dahulu **koneksi lokal milik perangkat yang bermasalah** (lampu indikator port LAN di belakang PC, kabel yang terinjak, atau soket RJ-45 yang longgar).

4. **Aktivitas Interaktif (Analisis Jalur Putus):**
   Siswa disajikan visual 2 PC (PC-1 & PC-2), 1 Switch Tengah, dan 1 Printer. Terdapat indikator kabel hijau (terhubung) dan merah (putus). Siswa mengamati ketika kabel PC-2 putus, transmisi pesan dari PC-1 tetap berwarna hijau sampai ke printer. Siswa lalu mengklik kabel PC-2 untuk memperbaikinya dan menguji kembali pengiriman data hingga sukses.

5. **Kuis Formatif (3 Soal — Wajib Benar Semua untuk Lulus):**
   - **Soal 1 (WN-L4-A | ID: `quiz-wn-l4-q1`):**
     *Pertanyaan:* Manakah urutan tahapan yang benar pada komunikasi jaringan dua arah ketika sebuah laptop meminta berkas dari komputer penyedia?
     - A. Laptop menerima berkas -> Laptop meminta -> Komputer penyedia mengirim respons -> Media terhubung
     - B. Laptop membuat permintaan -> Permintaan dikirim melalui media transmisi -> Komputer penyedia menerima & memproses -> Komputer penyedia mengirim respons balik *(KUNCI: BENAR)*
     - C. Komputer penyedia mengirim berkas sebelum ada permintaan -> Laptop mematikan kabel -> Transaksi selesai
     - D. Media transmisi mengirim berkas sendiri tanpa ada perangkat pengirim
     *Umpan Balik Miskonsepsi:* Komunikasi data yang terstruktur selalu berawal dari pembuatan permintaan oleh klien, ditransmisikan lewat media, diterima target, dan diakhiri dengan respons status/data dari penyedia.
   - **Soal 2 (WN-L4-B | ID: `quiz-wn-l4-q2`):**
     *Pertanyaan:* PC-A dan PC-B terhubung ke switch yang sama di lab. PC-A dapat mencetak dokumen ke printer jaringan, namun PC-B selalu gagal. Setelah diperiksa ke belakang meja, kabel jaringan PC-B tidak tercolok ke port LAN. Kesimpulan teknis apa yang paling tepat?
     - A. Printer lab rusak total dan harus segera dibuang.
     - B. Kegagalan komunikasi hanya terjadi pada PC-B karena kabel cabangnya terputus, sedangkan printer dan PC-A bekerja normal. *(KUNCI: BENAR)*
     - C. Seluruh kabel jaringan di sekolah terkena petir.
     - D. PC-B tidak menyukai printer tersebut.
     *Umpan Balik Miskonsepsi:* Bukti empiris bahwa PC-A berhasil mencetak membuktikan printer dan jaringan switch berfungsi baik; masalah terisolasi secara spesifik pada kabel koneksi PC-B.
   - **Soal 3 (WN-L4-B | ID: `quiz-wn-l4-q3`):**
     *Pertanyaan:* Berdasarkan temuan kabel PC-B yang lepas pada skenario di atas, tindakan perbaikan terarah apa yang harus dilakukan pertama kali oleh petugas IT Support?
     - A. Menginstal ulang seluruh sistem operasi di PC-A dan PC-B.
     - B. Mengganti switch lab dengan switch baru yang lebih mahal.
     - C. Menancapkan kembali kabel jaringan PC-B ke port LAN hingga terkunci rapat lalu memverifikasi koneksi. *(KUNCI: BENAR)*
     - D. Menghubungi penyedia jasa internet (ISP) untuk komplain kecepatan internet.
     *Umpan Balik Miskonsepsi:* Perbaikan masalah jaringan harus selalu dimulai dari penyebab paling fisik dan spesifik yang terbukti bermasalah (kabel cabang lepas) sebelum mengambil tindakan drastis yang tidak relevan.

6. **Rangkuman Pelajaran 4:**
   - Komunikasi jaringan mengikuti alur: Permintaan dibuat -> Dikirim lewat media -> Diterima target -> Dibalas dengan respons.
   - Gangguan pada satu jalur cabang tidak otomatis melumpuhkan seluruh perangkat di jaringan lokal.
   - Diagnosis masalah jaringan harus didasarkan pada bukti nyata: isolasi perangkat yang bermasalah sebelum menyimpulkan kerusakan sistem.

---

## 3. Asesmen Akhir Modul: Welcome to Networking

Asesmen Akhir Modul menguji kemampuan siswa mentransfer pemahaman konsep ke skenario baru yang realistis, serta menguji keterampilan praktik konektivitas dasar.

### Skenario Asesmen:
**Jaringan Perpustakaan Digital SMK Merdeka**  
Perpustakaan sekolah memiliki:
- **PC-Katalog:** Komputer di meja depan untuk pengunjung mencari buku.
- **PC-Sirkulasi:** Komputer di meja petugas untuk peminjaman/pengembalian buku.
- **Switch Perpustakaan:** Perangkat perantara lokal berkecepatan tinggi.
- **Printer Barcode Bersama:** Mesin cetak label barcode yang diakses bersama.
- **Router ISP Perpustakaan:** Perangkat yang menghubungkan LAN perpustakaan ke Internet luar.

---

### Bagian 1: Evaluasi Konsep (10 Soal Pilihan Ganda)
*Ambang Batas Kelulusan: Minimal 8 dari 10 soal benar (>= 80%).*

- **Soal F01 (WN-M1 | ID: `final-wn-f01`):**
  *Pertanyaan:* Apakah tujuan paling mendasar dari pembentukan jaringan komputer di lingkungan perpustakaan sekolah?
  - A. Memastikan semua komputer menggunakan tipe keyboard yang sama.
  - B. Menghubungkan perangkat komputasi agar dapat saling berkomunikasi, bertukar informasi, dan memanfaatkan sumber daya bersama secara terpadu. *(KUNCI: BENAR)*
  - C. Mengurangi daya konsumsi listrik PLN secara otomatis.
  - D. Menghapus kebutuhan petugas perpustakaan.
  *Kategori:* Pemahaman Esensi Jaringan.

- **Soal F02 (WN-M1 | ID: `final-wn-f02`):**
  *Pertanyaan:* Di masa lalu sebelum ada jaringan, petugas memindahkan daftar peminjam buku antar komputer menggunakan flashdisk. Manakah risiko utama metode manual (*standalone*) ini yang dapat diatasi oleh jaringan komputer?
  - A. Flashdisk mudah hilang, rentan tertular virus, dan data menjadi tidak sinkron antar komputer. *(KUNCI: BENAR)*
  - B. Layar monitor komputer menjadi buram.
  - C. Komputer menolak untuk dinyalakan di pagi hari.
  - D. Biaya pembelian buku perpustakaan meningkat drastis.
  *Kategori:* Manfaat Berbagi Berkas.

- **Soal F03 (WN-M2 | ID: `final-wn-f03`):**
  *Pertanyaan:* Di ruang perpustakaan tersebut terdapat: PC-Katalog, Switch LAN, Kabel UTP, Printer Barcode, dan Laptop Petugas. Manakah yang dikategorikan sebagai perangkat akhir (*end devices*)?
  - A. Switch LAN dan Kabel UTP
  - B. PC-Katalog, Printer Barcode, dan Laptop Petugas *(KUNCI: BENAR)*
  - C. Kabel UTP saja
  - D. Switch LAN saja
  *Kategori:* Klasifikasi Perangkat Akhir vs Media/Perantara.

- **Soal F04 (WN-M2 | ID: `final-wn-f04`):**
  *Pertanyaan:* Petugas perpustakaan ingin menghubungkan PC-Katalog dan PC-Sirkulasi yang posisinya tetap di atas meja kerja permanen. Media koneksi apa yang paling tepat dipilih untuk stabilitas koneksi tinggi dan bebas interferensi?
  - A. Kabel tembaga Ethernet (UTP) langsung ke switch lokal. *(KUNCI: BENAR)*
  - B. Sinyal inframerah remote TV.
  - C. Menggunakan kabel audio AUX.
  - D. Mengandalkan sinyal radio FM.
  *Kategori:* Pemilihan Media Transmisi.

- **Soal F05 (WN-M2 | ID: `final-wn-f05`):**
  *Pertanyaan:* Ketika PC-Sirkulasi membuka database buku yang tersimpan pada folder bersama di komputer utama, perangkat manakah yang bertindak sebagai penyedia layanan (*server / provider*)?
  - A. PC-Sirkulasi yang meminta data
  - B. Komputer utama yang menyimpan dan menyajikan berkas database *(KUNCI: BENAR)*
  - C. Mouse yang digerakkan oleh petugas
  - D. Lampu penerangan ruangan
  *Kategori:* Identifikasi Peran Provider/Server.

- **Soal F06 (WN-M3 | ID: `final-wn-f06`):**
  *Pertanyaan:* Pagi ini hujan badai menyebabkan kabel fiber optik milik ISP putus total sehingga seluruh sekolah kehilangan akses Internet. Petugas perpustakaan panik karena harus mencetak label barcode untuk 50 buku baru ke Printer Barcode lokal yang terhubung ke switch LAN. Apa yang sebenarnya terjadi?
  - A. Printer Barcode tidak bisa digunakan sama sekali karena tidak ada Internet.
  - B. Printer Barcode tetap dapat digunakan normal karena komunikasi antara PC-Sirkulasi dan Printer berlangsung di dalam jaringan lokal (LAN). *(KUNCI: BENAR)*
  - C. Seluruh komputer di perpustakaan akan meledak jika dinyalakan.
  - D. Komputer hanya bisa mencetak jika terhubung ke Google Drive.
  *Kategori:* Independensi Jaringan Lokal vs Internet.

- **Soal F07 (WN-M3 | ID: `final-wn-f07`):**
  *Pertanyaan:* Siswa yang membawa laptop ke perpustakaan mengeluh: "Laptop saya terhubung ke Wi-Fi perpustakaan dengan sinyal sangat kuat, tetapi mengapa tidak bisa membuka website berita?". Penjelasan teknis apa yang paling logis?
  - A. Sinyal radio Wi-Fi lokal dari access point sangat baik, namun router perpustakaan tidak memiliki koneksi aktif ke jaringan Internet luar. *(KUNCI: BENAR)*
  - B. Laptop siswa tersebut tidak kompatibel dengan lantai perpustakaan.
  - C. Sinyal Wi-Fi yang kuat otomatis menjamin kecepatan download super cepat.
  - D. Website berita tersebut diblokir oleh pembuat laptop.
  *Kategori:* Membedakan Media Wi-Fi dan Akses Internet.

- **Soal F08 (WN-M4 | ID: `final-wn-f08`):**
  *Pertanyaan:* Bagaimana urutan aliran data yang benar ketika PC-Katalog mengirimkan perintah cek status ke Printer Barcode?
  - A. Printer mencetak -> PC-Katalog membuat perintah -> Switch mengirim kabel
  - B. PC-Katalog membuat permintaan -> Permintaan dikirim lewat kabel ke Switch lalu diteruskan ke Printer -> Printer memproses -> Printer mengirimkan respons status kembali ke PC-Katalog *(KUNCI: BENAR)*
  - C. Switch membuat dokumen sendiri -> Mengirim ke kedua komputer
  - D. Printer mengirim perintah cek status ke PC-Katalog
  *Kategori:* Urutan Alur Komunikasi Request-Response.

- **Soal F09 (WN-M4 | ID: `final-wn-f09`):**
  *Pertanyaan:* PC-Katalog berhasil melakukan pencarian data di server lokal, tetapi PC-Sirkulasi sama sekali tidak bisa terhubung ke server maupun printer. Lampu port kabel LAN di belakang PC-Sirkulasi tampak mati gelap. Apa hipotesis awal yang paling masuk akal?
  - A. Server lokal mengalami kerusakan hardware fatal.
  - B. Switch perpustakaan mati total.
  - C. Kabel koneksi antara PC-Sirkulasi dan switch longgar, lepas, atau putus. *(KUNCI: BENAR)*
  - D. Listrik di seluruh gedung sekolah padam.
  *Kategori:* Analisis Kegagalan Koneksi Terisolasi.

- **Soal F10 (WN-M4 | ID: `final-wn-f10`):**
  *Pertanyaan:* Jika kabel cabang yang menghubungkan PC-Katalog ke switch dicabut, bagaimana dampaknya terhadap operasional PC-Sirkulasi dan Printer Barcode?
  - A. Seluruh sistem jaringan perpustakaan lumpuh total.
  - B. PC-Sirkulasi dan Printer Barcode tetap dapat saling berkomunikasi normal karena masing-masing memiliki jalur kabel tersendiri ke switch. *(KUNCI: BENAR)*
  - C. PC-Sirkulasi akan otomatis berganti nama menjadi PC-Katalog.
  - D. Printer Barcode akan mencetak kertas kosong terus menerus.
  *Kategori:* Prediksi Dampak Pemutusan Jalur Cabang.

---

### Bagian 2: Evaluasi Praktik Konektivitas Pemula (3 Kriteria Wajib Lulus)
*Ambang Batas Kelulusan: 3 dari 3 kriteria praktik wajib terpenuhi (100%).*

Siswa dihadapkan pada simulator visual topologi interaktif perpustakaan sekolah:
- **Node yang tersedia:**
  1. `pc-katalog` (PC Katalog Pengunjung)
  2. `pc-sirkulasi` (PC Meja Petugas)
  3. `switch-perpus` (Switch Jaringan Lokal)
  4. `printer-barcode` (Printer Label Bersama)
  5. `router-isp` (Router Penghubung Internet)
- **Kondisi Awal Simulasi:**
  - `pc-katalog` terhubung ke `switch-perpus` (kabel hijau / normal).
  - `pc-sirkulasi` kabelnya terlepas / tidak tercolok ke `switch-perpus` (status broken/disconnected).
  - `printer-barcode` terhubung ke `switch-perpus` (kabel hijau / normal).
  - `router-isp` status uplink Internet: **OFFLINE / DISCONNECTED** (simulasi gangguan ISP).

#### Tiga Kriteria Penilaian Praktik (Server-Authoritative Evaluation):
1. **Kriteria P01 — Jalur Fisik Lengkap (Physical Reachability):**
   Siswa memastikan seluruh perangkat kerja lokal (`pc-katalog`, `pc-sirkulasi`, dan `printer-barcode`) terhubung secara fisik melalui kabel ke `switch-perpus`.
2. **Kriteria P02 — Diagnosis & Restorasi Cabang Rusak (Fault Isolation & Repair):**
   Siswa mengidentifikasi bahwa cabang kabel yang rusak/terlepas secara spesifik adalah kabel `pc-sirkulasi` -> `switch-perpus`, dan memperbaikinya tanpa merusak kabel `pc-katalog` atau kabel `printer-barcode`.
3. **Kriteria P03 — Verifikasi Layanan Lokal Tanpa Uplink Internet (Local Service Verification):**
   Siswa berhasil menjalankan uji transmisi pencetakan dari kedua PC ke `printer-barcode` dan membuktikan bahwa kedua transaksi cetak sukses meskipun status `router-isp` tetap offline / tidak ada sambungan internet luar.

---

## 4. Matriks Ketertelusuran Kurikulum (Traceability Matrix)

| Kode Capaian | Deskripsi Singkat | Pelajaran Pengampu | Blok Teori & Aktivitas | Soal Formatif | Soal Ujian Akhir |
|---|---|---|---|---|---|
| **WN-L1-A** | Perangkat Terhubung vs Mandiri | Pelajaran 1 | `block-l1-teach-1`, `block-l1-act-1` | `quiz-wn-l1-q1` | `final-wn-f01` |
| **WN-L1-B** | Manfaat Berbagi File & Printer | Pelajaran 1 | `block-l1-teach-2`, `block-l1-act-2` | `quiz-wn-l1-q2`, `quiz-wn-l1-q3` | `final-wn-f02` |
| **WN-L2-A** | Perangkat Akhir & Media Transmisi | Pelajaran 2 | `block-l2-teach-1`, `block-l2-act-1` | `quiz-wn-l2-q1` | `final-wn-f03`, `final-wn-f04` |
| **WN-L2-B** | Layanan Lokal vs Internet | Pelajaran 2 | `block-l2-teach-2`, `block-l2-act-2` | `quiz-wn-l2-q2`, `quiz-wn-l2-q3` | `final-wn-f06`, `final-wn-f07`, Praktik P03 |
| **WN-L3-A** | Pemilihan Sumber Daya Jaringan | Pelajaran 3 | `block-l3-teach-1`, `block-l3-act-1` | `quiz-wn-l3-q1` | `final-wn-f02`, Praktik P01 |
| **WN-L3-B** | Peran Client vs Server | Pelajaran 3 | `block-l3-teach-2`, `block-l3-act-2` | `quiz-wn-l3-q2`, `quiz-wn-l3-q3` | `final-wn-f05` |
| **WN-L4-A** | Alur Komunikasi Request-Response | Pelajaran 4 | `block-l4-teach-1`, `block-l4-act-1` | `quiz-wn-l4-q1` | `final-wn-f08` |
| **WN-L4-B** | Identifikasi Cabang Rusak | Pelajaran 4 | `block-l4-teach-2`, `block-l4-act-2` | `quiz-wn-l4-q2`, `quiz-wn-l4-q3` | `final-wn-f09`, `final-wn-f10`, Praktik P02 |
