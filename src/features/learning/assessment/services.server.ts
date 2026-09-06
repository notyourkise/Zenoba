/**
 * SERVER-ONLY ASSESSMENT DEFINITIONS FOR ROUTING & NETWORK SERVICES (P4-M1 s.d. P4-M5)
 *
 * CRITICAL SECURITY BOUNDARY:
 * This file contains confidential question keys, correct answers, and grading rubrics.
 * It must NEVER be imported into client components or client bundles.
 */

import type { PrivateQuizQuestion } from "./welcome.server";

export const servicesFormativeQuestions: PrivateQuizQuestion[] = [
  // =========================================================================
  // Module 1: Konsep Routing & Default Gateway (P4-M1)
  // =========================================================================

  // Lesson 1: default-gateway (P4-L01)
  {
    id: "quiz-rtg-l1-q1",
    lessonSlug: "default-gateway",
    outcomeId: "RTG-L1-A",
    question: "Sebuah PC memiliki IP 10.0.1.15/24. Kapan PC tersebut akan mengirimkan paket ke Default Gateway?",
    options: [
      { id: "opt-a", text: "Saat mengirim data ke host 10.0.1.20" },
      { id: "opt-b", text: "Saat mengirim data ke host 10.0.2.15" },
      { id: "opt-c", text: "Saat melakukan ping ke IP loopback 127.0.0.1" },
      { id: "opt-d", text: "Setiap kali komputer mengirim data apa pun" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "IP 10.0.2.15 berada di subnet 10.0.2.0/24 yang berbeda dengan subnet lokal PC (10.0.1.0/24). Oleh karena itu, paket wajib diteruskan ke Default Gateway.",
    misconceptionFeedback:
      "Jika tujuan berada dalam subnet yang sama (seperti 10.0.1.20), host cukup mengirimkan ARP langsung ke host tujuan tanpa melibatkan Default Gateway.",
  },
  {
    id: "quiz-rtg-l1-q2",
    lessonSlug: "default-gateway",
    outcomeId: "RTG-L1-A",
    question: "Saat PC mengirimkan paket ke server web di Internet melalui router gateway, informasi apakah yang tercantum pada Destination MAC address frame Ethernet pertama?",
    options: [
      { id: "opt-a", text: "MAC address dari server web tujuan" },
      { id: "opt-b", text: "MAC address dari antarmuka router Default Gateway" },
      { id: "opt-c", text: "Broadcast MAC address (FF:FF:FF:FF:FF:FF)" },
      { id: "opt-d", text: "MAC address dari switch access LAN" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Di link LAN lokal pengirim, Destination MAC diisi dengan MAC address milik interface router Default Gateway, sedangkan Destination IP tetap berisi IP server web tujuan.",
    misconceptionFeedback:
      "Host tidak bisa mengetahui MAC address server di internet karena ARP broadcast tidak pernah melintasi router. Destination MAC frame lokal harus diarahkan ke router gateway.",
  },
  {
    id: "quiz-rtg-l1-q3",
    lessonSlug: "default-gateway",
    outcomeId: "RTG-L1-B",
    question: "Apa akibatnya jika adapter jaringan PC salah dikonfigurasi dengan IP Default Gateway yang tidak ada / mati?",
    options: [
      { id: "opt-a", text: "PC tidak dapat berkomunikasi dengan PC lain di subnet lokal yang sama" },
      { id: "opt-b", text: "PC tetap bisa berkomunikasi lokal, namun gagal terhubung ke subnet lain atau Internet" },
      { id: "opt-c", text: "Kartu jaringan PC otomatis dinonaktifkan oleh Windows/Linux" },
      { id: "opt-d", text: "PC otomatis berganti ke alamat IP 127.0.0.1" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Komunikasi dalam subnet lokal (LAN yang sama) hanya membutuhkan Layer 2 switch dan ARP langsung antar-host. Namun kegagalan gateway membuat seluruh paket tujuan luar subnet terhenti.",
    misconceptionFeedback:
      "Kesalahan gateway tidak merusak komunikasi lokal intra-LAN karena transfer data sesama subnet tidak melewati router sama sekali.",
  },

  // Lesson 2: routing-table-lookup (P4-L02)
  {
    id: "quiz-rtg-l2-q1",
    lessonSlug: "routing-table-lookup",
    outcomeId: "RTG-L2-A",
    question: "Manakah kolom pada tabel routing yang menentukan alamat IP dari perangkat hop berikutnya tempat paket harus diserahkan?",
    options: [
      { id: "opt-a", text: "Destination Network" },
      { id: "opt-b", text: "Netmask" },
      { id: "opt-c", text: "Next-Hop / Gateway" },
      { id: "opt-d", text: "Metric" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Kolom Next-Hop (Gateway) mencatat alamat IP router tetangga terdekat yang bertugas menerima dan melanjutkan paket tersebut.",
    misconceptionFeedback:
      "Destination Network adalah alamat jaringan tujuan akhir paket, sedangkan Next-Hop adalah router perantara terdekat yang menerima paket selanjutnya.",
  },
  {
    id: "quiz-rtg-l2-q2",
    lessonSlug: "routing-table-lookup",
    outcomeId: "RTG-L2-B",
    question: "Jika sebuah router menerima paket menuju 172.16.5.10 dan memiliki rute 172.16.0.0/16 (via R-A) serta 172.16.5.0/24 (via R-B), rute manakah yang akan dipilih router?",
    options: [
      { id: "opt-a", text: "172.16.0.0/16 via R-A karena cakupan IP-nya lebih luas" },
      { id: "opt-b", text: "172.16.5.0/24 via R-B sesuai prinsip Longest Prefix Match" },
      { id: "opt-c", text: "Router membagi trafik 50:50 secara acak ke kedua router" },
      { id: "opt-d", text: "Paket dibatalkan karena terjadi duplikasi rute" },
    ],
    correctAnswer: "opt-b",
    explanation:
      "Berdasarkan algoritma Longest Prefix Match (LPM), router memilih rute dengan prefix terpanjang (/24 lebih panjang dan lebih spesifik daripada /16).",
    misconceptionFeedback:
      "Router tidak memilih rute berdasarkan luas jangkauan (/16), melainkan memilih rute paling spesifik dan paling akurat (prefix terpanjang /24).",
  },
  {
    id: "quiz-rtg-l2-q3",
    lessonSlug: "routing-table-lookup",
    outcomeId: "RTG-L2-B",
    question: "Apa arti rute tujuan 0.0.0.0 dengan netmask 0.0.0.0 (0.0.0.0/0) pada tabel routing?",
    options: [
      { id: "opt-a", text: "Rute yang memblokir seluruh paket data asing" },
      { id: "opt-b", text: "Rute khusus menuju server lokal router itu sendiri" },
      { id: "opt-c", text: "Default Route (Gateway of Last Resort) untuk paket yang tujuannya tidak terdaftar pada rute spesifik" },
      { id: "opt-d", text: "Rute yang digunakan router untuk mengirim pesan broadcast" },
    ],
    correctAnswer: "opt-c",
    explanation:
      "Rute 0.0.0.0/0 adalah Default Route yang mencocokkan alamat IP mana pun jika tidak ditemukan rute yang lebih spesifik dalam tabel routing.",
    misconceptionFeedback:
      "Rute 0.0.0.0/0 bukan pemblokir trafik, melainkan rute sapu jagat (catch-all) yang meneruskan paket tak dikenal ke router hulu (ISP).",
  },

  // =========================================================================
  // Module 2: Rute Statis & Inter-VLAN Routing (P4-M2)
  // =========================================================================

  // Lesson 3: static-default-routes (P4-L03)
  {
    id: "quiz-rtg-l3-q1",
    lessonSlug: "static-default-routes",
    outcomeId: "RTG-L3-A",
    question: "Mengapa menggunakan hanya Exit-Interface pada media Ethernet multi-akses untuk rute statis dianggap tidak efisien?",
    options: [
      { id: "opt-a", text: "Karena router menganggap semua host tujuan terhubung langsung dan mengirimkan ARP request untuk setiap IP tujuan" },
      { id: "opt-b", text: "Karena router menolak menyalakan port GigabitEthernet" },
      { id: "opt-c", text: "Karena enkripsi paket otomatis aktif sehingga memperlambat throughput" },
      { id: "opt-d", text: "Karena subnet mask otomatis berubah menjadi /32" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Pada Ethernet multi-akses, rute yang hanya menunjuk exit-interface memaksa router melakukan ARP broadcast ke setiap IP tujuan individual, memenuhi memori ARP cache router.",
    misconceptionFeedback:
      "Exit-interface pada media broadcast (Ethernet) memicu router berasumsi setiap IP remote adalah tetangga satu link, sehingga memicu ARP storm dan memboroskan tabel ARP.",
  },
  {
    id: "quiz-rtg-l3-q2",
    lessonSlug: "static-default-routes",
    outcomeId: "RTG-L3-B",
    question: "Apa notasi CIDR dan subnet mask dari sebuah Default Route (Gateway of Last Resort)?",
    options: [
      { id: "opt-a", text: "0.0.0.0/0 (Netmask: 0.0.0.0)" },
      { id: "opt-b", text: "255.255.255.255/32 (Netmask: 255.255.255.255)" },
      { id: "opt-c", text: "127.0.0.1/8 (Netmask: 255.0.0.0)" },
      { id: "opt-d", text: "192.168.1.0/24 (Netmask: 255.255.255.0)" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Default route direpresentasikan dengan alamat 0.0.0.0/0 (netmask 0.0.0.0), yang artinya mencocokkan sembarang alamat IP jika tidak ada rute spesifik.",
    misconceptionFeedback:
      "Jangan tertukar dengan 255.255.255.255/32 yang merupakan host route spesifik tunggal. Default route selalu 0.0.0.0/0.",
  },
  {
    id: "quiz-rtg-l3-q3",
    lessonSlug: "static-default-routes",
    outcomeId: "RTG-L3-B",
    question: "Perintah Cisco manakah yang benar untuk mengarahkan seluruh trafik Internet yang tidak terdaftar ke router ISP di IP 203.0.113.1?",
    options: [
      { id: "opt-a", text: "ip route 0.0.0.0 0.0.0.0 203.0.113.1" },
      { id: "opt-b", text: "ip default-network 203.0.113.1 255.255.255.255" },
      { id: "opt-c", text: "router ospf 1 network 0.0.0.0" },
      { id: "opt-d", text: "ip route 255.255.255.255 0.0.0.0 203.0.113.1" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Sintaks standar rute default statis adalah 'ip route 0.0.0.0 0.0.0.0 <next_hop_ip>'.",
    misconceptionFeedback:
      "Format perintah static route Cisco IOS adalah 'ip route <network> <mask> <next_hop>', sehingga default route adalah 'ip route 0.0.0.0 0.0.0.0 203.0.113.1'.",
  },

  // Lesson 4: inter-vlan-routing (P4-L04)
  {
    id: "quiz-rtg-l4-q1",
    lessonSlug: "inter-vlan-routing",
    outcomeId: "RTG-L4-A",
    question: "Mengapa switch Layer 2 murni tidak mampu meneruskan frame antara VLAN 10 dan VLAN 20 secara langsung?",
    options: [
      { id: "opt-a", text: "Karena masing-masing VLAN membentuk broadcast domain terisolasi dan switch Layer 2 tidak memiliki mesin perutean Layer 3" },
      { id: "opt-b", text: "Karena kabel LAN tidak mendukung pengiriman dua frekuensi listrik berbeda" },
      { id: "opt-c", text: "Karena alamat MAC kedua VLAN selalu bertabrakan di tabel CAM switch" },
      { id: "opt-d", text: "Karena switch Layer 2 hanya dapat menampung maksimal satu VLAN" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "VLAN memisahkan broadcast domain di Layer 2; switch murni tidak membaca header IP Layer 3 sehingga komunikasi antar-subnet membutuhkan router Layer 3.",
    misconceptionFeedback:
      "Isolasi antar-VLAN adalah fitur keamanan dan segmentasi dasar Layer 2; switch Layer 2 tidak membaca IP tujuan sehingga tidak bisa merutekan paket antar-VLAN.",
  },
  {
    id: "quiz-rtg-l4-q2",
    lessonSlug: "inter-vlan-routing",
    outcomeId: "RTG-L4-B",
    question: "Pada arsitektur Router-on-a-Stick, perintah apakah yang wajib diberikan pada sub-interface router agar router mengenali nomor VLAN dari frame yang masuk?",
    options: [
      { id: "opt-a", text: "encapsulation dot1Q <vlan_id>" },
      { id: "opt-b", text: "switchport mode trunk" },
      { id: "opt-c", text: "vlan create <vlan_id>" },
      { id: "opt-d", text: "ip vlan-forwarding enable" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Perintah 'encapsulation dot1Q <vlan_id>' memerintahkan sub-interface router untuk memproses frame ber-tag standar IEEE 802.1Q dengan VLAN ID tertentu.",
    misconceptionFeedback:
      "'switchport mode trunk' adalah perintah pada switch, bukan pada router. Pada router Cisco, sub-interface menggunakan perintah 'encapsulation dot1Q <vlan_id>'.",
  },
  {
    id: "quiz-rtg-l4-q3",
    lessonSlug: "inter-vlan-routing",
    outcomeId: "RTG-L4-B",
    question: "Apa mode port switch yang terhubung langsung ke router yang menjalankan metode Router-on-a-Stick?",
    options: [
      { id: "opt-a", text: "Trunk" },
      { id: "opt-b", text: "Access" },
      { id: "opt-c", text: "Dynamic Auto" },
      { id: "opt-d", text: "Loopback" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Port switch harus berada dalam mode Trunk agar dapat membawa frame bertag beberapa VLAN sekaligus menuju interface router.",
    misconceptionFeedback:
      "Port access hanya membawa satu VLAN tanpa tag. Link menuju router Router-on-a-Stick harus berupa Trunk agar tag 802.1Q dari setiap VLAN terbawa ke router.",
  },

  // =========================================================================
  // Module 3: Layanan Otomatisasi IP & Resolusi Domain (P4-M3)
  // =========================================================================

  // Lesson 5: dhcp-dora-process (P4-L05)
  {
    id: "quiz-srv-l1-q1",
    lessonSlug: "dhcp-dora-process",
    outcomeId: "SRV-L1-A",
    question: "Manakah urutan kronologis yang benar dari 4 tahap pertukaran pesan DHCP (DORA)?",
    options: [
      { id: "opt-a", text: "Discover -> Offer -> Request -> Acknowledge" },
      { id: "opt-b", text: "Demand -> Offer -> Receive -> Accept" },
      { id: "opt-c", text: "Discover -> Request -> Offer -> Acknowledge" },
      { id: "opt-d", text: "Dial -> Open -> Ready -> Active" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Siklus DHCP disingkat DORA: Discover (klien mencari), Offer (server menawar), Request (klien meminta), Acknowledge (server menyetujui).",
    misconceptionFeedback:
      "Urutan DORA adalah Discover -> Offer -> Request -> Acknowledge. Server harus menawarkan (Offer) terlebih dahulu sebelum klien meminta (Request) IP tersebut.",
  },
  {
    id: "quiz-srv-l1-q2",
    lessonSlug: "dhcp-dora-process",
    outcomeId: "SRV-L1-A",
    question: "Protokol transport dan nomor port apakah yang digunakan oleh DHCP Server dan DHCP Client?",
    options: [
      { id: "opt-a", text: "UDP port 67 (Server) dan UDP port 68 (Client)" },
      { id: "opt-b", text: "TCP port 80 (Server) dan TCP port 443 (Client)" },
      { id: "opt-c", text: "UDP port 53 (Server) dan UDP port 53 (Client)" },
      { id: "opt-d", text: "TCP port 21 (Server) dan TCP port 20 (Client)" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "DHCP beroperasi di Layer Transport menggunakan UDP port 67 untuk server dan port 68 untuk klien.",
    misconceptionFeedback:
      "Port 53 adalah DNS. DHCP secara khusus menggunakan pasangan UDP port 67 (Server) dan UDP port 68 (Client).",
  },
  {
    id: "quiz-srv-l1-q3",
    lessonSlug: "dhcp-dora-process",
    outcomeId: "SRV-L1-B",
    question: "Ketika laptop siswa dihidupkan, ia mendapatkan alamat IP 169.254.45.88 dan tidak dapat browsing. Apa yang sebenarnya terjadi?",
    options: [
      { id: "opt-a", text: "Laptop gagal menghubungi DHCP Server sehingga Windows memberikan alamat otomatis APIPA" },
      { id: "opt-b", text: "DHCP Server telah berhasil memberikan alamat IP publik global" },
      { id: "opt-c", text: "Kartu jaringan laptop terbakar secara fisik" },
      { id: "opt-d", text: "Router telah mengaktifkan enkripsi VPN IPsec" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Alamat 169.254.x.x adalah APIPA (Automatic Private IP Addressing) yang aktif saat klien gagal menerima respons DHCP Offer dari server.",
    misconceptionFeedback:
      "Alamat 169.254.x.x bukan alamat normal dari server, melainkan mekanisme fallback sistem operasi saat server DHCP tidak merespons broadcast klien.",
  },

  // Lesson 6: dns-query-resolution (P4-L06)
  {
    id: "quiz-srv-l2-q1",
    lessonSlug: "dns-query-resolution",
    outcomeId: "SRV-L2-A",
    question: "Manakah server DNS yang memegang basis data zona asli dan berhak memberikan jawaban pasti atas record dari sebuah domain?",
    options: [
      { id: "opt-a", text: "Authoritative Name Server" },
      { id: "opt-b", text: "Recursive Resolver" },
      { id: "opt-c", text: "Root Name Server" },
      { id: "opt-d", text: "Proxy Server" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Authoritative Name Server adalah server resmi yang menyimpan konfigurasi zona domain aktual dan memberikan respon final definitif atas domain tersebut.",
    misconceptionFeedback:
      "Recursive resolver hanya meneruskan pertanyaan dan menyimpan cache sementara. Pemegang sah rekaman domain asli adalah Authoritative Name Server.",
  },
  {
    id: "quiz-srv-l2-q2",
    lessonSlug: "dns-query-resolution",
    outcomeId: "SRV-L2-A",
    question: "Manakah tingkatan Top-Level Domain (TLD) pada alamat domain sekolah 'smkn1jakarta.sch.id'?",
    options: [
      { id: "opt-a", text: ".id" },
      { id: "opt-b", text: "sch.id" },
      { id: "opt-c", text: "smkn1jakarta" },
      { id: "opt-d", text: "www" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Puncak domain setelah tanda titik paling kanan adalah TLD (.id adalah Country Code Top-Level Domain untuk Indonesia).",
    misconceptionFeedback:
      "'sch.id' adalah Second-Level Domain (SLD) di bawah TLD .id. TLD murninya adalah bagian paling kanan yaitu '.id'.",
  },
  {
    id: "quiz-srv-l2-q3",
    lessonSlug: "dns-query-resolution",
    outcomeId: "SRV-L2-B",
    question: "Tipe resource record DNS apakah yang digunakan untuk memetakan nama domain ke alamat IPv4 32-bit?",
    options: [
      { id: "opt-a", text: "A Record" },
      { id: "opt-b", text: "AAAA Record" },
      { id: "opt-c", text: "CNAME Record" },
      { id: "opt-d", text: "MX Record" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "A Record (Address Record) memetakan nama host ke alamat IPv4, sedangkan AAAA memetakan ke IPv6.",
    misconceptionFeedback:
      "AAAA record adalah untuk IPv6 128-bit. Untuk memetakan nama ke alamat standar IPv4 32-bit, record yang digunakan adalah A Record.",
  },

  // =========================================================================
  // Module 4: Translasi Alamat Jaringan (NAT & PAT) (P4-M4)
  // =========================================================================

  // Lesson 7: nat-static-dynamic (P4-L07)
  {
    id: "quiz-nat-l1-q1",
    lessonSlug: "nat-static-dynamic",
    outcomeId: "NAT-L1-A",
    question: "Alamat apakah yang dimaksud dengan 'Inside Local' dalam konsep translasi NAT?",
    options: [
      { id: "opt-a", text: "Alamat IP privat yang terpasang pada host di dalam jaringan internal lokal" },
      { id: "opt-b", text: "Alamat IP publik yang diberikan oleh ISP pada interface WAN" },
      { id: "opt-c", text: "Alamat MAC fisik kartu jaringan router" },
      { id: "opt-d", text: "Alamat IP server web remote di Internet" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Inside Local adalah alamat IP aktual (biasanya alamat privat RFC 1918) yang dikonfigurasikan pada host di dalam jaringan internal.",
    misconceptionFeedback:
      "Inside Global adalah alamat publik router yang dilihat dunia luar, sedangkan Inside Local adalah IP privat perangkat di dalam jaringan lokal.",
  },
  {
    id: "quiz-nat-l1-q2",
    lessonSlug: "nat-static-dynamic",
    outcomeId: "NAT-L1-A",
    question: "Manakah dari alamat IPv4 berikut ini yang termasuk alamat IP Privat RFC 1918 yang TIDAK dapat dirutekan langsung di Internet publik?",
    options: [
      { id: "opt-a", text: "192.168.50.1" },
      { id: "opt-b", text: "8.8.8.8" },
      { id: "opt-c", text: "1.1.1.1" },
      { id: "opt-d", text: "203.0.113.25" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "192.168.0.0/16 adalah salah satu blok IP privat RFC 1918 (bersama 10.0.0.0/8 dan 172.16.0.0/12) yang wajib ditranslasikan oleh NAT untuk mengakses internet.",
    misconceptionFeedback:
      "8.8.8.8 dan 1.1.1.1 adalah IP publik global. Blok 192.168.x.x adalah alamat privat internal yang memerlukan NAT untuk keluar.",
  },
  {
    id: "quiz-nat-l1-q3",
    lessonSlug: "nat-static-dynamic",
    outcomeId: "NAT-L1-B",
    question: "Perintah Cisco manakah yang tepat untuk mengonfigurasi Static NAT satu-ke-satu antara Web Server internal 192.168.1.100 dan IP publik 203.0.113.10?",
    options: [
      { id: "opt-a", text: "ip nat inside source static 192.168.1.100 203.0.113.10" },
      { id: "opt-b", text: "ip route 192.168.1.100 255.255.255.255 203.0.113.10" },
      { id: "opt-c", text: "ip nat pool STATIC 192.168.1.100 203.0.113.10" },
      { id: "opt-d", text: "nat enable 192.168.1.100 to 203.0.113.10" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Sintaks resmi Cisco IOS untuk Static NAT adalah 'ip nat inside source static <inside_local_ip> <inside_global_ip>'.",
    misconceptionFeedback:
      "Static NAT dikonfigurasi dengan kata kunci 'source static' diikuti oleh IP internal lokal kemudian IP publik global yang dituju.",
  },

  // Lesson 8: pat-port-address-translation (P4-L08)
  {
    id: "quiz-nat-l2-q1",
    lessonSlug: "pat-port-address-translation",
    outcomeId: "NAT-L2-A",
    question: "Komponen Layer 4 apakah yang dimanfaatkan oleh Port Address Translation (PAT) untuk membedakan trafik dari ratusan host internal yang memakai satu IP publik yang sama?",
    options: [
      { id: "opt-a", text: "Nomor Port Sumber (Source Port Number) Layer 4 (TCP/UDP)" },
      { id: "opt-b", text: "Alamat MAC kartu jaringan" },
      { id: "opt-c", text: "Nilai Time to Live (TTL)" },
      { id: "opt-d", text: "Panjang kabel UTP" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "PAT memetakan kombinasi Inside Local IP dan Source Port unik ke satu Inside Global IP dengan port baru yang unik pada Layer 4.",
    misconceptionFeedback:
      "PAT bekerja di Layer 4 menggunakan nomor port TCP/UDP untuk melacak setiap sesi koneksi individual dari banyak host.",
  },
  {
    id: "quiz-nat-l2-q2",
    lessonSlug: "pat-port-address-translation",
    outcomeId: "NAT-L2-A",
    question: "Apa istilah yang digunakan oleh MikroTik RouterOS untuk fungsi PAT / NAT Overload pada menu firewall NAT?",
    options: [
      { id: "opt-a", text: "action = masquerade" },
      { id: "opt-b", text: "action = passthrough" },
      { id: "opt-c", text: "action = accept" },
      { id: "opt-d", text: "action = drop" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Di MikroTik RouterOS, aksi 'masquerade' adalah implementasi PAT yang secara dinamis menggunakan alamat IP dari antarmuka keluar.",
    misconceptionFeedback:
      "Di MikroTik, aksi yang menerjemahkan banyak IP privat ke IP interface keluar dengan pemetaan port otomatis disebut 'masquerade'.",
  },
  {
    id: "quiz-nat-l2-q3",
    lessonSlug: "pat-port-address-translation",
    outcomeId: "NAT-L2-B",
    question: "Apa yang terjadi jika perintah NAT Cisco 'ip nat inside source list 1 interface GigabitEthernet0/1' dijalankan TANPA menyertakan kata kunci 'overload'?",
    options: [
      { id: "opt-a", text: "Hanya satu host pertama yang dapat mengakses Internet, host berikutnya akan ditolak karena kehabisan IP publik" },
      { id: "opt-b", text: "Router langsung crash dan me-restart sendiri" },
      { id: "opt-c", text: "Seluruh port switch otomatis menjadi trunk" },
      { id: "opt-d", text: "Kecepatan internet otomatis turun menjadi 10 Mbps" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Tanpa kata kunci 'overload', router memperlakukan konfigurasi sebagai Dynamic NAT 1-to-1 biasa. Karena hanya ada satu IP antarmuka WAN, hanya perangkat pertama yang mendapat translasi.",
    misconceptionFeedback:
      "Kata kunci 'overload' wajib disertakan untuk mengizinkan port multiplexing (PAT); tanpanya, router hanya memetakan 1 host untuk 1 IP publik.",
  },

  // =========================================================================
  // Module 5: Protokol Transport & Diagnostik Layanan Jaringan (P4-M5)
  // =========================================================================

  // Lesson 9: tcp-udp-icmp (P4-L09)
  {
    id: "quiz-trn-l1-q1",
    lessonSlug: "tcp-udp-icmp",
    outcomeId: "TRN-L1-A",
    question: "Manakah urutan bendera (flag) kontrol yang benar pada proses pembukaan koneksi TCP 3-Way Handshake?",
    options: [
      { id: "opt-a", text: "SYN -> SYN-ACK -> ACK" },
      { id: "opt-b", text: "ACK -> SYN -> FIN" },
      { id: "opt-c", text: "SYN -> ACK -> RST" },
      { id: "opt-d", text: "HELLO -> READY -> CONNECT" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Proses TCP 3-Way Handshake dimulai dari SYN (klien), dibalas SYN-ACK (server), dan diselesaikan oleh ACK (klien).",
    misconceptionFeedback:
      "Negosiasi TCP selalu 3 langkah: SYN dari inisiator, balasan SYN-ACK dari penerima, dan konfirmasi ACK dari inisiator.",
  },
  {
    id: "quiz-trn-l1-q2",
    lessonSlug: "tcp-udp-icmp",
    outcomeId: "TRN-L1-A",
    question: "Mengapa aplikasi komunikasi suara real-time (VoIP) dan video streaming langsung lebih memilih protokol UDP daripada TCP?",
    options: [
      { id: "opt-a", text: "Karena UDP tidak memiliki overhead transmisi ulang (retransmission) sehingga meminimalkan latensi dan jeda waktu" },
      { id: "opt-b", text: "Karena paket UDP dijamin 100% tidak akan pernah hilang oleh switch" },
      { id: "opt-c", text: "Karena UDP mengenkripsi data secara otomatis menggunakan algoritma AES-256" },
      { id: "opt-d", text: "Karena ukuran MTU UDP dua kali lebih besar dari TCP" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "UDP adalah protokol connectionless yang memprioritaskan latensi rendah tanpa mekanisme pengiriman ulang yang dapat menyebabkan lag suara.",
    misconceptionFeedback:
      "Pada percakapan suara, mendengar kata yang telat 3 detik akibat transmisi ulang TCP jauh lebih mengganggu daripada suara sedikit berderau akibat paket UDP terlewat.",
  },
  {
    id: "quiz-trn-l1-q3",
    lessonSlug: "tcp-udp-icmp",
    outcomeId: "TRN-L1-B",
    question: "Pesan ICMP apakah yang dihasilkan oleh router perantara saat nilai Time to Live (TTL) dari paket IP mencapai angka 0, yang dimanfaatkan oleh perintah traceroute?",
    options: [
      { id: "opt-a", text: "ICMP Type 11 (Time-to-Live Exceeded)" },
      { id: "opt-b", text: "ICMP Type 8 (Echo Request)" },
      { id: "opt-c", text: "ICMP Type 0 (Echo Reply)" },
      { id: "opt-d", text: "ICMP Type 3 (Destination Unreachable)" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Ketika nilai TTL paket berkurang menjadi 0 di sebuah router hop, router tersebut membuang paket dan mengirim balik pesan ICMP Type 11 (Time Exceeded).",
    misconceptionFeedback:
      "Type 8 dan Type 0 adalah Echo Request dan Reply milik ping. Pesan habisnya batas waktu hop router adalah ICMP Type 11 (Time-to-Live Exceeded).",
  },

  // Lesson 10: port-dan-layanan (P4-L10)
  {
    id: "quiz-trn-l2-q1",
    lessonSlug: "port-dan-layanan",
    outcomeId: "TRN-L2-A",
    question: "Nomor port standar berapakah yang digunakan oleh layanan web terenkripsi HTTPS (Hypertext Transfer Protocol Secure)?",
    options: [
      { id: "opt-a", text: "Port 443" },
      { id: "opt-b", text: "Port 80" },
      { id: "opt-c", text: "Port 22" },
      { id: "opt-d", text: "Port 8080" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "HTTPS menggunakan TCP port 443 secara default, sedangkan HTTP biasa tanpa enkripsi menggunakan TCP port 80.",
    misconceptionFeedback:
      "Port 80 adalah HTTP biasa tanpa enkripsi. Port resmi untuk HTTPS terenkripsi SSL/TLS adalah port 443.",
  },
  {
    id: "quiz-trn-l2-q2",
    lessonSlug: "port-dan-layanan",
    outcomeId: "TRN-L2-A",
    question: "Kombinasi antara alamat IP dan nomor port pada sistem operasi (contoh: 192.168.1.10:80) disebut sebagai apa?",
    options: [
      { id: "opt-a", text: "Socket" },
      { id: "opt-b", text: "Netmask" },
      { id: "opt-c", text: "Sub-interface" },
      { id: "opt-d", text: "Trunk" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Socket adalah kombinasi unik dari alamat IP dan nomor port yang mengidentifikasi titik akhir proses komunikasi pada host.",
    misconceptionFeedback:
      "Istilah resmi kombinasi alamat IP (Layer 3) dan Port (Layer 4) dalam pemrosesan sistem operasi adalah Socket.",
  },
  {
    id: "quiz-trn-l2-q3",
    lessonSlug: "port-dan-layanan",
    outcomeId: "TRN-L2-B",
    question: "Seorang administrator dapat melakukan ping ke IP server web (ICMP reply normal), namun saat membuka web browser muncul pesan 'Connection Refused'. Apa kemungkinan besar penyebabnya?",
    options: [
      { id: "opt-a", text: "Layanan web server (Apache/Nginx) sedang mati atau port 80/443 ditutup oleh firewall lokal server" },
      { id: "opt-b", text: "Kabel UTP antara switch dan router terputus total" },
      { id: "opt-c", text: "Subnet mask pada kartu jaringan server salah ketik" },
      { id: "opt-d", text: "Default Gateway di server belum diisi" },
    ],
    correctAnswer: "opt-a",
    explanation:
      "Keberhasilan ping membuktikan Layer 1 sampai Layer 3 (IP, rute, kabel) berfungsi normal. Pesan 'Connection Refused' menandakan tidak ada proses aplikasi di server yang mendengarkan di port web yang dituju.",
    misconceptionFeedback:
      "Karena ping sukses, rute IP, gateway, dan kabel terbukti berfungsi baik. Masalah 'Connection Refused' murni terjadi di Layer 4/7: port tertutup atau service web mati.",
  },
];
