import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Metodologi Troubleshooting Sistematis (P5-M4)
 *
 * Covers scientific troubleshooting methodology:
 * 1. Bottom-Up, Top-Down, Divide-and-Conquer diagnostic workflows.
 * 2. Distinguishing objective facts/evidence from assumptions/speculation.
 * 3. Hypothesis generation and ranking by probability.
 * 4. Isolating variables (one change at a time) and rollback planning.
 * 5. Full-stack verification (beyond ping to Layer 7 service functionality).
 * 6. Root-cause documentation and preventive remediation.
 */
export const troubleshootingMethodologyModuleData: CurriculumModule = {
  id: "module-troubleshooting-methodology",
  slug: "troubleshooting-methodology",
  title: "Metodologi Troubleshooting Sistematis",
  description:
    "Kuasai kerangka kerja ilmiah pemecahan masalah jaringan: pemisahan fakta observasi dari asumsi, formulasi hipotesis, pengujian terisolasi, verifikasi restorasi menyeluruh, dan dokumentasi resolusi insiden.",
  orderIndex: 4,
  prerequisites: ["diagnostic-tools"],
  outcomes: [
    {
      id: "MTH-M1",
      text: "Siswa dapat menerapkan metode troubleshooting terstruktur (Bottom-Up, Top-Down, atau Divide-and-Conquer) serta membedakan bukti observasi faktual dari tebakan spekulatif.",
    },
    {
      id: "MTH-M2",
      text: "Siswa dapat merancang langkah perbaikan dengan prinsip isolasi variabel tunggal, menyusun rencana rollback, dan memverifikasi restorasi layanan aplikasi secara komprehensif.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 7: observasi-dan-hipotesis (P5-L07)
    // =========================================================================
    {
      id: "lesson-observasi-dan-hipotesis",
      slug: "observasi-dan-hipotesis",
      title: "Metodologi Troubleshooting: Observasi Gejala & Hipotesis",
      description:
        "Memahami alur diagnostik sistematis, memilih pendekatan OSI yang tepat, membedakan fakta terukur dari opini pengguna, serta merumuskan hipotesis akar masalah berdasar probabilitas.",
      orderIndex: 0,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["nslookup-arp-traceroute"],
      outcomes: [
        {
          id: "MTH-L7-A",
          text: "Siswa dapat memilih strategi troubleshooting yang efisien (Bottom-Up untuk kendala kabel/fisik, Top-Down untuk kendala aplikasi tertentu, Divide-and-Conquer untuk isolasi cepat via ping).",
        },
        {
          id: "MTH-L7-B",
          text: "Siswa dapat memisahkan fakta teknis terverifikasi (CLI output, log, LED status) dari klaim subjektif pengguna dan menyusun daftar hipotesis berurutan dari yang paling mungkin.",
        },
      ],
      evidence: [
        {
          outcomeId: "MTH-L7-A",
          teachingBlockIds: ["mth-l7-h1", "mth-l7-txt1", "mth-l7-callout1"],
          activityIds: ["mth-l7-code1"],
          assessmentItemIds: ["quiz-mth-l7-q1", "quiz-mth-l7-q2"],
        },
        {
          outcomeId: "MTH-L7-B",
          teachingBlockIds: ["mth-l7-h2", "mth-l7-txt2", "mth-l7-callout2"],
          activityIds: ["mth-l7-interactive1"],
          assessmentItemIds: ["quiz-mth-l7-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "mth-l7-h1",
            type: "heading",
            level: 2,
            text: "Tiga Pendekatan Investigasi Berbasis Model OSI",
          },
          {
            id: "mth-l7-txt1",
            type: "text",
            format: "markdown",
            content:
              "Teknisi jaringan profesional tidak pernah bekerja secara acak (*trial-and-error serampangan*). Mereka menggunakan kerangka kerja berbasis lapisan model OSI:\n\n1. **Pendekatan Bottom-Up (Layer 1 -> Layer 7):**\n   - Dimulai dari lapisan fisik: periksa apakah kabel UTP tertancap, lampu link switch menyala, kartu Wi-Fi aktif, baru kemudian naik ke Layer 2 (MAC/VLAN), Layer 3 (IP/Routing), hingga Layer 7 (Aplikasi).\n   - *Kapan digunakan:* Sangat ideal ketika masalah dicurigai akibat faktor fisik (gedung baru direnovasi, kabel tersenggol, instalasi baru).\n2. **Pendekatan Top-Down (Layer 7 -> Layer 1):**\n   - Dimulai dari lapisan aplikasi: periksa apakah browser menampilkan error spesifik (seperti HTTP 403 Forbidden atau HTTP 500 Internal Server Error), uji apakah aplikasi lain bisa berjalan normal, lalu turun ke lapisan transport dan network.\n   - *Kapan digunakan:* Sangat tepat jika sebagian besar aplikasi berjalan normal dan hanya satu software tertentu yang bermasalah.\n3. **Pendekatan Divide-and-Conquer (Mulai dari Layer 3 / Network):**\n   - Dimulai langsung di tengah model OSI dengan menjalankan tes konektivitas IP (`ping` dan `traceroute`).\n   - Jika ping berhasil, masalah pasti berada di Layer 4 ke atas (port, firewall aplikasi, DNS, atau konfigurasi software). Jika ping gagal, masalah pasti berada di Layer 1 hingga Layer 3 (kabel, link switch, subnet mask, atau gateway).\n   - *Kapan digunakan:* Pendekatan paling populer dan paling hemat waktu di lapangan!",
          },
          {
            id: "mth-l7-code1",
            type: "code",
            language: "text",
            code: "Diagram Alur Investigasi Divide-and-Conquer:\n\n                    [Laporan Gangguan: 'Tidak Bisa Akses Sistem']\n                                     |\n                         [Jalankan Ping ke Target]\n                                     |\n                    +----------------+----------------+\n                    |                                 |\n             [Ping Berhasil]                    [Ping GAGAL]\n                    |                                 |\n         Fokus ke Layer 4 - 7              Fokus ke Layer 1 - 3\n     - Cek Port Layanan (netstat)      - Cek Fisik Kabel / Sinyal Wi-Fi (L1)\n     - Cek Firewall Port 80/443        - Cek Link / VLAN / Trunk (L2)\n     - Cek Resolusi Nama DNS           - Cek IP / Subnet / Gateway (L3)",
          },
          {
            id: "mth-l7-callout1",
            type: "callout",
            variant: "info",
            title: "Miskonsepsi: 'Semua Masalah Berasal dari Server Pusat'",
            content:
              "Sering kali teknisi pemula langsung menelepon tim server ketika klien tidak bisa membuka web internal. Dengan pendekatan Divide-and-Conquer, pengujian 10 detik menggunakan ping ke gateway dan DNS lokal dapat langsung membuktikan apakah gangguan berada di meja pengguna atau di ruang server.",
          },
          {
            id: "mth-l7-h2",
            type: "heading",
            level: 2,
            text: "Membedakan Fakta Observasi dari Asumsi Spekulatif",
          },
          {
            id: "mth-l7-txt2",
            type: "text",
            format: "markdown",
            content:
              "Langkah kedua dari metodologi troubleshooting adalah mengumpulkan fakta objektif:\n\n- **Gejala / Klaim Pengguna (Subjektif):** 'Internet kantor mati total, komputernya kena virus!' -> Ini adalah opini yang tidak boleh langsung ditelan mentah-mentah.\n- **Bukti Observasi Teknis (Faktual):**\n  - Lampu link port switch menyala oranye (negosiasi 100 Mbps bukan 1 Gbps).\n  - Perintah `ipconfig` menampilkan IP `169.254.10.20` (indikasi APIPA).\n  - Log router mencatat pesan `DHCP scope exhausted: no free leases available`.\n\n### Formulasi Hipotesis Berdasarkan Probabilitas\nDari fakta observasi di atas, buatlah hipotesis terurut:\n1. **Hipotesis 1 (Paling Mungkin):** Alokasi IP pada DHCP scope telah habis karena banyaknya peserta pertemuan baru.\n2. **Hipotesis 2:** Kabel trunk antara switch lantai 2 dan router mengalami gangguan transmisi.\n3. **Hipotesis 3 (Paling Tidak Mungkin):** Kabel fiber optik bawah laut ISP putus.",
          },
          {
            id: "mth-l7-interactive1",
            type: "interactive",
            interactiveType: "troubleshooting_workflow",
            config: {
              scenario: "office-apipa-incident",
              symptom: "Klien baru di lantai 2 mendapat IP 169.254.x.x, klien lama lancar.",
              hypothesisOptions: [
                { id: "dhcp-full", text: "DHCP Pool /28 habis terisi", score: 100 },
                { id: "isp-cut", text: "Kabel ISP putus", score: 0 },
                { id: "pc-broken", text: "Motherboard laptop rusak", score: 0 },
              ],
            },
          },
          {
            id: "mth-l7-callout2",
            type: "callout",
            variant: "tip",
            title: "Aturan Emas: Occam's Razor dalam Jaringan",
            content:
              "Prinsip 'Occam's Razor' menyatakan: dari beberapa penjelasan yang mungkin, penjelasan yang paling sederhana dan paling sedikit membuat asumsi liar biasanya adalah yang benar. Cek hal-hal mendasar (kabel terlepas, IP bentrok, pool habis) sebelum mencurigai serangan siber canggih.",
          },
          {
            id: "mth-l7-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mth-l7-q1",
            question:
              "Seorang teknisi memulai investigasi keluhan jaringan dengan melakukan ping ke IP gateway lokal untuk menentukan apakah masalah berada di Layer 1-3 atau Layer 4-7. Strategi model OSI apakah yang digunakan?",
            options: [
              { id: "opt-a", text: "Pendekatan Divide-and-Conquer" },
              { id: "opt-b", text: "Pendekatan Bottom-Up" },
              { id: "opt-c", text: "Pendekatan Top-Down" },
              { id: "opt-d", text: "Pendekatan Random Trial and Error" },
            ],
            explanation:
              "Divide-and-Conquer memulai pengujian pada lapisan tengah (Layer 3 Network) via ping untuk membelah cakupan penyelidikan menjadi dua arah logis.",
            xpReward: 10,
          },
          {
            id: "quiz-mth-l7-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mth-l7-q2",
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
            explanation:
              "Teknisi harus selalu mendahulukan pengumpulan bukti faktual dan observasi teknis obyektif sebelum mengambil tindakan apapun.",
            xpReward: 10,
          },
          {
            id: "quiz-mth-l7-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mth-l7-q3",
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
            explanation:
              "Output CLI ipconfig adalah data kuantitatif dan teknis yang dapat diverifikasi ulang tanpa bias perasaan subjektif pengguna.",
            xpReward: 10,
          },
          {
            id: "mth-l7-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 7",
            keyPoints: [
              "Tiga strategi investigasi OSI: Bottom-Up (fisik ke aplikasi), Top-Down (aplikasi ke fisik), dan Divide-and-Conquer (mulai di tengah dengan ping).",
              "Pendekatan Divide-and-Conquer memangkas waktu troubleshooting hingga 50% dengan membedakan masalah Layer 1-3 dari Layer 4-7 secara cepat.",
              "Seorang teknisi harus mendasarkan analisis pada bukti empiris (CLI output, log, LED) bukan opini subjektif pengguna.",
              "Daftar hipotesis harus disusun berdasarkan probabilitas dari penyebab paling umum dan sederhana menuju yang paling kompleks.",
            ],
          },
          {
            id: "mth-l7-rew",
            type: "reward",
            xp: 60,
            message:
              "Hebat! Anda memahami metodologi investigasi ilmiah dan formulasi hipotesis berbasis bukti.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 8: perbaikan-dan-verifikasi (P5-L08)
    // =========================================================================
    {
      id: "lesson-perbaikan-dan-verifikasi",
      slug: "perbaikan-dan-verifikasi",
      title: "Eksekusi Perbaikan, Verifikasi Hasil & Dokumentasi",
      description:
        "Menerapkan prinsip isolasi variabel tunggal dalam perbaikan konfigurasi jaringan, menyiapkan rencana rollback darurat, memverifikasi pemulihan end-to-end hingga Layer 7, serta menyusun dokumentasi tiket insiden.",
      orderIndex: 1,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["observasi-dan-hipotesis"],
      outcomes: [
        {
          id: "MTH-L8-A",
          text: "Siswa dapat menjelaskan prinsip mengubah hanya satu variabel konfigurasi pada satu waktu serta pentingnya membuat backup/rencana rollback sebelum eksekusi.",
        },
        {
          id: "MTH-L8-B",
          text: "Siswa dapat merancang protokol verifikasi pemulihan fungsional penuh (bukan hanya ping ICMP, tetapi uji akses aplikasi nyata) dan menyusun laporan insiden terstruktur.",
        },
      ],
      evidence: [
        {
          outcomeId: "MTH-L8-A",
          teachingBlockIds: ["mth-l8-h1", "mth-l8-txt1", "mth-l8-callout1"],
          activityIds: ["mth-l8-code1"],
          assessmentItemIds: ["quiz-mth-l8-q1", "quiz-mth-l8-q2"],
        },
        {
          outcomeId: "MTH-L8-B",
          teachingBlockIds: ["mth-l8-h2", "mth-l8-txt2", "mth-l8-callout2"],
          activityIds: ["mth-l8-interactive1"],
          assessmentItemIds: ["quiz-mth-l8-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "mth-l8-h1",
            type: "heading",
            level: 2,
            text: "Prinsip Isolasi Variabel Tunggal & Rencana Rollback",
          },
          {
            id: "mth-l8-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika hipotesis akar masalah telah dirumuskan, tahap eksekusi perbaikan menuntut disiplin tinggi:\n\n### 1. Ubah Hanya SATU Hal pada Satu Waktu (Isolate One Variable)\nJangan pernah mengubah alamat IP router, mengganti kabel switch, mengedit tabel routing, dan merestart server secara serentak dalam satu waktu!\n\nJika Anda mengubah empat hal sekaligus dan jaringan tiba-tiba berfungsi, Anda **tidak akan pernah tahu** konfigurasi mana yang sebenarnya menyelesaikan masalah. Lebih buruk lagi, jika jaringan menjadi semakin rusak total, Anda tidak tahu perubahan mana yang menjadi penyebab malapetaka baru.\n\n### 2. Selalu Siapkan Rencana Rollback\nSebelum mengubah baris konfigurasi pada perangkat jaringan produksi:\n\n- Simpan salinan konfigurasi aktif (`backup configuration`).\n- Tentukan batas waktu uji (misal 5 menit). Jika setelah 5 menit perubahan tidak membuahkan hasil positif, **kembalikan konfigurasi ke keadaan semula (Rollback)** sebelum menguji hipotesis berikutnya.",
          },
          {
            id: "mth-l8-code1",
            type: "code",
            language: "text",
            code: "Standar Prosedur Operasional (SOP) Perbaikan Jaringan:\n\n1. Pra-Perbaikan:\n   - Backup running-config perangkat aktif.\n   - Catat status awal (baseline) tabel routing dan interface.\n\n2. Eksekusi Perbaikan (Single Action):\n   - Terapkan 1 tindakan korektif (contoh: ubah port Fa0/24 menjadi mode trunk).\n\n3. Uji Hasil:\n   - Apakah inter-VLAN routing pulih?\n     -> YA: Lanjutkan ke Verifikasi Menyeluruh & Dokumentasi.\n     -> TIDAK: Kembalikan port Fa0/24 ke setelan awal (ROLLBACK!), lalu uji hipotesis ke-2.",
          },
          {
            id: "mth-l8-callout1",
            type: "callout",
            variant: "warning",
            title: "Bahaya Mengabaikan Rollback",
            content:
              "Banyak downtime berkepanjangan di perusahaan disebabkan oleh teknisi yang menumpuk coba-coba konfigurasi salah tanpa pernah membatalkannya. Setelah 1 jam, sistem menjadi begitu kacau sehingga konfigurasi asli yang sebenarnya hanya salah satu angka tidak bisa dipulihkan kembali.",
          },
          {
            id: "mth-l8-h2",
            type: "heading",
            level: 2,
            text: "Verifikasi Pemulihan Layanan Penuh & Dokumentasi Tiket",
          },
          {
            id: "mth-l8-txt2",
            type: "text",
            format: "markdown",
            content:
              "Setelah tindakan perbaikan diterapkan, pekerjaan seorang teknisi belum selesai!\n\n### 1. Verifikasi Menyeluruh (Beyond Ping!)\nPing yang berhasil (Reply 0ms) hanya membuktikan bahwa paket ICMP Layer 3 dapat bolak-balik. Ping **tidak menjamin** bahwa sistem telah pulih sepenuhnya:\n\n- Apakah pengguna bisa melakukan login ke aplikasi web (uji Layer 7)?\n- Apakah database PostgreSQL dapat menerima query pada port 5432 (uji Layer 4)?\n- Apakah DNS dapat menyelesaikan nama domain internal kantor?\n- Mintalah pengguna yang bersangkutan untuk menguji alur kerja nyata mereka dan mengonfirmasi penyelesaian.\n\n### 2. Dokumentasi Tiket Insiden (Post-Mortem)\nDokumentasikan insiden tersebut dalam sistem tiket helpdesk dengan format terstruktur:\n\n1. **Waktu & Ruang Lingkup Insiden:** Kapan terjadi dan berapa banyak perangkat yang terdampak.\n2. **Gejala Awal:** Pesan kesalahan awal dan laporan pengguna.\n3. **Akar Masalah (Root Cause):** Alasan teknis pasti terjadinya gangguan.\n4. **Tindakan Perbaikan:** Perintah atau perubahan konfigurasi persis yang diterapkan.\n5. **Tindakan Pencegahan (Preventive Action):** Langkah agar masalah serupa tidak terulang di masa depan (misalnya memperbesar DHCP lease pool, memasang label kabel, atau mengaktifkan BPDU guard).",
          },
          {
            id: "mth-l8-interactive1",
            type: "interactive",
            interactiveType: "remediation_verification",
            config: {
              targetService: "ERP Web Application (Port 443)",
              verificationSteps: [
                "1. Ping Default Gateway (Layer 3)",
                "2. Resolusi DNS portal.smk.sch.id (Layer 7)",
                "3. Telnet/cURL ke port 443 TCP (Layer 4)",
                "4. Login Web Browser Klien (Verifikasi Fungsional)",
              ],
            },
          },
          {
            id: "mth-l8-callout2",
            type: "callout",
            variant: "tip",
            title: "Dokumentasi Adalah Aset Terbesar IT Support",
            content:
              "Ketika insiden yang sama terulang 6 bulan kemudian, catatan tiket Anda akan menyelamatkan waktu tim IT dari proses penelusuran berjam-jam menjadi hanya perbaikan dalam 5 menit.",
          },
          {
            id: "mth-l8-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mth-l8-q1",
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
            explanation:
              "Isolasi variabel memastikan kita dapat mengatribusikan keberhasilan atau kegagalan kepada satu parameter spesifik yang diuji.",
            xpReward: 10,
          },
          {
            id: "quiz-mth-l8-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mth-l8-q2",
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
            explanation:
              "Rollback wajib dilakukan segera setelah suatu hipotesis terbukti salah agar konfigurasi perangkat tidak tertumpuk dengan setelan yang salah.",
            xpReward: 10,
          },
          {
            id: "quiz-mth-l8-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-mth-l8-q3",
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
            explanation:
              "Konektivitas ICMP (Layer 3) tidak menjamin port aplikasi web (Layer 4/7) dapat diakses atau otorisasi login berjalan dengan benar. Verifikasi menyeluruh mutlak diperlukan.",
            xpReward: 10,
          },
          {
            id: "mth-l8-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 8",
            keyPoints: [
              "Selalu ubah satu parameter konfigurasi pada satu waktu (isolate one variable) agar dampak perubahan dapat diukur dengan pasti.",
              "Selalu buat backup konfigurasi sebelum eksekusi dan lakukan rollback seketika jika perubahan tidak memperbaiki masalah.",
              "Verifikasi pemulihan wajib menguji fungsi aplikasi di tingkat pengguna akhir (Layer 7), bukan hanya mengandalkan respon ping ICMP.",
              "Dokumentasi tiket insiden yang mencakup gejala, akar masalah, tindakan perbaikan, dan langkah pencegahan mencegah terjadinya insiden berulang di masa depan.",
            ],
          },
          {
            id: "mth-l8-rew",
            type: "reward",
            xp: 60,
            message:
              "Selamat! Anda telah menyelesaikan seluruh 8 pelajaran di Path 5 Wireless & Troubleshooting!",
          },
        ],
      },
    },
  ],
};
