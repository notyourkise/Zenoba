import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Ethernet & Alamat MAC (P3-M1)
 *
 * Covers Layer 2 Ethernet framing, 48-bit MAC address anatomy,
 * and switch CAM table learning mechanics.
 */
export const ethernetMacModuleData: CurriculumModule = {
  id: "module-ethernet-dan-mac",
  slug: "ethernet-dan-mac",
  title: "Ethernet & Alamat MAC",
  description:
    "Pahami struktur pengalamatan fisik Layer 2, anatomi frame Ethernet 48-bit, serta cara switch membangun tabel CAM untuk meneruskan paket data.",
  orderIndex: 1,
  prerequisites: [],
  outcomes: [
    {
      id: "ETH-M1",
      text: "Siswa dapat membedakan peran pengalamatan fisik Layer 2 MAC address dari alamat logika Layer 3 IP, serta menganalisis format 48-bit frame Ethernet.",
    },
    {
      id: "ETH-M2",
      text: "Siswa dapat memprediksi pembaruan tabel CAM switch dari source MAC frame dan menjelaskan proses forward, filter, dan unknown unicast flooding.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 1: ethernet-mac-address (P3-L01)
    // =========================================================================
    {
      id: "lesson-ethernet-mac-address",
      slug: "ethernet-mac-address",
      title: "Format Frame Ethernet & Alamat MAC",
      description:
        "Mempelajari unit data frame Layer 2, susunan 48-bit MAC address (OUI dan NIC), serta perbedaannya dengan alamat IP.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: [],
      outcomes: [
        {
          id: "ETH-L1-A",
          text: "Siswa dapat menjelaskan fungsi frame Ethernet dan mengidentifikasi komponen utama header (Destination MAC, Source MAC, EtherType, Payload, dan FCS).",
        },
        {
          id: "ETH-L1-B",
          text: "Siswa dapat membedakan pengalamatan fisik 48-bit MAC (24-bit OUI dan 24-bit Vendor Assigned) dari pengalamatan logika IP.",
        },
      ],
      evidence: [
        {
          outcomeId: "ETH-L1-A",
          teachingBlockIds: ["eth-l1-h1", "eth-l1-txt1", "eth-l1-callout1"],
          activityIds: ["eth-l1-code1"],
          assessmentItemIds: ["quiz-eth-l1-q1", "quiz-eth-l1-q2"],
        },
        {
          outcomeId: "ETH-L1-B",
          teachingBlockIds: ["eth-l1-h2", "eth-l1-txt2", "eth-l1-callout2"],
          activityIds: ["eth-l1-code2"],
          assessmentItemIds: ["quiz-eth-l1-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "eth-l1-h1",
            type: "heading",
            level: 2,
            text: "Frame Ethernet: Unit Data Protokol Layer 2",
          },
          {
            id: "eth-l1-txt1",
            type: "text",
            format: "markdown",
            content:
              "Di lapisan Data Link (Layer 2 model OSI), data dibungkus dalam bentuk **Frame**. Protokol standar LAN yang paling dominan di dunia adalah **Ethernet** (IEEE 802.3).\n\nSebuah frame Ethernet memiliki struktur baku yang memastikan perangkat penerima dapat mendeteksi awal data, mengenali siapa pengirim dan penerima fisik, serta memastikan data tidak mengalami kerusakan selama perjalanan kabel tembaga maupun nirkabel.",
          },
          {
            id: "eth-l1-code1",
            type: "code",
            language: "text",
            code: "Struktur Frame Ethernet II (Standard LAN):\n+-----------+-------+------------+------------+-----------+--------------+---------+\n| Preamble  |  SFD  | Dest MAC   | Source MAC | EtherType | Data Payload |   FCS   |\n|  7 Bytes  | 1 Byte|  6 Bytes   |  6 Bytes   |  2 Bytes  | 46-1500 Byte | 4 Bytes |\n+-----------+-------+------------+------------+-----------+--------------+---------+\n\nKeterangan:\n- Preamble & SFD : Sinkronisasi timing clock sinyal fisik.\n- Dest & Src MAC : Alamat fisik kartu jaringan penerima & pengirim.\n- EtherType      : Menunjukkan protokol Layer 3 di atasnya (0x0800 = IPv4, 0x0806 = ARP).\n- Data Payload   : Isi data paket Layer 3 (misal paket IP).\n- FCS (CRC-32)   : Frame Check Sequence untuk mendeteksi error korupsi bit.",
          },
          {
            id: "eth-l1-callout1",
            type: "callout",
            variant: "info",
            title: "FCS (Frame Check Sequence) & Integritas Data",
            content:
              "Jika kalkulasi CRC pada field FCS oleh switch penerima tidak cocok dengan hasil hitungan pengirim, frame akan langsung **dibuang (dropped)** seketika tanpa peringatan! Ethernet tidak memperbaiki frame yang rusak; perbaikan diserahkan ke protokol Layer 4 seperti TCP.",
          },
          {
            id: "eth-l1-h2",
            type: "heading",
            level: 2,
            text: "Anatomi 48-Bit MAC Address (Media Access Control)",
          },
          {
            id: "eth-l1-txt2",
            type: "text",
            format: "markdown",
            content:
              "Setiap kartu jaringan (NIC — *Network Interface Card*), baik ethernet port laptop, port switch, maupun chip Wi-Fi smartphone, memiliki identitas unik permanen bernama **MAC Address** (*Physical/Hardware Address*).\n\nMAC address berukuran **48 bit** (6 byte), ditulis dalam format 12 digit heksadesimal yang biasanya dipisahkan oleh tanda titik dua (`:`) atau tanda hubung (`-`), misalnya: `00:1A:2B:3C:4D:5E`.",
          },
          {
            id: "eth-l1-code2",
            type: "code",
            language: "text",
            code: "Format Pembagian 48-bit MAC Address:\n\n      00 : 1A : 2B      :      3C : 4D : 5E\n    [--- 24-bit OUI ---]     [--- 24-bit NIC ---]\n    Organizationally Unique      Vendor Assigned\n          Identifier             Serial Identifier\n   (Ditetapkan oleh IEEE)      (Ditetapkan oleh Pabrik)",
          },
          {
            id: "eth-l1-callout2",
            type: "callout",
            variant: "warning",
            title: "Perbedaan Krusial: MAC Address vs IP Address",
            content:
              "- **MAC Address (Layer 2):** Alamat fisik permanen (bawaan pabrik). Hanya relevan untuk pengiriman data hop-by-hop di dalam satu jaringan lokal (LAN) yang sama.\n- **IP Address (Layer 3):** Alamat logis hierarkis. Menunjukkan lokasi host di jaringan global/antar-network sehingga paket dapat dirutekan melintasi berbagai router di dunia.",
          },
          {
            id: "eth-l1-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-eth-l1-q1",
            question: "Berapa panjang total ukuran sebuah MAC Address dalam representasi bit dan byte?",
            options: [
              { id: "opt-a", text: "32 bit (4 byte)" },
              { id: "opt-b", text: "48 bit (6 byte)" },
              { id: "opt-c", text: "64 bit (8 byte)" },
              { id: "opt-d", text: "128 bit (16 byte)" },
            ],
            explanation:
              "MAC Address berukuran 48 bit (6 byte), terdiri dari 24 bit OUI untuk kode manufaktur dan 24 bit ID antarmuka perangkat.",
            xpReward: 10,
          },
          {
            id: "eth-l1-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-eth-l1-q2",
            question: "Apa fungsi utama dari field FCS (Frame Check Sequence) pada frame Ethernet?",
            options: [
              { id: "opt-a", text: "Menentukan kecepatan transmisi port switch (10/100/1000 Mbps)" },
              { id: "opt-b", text: "Mendeteksi kerusakan bit data selama transmisi menggunakan algoritma CRC" },
              { id: "opt-c", text: "Mengatur alamat IP tujuan dari komputer penerima" },
              { id: "opt-d", text: "Membagi frame menjadi potongan paket yang lebih kecil" },
            ],
            explanation:
              "FCS menggunakan algoritma CRC-32 untuk mendeteksi apakah bit-bit di dalam frame mengalami gangguan atau korupsi sinyal saat melintasi kabel.",
            xpReward: 10,
          },
          {
            id: "eth-l1-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-eth-l1-q3",
            question: "24 bit pertama dari sebuah MAC address disebut OUI. Siapa yang menerbitkan OUI tersebut?",
            options: [
              { id: "opt-a", text: "IEEE (Institute of Electrical and Electronics Engineers) kepada pabrikan vendor" },
              { id: "opt-b", text: "Administrator jaringan lokal di sekolah/kantor" },
              { id: "opt-c", text: "Router gateway ISP melalui layanan DHCP" },
              { id: "opt-d", text: "Sistem operasi komputer saat pertama kali dinyalakan" },
            ],
            explanation:
              "OUI (Organizationally Unique Identifier) dikelola dan diterbitkan secara resmi oleh IEEE kepada vendor perangkat keras jaringan seperti Cisco, Intel, Realtek, MikroTik, dll.",
            xpReward: 10,
          },
          {
            id: "eth-l1-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 1",
            keyPoints: [
              "Frame Ethernet adalah PDU Layer 2 yang membungkus data paket Layer 3.",
              "Field utama Ethernet frame mencakup Preamble/SFD, Destination MAC, Source MAC, EtherType, Payload, dan FCS.",
              "MAC Address berukuran 48-bit (6 byte) heksadesimal: 24-bit OUI (vendor ID) dan 24-bit nomor seri kartu jaringan.",
              "MAC address bersifat fisik dan permanen di kartu jaringan, berbeda dengan IP address yang merupakan pengalamatan logis.",
            ],
          },
          {
            id: "eth-l1-rew",
            type: "reward",
            xp: 60,
            message: "Selamat! Anda memahami anatomi Frame Ethernet dan alamat fisik MAC Layer 2.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 2: mac-learning-table (P3-L02)
    // =========================================================================
    {
      id: "lesson-mac-learning-table",
      slug: "mac-learning-table",
      title: "Cara Kerja Switch & Pembelajaran Tabel MAC",
      description:
        "Memahami bagaimana switch mempelajari alamat MAC pengirim, menyimpan tabel CAM, serta proses forwarding, filtering, dan unknown unicast flooding.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["ethernet-mac-address"],
      outcomes: [
        {
          id: "ETH-L2-A",
          text: "Siswa dapat menjelaskan mekanisme pembelajaran dinamis tabel MAC (CAM table) switch berdasarkan Source MAC address dari frame yang masuk.",
        },
        {
          id: "ETH-L2-B",
          text: "Siswa dapat memprediksi 3 tindakan forwarding switch: Forwarding (unicast terdaftar), Filtering (port sama), dan Flooding (unknown unicast).",
        },
      ],
      evidence: [
        {
          outcomeId: "ETH-L2-A",
          teachingBlockIds: ["eth-l2-h1", "eth-l2-txt1", "eth-l2-callout1"],
          activityIds: ["eth-l2-code1"],
          assessmentItemIds: ["quiz-eth-l2-q1", "quiz-eth-l2-q2"],
        },
        {
          outcomeId: "ETH-L2-B",
          teachingBlockIds: ["eth-l2-h2", "eth-l2-txt2", "eth-l2-callout2"],
          activityIds: ["eth-l2-code2"],
          assessmentItemIds: ["quiz-eth-l2-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "eth-l2-h1",
            type: "heading",
            level: 2,
            text: "Bagaimana Switch Berpikir? Dynamic MAC Learning",
          },
          {
            id: "eth-l2-txt1",
            type: "text",
            format: "markdown",
            content:
              "Berbeda dengan Hub zaman dulu yang membabi-buta meneruskan sinyal ke seluruh port, **Switch** adalah perangkat cerdas Layer 2. Switch memiliki memori khusus bernama **CAM Table** (*Content Addressable Memory*) atau sering disebut **MAC Address Table**.\n\nPrinsip dasar pembelajaran switch sangat sederhana namun fundamental:\n> **Switch BELAJAR dari Source MAC, dan switch MENERUSKAN (Forward) berdasarkan Destination MAC.**",
          },
          {
            id: "eth-l2-callout1",
            type: "callout",
            variant: "info",
            title: "Proses Pencatatan Otomatis Tabel CAM",
            content:
              "Ketika sebuah frame masuk ke Port 1 dengan Source MAC `AA:AA:AA:AA:AA:AA`, switch langsung mencatat di tabelnya:\n`Port 1 <--> AA:AA:AA:AA:AA:AA`.\nSwitch TIDAK PERNAH belajar lokasi port dari Destination MAC!",
          },
          {
            id: "eth-l2-code1",
            type: "code",
            language: "text",
            code: "Contoh Isi Tabel MAC (CAM Table) pada Switch:\n+------+-------------------+---------+------------+\n| Port |    MAC Address    | VLAN ID | Aging Time |\n+------+-------------------+---------+------------+\n| Fa0/1| 00:11:22:33:44:01 |    1    |  300 detik |\n| Fa0/2| 00:11:22:33:44:02 |    1    |  300 detik |\n| Fa0/3| 00:11:22:33:44:03 |    1    |  280 detik |\n+------+-------------------+---------+------------+\nCatatan: Entri MAC memiliki masa kedaluwarsa (Aging Timer, default 300 detik / 5 menit).\nJika perangkat tidak aktif mengirim data selama 5 menit, entrinya otomatis dihapus.",
          },
          {
            id: "eth-l2-h2",
            type: "heading",
            level: 2,
            text: "3 Tindakan Forwarding Switch Saat Menerima Frame",
          },
          {
            id: "eth-l2-txt2",
            type: "text",
            format: "markdown",
            content:
              "Setelah mencatat Source MAC ke tabel CAM, switch memeriksa **Destination MAC** frame tersebut untuk menentukan tindakan pengiriman:\n\n1. **Forwarding (Unicast Forward):** Jika Destination MAC sudah terdaftar di tabel CAM pada port tertentu (misal Port 2), switch hanya meneruskan frame keluar melalui Port 2 saja.\n2. **Filtering (Drop):** Jika Destination MAC terdaftar di port yang SAMA dengan port masuknya frame, switch menyaring dan membuang frame tersebut karena tujuan berada di segmen kabel yang sama.\n3. **Flooding (Unknown Unicast Flooding):** Jika Destination MAC BELUM terdaftar di tabel CAM, switch menyebarkan frame ke SELURUH port aktif lainnya (kecuali port asal frame masuk).",
          },
          {
            id: "eth-l2-code2",
            type: "code",
            language: "text",
            code: "Skenario Unknown Unicast Flooding:\n\n     [PC 1: MAC A] ---> (Kirim frame tujuan MAC B) ---> Port 1 [SWITCH]\n                                                                 |\n       Tabel CAM belum punya MAC B!                              |\n       Switch mem-flood frame ke semua port aktif:              |\n       - Port 2: Diteruskan ke PC 2 -----------------------------+\n       - Port 3: Diteruskan ke PC 3 -----------------------------+\n       - Port 1: TIDAK dikirim balik ke pengirim (Split Horizon)",
          },
          {
            id: "eth-l2-callout2",
            type: "callout",
            variant: "warning",
            title: "Unknown Unicast vs Broadcast",
            content:
              "- **Broadcast (`FF:FF:FF:FF:FF:FF`):** Ditujukan memang untuk semua host (misal ARP request).\n- **Unknown Unicast:** Ditujukan untuk satu host tertentu, tetapi switch belum tahu port mana yang menghubungkannya, sehingga switch terpaksa melakukan flooding sementara sampai host tujuan membalas.",
          },
          {
            id: "eth-l2-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-eth-l2-q1",
            question: "Bagian manakah dari frame Ethernet yang digunakan oleh switch untuk mempelajari dan mengisi tabel MAC-nya?",
            options: [
              { id: "opt-a", text: "Destination MAC Address" },
              { id: "opt-b", text: "Source MAC Address" },
              { id: "opt-c", text: "Field EtherType" },
              { id: "opt-d", text: "Frame Check Sequence (FCS)" },
            ],
            explanation:
              "Switch belajar dari Source MAC address frame yang masuk pada port tertentu, bukan dari Destination MAC.",
            xpReward: 10,
          },
          {
            id: "eth-l2-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-eth-l2-q2",
            question: "Apa yang dilakukan switch jika menerima frame unicast dengan Destination MAC yang belum tercatat di tabel CAM?",
            options: [
              { id: "opt-a", text: "Membuang frame seketika (drop frame)" },
              { id: "opt-b", text: "Mengirim frame ke seluruh port aktif kecuali port tempat frame tersebut masuk (flooding)" },
              { id: "opt-c", text: "Mengembalikan frame ke komputer pengirim" },
              { id: "opt-d", text: "Mengubah MAC tujuan menjadi broadcast secara otomatis" },
            ],
            explanation:
              "Proses ini disebut Unknown Unicast Flooding. Switch meneruskan frame ke semua port aktif selain port kedatangan agar penerima tetap mendapatkan datanya.",
            xpReward: 10,
          },
          {
            id: "eth-l2-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-eth-l2-q3",
            question: "Mengapa tabel MAC switch memiliki Aging Timer (waktu kedaluwarsa, misal 300 detik)?",
            options: [
              { id: "opt-a", text: "Agar port switch tidak kepanasan akibat beban listrik" },
              { id: "opt-b", text: "Untuk menghapus entri perangkat yang sudah dicabut/pindah port sehingga tabel tetap akurat" },
              { id: "opt-c", text: "Karena kapasitas kabel LAN hanya bisa menyimpan data selama 5 menit" },
              { id: "opt-d", text: "Sebagai standar keamanan wajib untuk memblokir hacker setiap 5 menit" },
            ],
            explanation:
              "Aging Timer memastikan bahwa jika komputer dimatikan, kabel dicabut, atau dipindahkan ke port lain, entri lama akan dihapus dan digantikan entri baru.",
            xpReward: 10,
          },
          {
            id: "eth-l2-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 2",
            keyPoints: [
              "Switch mencatat Source MAC address dan nomor port kedatangan ke dalam CAM Table (MAC Table).",
              "Jika Destination MAC diketahui di CAM table, frame diteruskan hanya ke port tersebut (Forwarding).",
              "Jika Destination MAC berada di port yang sama, frame dibuang (Filtering).",
              "Jika Destination MAC belum dikenal, switch melakukan Unknown Unicast Flooding ke semua port kecuali port pengirim.",
              "Entri tabel MAC dibersihkan secara berkala melalui mekanisme Aging Timer (default 300 detik).",
            ],
          },
          {
            id: "eth-l2-rew",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda telah menguasai algoritma dynamic MAC learning dan operasi forwarding switch.",
          },
        ],
      },
    },
  ],
};
