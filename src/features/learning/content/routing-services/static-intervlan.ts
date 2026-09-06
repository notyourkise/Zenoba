import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Rute Statis & Inter-VLAN Routing (P4-M2)
 *
 * Covers static routing mechanics, next-hop vs exit-interface,
 * default routes (0.0.0.0/0), inter-VLAN routing challenges, and Router-on-a-Stick (ROAS).
 */
export const staticIntervlanModuleData: CurriculumModule = {
  id: "module-static-intervlan",
  slug: "static-intervlan",
  title: "Rute Statis & Inter-VLAN Routing",
  description:
    "Kuasai konfigurasi rute statis manual, fungsi krusial Default Route 0.0.0.0/0, konsep perutean antar-VLAN, dan arsitektur Router-on-a-Stick (802.1Q sub-interface).",
  orderIndex: 2,
  prerequisites: ["gateway-dan-route"],
  outcomes: [
    {
      id: "RTG-M3",
      text: "Siswa dapat merancang rute statis dan default route untuk mengarahkan trafik keluar LAN secara deterministik.",
    },
    {
      id: "RTG-M4",
      text: "Siswa dapat menganalisis arsitektur Router-on-a-Stick dan mendiagnosis kegagalan komunikasi antar-VLAN pada link trunk.",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 3: static-default-routes (P4-L03)
    // =========================================================================
    {
      id: "lesson-static-default-routes",
      slug: "static-default-routes",
      title: "Konfigurasi Rute Statis & Default Route 0.0.0.0/0",
      description:
        "Memahami sintaks dan logika rute statis manual (Next-Hop IP vs Exit-Interface) serta implementasi Default Route 0.0.0.0/0 sebagai gerbang keluar menuju ISP atau Internet.",
      orderIndex: 0,
      estimatedMinutes: 14,
      xpReward: 60,
      prerequisites: ["routing-table-lookup"],
      outcomes: [
        {
          id: "RTG-L3-A",
          text: "Siswa dapat membedakan konfigurasi rute statis menggunakan Next-Hop IP vs Exit-Interface serta dampaknya terhadap pencarian ARP.",
        },
        {
          id: "RTG-L3-B",
          text: "Siswa dapat mengonfigurasi rute default 0.0.0.0/0 dan memverifikasi perannya sebagai Gateway of Last Resort.",
        },
      ],
      evidence: [
        {
          outcomeId: "RTG-L3-A",
          teachingBlockIds: ["st-l3-h1", "st-l3-txt1", "st-l3-callout1"],
          activityIds: ["st-l3-code1"],
          assessmentItemIds: ["quiz-rtg-l3-q1"],
        },
        {
          outcomeId: "RTG-L3-B",
          teachingBlockIds: ["st-l3-h2", "st-l3-txt2", "st-l3-callout2"],
          activityIds: ["st-l3-interactive1"],
          assessmentItemIds: ["quiz-rtg-l3-q2", "quiz-rtg-l3-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "st-l3-h1",
            type: "heading",
            level: 2,
            text: "Konsep Dasar Rute Statis: Next-Hop IP vs Exit-Interface",
          },
          {
            id: "st-l3-txt1",
            type: "text",
            format: "markdown",
            content:
              "Rute statis (*static route*) adalah rute yang dimasukkan secara manual oleh administrator jaringan ke dalam tabel routing router. Berbeda dengan protokol routing dinamis (seperti OSPF atau BGP) yang bertukar informasi secara otomatis, rute statis tidak membebani CPU atau bandwidth link dengan trafik broadcast/multicast.\n\nDalam konfigurasi rute statis, ada dua metode penentuan jalur keluar:\n\n1. **Next-Hop IP (Rekursif):** Administrator menentukan alamat IP router tetangga (misalnya `ip route 10.0.2.0 255.255.255.0 192.168.12.2`). Router akan melakukan *recursive lookup* untuk mencari antarmuka mana yang terhubung ke IP `192.168.12.2`.\n2. **Exit-Interface (Directly Attached):** Administrator menentukan port fisik keluar (misalnya `ip route 10.0.2.0 255.255.255.0 GigabitEthernet0/1`). Pada link Ethernet multi-akses, metode ini berbahaya jika tidak disertai Next-Hop IP karena router akan mengirim ARP broadcast untuk SETIAP host tujuan, yang dapat membanjiri tabel ARP (*ARP table bloat*).",
          },
          {
            id: "st-l3-code1",
            type: "code",
            language: "text",
            code: "Sintaks Perintah Static Route pada Router Cisco & MikroTik:\n\n1. Cisco IOS:\n   Router(config)# ip route <destination_network> <subnet_mask> <next_hop_ip>\n   Contoh:\n   Router(config)# ip route 172.16.20.0 255.255.255.0 10.0.0.2\n\n2. MikroTik RouterOS:\n   [admin@MikroTik] > /ip route add dst-address=172.16.20.0/24 gateway=10.0.0.2",
          },
          {
            id: "st-l3-callout1",
            type: "callout",
            variant: "info",
            title: "Best Practice di Industri",
            content:
              "Pada koneksi Ethernet (LAN/WAN switch), gunakan selalu kombinasi Next-Hop IP atau Fully Specified Static Route (Exit-Interface + Next-Hop IP) agar router tidak memboroskan memori tabel ARP.",
          },
          {
            id: "st-l3-h2",
            type: "heading",
            level: 2,
            text: "Default Route (0.0.0.0/0) & Gateway of Last Resort",
          },
          {
            id: "st-l3-txt2",
            type: "text",
            format: "markdown",
            content:
              "Mustahil bagi router kantor cabang atau sekolah untuk mencatat miliaran alamat IP publik yang ada di seluruh dunia ke dalam tabel routing. Sebagai solusinya, kita menggunakan **Default Route** (sering disebut *Gateway of Last Resort*).\n\nDefault Route direpresentasikan dengan network destination `0.0.0.0` dan subnet mask `0.0.0.0` (notasi CIDR: `0.0.0.0/0`):\n\n```text\nip route 0.0.0.0 0.0.0.0 <IP_Gateway_ISP>\n```\n\nKarena subnet mask `/0` mencakup 0 bit yang harus dicocokkan, rute ini **cocok dengan IP tujuan mana pun di alam semesta**! Sesuai prinsip Longest Prefix Match, rute ini hanya akan dipilih jika tidak ada rute internal yang lebih spesifik (/24, /16, atau /8) di tabel routing.",
          },
          {
            id: "st-l3-interactive1",
            type: "interactive",
            interactiveType: "routing_table",
            config: {},
          },
          {
            id: "st-l3-callout2",
            type: "callout",
            variant: "warning",
            title: "Routing Loop Jika Default Route Salah",
            content:
              "Jika Router A memiliki default route menuju Router B, dan Router B salah mengonfigurasi default route kembali ke Router A, paket data yang tujuannya tidak valid akan dipantulkan bolak-balik sampai nilai Time to Live (TTL) habis menjadi 0.",
          },
          {
            id: "st-l3-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l3-q1",
            question: "Mengapa menggunakan hanya Exit-Interface pada media Ethernet multi-akses untuk rute statis dianggap tidak efisien?",
            options: [
              { id: "opt-a", text: "Karena router menganggap semua host tujuan terhubung langsung dan mengirimkan ARP request untuk setiap IP tujuan" },
              { id: "opt-b", text: "Karena router menolak menyalakan port GigabitEthernet" },
              { id: "opt-c", text: "Karena enkripsi paket otomatis aktif sehingga memperlambat throughput" },
              { id: "opt-d", text: "Karena subnet mask otomatis berubah menjadi /32" },
            ],
            explanation:
              "Pada Ethernet multi-akses, rute yang hanya menunjuk exit-interface memaksa router melakukan ARP broadcast ke setiap IP tujuan individual, memenuhi memori ARP cache router.",
            xpReward: 10,
          },
          {
            id: "st-l3-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l3-q2",
            question: "Apa notasi CIDR dan subnet mask dari sebuah Default Route (Gateway of Last Resort)?",
            options: [
              { id: "opt-a", text: "0.0.0.0/0 (Netmask: 0.0.0.0)" },
              { id: "opt-b", text: "255.255.255.255/32 (Netmask: 255.255.255.255)" },
              { id: "opt-c", text: "127.0.0.1/8 (Netmask: 255.0.0.0)" },
              { id: "opt-d", text: "192.168.1.0/24 (Netmask: 255.255.255.0)" },
            ],
            explanation:
              "Default route direpresentasikan dengan alamat 0.0.0.0/0 (netmask 0.0.0.0), yang artinya mencocokkan sembarang alamat IP jika tidak ada rute spesifik.",
            xpReward: 10,
          },
          {
            id: "st-l3-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l3-q3",
            question: "Perintah Cisco manakah yang benar untuk mengarahkan seluruh trafik Internet yang tidak terdaftar ke router ISP di IP 203.0.113.1?",
            options: [
              { id: "opt-a", text: "ip route 0.0.0.0 0.0.0.0 203.0.113.1" },
              { id: "opt-b", text: "ip default-network 203.0.113.1 255.255.255.255" },
              { id: "opt-c", text: "router ospf 1 network 0.0.0.0" },
              { id: "opt-d", text: "ip route 255.255.255.255 0.0.0.0 203.0.113.1" },
            ],
            explanation:
              "Sintaks standar rute default statis adalah 'ip route 0.0.0.0 0.0.0.0 <next_hop_ip>'.",
            xpReward: 10,
          },
          {
            id: "st-l3-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 3",
            keyPoints: [
              "Rute statis dikonfigurasi secara manual oleh administrator tanpa overhead protokol routing dinamis.",
              "Konfigurasi Next-Hop IP melakukan recursive lookup, sedangkan Exit-Interface langsung mengarahkan frame ke interface fisik.",
              "Default Route 0.0.0.0/0 mencocokkan seluruh alamat tujuan dan bertindak sebagai Gateway of Last Resort menuju ISP/Internet.",
              "Rute default memiliki nilai prefix terendah (/0), sehingga hanya aktif ketika rute spesifik internal tidak ditemukan.",
            ],
          },
          {
            id: "st-l3-rew",
            type: "reward",
            xp: 60,
            message: "Hebat! Anda telah menguasai logika rute statis dan default route 0.0.0.0/0.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 4: inter-vlan-routing (P4-L04)
    // =========================================================================
    {
      id: "lesson-inter-vlan-routing",
      slug: "inter-vlan-routing",
      title: "Inter-VLAN Routing & Router-on-a-Stick",
      description:
        "Mempelajari bagaimana router menghubungkan VLAN yang terisolasi di Layer 2 melalui metode Router-on-a-Stick (sub-interface 802.1Q) dan Switch Layer 3 (SVI).",
      orderIndex: 1,
      estimatedMinutes: 16,
      xpReward: 70,
      prerequisites: ["static-default-routes"],
      outcomes: [
        {
          id: "RTG-L4-A",
          text: "Siswa dapat menjelaskan perlunya perutean Layer 3 untuk menghubungkan VLAN yang berbeda subnet.",
        },
        {
          id: "RTG-L4-B",
          text: "Siswa dapat menelusuri alur enkapsulasi 802.1Q pada sub-interface router dalam arsitektur Router-on-a-Stick.",
        },
      ],
      evidence: [
        {
          outcomeId: "RTG-L4-A",
          teachingBlockIds: ["st-l4-h1", "st-l4-txt1", "st-l4-callout1"],
          activityIds: ["st-l4-code1"],
          assessmentItemIds: ["quiz-rtg-l4-q1"],
        },
        {
          outcomeId: "RTG-L4-B",
          teachingBlockIds: ["st-l4-h2", "st-l4-txt2", "st-l4-callout2"],
          activityIds: ["st-l4-interactive1"],
          assessmentItemIds: ["quiz-rtg-l4-q2", "quiz-rtg-l4-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "st-l4-h1",
            type: "heading",
            level: 2,
            text: "Mengapa VLAN Membutuhkan Router untuk Saling Berkomunikasi?",
          },
          {
            id: "st-l4-txt1",
            type: "text",
            format: "markdown",
            content:
              "Sebagaimana dipelajari pada modul Switching & LAN, VLAN memisahkan satu switch fisik menjadi beberapa *broadcast domain* logis yang terisolasi secara mutlak di Layer 2. Host di VLAN 10 (`192.168.10.0/24`) tidak akan pernah bisa menerima broadcast dari host di VLAN 20 (`192.168.20.0/24`).\n\nUntuk menghubungkan dua subnet yang berbeda tersebut, dibutuhkan perangkat **Layer 3 (Network Layer)** yang memiliki tabel routing. Proses meneruskan paket dari satu VLAN ke VLAN lain disebut **Inter-VLAN Routing**.\n\nTerdapat tiga metode utama Inter-VLAN Routing:\n1. **Legacy Inter-VLAN Routing:** Satu kabel fisik dari router untuk setiap VLAN yang ada di switch (sangat boros port).\n2. **Router-on-a-Stick (ROAS):** Menggunakan SATU kabel fisik trunk antara switch dan router, di mana router membagi port fisiknya menjadi beberapa *sub-interface* logis.\n3. **Multilayer Switch (Switch Layer 3):** Menggunakan antarmuka virtual internal bernama SVI (*Switched Virtual Interface*) dengan kecepatan *wire-speed* ASIC.",
          },
          {
            id: "st-l4-code1",
            type: "code",
            language: "text",
            code: "Konfigurasi Router-on-a-Stick (ROAS) pada Router Cisco:\n\n1. Aktifkan interface fisik utama (tanpa alamat IP):\n   Router(config)# interface GigabitEthernet0/0\n   Router(config-if)# no ip address\n   Router(config-if)# no shutdown\n\n2. Buat Sub-Interface untuk VLAN 10:\n   Router(config)# interface GigabitEthernet0/0.10\n   Router(config-subif)# encapsulation dot1Q 10\n   Router(config-subif)# ip address 192.168.10.1 255.255.255.0\n\n3. Buat Sub-Interface untuk VLAN 20:\n   Router(config)# interface GigabitEthernet0/0.20\n   Router(config-subif)# encapsulation dot1Q 20\n   Router(config-subif)# ip address 192.168.20.1 255.255.255.0",
          },
          {
            id: "st-l4-callout1",
            type: "callout",
            variant: "info",
            title: "Penting: Switch Port Harus Menjadi Trunk",
            content:
              "Port switch yang terhubung langsung ke router pada arsitektur Router-on-a-Stick WAJIB dikonfigurasi sebagai port TRUNK (`switchport mode trunk`), bukan access port, agar frame yang membawa tag 802.1Q dapat melintas.",
          },
          {
            id: "st-l4-h2",
            type: "heading",
            level: 2,
            text: "Alur Perjalanan Paket Inter-VLAN (Trunk Tagging 802.1Q)",
          },
          {
            id: "st-l4-txt2",
            type: "text",
            format: "markdown",
            content:
              "Mari kita telusuri apa yang terjadi ketika PC Staff di VLAN 10 mengirim data ke Server Guru di VLAN 20 via Router-on-a-Stick:\n\n1. **PC Staff** menyadari IP server berbeda subnet. PC Staff membungkus frame ke MAC Gateway (`00:AA...` milik `Gig0/0.10`).\n2. **Switch** menerima frame di access port VLAN 10, lalu menambahkan **Tag 802.1Q (VLAN ID 10)** sebelum mengirimkannya lewat link trunk ke router.\n3. **Router** menerima frame bertag VLAN 10 pada port fisik `Gig0/0`, lalu menyerahkannya ke sub-interface `Gig0/0.10`. Router melepas tag 802.1Q dan memeriksa IP header tujuan Layer 3.\n4. Router melihat tujuan adalah subnet `192.168.20.0/24` yang terpasang pada sub-interface `Gig0/0.20`.\n5. Router membuat frame baru, membubuhkan **Tag 802.1Q (VLAN ID 20)**, dan mengirimkannya kembali menuruni kabel fisik yang sama ke switch!\n6. Switch menerima frame ber-tag 20, melepas tag tersebut, dan mengirimkan frame murni ke port access Server Guru.",
          },
          {
            id: "st-l4-interactive1",
            type: "interactive",
            interactiveType: "routing_table",
            config: {},
          },
          {
            id: "st-l4-callout2",
            type: "callout",
            variant: "warning",
            title: "Bottleneck Satu Kabel (Stick)",
            content:
              "Kelemahan utama arsitektur Router-on-a-Stick adalah semua trafik antar-VLAN harus bolak-balik melintasi satu kabel trunk fisik yang sama. Pada jaringan perusahaan berskala besar, Switch Layer 3 lebih disukai karena proses perutean terjadi langsung di hardware switch tanpa membebani satu kabel tunggal.",
          },
          {
            id: "st-l4-q1",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l4-q1",
            question: "Mengapa switch Layer 2 murni tidak mampu meneruskan frame antara VLAN 10 dan VLAN 20 secara langsung?",
            options: [
              { id: "opt-a", text: "Karena masing-masing VLAN membentuk broadcast domain terisolasi dan switch Layer 2 tidak memiliki mesin perutean Layer 3" },
              { id: "opt-b", text: "Karena kabel LAN tidak mendukung pengiriman dua frekuensi listrik berbeda" },
              { id: "opt-c", text: "Karena alamat MAC kedua VLAN selalu bertabrakan di tabel CAM switch" },
              { id: "opt-d", text: "Karena switch Layer 2 hanya dapat menampung maksimal satu VLAN" },
            ],
            explanation:
              "VLAN memisahkan broadcast domain di Layer 2; switch murni tidak membaca header IP Layer 3 sehingga komunikasi antar-subnet membutuhkan router Layer 3.",
            xpReward: 10,
          },
          {
            id: "st-l4-q2",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l4-q2",
            question: "Pada arsitektur Router-on-a-Stick, perintah apakah yang wajib diberikan pada sub-interface router agar router mengenali nomor VLAN dari frame yang masuk?",
            options: [
              { id: "opt-a", text: "encapsulation dot1Q <vlan_id>" },
              { id: "opt-b", text: "switchport mode trunk" },
              { id: "opt-c", text: "vlan create <vlan_id>" },
              { id: "opt-d", text: "ip vlan-forwarding enable" },
            ],
            explanation:
              "Perintah 'encapsulation dot1Q <vlan_id>' memerintahkan sub-interface router untuk memproses frame ber-tag standar IEEE 802.1Q dengan VLAN ID tertentu.",
            xpReward: 10,
          },
          {
            id: "st-l4-q3",
            type: "quiz",
            quizType: "single_choice",
            quizId: "quiz-rtg-l4-q3",
            question: "Apa mode port switch yang terhubung langsung ke router yang menjalankan metode Router-on-a-Stick?",
            options: [
              { id: "opt-a", text: "Trunk" },
              { id: "opt-b", text: "Access" },
              { id: "opt-c", text: "Dynamic Auto" },
              { id: "opt-d", text: "Loopback" },
            ],
            explanation:
              "Port switch harus berada dalam mode Trunk agar dapat membawa frame bertag beberapa VLAN sekaligus menuju interface router.",
            xpReward: 10,
          },
          {
            id: "st-l4-sum",
            type: "summary",
            title: "Rangkuman Pelajaran 4",
            keyPoints: [
              "Inter-VLAN routing adalah proses mengalirkan trafik antar-VLAN yang terpisah menggunakan perangkat perutean Layer 3.",
              "Router-on-a-Stick (ROAS) memanfaatkan sub-interface logis pada satu interface fisik router yang dihubungkan ke port trunk switch.",
              "Perintah 'encapsulation dot1Q <vlan_id>' memetakan sub-interface ke tag VLAN yang bersesuaian.",
              "Switch Layer 3 menggunakan Switched Virtual Interface (SVI) untuk performa lebih tinggi tanpa bottleneck satu kabel fisik.",
            ],
          },
          {
            id: "st-l4-rew",
            type: "reward",
            xp: 70,
            message: "Luar biasa! Anda telah menguasai Inter-VLAN Routing dan arsitektur Router-on-a-Stick.",
          },
        ],
      },
    },
  ],
};
