import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Keamanan Nirkabel & Segmentasi (P5-M2)
 *
 * Covers WPA2-Personal (PSK 4-Way Handshake vulnerabilities) vs WPA3-SAE (Dragonfly handshake),
 * WPA2/WPA3-Enterprise (802.1X/EAP with RADIUS), AP Client Isolation at Layer 2,
 * and Guest Wi-Fi VLAN segmentation.
 */
export const wirelessSecurityModuleData: CurriculumModule = {
  id: "module-wireless-security",
  slug: "wireless-security",
  title: "Keamanan Jaringan Nirkabel & Segmentasi",
  description:
    "Pelajari evolusi protokol keamanan nirkabel dari WPA2 hingga WPA3-SAE, autentikasi 802.1X Enterprise dengan RADIUS, penerapan AP Client Isolation, serta arsitektur segmentasi jaringan tamu (Guest Wi-Fi).",
  orderIndex: 2,
  prerequisites: ["wireless-basics"],
  outcomes: [
    {
      id: "SEC-M1",
      text: "Siswa dapat menganalisis perbedaan mekanisme keamanan antara WPA2-Personal (PSK) dan WPA3-Personal (SAE) serta menjelaskan proteksi terhadap serangan offline dictionary dan deauthentication.",
    },
    {
      id: "SEC-M2",
      text: "Siswa dapat merancang arsitektur jaringan tamu nirkabel yang aman menggunakan kombinasi VLAN terisolasi dan fitur AP Client Isolation di Layer 2.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 3: keamanan-wpa2-wpa3 (P5-L03)
    // =========================================================================
    {
      id: "lesson-keamanan-wpa2-wpa3",
      slug: "keamanan-wpa2-wpa3",
      title: "Keamanan Nirkabel: WPA2-PSK vs WPA3-SAE & Enterprise",
      description:
        "Memahami kelemahan 4-Way Handshake pada WPA2 Pre-Shared Key, mekanisme perlindungan WPA3 Simultaneous Authentication of Equals (SAE), serta autentikasi berbasis pengguna pada WPA-Enterprise.",
      orderIndex: 0,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["channel-dan-interferensi"],
      outcomes: [
        {
          id: "SEC-L3-A",
          text: "Siswa dapat menjelaskan kerentanan 4-Way Handshake WPA2 terhadap serangan capture packet deauth dan offline dictionary attack serta bagaimana WPA3-SAE menutup celah tersebut.",
        },
        {
          id: "SEC-L3-B",
          text: "Siswa dapat membedakan penggunaan WPA-Personal (kunci bersama/PSK) dan WPA-Enterprise (kredensial individual via 802.1X RADIUS server).",
        },
      ],
      evidence: [
        {
          outcomeId: "SEC-L3-A",
          teachingBlockIds: ["sec-l3-h1", "sec-l3-txt1", "sec-l3-callout1"],
          activityIds: ["sec-l3-code1"],
          assessmentItemIds: ["quiz-sec-l3-q1", "quiz-sec-l3-q2"],
        },
        {
          outcomeId: "SEC-L3-B",
          teachingBlockIds: ["sec-l3-h2", "sec-l3-txt2", "sec-l3-callout2"],
          activityIds: ["sec-l3-interactive1"],
          assessmentItemIds: ["quiz-sec-l3-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "sec-l3-h1",
            type: "heading",
            level: 2,
            text: "Kelemahan WPA2-Personal (PSK) dan Solusi WPA3-SAE",
          },
          {
            id: "sec-l3-txt1",
            type: "text",
            format: "markdown",
            content:
              "Selama hampir dua dekade, **WPA2-Personal** (menggunakan enkripsi AES-CCMP) menjadi standar utama Wi-Fi. Namun, WPA2 memiliki kelemahan arsitektural pada proses autentikasi **4-Way Handshake**:\n\n1. **Serangan Deauthentication & Handshake Capture:** Penyerang dapat mengirim frame deauth palsu (spoofed deauth frame) yang memaksa klien terputus dari AP. Ketika klien mencoba menyambung ulang, proses 4-Way Handshake terjadi di udara.\n2. **Offline Dictionary Attack:** Penyerang yang merekam 4 paket handshake tersebut tidak perlu tetap berada di dekat AP. Mereka dapat membawa file capture ke komputer bertenaga GPU tinggi dan mencoba miliaran kombinasi kata sandi secara lokal tanpa memicu alarm AP.\n\nUntuk mengatasi hal ini, standar **WPA3-Personal** memperkenalkan **SAE (Simultaneous Authentication of Equals)** berbasis algoritma Dragonfly:\n\n- **Zero Password Leakage:** Kunci enkripsi sesi dihitung secara dinamis melalui pertukaran kunci Diffie-Hellman yang aman. Nilai password mentah tidak pernah diekspos dalam handshake.\n- **Tahan Brute-Force Offline:** Penyerang tidak bisa menguji tebakan password secara offline. Setiap tebakan memerlukan interaksi langsung satu per satu dengan Access Point, membuat serangan kamus menjadi mustahil.\n- **Forward Secrecy:** Bahkan jika password Wi-Fi diketahui di masa depan, penyerang tetap tidak dapat mendekripsi lalu lintas data masa lalu yang pernah direkam.",
          },
          {
            id: "sec-l3-code1",
            type: "code",
            language: "text",
            code: "Perbandingan Mekanisme Autentikasi Nirkabel:\n\nParameter            WPA2-Personal (PSK)         WPA3-Personal (SAE)       WPA2/WPA3-Enterprise\n--------------------------------------------------------------------------------------------\nProtokol Kunci       4-Way Handshake (PSK)       Dragonfly Handshake (SAE) 802.1X / EAP via RADIUS\nOffline Attack       Rentan jika password lemah  Kebal (Zero Offline Attack) Tidak ada PSK statis\nForward Secrecy      Tidak ada                   Wajib (PFS aktif)         Tergantung metode EAP\nManajemen Kunci      1 Password untuk semua user 1 Password untuk semua user Username & Password unik / Sertifikat digital\nTarget Penerapan     Rumah / Kafe kecil          Rumah / Kafe modern       Sekolah, Kampus, Enterprise",
          },
          {
            id: "sec-l3-callout1",
            type: "callout",
            variant: "warning",
            title: "Peringatan Transisi: Mode WPA2/WPA3 Mixed",
            content:
              "Banyak router rumahan menyediakan mode 'WPA2/WPA3 Transition Mode'. Meskipun ramah bagi perangkat lama, mode ini masih rentan terhadap serangan downgrade attack di mana penyerang memaksa klien berpindah ke protokol WPA2 yang lebih lemah.",
          },
          {
            id: "sec-l3-h2",
            type: "heading",
            level: 2,
            text: "WPA-Enterprise: Autentikasi Berbasis Identitas Unik",
          },
          {
            id: "sec-l3-txt2",
            type: "text",
            format: "markdown",
            content:
              "Di lingkungan sekolah atau kantor dengan ratusan pengguna, sistem WPA-Personal memiliki kelemahan operasional besar: jika satu staf mengundurkan diri, password Wi-Fi di seluruh perangkat harus diganti secara manual!\n\n**WPA-Enterprise (802.1X/EAP)** menyelesaikan masalah ini dengan memindahkan proses autentikasi ke server terpusat (**RADIUS Server**, seperti FreeRADIUS atau Windows Network Policy Server):\n\n- Klien (Supplicant) memasukkan username dan password pribadi (atau sertifikat digital).\n- Access Point (Authenticator) meneruskan kredensial tersebut ke RADIUS Server (Authentication Server) menggunakan protokol EAP (Extensible Authentication Protocol).\n- Kunci enkripsi data dibuat secara unik dan acak per sesi per pengguna. Siswa dan guru tidak saling berbagi kunci, dan akun yang keluar dapat dinonaktifkan dalam hitungan detik di server.",
          },
          {
            id: "sec-l3-interactive1",
            type: "interactive",
            interactiveType: "security_comparison",
            config: {
              scenarios: [
                {
                  id: "home-wifi",
                  title: "Jaringan Wi-Fi Rumah Pribadi",
                  recommendedMode: "WPA3-Personal",
                },
                {
                  id: "school-campus",
                  title: "Wi-Fi Lab & Guru Sekolah SMK (200+ Siswa)",
                  recommendedMode: "WPA2/WPA3-Enterprise (802.1X)",
                },
              ],
            },
          },
          {
            id: "sec-l3-callout2",
            type: "callout",
            variant: "tip",
            title: "Metode EAP Populer: PEAP-MSCHAPv2 vs EAP-TLS",
            content:
              "Pada instalasi SMK TKJ, metode EAP yang paling umum diajarkan adalah **PEAP-MSCHAPv2** karena cukup menggunakan kombinasi username dan password Active Directory. Untuk keamanan militer/finansial tertinggi, **EAP-TLS** menggunakan sertifikat digital ganda di sisi server dan perangkat klien.",
          },
          {
            id: "sec-l3-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-sec-l3-q1",
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
            explanation:
              "Kelemahan terbesar 4-Way Handshake WPA2 adalah paket pertukaran kunci yang terekam di udara memuat cryptographic hash yang dapat diuji jutaan kali per detik secara offline tanpa perlu terhubung kembali ke AP korban.",
            xpReward: 10,
          },
          {
            id: "sec-l3-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-sec-l3-q2",
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
            explanation:
              "SAE (Simultaneous Authentication of Equals) mengharuskan interaksi aktif dengan AP untuk setiap kali tebakan sandi, sehingga penyerang tidak dapat menjalankan dictionary attack offline.",
            xpReward: 10,
          },
          {
            id: "sec-l3-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-sec-l3-q3",
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
            explanation:
              "WPA-Enterprise memisahkan identitas tiap pengguna. Penggantian kata sandi atau pencabutan akses seorang siswa tidak memengaruhi kredensial ratusan pengguna lainnya.",
            xpReward: 10,
          },
          {
            id: "sec-l3-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 3",
            keyPoints: [
              "WPA2-Personal rentan terhadap penangkapan 4-way handshake melalui spoofing frame deauthentication, diikuti offline dictionary attack.",
              "WPA3-Personal menggunakan SAE (Simultaneous Authentication of Equals) yang memblokir penyerangan kamus offline dan menyediakan Forward Secrecy.",
              "WPA-Enterprise mengisolasi identitas setiap pengguna menggunakan autentikasi 802.1X dan server RADIUS, menghapus ketergantungan pada password bersama (PSK).",
              "Penggunaan WPA-Enterprise mempermudah pencabutan hak akses secara terpusat tanpa perlu mengubah konfigurasi perangkat lain.",
            ],
          },
          {
            id: "sec-l3-rew",
            type: "reward",
            xp: 60,
            message:
              "Luar biasa! Anda memahami perbandingan mendalam WPA2, WPA3-SAE, dan arsitektur WPA-Enterprise.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 4: guest-network-isolation (P5-L04)
    // =========================================================================
    {
      id: "lesson-guest-network-isolation",
      slug: "guest-network-isolation",
      title: "Guest Network & Isolasi Klien Nirkabel (AP Client Isolation)",
      description:
        "Memahami arsitektur jaringan tamu (Guest Wi-Fi), penerapan AP Client Isolation pada Layer 2 untuk mencegah serangan antar-klien, dan segmentasi lalu lintas menggunakan VLAN serta Access Control List (ACL).",
      orderIndex: 1,
      estimatedMinutes: 12,
      xpReward: 60,
      prerequisites: ["keamanan-wpa2-wpa3"],
      outcomes: [
        {
          id: "SEC-L4-A",
          text: "Siswa dapat menjelaskan prinsip kerja AP Client Isolation di Layer 2 dalam mencegah infeksi lateral malware dan serangan sniffing antar perangkat nirkabel.",
        },
        {
          id: "SEC-L4-B",
          text: "Siswa dapat merancang integrasi Guest SSID ke VLAN terpisah dengan aturan firewall/ACL yang membatasi akses hanya ke gateway Internet.",
        },
      ],
      evidence: [
        {
          outcomeId: "SEC-L4-A",
          teachingBlockIds: ["sec-l4-h1", "sec-l4-txt1", "sec-l4-callout1"],
          activityIds: ["sec-l4-code1"],
          assessmentItemIds: ["quiz-sec-l4-q1", "quiz-sec-l4-q2"],
        },
        {
          outcomeId: "SEC-L4-B",
          teachingBlockIds: ["sec-l4-h2", "sec-l4-txt2", "sec-l4-callout2"],
          activityIds: ["sec-l4-interactive1"],
          assessmentItemIds: ["quiz-sec-l4-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "sec-l4-h1",
            type: "heading",
            level: 2,
            text: "Bahaya Jaringan Wi-Fi Tanpa Isolasi Klien (Peer-to-Peer Risk)",
          },
          {
            id: "sec-l4-txt1",
            type: "text",
            format: "markdown",
            content:
              "Pada konfigurasi Access Point standar, seluruh klien yang terhubung ke SSID yang sama berada dalam satu broadcast domain Layer 2. Hal ini berarti:\n\n- Laptop Tamu A dapat mengirim paket langsung ke Laptop Tamu B.\n- Perangkat yang terinfeksi ransomware atau worm jaringan (seperti Conficker/WannaCry) akan secara agresif memindai port SMB (port 445) milik seluruh laptop di ruangan yang sama.\n- Penyerang dapat melakukan **ARP Poisoning/Spoofing** untuk menyadap data sensitif dari tamu lain di kafe atau lobi hotel.\n\nSolusi Layer 2 paling mendasar adalah mengaktifkan fitur **AP Client Isolation** (dikenal juga sebagai Station Isolation atau Wireless Client Separation).",
          },
          {
            id: "sec-l4-code1",
            type: "code",
            language: "text",
            code: "Cara Kerja AP Client Isolation pada Access Point:\n\n1. Tanpa AP Client Isolation:\n   Client-A (192.168.50.10) -----> AP -----> Client-B (192.168.50.11)  [DIIZINKAN]\n   * Risiko: Penyerangan lateral, scan port, ARP spoofing.\n\n2. DENGAN AP Client Isolation Diaktifkan:\n   Client-A (192.168.50.10) -----> AP -x-x-> Client-B (192.168.50.11)  [DIBLOKIR L2!]\n   Client-A (192.168.50.10) -----> AP -----> Default Gateway (Router)   [DIIZINKAN!]\n   * AP secara ketat melarang penerusan frame antar-MAC asosiasi nirkabel lokal.",
          },
          {
            id: "sec-l4-callout1",
            type: "callout",
            variant: "info",
            title: "Prinsip Client Isolation: Hanya Boleh Bicara ke Gateway",
            content:
              "Ketika AP Client Isolation aktif, setiap perangkat klien berada dalam pulau logisnya sendiri. Paket hanya boleh diarahkan menuju interface router/gateway. Komunikasi peer-to-peer antar klien Wi-Fi dibuang seketika oleh firmware Access Point.",
          },
          {
            id: "sec-l4-h2",
            type: "heading",
            level: 2,
            text: "Segmentasi Total Jaringan Tamu: SSID + VLAN + ACL",
          },
          {
            id: "sec-l4-txt2",
            type: "text",
            format: "markdown",
            content:
              "Mengaktifkan AP Client Isolation saja belum cukup untuk mengamankan kantor enterprise. Jika jaringan tamu masih menggunakan subnet yang sama dengan server internal kantor, tamu masih bisa mengakses printer korporat atau server database internal melalui router!\n\nArsitektur **Guest Wi-Fi Enterprise** standar memerlukan tiga pilar:\n\n1. **Multiple SSID (Multi-SSID):** Access Point memancarkan minimal dua nama SSID, misalnya `SMK-Staff` dan `SMK-Guest`.\n2. **VLAN Tagging (802.1Q):** SSID `SMK-Staff` dipetakan ke VLAN 10 (Subnet `192.168.10.0/24`), sedangkan `SMK-Guest` dipetakan ke VLAN 50 (Subnet `192.168.50.0/24`).\n3. **Inter-VLAN Firewall / ACL:** Router dikonfigurasi dengan aturan tegas: VLAN 50 (Guest) **HANYA** diizinkan mengakses Default Gateway menuju Internet (WAN), dan **DILARANG KERAS** melakukan routing ke VLAN 10 (Staf) maupun subnet internal lainnya.",
          },
          {
            id: "sec-l4-interactive1",
            type: "interactive",
            interactiveType: "client_isolation",
            config: {
              staffVlan: 10,
              guestVlan: 50,
              isolationEnabled: true,
            },
          },
          {
            id: "sec-l4-callout2",
            type: "callout",
            variant: "tip",
            title: "Captive Portal pada Guest Wi-Fi",
            content:
              "Untuk jaringan publik, router atau controller nirkabel sering kali dilengkapi **Captive Portal**, yaitu mekanisme pengalihan browser ke halaman web syarat & ketentuan (*terms of service*) atau voucher sebelum akses internet diaktifkan.",
          },
          {
            id: "sec-l4-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-sec-l4-q1",
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
            explanation:
              "Dengan AP Client Isolation, Access Point melarang forwarding frame ethernet antar-stasiun wireless asosiasinya, sehingga klien tidak bisa saling ping atau bertukar data.",
            xpReward: 10,
          },
          {
            id: "quiz-sec-l4-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-sec-l4-q2",
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
            explanation:
              "Client Isolation hanya bekerja di Layer 2 nirkabel AP. Jika paket tamu diteruskan ke router dan router mengizinkan routing antar-subnet, tamu tetap bisa menjangkau server LAN kabel.",
            xpReward: 10,
          },
          {
            id: "quiz-sec-l4-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-sec-l4-q3",
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
            explanation:
              "Pemisahan VLAN, Client Isolation, dan ACL firewall membatasi tamu hanya bisa mengakses gateway Internet dan menutup rapat jalur menuju resource internal sekolah.",
            xpReward: 10,
          },
          {
            id: "sec-l4-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 4",
            keyPoints: [
              "Jaringan nirkabel tanpa isolasi klien rentan terhadap penyebaran malware lateral dan penyadapan ARP Poisoning antar sesama tamu.",
              "Fitur AP Client Isolation membatasi transmisi frame nirkabel sehingga klien hanya dapat berkomunikasi dengan Default Gateway.",
              "Pemisahan Guest Wi-Fi yang komprehensif memetakan Guest SSID ke VLAN khusus dengan isolasi firewall ke subnet internal kantor.",
              "Penerapan captive portal memberikan autentikasi dasar dan pembatasan bandwidth bagi tamu tanpa memberikan akses ke resource privat.",
            ],
          },
          {
            id: "sec-l4-rew",
            type: "reward",
            xp: 60,
            message:
              "Hebat! Anda telah menguasai arsitektur isolasi jaringan tamu dan segmentasi VLAN Wi-Fi.",
          },
        ],
      },
    },
  ],
};
