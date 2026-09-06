import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for How Data Travels (P1-M7)
 *
 * Covers data units (Bits, Frames, Packets) and transmission scopes (Unicast, Broadcast, Multicast).
 */
export const howDataTravelsModuleData: CurriculumModule = {
  id: "module-how-data-travels",
  slug: "how-data-travels",
  title: "How Data Travels",
  description:
    "Perjalanan data di jaringan: transformasi representasi bit, frame, paket, dan metode transmisi unicast, broadcast, multicast.",
  orderIndex: 6,
  prerequisites: ["physical-media-cabling"],
  outcomes: [
    {
      id: "HDT-M1",
      text: "Siswa dapat mengidentifikasi representasi unit data (Bit, Frame, Packet) sesuai lapisannya.",
    },
    {
      id: "HDT-M2",
      text: "Siswa dapat memprediksi cakupan penerima data berdasarkan metode pengiriman (Unicast, Broadcast, Multicast).",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 16: bits-frames-packets
    // =========================================================================
    {
      id: "lesson-bits-frames-packets",
      slug: "bits-frames-packets",
      title: "Representasi Data: Bit, Frame, dan Packet",
      description:
        "Melihat perubahan bentuk data: bit sinyal di kabel, frame dengan alamat MAC di switch, dan paket dengan alamat IP di router.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["fiber-optic-intro"],
      outcomes: [
        {
          id: "HDT-L16-A",
          text: "Siswa dapat menghubungkan unit data (Bit, Frame, Paket) dengan lapisan dan perangkat jaringan yang memprosesnya.",
        },
        {
          id: "HDT-L16-B",
          text: "Siswa dapat menjelaskan fungsi penambahan header alamat pada frame dan paket data.",
        },
      ],
      evidence: [
        {
          outcomeId: "HDT-L16-A",
          teachingBlockIds: ["hdt-l16-h1", "hdt-l16-txt1", "hdt-l16-callout1"],
          activityIds: ["hdt-l16-act1"],
          assessmentItemIds: ["quiz-hdt-l16-q1", "quiz-hdt-l16-q2"],
        },
        {
          outcomeId: "HDT-L16-B",
          teachingBlockIds: ["hdt-l16-txt2"],
          activityIds: ["hdt-l16-act1"],
          assessmentItemIds: ["quiz-hdt-l16-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "hdt-l16-h1",
            type: "heading",
            level: 2,
            text: "Transformasi Satuan Data: Dari Bit ke Paket",
          },
          {
            id: "hdt-l16-txt1",
            type: "text",
            format: "markdown",
            content:
              "Ketika Anda mengirim pesan, data tidak dikirim begitu saja dalam satu bongkahan utuh. Data dipecah menjadi unit-unit kecil dan dibungkus dengan alamat pengenal:\n\n1. **Bit (Binary Digit - 0 atau 1):**\n   - Sinyal fisik paling mendasar yang mengalir di media transmisi (voltase listrik di tembaga atau kedipan pulsa cahaya di serat optik).\n   - Diproses di Lapisan Fisik (Layer 1).\n2. **Frame (Bingkai Data):**\n   - Satuan data di lapisan lokal (Data Link - Layer 2).\n   - Frame membungkus data dengan header yang memuat **MAC Address Pengirim** dan **MAC Address Tujuan**, serta ditutup oleh *Frame Check Sequence* (FCS) untuk mendeteksi kerusakan data saat transmisi kabel.\n   - Diproses dan diforward oleh **Switch**.\n3. **Packet (Paket Data):**\n   - Satuan data di lapisan antarnetwork (Network - Layer 3).\n   - Paket memuat header berisikan **IP Address Asal** dan **IP Address Tujuan** agar data dapat menyeberangi router hingga mencapai belahan dunia lain.\n   - Diproses dan dirutekan oleh **Router**.",
          },
          {
            id: "hdt-l16-callout1",
            type: "callout",
            variant: "info",
            title: "Analogi Surat Kantor Pos",
            content:
              "- **Data:** Isi surat Anda.\n- **Paket (Packet):** Amplop surat yang bertuliskan alamat kota/negara tujuan (IP Address).\n- **Frame (Frame):** Mobil van pos lokal yang membawa amplop tersebut dari kantor pos cabang A ke cabang B (MAC Address).\n- **Bit:** Putaran roda mobil di atas jalan aspal fisik.",
          },
          {
            id: "hdt-l16-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Hubungan Perangkat dan Unit Data (PDU)\n- **Kabel / Hub:** Hanya mengenal **Bit** (listrik/cahaya).\n- **Switch:** Membaca header **Frame** (melihat MAC Address tujuan).\n- **Router:** Membaca header **Packet** (melihat IP Address tujuan).",
          },
          {
            id: "hdt-l16-act1",
            type: "interactive",
            interactiveType: "packet_flow",
            config: {
              instruction: "Amati bagaimana data dibungkus menjadi paket ber-IP lalu dibingkai menjadi frame ber-MAC saat dikirimkan.",
            },
          },
          {
            id: "hdt-l16-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Bit, Frame, dan Paket",
          },
          {
            id: "hdt-l16-q1-block",
            type: "quiz",
            quizId: "quiz-hdt-l16-q1",
            question: "Satuan data protokol (PDU) yang memuat alamat MAC pengirim dan MAC tujuan untuk diproses oleh Switch disebut:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Bit" },
              { id: "opt-b", text: "Frame" },
              { id: "opt-c", text: "Packet" },
              { id: "opt-d", text: "Segment" },
            ],
            explanation: "Frame adalah PDU Layer 2 (Data Link) yang memuat alamat fisik perangkat keras (MAC Address).",
            xpReward: 10,
          },
          {
            id: "hdt-l16-q2-block",
            type: "quiz",
            quizId: "quiz-hdt-l16-q2",
            question: "Perangkat Router membaca informasi pada header untuk menentukan jalur rute terbaik. Informasi apakah yang diperiksa pada header paket?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Warna kabel yang dicolokkan" },
              { id: "opt-b", text: "Alamat IP Tujuan (Destination IP Address)" },
              { id: "opt-c", text: "Nama pemilik akun media sosial" },
              { id: "opt-d", text: "Jumlah kapasitas hard disk router" },
            ],
            explanation: "Router bekerja di Layer 3 dan memeriksa Alamat IP Tujuan pada header paket untuk mencocokkannya dengan tabel routing.",
            xpReward: 10,
          },
          {
            id: "hdt-l16-q3-block",
            type: "quiz",
            quizId: "quiz-hdt-l16-q3",
            question: "Ketika data keluar dari kartu jaringan melewati kabel tembaga UTP menuju switch, data tersebut ditransmisikan dalam bentuk fisik berupa:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Aliran pulsa sinyal voltase listrik digital (Bit 0 dan 1)" },
              { id: "opt-b", text: "File teks Microsoft Word utuh" },
              { id: "opt-c", text: "Cairan kimia penghantar data" },
              { id: "opt-d", text: "Huruf alfabet yang dicetak pada kawat" },
            ],
            explanation: "Di media kabel tembaga fisik, data ditransmisikan sebagai variasi pulsa tegangan listrik yang merepresentasikan bit digital.",
            xpReward: 10,
          },
          {
            id: "hdt-l16-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 16",
            keyPoints: [
              "Bit adalah bentuk fisik sinyal data di Layer 1.",
              "Frame membawa MAC address untuk pengiriman antarnode di LAN Layer 2.",
              "Packet membawa IP address untuk perutean lintas jaringan Layer 3.",
            ],
          },
          {
            id: "hdt-l16-reward",
            type: "reward",
            xp: 60,
            message: "Mantap! Anda memahami bagaimana data dienkapsulasi dari bit, frame, hingga paket.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 17: unicast-broadcast-multicast
    // =========================================================================
    {
      id: "lesson-unicast-broadcast-multicast",
      slug: "unicast-broadcast-multicast",
      title: "Metode Pengiriman: Unicast, Broadcast, dan Multicast",
      description:
        "Membedakan pengiriman data satu-ke-satu, satu-ke-semua dalam broadcast domain, dan satu-ke-grup terdaftar.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["bits-frames-packets"],
      outcomes: [
        {
          id: "HDT-L17-A",
          text: "Siswa dapat membedakan konsep dan skenario penggunaan Unicast, Broadcast, dan Multicast.",
        },
        {
          id: "HDT-L17-B",
          text: "Siswa dapat memprediksi perangkat mana saja yang akan menerima frame broadcast vs unicast dalam LAN.",
        },
      ],
      evidence: [
        {
          outcomeId: "HDT-L17-A",
          teachingBlockIds: ["hdt-l17-h1", "hdt-l17-txt1", "hdt-l17-callout1"],
          activityIds: ["hdt-l17-act1"],
          assessmentItemIds: ["quiz-hdt-l17-q1", "quiz-hdt-l17-q2"],
        },
        {
          outcomeId: "HDT-L17-B",
          teachingBlockIds: ["hdt-l17-txt2"],
          activityIds: ["hdt-l17-act1"],
          assessmentItemIds: ["quiz-hdt-l17-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "hdt-l17-h1",
            type: "heading",
            level: 2,
            text: "Tiga Mode Pengiriman Paket Data",
          },
          {
            id: "hdt-l17-txt1",
            type: "text",
            format: "markdown",
            content:
              "Berdasarkan cakupan penerima yang dituju, lalu lintas data dibedakan menjadi tiga mode transmisi:\n\n1. **Unicast (Satu-ke-Satu):**\n   - Paket dikirimkan dari satu pengirim spesifik ke satu penerima spesifik.\n   - Contoh: Anda membuka website sekolah, mengunduh file tugas, atau melakukan panggilan video personal. Switch hanya meneruskan frame ke port tujuan yang tepat.\n2. **Broadcast (Satu-ke-Semua):**\n   - Paket dikirimkan ke **seluruh perangkat** yang berada dalam satu segmen jaringan lokal (*Broadcast Domain*).\n   - Switch akan menduplikasi frame broadcast ke seluruh port aktif (kecuali port pengirim).\n   - Contoh: Protokol ARP (mencari alamat siapa pemilik IP tertentu) dan DHCP Discovery (mencari server pembagi IP).\n3. **Multicast (Satu-ke-Grup Terpilih):**\n   - Paket dikirimkan dari satu sumber ke sekelompok perangkat tertentu yang telah bergabung ke dalam grup multicast tersebut.\n   - Contoh: Siaran video streaming langsung (IPTV) di jaringan kampus, protokol routing dinamis OSPF.",
          },
          {
            id: "hdt-l17-callout1",
            type: "callout",
            variant: "warning",
            title: "Batas Akhir Broadcast: Router!",
            content:
              "Switch akan meneruskan paket broadcast ke seluruh komputer di lab Anda. Namun ketika paket broadcast mencapai **Router**, router secara default akan **menghentikan (drop) paket broadcast tersebut** agar tidak meluap ke Internet. Karena itu, satu LAN disebut satu *Broadcast Domain*.",
          },
          {
            id: "hdt-l17-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Perbandingan Alamat Tujuan\n| Mode | Alamat MAC Tujuan | Alamat IP Contoh | Karakteristik Penerima |\n| :--- | :--- | :--- | :--- |\n| **Unicast** | MAC spesifik (cth: `00:1A:2B:3C:4D:5E`) | IP host tertentu | Hanya 1 perangkat tujuan |\n| **Broadcast** | `FF:FF:FF:FF:FF:FF` (semua 1) | `255.255.255.255` | Seluruh host dalam satu LAN |\n| **Multicast** | Dimulai dengan `01:00:5E:...` | Range `224.0.0.0/4` | Hanya host anggota grup terdaftar |",
          },
          {
            id: "hdt-l17-act1",
            type: "interactive",
            interactiveType: "packet_flow",
            config: {
              instruction: "Simulasikan aliran pengiriman paket Unicast (ke 1 PC) dan Broadcast (ke seluruh PC di lab).",
            },
          },
          {
            id: "hdt-l17-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: Unicast, Broadcast, & Multicast",
          },
          {
            id: "hdt-l17-q1-block",
            type: "quiz",
            quizId: "quiz-hdt-l17-q1",
            question: "Ketika komputer baru pertama kali menyala dan mencari server DHCP untuk meminta IP address, metode transmisi apa yang digunakan?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Unicast langsung ke alamat server yang sudah dihafal" },
              { id: "opt-b", text: "Broadcast ke seluruh jaringan lokal (DHCP Discover)" },
              { id: "opt-c", text: "Multicast ke komputer teman sebangku" },
              { id: "opt-d", text: "Panggilan telepon analog" },
            ],
            explanation: "Karena komputer baru belum tahu di mana dan siapa server DHCP, ia mengirim pesan broadcast (satu ke semua) untuk menemukan server.",
            xpReward: 10,
          },
          {
            id: "hdt-l17-q2-block",
            type: "quiz",
            quizId: "quiz-hdt-l17-q2",
            question: "Apa yang dilakukan oleh perangkat Router ketika menerima paket broadcast dari jaringan lokal switch?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Meneruskannya ke seluruh dunia dan satelit" },
              { id: "opt-b", text: "Menghentikan (memblokir/drop) paket broadcast tersebut agar tidak bocor ke jaringan lain" },
              { id: "opt-c", text: "Menggandakan paket menjadi jutaan salinan" },
              { id: "opt-d", text: "Mengubah paket broadcast menjadi file PDF" },
            ],
            explanation: "Router membatasi batas broadcast domain; router tidak meneruskan broadcast lokal ke jaringan luar.",
            xpReward: 10,
          },
          {
            id: "hdt-l17-q3-block",
            type: "quiz",
            quizId: "quiz-hdt-l17-q3",
            question: "Pengiriman siaran video pembelajaran secara bersamaan hanya kepada 30 siswa yang terdaftar di kelas daring tanpa membebani siswa lain di luar kelas menggunakan metode:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Broadcast massal" },
              { id: "opt-b", text: "Multicast" },
              { id: "opt-c", text: "Bluetooth pairing" },
              { id: "opt-d", text: "Dial-up suara" },
            ],
            explanation: "Multicast mendistribusikan satu aliran data secara efisien hanya kepada kelompok host yang berlangganan/terdaftar.",
            xpReward: 10,
          },
          {
            id: "hdt-l17-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 17",
            keyPoints: [
              "Unicast adalah transmisi titik-ke-titik (point-to-point) untuk komunikasi personal.",
              "Broadcast mengirim data ke seluruh node dalam satu segmen LAN lokal.",
              "Router bertindak sebagai pembatas batas penyebaran paket broadcast.",
              "Multicast mengirimkan data efisien khusus kepada anggota kelompok tertentu.",
            ],
          },
          {
            id: "hdt-l17-reward",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda telah memahami bagaimana paket data didistribusikan di jaringan.",
          },
        ],
      },
    },
  ],
};
