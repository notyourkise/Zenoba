import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Konfigurasi Access & Trunk Port (P3-M4)
 *
 * Covers Access port mode (untagged traffic for endpoints),
 * 802.1Q Trunk port mode, Native VLAN, and Allowed VLAN filtering.
 */
export const accessTrunkModuleData: CurriculumModule = {
  id: "module-access-dan-trunk",
  slug: "access-dan-trunk",
  title: "Konfigurasi Access & Trunk Port",
  description:
    "Kuasai perbedaan port Access untuk komputer klien dan jalur Trunk 802.1Q antar-switch, penandaan tag VLAN, Native VLAN, serta penyaringan Allowed VLAN.",
  orderIndex: 4,
  prerequisites: ["module-vlan-dan-segmentasi"],
  outcomes: [
    {
      id: "TRK-M1",
      text: "Siswa dapat memilih peran port Access untuk perangkat akhir (untagged) dan mengonfigurasi keanggotaan VLAN yang benar.",
    },
    {
      id: "TRK-M2",
      text: "Siswa dapat mengonfigurasi jalur Trunk antar-switch menggunakan enkapsulasi IEEE 802.1Q, mengatur Allowed VLAN list, dan mendiagnosis mismatch konfigurasi.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 7: access-port (P3-L07)
    // =========================================================================
    {
      id: "lesson-access-port",
      slug: "access-port",
      title: "Karakteristik & Konfigurasi Port Access",
      description:
        "Memahami fungsi port Access yang hanya membawa satu VLAN, karakteristik untagged frame pada komputer klien, dan verifikasi port.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["vlan-membership"],
      outcomes: [
        {
          id: "TRK-L1-A",
          text: "Siswa dapat menjelaskan karakteristik mode port Access yang hanya dapat menjadi anggota dari tepat satu VLAN.",
        },
        {
          id: "TRK-L1-B",
          text: "Siswa dapat menjelaskan bahwa frame yang masuk dan keluar dari port Access menuju komputer klien tidak memiliki tag VLAN (Untagged).",
        },
      ],
      evidence: [
        {
          outcomeId: "TRK-L1-A",
          teachingBlockIds: ["trk-l1-h1", "trk-l1-txt1", "trk-l1-callout1"],
          activityIds: ["trk-l1-code1"],
          assessmentItemIds: ["quiz-trk-l1-q1", "quiz-trk-l1-q2"],
        },
        {
          outcomeId: "TRK-L1-B",
          teachingBlockIds: ["trk-l1-h2", "trk-l1-txt2", "trk-l1-callout2"],
          activityIds: ["trk-l1-code2"],
          assessmentItemIds: ["quiz-trk-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "trk-l1-h1",
            type: "heading",
            level: 2,
            text: "Apa Itu Port Mode Access?",
          },
          {
            id: "trk-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Di dalam switch manageable, setiap port fisik harus ditentukan peran modenya. Mode port yang paling banyak digunakan adalah **Access Port**.\n\n**Port Access** adalah port switch yang dirancang khusus untuk menghubungkan **perangkat akhir (end devices)**, seperti:\n- Komputer PC desktop & Laptop\n- Printer jaringan\n- IP Camera (CCTV)\n- Server tunggal biasa\n\nAturan mutlak port access: **Port Access hanya dapat menjadi anggota dari TEPAT SATU VLAN pada satu waktu!**",
          },
          {
            id: "trk-l1-callout1",
            type: "callout",
            variant: "info",
            title: "Mengapa Hanya 1 VLAN?",
            content:
              "Kartu jaringan komputer biasa (NIC) tidak mengerti bahasa tagging VLAN. Komputer pengguna hanya menganggap dirinya terhubung ke jaringan LAN biasa tanpa tahu nomor VLAN berapa yang diatribusikan oleh switch.",
          },
          {
            id: "trk-l1-code1",
            type: "code",
            language: "text",
            code: "Sintaks Konseptual Konfigurasi Port Access (Standar CLI Switch):\nSwitch(config)# interface FastEthernet 0/5\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10\nSwitch(config-if)# no shutdown\n\nArtinya: Port Fa0/5 kini beroperasi sebagai Access Port dan resmi menjadi anggota VLAN 10.",
          },
          {
            id: "trk-l1-h2",
            type: "heading",
            level: 2,
            text: "Mekanisme Untagged Frame pada Port Access",
          },
          {
            id: "trk-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Lalu bagaimana switch mengetahui keanggotaan paket jika komputer tidak mengirim nomor VLAN?\n\n1. **Saat Frame Masuk ke Switch (Ingress):**\n   Komputer mengirim frame Ethernet standar (tanpa tag). Begitu frame masuk ke port access (misal Port 5 yang diset ke VLAN 10), switch secara internal menandai frame tersebut sebagai milik VLAN 10.\n2. **Saat Frame Keluar dari Switch Menuju Komputer (Egress):**\n   Ketika switch meneruskan frame ke komputer tujuan di port access lain (misal Port 8 di VLAN 10), switch **mencopot/membuang seluruh tanda pengenal VLAN internal**. Frame tiba di komputer penerima dalam format frame Ethernet biasa (Untagged).",
          },
          {
            id: "trk-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "Komputer Klien Tidak Pernah Menerima Tag!",
            content:
              "Jika switch mengirimkan frame bertag ke kartu jaringan PC biasa, kartu jaringan tersebut kemungkinan besar akan menganggap frame tersebut rusak (*corrupt*) dan langsung membuangnya karena panjang header-nya tidak sesuai standar Ethernet II.",
          },
          {
            id: "trk-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trk-l1-q1",
            question: "Berapa banyak VLAN yang dapat ditampung secara aktif oleh sebuah port switch berstatus mode Access?",
            options: [
              { id: "opt-a", text: "Tepat 1 VLAN saja" },
              { id: "opt-b", text: "Maksimal 10 VLAN" },
              { id: "opt-c", text: "Hingga 4094 VLAN sekaligus" },
              { id: "opt-d", text: "Tergantung kecepatan kabel (Fast Ethernet atau Gigabit)" },
            ],
            explanation:
              "Port Access dirancang khusus untuk end-device dan hanya dapat mengalirkan trafik dari satu VLAN saja.",
            xpReward: 10,
          },
          {
            id: "trk-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trk-l1-q2",
            question: "Perangkat manakah di bawah ini yang paling tepat dihubungkan ke port switch bertipe Access?",
            options: [
              { id: "opt-a", text: "Switch distribusi lain yang membawa 5 VLAN" },
              { id: "opt-b", text: "Komputer workstation staf kantor atau printer jaringan" },
              { id: "opt-c", text: "Router backbone ISP" },
              { id: "opt-d", text: "Kabel fiber optik antar-gedung bertingkat" },
            ],
            explanation:
              "Port access digunakan untuk perangkat akhir (host endpoint) seperti PC staf, laptop, printer, dan kamera pengawas.",
            xpReward: 10,
          },
          {
            id: "trk-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trk-l1-q3",
            question: "Apa yang dilakukan oleh switch terhadap frame sebelum dikirimkan keluar melalui port Access menuju ke komputer PC?",
            options: [
              { id: "opt-a", text: "Menambahkan header tag 802.1Q sebesar 4 byte" },
              { id: "opt-b", text: "Mencopot/melepas informasi tag VLAN sehingga frame sampai ke PC sebagai frame untagged biasa" },
              { id: "opt-c", text: "Mengenkripsi seluruh data payload dengan password administrator" },
              { id: "opt-d", text: "Mengubah MAC address pengirim menjadi MAC switch" },
            ],
            explanation:
              "Switch memastikan frame keluar port access sebagai untagged frame agar dapat dibaca oleh kartu jaringan komputer biasa.",
            xpReward: 10,
          },
          {
            id: "trk-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 7",
            keyPoints: [
              "Port Access diperuntukkan bagi perangkat akhir (PC, laptop, printer, server lokal).",
              "Port Access hanya dapat menjadi anggota dari tepat satu VLAN.",
              "Frame yang melintasi kabel port access menuju PC berstatus Untagged (tidak memiliki tag VLAN).",
              "Switch mengelola keanggotaan VLAN secara internal tanpa membebani komputer klien.",
            ],
          },
          {
            id: "trk-l1-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai karakteristik dan prinsip kerja port Access.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 8: trunk-8021q (P3-L08)
    // =========================================================================
    {
      id: "lesson-trunk-8021q",
      slug: "trunk-8021q",
      title: "Trunking Antar-Switch, Tagging 802.1Q & Allowed VLAN",
      description:
        "Mempelajari bagaimana satu link kabel fisik dapat membawa banyak VLAN antar-switch menggunakan standar IEEE 802.1Q, Native VLAN, dan Allowed VLAN list.",
      orderIndex: 1,
      estimatedMinutes: 15,
      xpReward: 60,
      prerequisites: ["access-port"],
      outcomes: [
        {
          id: "TRK-L2-A",
          text: "Siswa dapat menjelaskan fungsi Trunk Port dan struktur penambahan 4-byte Tag IEEE 802.1Q (VLAN ID 12-bit) pada frame Ethernet.",
        },
        {
          id: "TRK-L2-B",
          text: "Siswa dapat menganalisis peran Native VLAN (untagged di trunk) dan menyaring trafik menggunakan daftar Allowed VLAN.",
        },
      ],
      evidence: [
        {
          outcomeId: "TRK-L2-A",
          teachingBlockIds: ["trk-l2-h1", "trk-l2-txt1", "trk-l2-callout1"],
          activityIds: ["trk-l2-code1"],
          assessmentItemIds: ["quiz-trk-l2-q1", "quiz-trk-l2-q2"],
        },
        {
          outcomeId: "TRK-L2-B",
          teachingBlockIds: ["trk-l2-h2", "trk-l2-txt2", "trk-l2-callout2"],
          activityIds: ["trk-l2-code2"],
          assessmentItemIds: ["quiz-trk-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "trk-l2-h1",
            type: "heading",
            level: 2,
            text: "Tantangan Komunikasi Antar-Switch & Solusi Trunking",
          },
          {
            id: "trk-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Bayangkan sekolah Anda memiliki 2 gedung: Gedung A dan Gedung B. Masing-masing gedung memiliki Switch dengan 5 VLAN (Guru, Siswa, TU, Lab, WiFi). Jika menggunakan kabel access biasa, Anda harus menarik **5 kabel fisik terpisah** antar-gedung! Jika ada 50 VLAN, Anda butuh 50 kabel!\n\nUntuk mengatasi inefisiensi ini, diciptakan **Trunk Port**.\n> **Trunk Port** adalah jalur koneksi berkapasitas tinggi (biasanya antar-switch atau switch-ke-router) yang mampu membawa lalu lintas data dari **banyak VLAN sekaligus hanya melalui 1 kabel fisik tunggal**.",
          },
          {
            id: "trk-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Standar Industri: IEEE 802.1Q (Dot1q)",
            content:
              "Agar Switch B tahu sebuah frame milik VLAN Guru atau Siswa, Switch A menempelkan 'label digital' sebesar **4 byte** ke dalam frame sebelum dikirimkan ke kabel trunk. Standar internasional untuk pelabelan ini disebut **IEEE 802.1Q**.",
          },
          {
            id: "trk-l2-code1",
            type: "code",
            language: "text",
            code: "Penambahan Tag IEEE 802.1Q ke dalam Frame Ethernet:\nFrame Standar:\n[ Dest MAC ][ Src MAC ][ EtherType ][ Payload ][ FCS ]\n\nFrame Setelah Ditag 802.1Q di Jalur Trunk:\n[ Dest MAC ][ Src MAC ][ 802.1Q Tag (4 Byte) ][ EtherType ][ Payload ][ FCS ]\n                                 |\n             +-------------------+-------------------+\n             | TPID (2 Byte) : 0x8100 (Identitas Tag) |\n             | Priority (3 bit): Quality of Service  |\n             | DEI (1 bit)   : Drop Eligible         |\n             | VLAN ID (12 bit): Nomor VLAN (1-4094) |\n             +---------------------------------------+",
          },
          {
            id: "trk-l2-h2",
            type: "heading",
            level: 2,
            text: "Native VLAN & Allowed VLAN List",
          },
          {
            id: "trk-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Ada dua konsep lanjutan yang wajib dipahami seorang network administrator saat mengelola trunk:\n\n1. **Native VLAN:**\n   Setiap port trunk memiliki satu VLAN khusus yang disepakati untuk **TIDAK diberi tag (Untagged)** saat melintasi kabel trunk. Secara default di hampir semua pabrikan, Native VLAN adalah **VLAN 1**.\n   *Aturan Kritis:* Nomor Native VLAN di kedua ujung switch HARUS SAMA! Jika Switch A Native VLAN 1 dan Switch B Native VLAN 99, akan terjadi *Native VLAN Mismatch* yang mengakibatkan kebocoran trafik dan celah keamanan.\n\n2. **Allowed VLAN List (Daftar VLAN yang Diizinkan):**\n   Secara default, trunk mengizinkan semua VLAN (1-4094). Namun demi keamanan dan efisiensi, administrator dapat membatasi VLAN mana saja yang boleh melintas:\n   `switchport trunk allowed vlan 10,20`.\n   Jika sebuah frame milik VLAN 30 mencoba menyeberang trunk ini, switch akan langsung menolaknya (*dropped*).",
          },
          {
            id: "trk-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "Diagnosa Umum: Trunk Mismatch",
            content:
              "Jika komputer di Switch 2 tidak bisa menghubungi komputer sesama VLAN di Switch 1, periksa:\n1. Apakah port antar-switch sudah diset `switchport mode trunk`?\n2. Apakah VLAN tersebut sudah masuk ke dalam daftar `allowed vlan` di kedua switch?",
          },
          {
            id: "trk-l2-code2",
            type: "code",
            language: "text",
            code: "Contoh Konfigurasi Jalur Trunk Antar-Switch (Port Gigabit 0/1):\nSwitch(config)# interface GigabitEthernet 0/1\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20\nSwitch(config-if)# switchport trunk native vlan 99\nSwitch(config-if)# no shutdown\n\nHasil: Port Gi0/1 membawa trafik VLAN 10 dan 20 dengan tag 802.1Q, serta VLAN 99 sebagai native untagged.",
          },
          {
            id: "trk-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trk-l2-q1",
            question: "Berapa ukuran penambahan tag header standar IEEE 802.1Q yang disisipkan pada frame Ethernet?",
            options: [
              { id: "opt-a", text: "4 byte (32 bit)" },
              { id: "opt-b", text: "2 byte (16 bit)" },
              { id: "opt-c", text: "8 byte (64 bit)" },
              { id: "opt-d", text: "20 byte (160 bit)" },
            ],
            explanation:
              "Standar IEEE 802.1Q menyisipkan field tag sebesar 4 byte (32 bit) yang memuat TPID (0x8100), Priority, DEI, dan 12-bit VLAN ID.",
            xpReward: 10,
          },
          {
            id: "trk-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trk-l2-q2",
            question: "Apa fungsi utama dari konfigurasi Allowed VLAN List pada sebuah port Trunk?",
            options: [
              { id: "opt-a", text: "Membatasi nomor VLAN tertentu saja yang diperbolehkan melintasi kabel trunk demi keamanan dan efisiensi" },
              { id: "opt-b", text: "Mengubah nomor MAC address komputer yang melewati trunk" },
              { id: "opt-c", text: "Mempercepat daya hantar listrik pada tembaga kabel LAN" },
              { id: "opt-d", text: "Menghapus paket data yang memiliki ukuran di atas 100 byte" },
            ],
            explanation:
              "Allowed VLAN List berfungsi sebagai filter keamanan untuk membatasi hanya VLAN yang diizinkan saja yang boleh melintasi link trunk.",
            xpReward: 10,
          },
          {
            id: "trk-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-trk-l2-q3",
            question: "Apa yang dimaksud dengan Native VLAN pada link trunk 802.1Q?",
            options: [
              { id: "opt-a", text: "VLAN khusus yang frame datanya dikirimkan tanpa tag (Untagged) saat melintasi jalur trunk" },
              { id: "opt-b", text: "VLAN yang hanya bisa digunakan di negara asal pembuatan switch" },
              { id: "opt-c", text: "VLAN yang otomatis memiliki akses internet gratis tanpa router" },
              { id: "opt-d", text: "VLAN dengan kecepatan bandwidth paling lambat di switch" },
            ],
            explanation:
              "Native VLAN adalah satu VLAN yang disepakati untuk tidak dipasangi tag (untagged) saat dikirimkan melintasi jalur trunk 802.1Q.",
            xpReward: 10,
          },
          {
            id: "trk-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 8",
            keyPoints: [
              "Trunk Port membawa lalu lintas dari banyak VLAN sekaligus melalui satu kabel fisik penghubung.",
              "Standar IEEE 802.1Q menyisipkan tag 4-byte berisi 12-bit VLAN ID ke dalam header Ethernet.",
              "Native VLAN melintasi jalur trunk dalam kondisi Untagged (tanpa tag); konfigurasi Native VLAN di kedua ujung harus cocok.",
              "Allowed VLAN List membatasi dan menyaring VLAN mana saja yang memiliki hak akses melintasi link trunk.",
            ],
          },
          {
            id: "trk-l2-rew",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda telah menyelesaikan seluruh 8 pelajaran di Path 3: Switching & LAN.",
          },
        ],
      },
    },
  ],
};
