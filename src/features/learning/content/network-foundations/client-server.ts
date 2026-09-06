import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Client, Server & Communication (P1-M3)
 *
 * Covers roles per transaction, peer-to-peer concept, and request-response cycles.
 */
export const clientServerModuleData: CurriculumModule = {
  id: "module-client-server-communication",
  slug: "client-server-communication",
  title: "Client, Server & Communication",
  description:
    "Konsep transaksi client-server, inisiasi layanan, pertukaran pesan request-response, dan pemahaman peran komputer dalam jaringan.",
  orderIndex: 2,
  prerequisites: ["types-of-networks"],
  outcomes: [
    {
      id: "CSC-M1",
      text: "Siswa dapat membedakan peran client dan server berdasarkan arah inisiasi dan transaksi data.",
    },
    {
      id: "CSC-M2",
      text: "Siswa dapat menelusuri alur siklus pesan request dan response dalam komunikasi data.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 7: client-server-roles
    // =========================================================================
    {
      id: "lesson-client-server-roles",
      slug: "client-server-roles",
      title: "Peran Client dan Server dalam Transaksi Data",
      description:
        "Memahami bahwa peran client atau server ditentukan oleh tindakan dalam transaksi, bukan bentuk fisik komputer.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["network-contexts-home-school-enterprise"],
      outcomes: [
        {
          id: "CSC-L7-A",
          text: "Siswa dapat mengidentifikasi peran client (peminta layanan) dan server (penyedia layanan) per transaksi.",
        },
        {
          id: "CSC-L7-B",
          text: "Siswa dapat menjelaskan bahwa satu komputer fisik dapat bertindak sebagai client sekaligus server.",
        },
      ],
      evidence: [
        {
          outcomeId: "CSC-L7-A",
          teachingBlockIds: ["csc-l7-h1", "csc-l7-txt1", "csc-l7-callout1"],
          activityIds: ["csc-l7-act1"],
          assessmentItemIds: ["quiz-csc-l7-q1", "quiz-csc-l7-q2"],
        },
        {
          outcomeId: "CSC-L7-B",
          teachingBlockIds: ["csc-l7-txt2"],
          activityIds: ["csc-l7-act1"],
          assessmentItemIds: ["quiz-csc-l7-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "csc-l7-h1",
            type: "heading",
            level: 2,
            text: "Hakikat Client dan Server dalam Jaringan",
          },
          {
            id: "csc-l7-txt1",
            type: "text",
            format: "markdown",
            content:
              "Banyak pemula mengira server harus selalu berbentuk komputer besar di dalam rak pendingin (*rack server*). Padahal dalam ilmu jaringan, **Client dan Server adalah peran perangkat lunak (software role)** dalam sebuah pertukaran data:\n\n1. **Client (Peminta Layanan):** Perangkat atau aplikasi yang menginisiasi (memulai) komunikasi dengan mengirimkan permintaan (*request*) untuk mendapatkan informasi atau layanan tertentu (contoh: browser di laptop Anda).\n2. **Server (Penyedia Layanan):** Perangkat atau aplikasi yang selalu siap mendengarkan (*listen*) di jaringan, memproses permintaan yang masuk, dan menyajikan data atau layanan kepada client (contoh: web server, file server, print server).\n\nPeran ini bersifat dinamis per transaksi.",
          },
          {
            id: "csc-l7-callout1",
            type: "callout",
            variant: "info",
            title: "Konsep Kunci TKJ: Model Peer-to-Peer",
            content:
              "Jika Laptop A membagikan folder tugas ke Laptop B, maka dalam transaksi itu Laptop A berperan sebagai **file server**. Sesaat kemudian, Laptop A membuka halaman web di Laptop B yang mengaktifkan web server lokal; kini perannya bertukar! Pada model **Peer-to-Peer (P2P)**, setiap komputer dapat bertindak sebagai client dan server secara bergantian.",
          },
          {
            id: "csc-l7-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Model Terpusat (Dedicated Server) vs Peer-to-Peer\n- **Dedicated Client-Server:** Menggunakan server khusus berkecepatan tinggi yang tidak digunakan untuk aktivitas sehari-hari pengguna. Manajemen terpusat dan aman (standar perusahaan).\n- **Peer-to-Peer (P2P):** Komputer pengguna saling terhubung langsung tanpa server pusat. Mudah disiapkan di lab sekolah atau rumah, namun sulit dikelola jika komputer berjumlah banyak.",
          },
          {
            id: "csc-l7-act1",
            type: "interactive",
            interactiveType: "role_assignment",
            config: {
              instruction: "Tentukan pihak peminta (Client) dan pihak penyedia (Server) pada setiap transaksi jaringan berikut.",
            },
          },
          {
            id: "csc-l7-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Peran Client & Server",
          },
          {
            id: "csc-l7-q1-block",
            type: "quiz",
            quizId: "quiz-csc-l7-q1",
            question: "Apa kriteria utama yang menentukan apakah suatu perangkat bertindak sebagai Client dalam komunikasi data?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Ukurannya harus lebih kecil daripada komputer lain" },
              { id: "opt-b", text: "Perangkat tersebut yang menginisiasi permintaan layanan kepada penyedia" },
              { id: "opt-c", text: "Perangkat tersebut harus menggunakan sistem operasi Linux" },
              { id: "opt-d", text: "Perangkat tersebut tidak boleh memiliki media penyimpanan hard disk" },
            ],
            explanation: "Client adalah pihak yang memulai koneksi dan mengajukan permintaan layanan kepada server.",
            xpReward: 10,
          },
          {
            id: "csc-l7-q2-block",
            type: "quiz",
            quizId: "quiz-csc-l7-q2",
            question: "Dapatkah sebuah smartphone Android bertindak sebagai server dalam jaringan lokal?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Tidak bisa, karena smartphone bukan komputer server rak" },
              { id: "opt-b", text: "Bisa, jika smartphone menjalankan aplikasi web server atau file sharing yang melayani permintaan dari perangkat lain" },
              { id: "opt-c", text: "Hanya bisa jika smartphone dihubungkan dengan kabel fiber optic" },
              { id: "opt-d", text: "Tidak bisa, karena Android tidak mendukung jaringan TCP/IP" },
            ],
            explanation: "Peran server ditentukan oleh perangkat lunak layanan yang mendengarkan dan merespons request, bukan bentuk fisik perangkat.",
            xpReward: 10,
          },
          {
            id: "csc-l7-q3-block",
            type: "quiz",
            quizId: "quiz-csc-l7-q3",
            question: "Dua orang siswa TKJ menghubungkan dua laptop menggunakan satu kabel LAN untuk saling bertukar file tugas tanpa server dedicated. Model ini disebut:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Mainframe Computing" },
              { id: "opt-b", text: "Peer-to-Peer (P2P)" },
              { id: "opt-c", text: "Cloud Data Center" },
              { id: "opt-d", text: "Wide Area Network" },
            ],
            explanation: "Jaringan langsung antarperangkat yang setara tanpa server pusat adalah model Peer-to-Peer (P2P).",
            xpReward: 10,
          },
          {
            id: "csc-l7-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 7",
            keyPoints: [
              "Client dan Server adalah peran fungsional perangkat lunak dalam transaksi data.",
              "Client bertindak sebagai pemohon, sedangkan server bertindak sebagai penyedia layanan.",
              "Pada jaringan P2P, setiap perangkat memiliki kemampuan ganda sebagai client maupun server.",
            ],
          },
          {
            id: "csc-l7-reward",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda memahami hakikat sejati peran client dan server dalam dunia jaringan.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 8: request-response-cycle
    // =========================================================================
    {
      id: "lesson-request-response-cycle",
      slug: "request-response-cycle",
      title: "Siklus Request dan Response",
      description:
        "Menelusuri anatomi komunikasi data: client meminta, jaringan mentransmisikan, server memproses, dan membalas dengan status.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["client-server-roles"],
      outcomes: [
        {
          id: "CSC-L8-A",
          text: "Siswa dapat mengurutkan tahapan siklus request dan response secara logis.",
        },
        {
          id: "CSC-L8-B",
          text: "Siswa dapat menginterpretasikan status keberhasilan atau kegagalan transaksi berdasarkan respon server.",
        },
      ],
      evidence: [
        {
          outcomeId: "CSC-L8-A",
          teachingBlockIds: ["csc-l8-h1", "csc-l8-txt1", "csc-l8-callout1"],
          activityIds: ["csc-l8-act1"],
          assessmentItemIds: ["quiz-csc-l8-q1", "quiz-csc-l8-q2"],
        },
        {
          outcomeId: "CSC-L8-B",
          teachingBlockIds: ["csc-l8-txt2"],
          activityIds: ["csc-l8-act1"],
          assessmentItemIds: ["quiz-csc-l8-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "csc-l8-h1",
            type: "heading",
            level: 2,
            text: "Anatomi Pertukaran Pesan Request dan Response",
          },
          {
            id: "csc-l8-txt1",
            type: "text",
            format: "markdown",
            content:
              "Hampir seluruh interaksi di Internet maupun LAN bekerja dengan pola tanya-jawab deterministik yang disebut **Siklus Request-Response**:\n\n1. **Inisiasi Request:** Pengguna mengetik alamat web atau menekan tombol kirim; aplikasi client membuat pesan permintaan berformat standar.\n2. **Transmisi Jaringan:** Paket request dikirim melalui media (kabel/Wi-Fi) dan switch/router menuju alamat server.\n3. **Pemrosesan Server:** Server menerima paket, memeriksa otorisasi, menjalankan logika pencarian database/file.\n4. **Pembuatan Response:** Server mengemas hasil pemrosesan disertai kode status (*status code*) ke dalam paket balasan.\n5. **Penerimaan & Tampilan:** Client menerima paket balasan dan merendernya ke antarmuka pengguna.",
          },
          {
            id: "csc-l8-callout1",
            type: "callout",
            variant: "tip",
            title: "Makna Kode Status Respon",
            content:
              "Ketika request berhasil, server mengirimkan konfirmasi sukses (misalnya kode HTTP `200 OK`). Jika file tidak ada, server membalas dengan `404 Not Found`. Jika server sibuk atau crash, muncullah `500 Server Error`. Jika kabel jaringan Anda putus sebelum mencapai server, client akan mengalami `Connection Timeout` (tidak ada respon sama sekali).",
          },
          {
            id: "csc-l8-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Membedakan Masalah Koneksi vs Masalah Server\nSebagai teknisi TKJ, Anda harus dapat membedakan dua kondisi berikut:\n- **Koneksi Fisik/Jaringan Bermasalah:** Client sama sekali tidak menerima respon dari server (*Request Timed Out / Host Unreachable*).\n- **Jaringan Terhubung Tapi Aplikasi Bermasalah:** Client berhasil mencapai server dan menerima balasan error dari aplikasi server (*Error 404 / Error 503*).",
          },
          {
            id: "csc-l8-act1",
            type: "interactive",
            interactiveType: "message_flow",
            config: {
              instruction: "Simulasikan urutan transaksi dari inisiasi request client, pemrosesan server, hingga response tiba kembali.",
            },
          },
          {
            id: "csc-l8-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Siklus Request & Response",
          },
          {
            id: "csc-l8-q1-block",
            type: "quiz",
            quizId: "quiz-csc-l8-q1",
            question: "Manakah urutan kronologis yang benar saat seorang siswa membuka halaman ujian di server lokal sekolah?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Server kirim data -> Siswa kirim request -> Server proses data" },
              { id: "opt-b", text: "Browser buat request -> Jaringan kirim paket -> Server proses data -> Server kirim response -> Browser tampilkan halaman" },
              { id: "opt-c", text: "Browser render halaman -> Server buat database -> Jaringan restart" },
              { id: "opt-d", text: "Kabel UTP memproses request -> Switch membuat halaman web -> Browser menyimpan file" },
            ],
            explanation: "Siklus dimulai dari inisiasi request oleh client, transmisi, pemrosesan server, dan pengiriman response kembali.",
            xpReward: 10,
          },
          {
            id: "csc-l8-q2-block",
            type: "quiz",
            quizId: "quiz-csc-l8-q2",
            question: "Jika browser menampilkan pesan 'Request Timeout', apa kemungkinan teknis yang terjadi di lapisan jaringan?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Client tidak menerima respon apa pun dari server dalam batas waktu tunggu yang ditentukan" },
              { id: "opt-b", text: "Server berhasil mengirimkan halaman dalam waktu kurang dari 1 milidetik" },
              { id: "opt-c", text: "Komputer siswa kehabisan kuota baterai" },
              { id: "opt-d", text: "Server menghapus semua data di hard disk pengguna" },
            ],
            explanation: "Timeout berarti client menunggu respon tetapi tidak ada balasan dari server dalam jangka waktu tertentu (karena jalur putus atau server mati).",
            xpReward: 10,
          },
          {
            id: "csc-l8-q3-block",
            type: "quiz",
            quizId: "quiz-csc-l8-q3",
            question: "Siswa menerima balasan '404 File Not Found' dari server ujian sekolah. Kesimpulan teknis yang tepat adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Kabel LAN siswa putus dan switch sekolah rusak total" },
              { id: "opt-b", text: "Jaringan terhubung normal ke server, namun berkas yang diminta tidak tersedia di server" },
              { id: "opt-c", text: "Modem ISP sekolah terbakar petir" },
              { id: "opt-d", text: "Kartu jaringan laptop siswa tidak terpasang" },
            ],
            explanation: "Pesan 404 membuktikan bahwa koneksi jaringan ke server berhasil, namun path atau dokumen yang diminta tidak ditemukan di server.",
            xpReward: 10,
          },
          {
            id: "csc-l8-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 8",
            keyPoints: [
              "Komunikasi jaringan berjalan dalam siklus terstruktur: Request -> Processing -> Response.",
              "Setiap response membawa data serta status indikasi keberhasilan transaksi.",
              "Kemampuan membaca kode respon memudahkan teknisi membedakan masalah fisik jaringan dari masalah aplikasi.",
            ],
          },
          {
            id: "csc-l8-reward",
            type: "reward",
            xp: 60,
            message: "Mantap! Anda telah menguasai alur transmisi pesan request dan response.",
          },
        ],
      },
    },
  ],
};
