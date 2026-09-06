import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for OSI & TCP/IP Foundations (P1-M8)
 *
 * Covers 7 OSI layers, 4 TCP/IP layers, encapsulation/decapsulation, and layered troubleshooting.
 */
export const osiTcpipModuleData: CurriculumModule = {
  id: "module-osi-tcpip-foundations",
  slug: "osi-tcpip-foundations",
  title: "OSI & TCP/IP Foundations",
  description:
    "Model referensi arsitektur jaringan: 7 Layer OSI, 4 Layer TCP/IP praktis, proses enkapsulasi dan dekapsulasi data, serta analisis troubleshooting bertingkat.",
  orderIndex: 7,
  prerequisites: ["how-data-travels"],
  outcomes: [
    {
      id: "OSI-M1",
      text: "Siswa dapat menghubungkan 7 lapisan model OSI dengan fungsi operasional dan gejala masalah troubleshooting jaringan.",
    },
    {
      id: "OSI-M2",
      text: "Siswa dapat menelusuri proses enkapsulasi dan dekapsulasi pada model praktis 4-Layer TCP/IP.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 18: osi-seven-layers
    // =========================================================================
    {
      id: "lesson-osi-seven-layers",
      slug: "osi-seven-layers",
      title: "Model Referensi 7-Layer OSI",
      description:
        "Memahami hierarki standar 7 lapisan OSI dari Physical hingga Application sebagai peta panduan diagnosa teknisi jaringan.",
      orderIndex: 0,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["unicast-broadcast-multicast"],
      outcomes: [
        {
          id: "OSI-L18-A",
          text: "Siswa dapat mengurutkan dan menyebutkan tanggung jawab 7 lapisan model OSI dari bawah ke atas.",
        },
        {
          id: "OSI-L18-B",
          text: "Siswa dapat mengaitkan gejala masalah jaringan ke lapisan OSI yang relevan.",
        },
      ],
      evidence: [
        {
          outcomeId: "OSI-L18-A",
          teachingBlockIds: ["osi-l18-h1", "osi-l18-txt1", "osi-l18-callout1"],
          activityIds: ["osi-l18-act1"],
          assessmentItemIds: ["quiz-osi-l18-q1", "quiz-osi-l18-q2"],
        },
        {
          outcomeId: "OSI-L18-B",
          teachingBlockIds: ["osi-l18-txt2"],
          activityIds: ["osi-l18-act1"],
          assessmentItemIds: ["quiz-osi-l18-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "osi-l18-h1",
            type: "heading",
            level: 2,
            text: "Model Referensi Open Systems Interconnection (OSI)",
          },
          {
            id: "osi-l18-txt1",
            type: "text",
            format: "markdown",
            content:
              "Diciptakan oleh ISO, model 7-Layer OSI adalah standar konseptual yang membagi proses komunikasi data menjadi 7 lapisan modular (dihitung dari Layer 1 di bawah hingga Layer 7 di atas):\n\n1. **Layer 1 - Physical:** Media transmisi kabel, konektor RJ-45, tegangan listrik, dan bit sinyal.\n2. **Layer 2 - Data Link:** Pengalamatan fisik (MAC Address), pembentukan frame, dan kendali akses media (Switch).\n3. **Layer 3 - Network:** Pengalamatan logis (IP Address) dan penentuan rute antarnetwork (Router).\n4. **Layer 4 - Transport:** Pengiriman data ujung-ke-ujung (end-to-end), kontrol kehandalan (TCP), dan nomor port layanan.\n5. **Layer 5 - Session:** Membuka, memelihara, dan menutup sesi komunikasi antar-aplikasi.\n6. **Layer 6 - Presentation:** Format data, kompresi, dan enkripsi keamanan (contoh: SSL/TLS, JPEG, ASCII).\n7. **Layer 7 - Application:** Antarmuka langsung yang berinteraksi dengan aplikasi pengguna (HTTP/HTTPS, DNS, DHCP, FTP).",
          },
          {
            id: "osi-l18-callout1",
            type: "callout",
            variant: "tip",
            title: "Jembatan Keledai Menghafal 7 Layer",
            content:
              "- Dari bawah (1 ke 7): **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way (Physical, Data Link, Network, Transport, Session, Presentation, Application).\n- Dari atas (7 ke 1): **A**nak **P**ak **S**oleh **T**idak **N**akal **D**an **P**intar.",
          },
          {
            id: "osi-l18-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Diagnosa Bertingkat (Bottom-Up Troubleshooting)\nTeknisi TKJ profesional mendiagnosa masalah dari bawah ke atas:\n- **Langkah 1 (Layer 1 Fisik):** Apakah kabel dicolok? Lampu port switch menyala hijau?\n- **Langkah 2 (Layer 2 Data Link):** Apakah kartu jaringan (NIC) terdeteksi dan terhubung ke switch?\n- **Langkah 3 (Layer 3 Network):** Apakah komputer mendapatkan IP Address dan bisa ping ke gateway?\n- **Langkah 4+ (Layer 4–7):** Jika ping sukses tapi web tidak bisa dibuka, barulah periksa firewall port atau konfigurasi DNS server!",
          },
          {
            id: "osi-l18-act1",
            type: "interactive",
            interactiveType: "osi_stack",
            config: {
              instruction: "Klik setiap lapisan pada tumpukan 7 Layer OSI untuk melihat nama, fungsi, dan contoh protokolnya.",
            },
          },
          {
            id: "osi-l18-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: 7 Layer OSI",
          },
          {
            id: "osi-l18-q1-block",
            type: "quiz",
            quizId: "quiz-osi-l18-q1",
            question: "Lapisan pada model OSI yang bertugas menentukan rute terbaik (routing) dan menangani pengalamatan IP adalah:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Layer 1 - Physical" },
              { id: "opt-b", text: "Layer 2 - Data Link" },
              { id: "opt-c", text: "Layer 3 - Network" },
              { id: "opt-d", text: "Layer 7 - Application" },
            ],
            explanation: "Layer 3 (Network) bertanggung jawab atas pengalamatan logis (IP Address) dan perutean paket (routing).",
            xpReward: 10,
          },
          {
            id: "osi-l18-q2-block",
            type: "quiz",
            quizId: "quiz-osi-l18-q2",
            question: "Sebuah kabel LAN UTP terinjak roda kursi hingga patah dan lampu indikator pada switch padam. Gangguan ini terjadi pada lapisan OSI:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Layer 1 - Physical" },
              { id: "opt-b", text: "Layer 4 - Transport" },
              { id: "opt-c", text: "Layer 6 - Presentation" },
              { id: "opt-d", text: "Layer 7 - Application" },
            ],
            explanation: "Kerusakan fisik kabel dan hilangnya sinyal listrik adalah masalah murni di Layer 1 (Physical).",
            xpReward: 10,
          },
          {
            id: "osi-l18-q3-block",
            type: "quiz",
            quizId: "quiz-osi-l18-q3",
            question: "Komputer siswa bisa melakukan tes ping ke alamat IP server lokal, tetapi gagal membuka halaman web karena browser salah membaca nama domain. Pada lapisan manakah masalah tersebut?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Layer 1 - Kabel terputus" },
              { id: "opt-b", text: "Layer 7 - Application (Layanan DNS / Web)" },
              { id: "opt-c", text: "Konektor RJ-45 kotor" },
              { id: "opt-d", text: "Switch kekurangan daya listrik" },
            ],
            explanation: "Karena ping (Layer 3) sukses, koneksi fisik dan IP terbukti normal. Masalah nama domain berada di Layer 7 (Application - DNS).",
            xpReward: 10,
          },
          {
            id: "osi-l18-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 18",
            keyPoints: [
              "Model OSI membagi komunikasi menjadi 7 lapisan modular dari Physical hingga Application.",
              "Setiap lapisan memiliki fungsi spesifik dan berkomunikasi dengan lapisan setara di perangkat seberang.",
              "Pendekatan bottom-up troubleshooting menghemat waktu diagnosa dari kabel fisik hingga aplikasi.",
            ],
          },
          {
            id: "osi-l18-reward",
            type: "reward",
            xp: 60,
            message: "Mantap! Anda telah menguasai model 7-Layer OSI dan metode troubleshooting bertingkat.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 19: tcp-ip-and-encapsulation
    // =========================================================================
    {
      id: "lesson-tcp-ip-and-encapsulation",
      slug: "tcp-ip-and-encapsulation",
      title: "Model 4-Layer TCP/IP dan Proses Enkapsulasi",
      description:
        "Menelusuri model implementasi nyata Internet (Network Access, Internet, Transport, Application) dan proses pembungkusan header data bertingkat.",
      orderIndex: 1,
      estimatedMinutes: 10,
      xpReward: 60,
      prerequisites: ["osi-seven-layers"],
      outcomes: [
        {
          id: "OSI-L19-A",
          text: "Siswa dapat memetakan model 4-Layer TCP/IP terhadap model 7-Layer OSI.",
        },
        {
          id: "OSI-L19-B",
          text: "Siswa dapat menjelaskan alur enkapsulasi dan dekapsulasi data pada proses pengiriman pesan.",
        },
      ],
      evidence: [
        {
          outcomeId: "OSI-L19-A",
          teachingBlockIds: ["osi-l19-h1", "osi-l19-txt1", "osi-l19-callout1"],
          activityIds: ["osi-l19-act1"],
          assessmentItemIds: ["quiz-osi-l19-q1", "quiz-osi-l19-q2"],
        },
        {
          outcomeId: "OSI-L19-B",
          teachingBlockIds: ["osi-l19-txt2"],
          activityIds: ["osi-l19-act1"],
          assessmentItemIds: ["quiz-osi-l19-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "osi-l19-h1",
            type: "heading",
            level: 2,
            text: "Model Praktis Internet: TCP/IP",
          },
          {
            id: "osi-l19-txt1",
            type: "text",
            format: "markdown",
            content:
              "Jika OSI adalah model teori, maka **TCP/IP (Transmission Control Protocol / Internet Protocol)** adalah arsitektur protokol nyata yang menjalankan seluruh Internet saat ini. Model TCP/IP menyederhanakan hierarki menjadi 4 lapisan:\n\n1. **Application Layer:** Menggabungkan Layer 5, 6, dan 7 OSI. Protokol: HTTP, HTTPS, DNS, DHCP, SSH.\n2. **Transport Layer:** Setara Layer 4 OSI. Mengatur kehandalan dan transmisi data. Protokol: TCP (andal & berurutan) dan UDP (cepat tanpa konfirmasi).\n3. **Internet Layer:** Setara Layer 3 OSI. Menangani pengalamatan logika dan pemilihan rute. Protokol: IP (IPv4, IPv6) dan ICMP (ping).\n4. **Network Access Layer:** Menggabungkan Layer 1 dan 2 OSI. Menangani media fisik dan transmisi frame lokal (Ethernet, Wi-Fi).",
          },
          {
            id: "osi-l19-callout1",
            type: "callout",
            variant: "info",
            title: "Proses Enkapsulasi vs Dekapsulasi",
            content:
              "- **Enkapsulasi (Saat Mengirim):** Data aplikasi -> dibungkus header TCP/UDP (**Segment**) -> dibungkus header IP (**Packet**) -> dibungkus header MAC (**Frame**) -> diubah menjadi sinyal fisik (**Bits**).\n- **Dekapsulasi (Saat Menerima):** Komputer penerima melepas header satu per satu dari bawah hingga data asli diserahkan ke aplikasi pengguna.",
          },
          {
            id: "osi-l19-txt2",
            type: "text",
            format: "markdown",
            content:
              "### Pemetaan Perbandingan OSI dan TCP/IP\n| Layer OSI (7) | Layer TCP/IP (4) | Satuan Data (PDU) | Contoh Protokol |\n| :--- | :--- | :--- | :--- |\n| **7. Application, 6. Presentation, 5. Session** | **Application** | Data | HTTP, HTTPS, DNS, DHCP |\n| **4. Transport** | **Transport** | Segment | TCP, UDP |\n| **3. Network** | **Internet** | Packet | IPv4, IPv6, ICMP |\n| **2. Data Link, 1. Physical** | **Network Access** | Frame / Bits | Ethernet 802.3, Wi-Fi 802.11 |",
          },
          {
            id: "osi-l19-act1",
            type: "interactive",
            interactiveType: "encapsulation",
            config: {
              instruction: "Amati simulasi interaktif bagaimana data aplikasi dibungkus bertahap dengan header Transport, Internet, dan Network Access.",
            },
          },
          {
            id: "osi-l19-h2",
            type: "heading",
            level: 3,
            text: "Uji Pemahaman: TCP/IP & Enkapsulasi",
          },
          {
            id: "osi-l19-q1-block",
            type: "quiz",
            quizId: "quiz-osi-l19-q1",
            question: "Manakah pasangan lapisan model 4-Layer TCP/IP yang tepat dari urutan atas ke bawah?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Physical -> Data Link -> Network -> Transport" },
              { id: "opt-b", text: "Application -> Transport -> Internet -> Network Access" },
              { id: "opt-c", text: "Internet -> Application -> Network Access -> Transport" },
              { id: "opt-d", text: "Session -> Presentation -> Physical -> Hardware" },
            ],
            explanation: "Urutan 4 Layer TCP/IP dari atas ke bawah: Application, Transport, Internet, dan Network Access.",
            xpReward: 10,
          },
          {
            id: "osi-l19-q2-block",
            type: "quiz",
            quizId: "quiz-osi-l19-q2",
            question: "Apa yang dimaksud dengan proses Enkapsulasi dalam pengiriman data jaringan?",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Penghapusan seluruh data pengguna agar file menjadi ringan" },
              { id: "opt-b", text: "Penambahan informasi header protokol secara bertahap pada setiap lapisan saat data bergerak turun ke media fisik" },
              { id: "opt-c", text: "Pemasangan kabel ke dalam pipa pipa tembok" },
              { id: "opt-d", text: "Proses pembersihan virus di dalam hard disk" },
            ],
            explanation: "Enkapsulasi adalah proses pembungkusan data dengan header protokol pada setiap lapisan saat hendak ditransmisikan.",
            xpReward: 10,
          },
          {
            id: "osi-l19-q3-block",
            type: "quiz",
            quizId: "quiz-osi-l19-q3",
            question: "Ketika data tiba di komputer server penerima, proses membuka dan melepas header satu per satu dari lapisan terbawah hingga data disajikan ke aplikasi disebut:",
            quizType: "single_choice",
            options: [
              { id: "opt-a", text: "Dekapsulasi (Decapsulation)" },
              { id: "opt-b", text: "Formatting ulang" },
              { id: "opt-c", text: "Crimping" },
              { id: "opt-d", text: "Subnetting" },
            ],
            explanation: "Dekapsulasi adalah kebalikan dari enkapsulasi: membuka dan memvalidasi header lapis demi lapis di sisi penerima.",
            xpReward: 10,
          },
          {
            id: "osi-l19-summary",
            type: "summary",
            title: "Rangkuman Pelajaran 19",
            keyPoints: [
              "Model TCP/IP terdiri dari 4 lapisan praktis: Application, Transport, Internet, Network Access.",
              "Enkapsulasi membungkus data dengan header protokol saat dikirim.",
              "Dekapsulasi melepas header lapis demi lapis saat data diterima.",
              "Selamat! Anda telah menuntaskan seluruh 19 pelajaran di Path 1 Network Foundations!",
            ],
          },
          {
            id: "osi-l19-reward",
            type: "reward",
            xp: 60,
            message: "Luar biasa! Anda telah menyelesaikan seluruh materi Network Foundations dengan sempurna!",
          },
        ],
      },
    },
  ],
};
