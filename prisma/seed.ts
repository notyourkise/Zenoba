/**
 * Netloka Database Seed - Milestone 3 (Network Foundations Path 1 Complete)
 * Seeds all 8 Modules, ordered lessons with rich interactive blocks and prerequisites.
 */

import { prisma, closeDatabaseConnection } from "../src/lib/db/client";

async function main() {
  console.log("🌱 Seeding Complete Network Foundations Path (8 Modules)...");

  // 1. Path: Network Foundations
  const path = await prisma.learningPath.upsert({
    where: { slug: "network-foundations" },
    update: {
      title: "Network Foundations",
      description:
        "Pelajari dasar-dasar jaringan komputer, perangkat jaringan, media kabel, topologi, dan model OSI 7-Layer secara interaktif.",
      icon: "BookOpen",
      orderIndex: 1,
      published: true,
    },
    create: {
      slug: "network-foundations",
      title: "Network Foundations",
      description:
        "Pelajari dasar-dasar jaringan komputer, perangkat jaringan, media kabel, topologi, dan model OSI 7-Layer secara interaktif.",
      icon: "BookOpen",
      orderIndex: 1,
      published: true,
    },
  });

  // Helper to upsert module
  const upsertModule = async (slug: string, title: string, description: string, orderIndex: number) => {
    return prisma.module.upsert({
      where: { pathId_slug: { pathId: path.id, slug } },
      update: { title, description, orderIndex, published: true },
      create: { pathId: path.id, slug, title, description, orderIndex, published: true },
    });
  };

  // Helper to upsert lesson
  const upsertLesson = async (
    moduleId: string,
    slug: string,
    title: string,
    description: string,
    orderIndex: number,
    xpReward: number,
    content: unknown
  ) => {
    return prisma.lesson.upsert({
      where: { moduleId_slug: { moduleId, slug } },
      update: { title, description, orderIndex, xpReward, content: content as any, published: true }, // eslint-disable-line @typescript-eslint/no-explicit-any
      create: { moduleId, slug, title, description, orderIndex, xpReward, content: content as any, published: true }, // eslint-disable-line @typescript-eslint/no-explicit-any
    });
  };

  // Helper to connect prerequisites
  const connectPrereq = async (lessonId: string, prerequisiteId: string) => {
    return prisma.lessonPrerequisite.upsert({
      where: { lessonId_prerequisiteId: { lessonId, prerequisiteId } },
      update: {},
      create: { lessonId, prerequisiteId },
    });
  };

  // ==========================================
  // MODULE 1: Welcome to Networking
  // ==========================================
  const mod1 = await upsertModule("welcome-to-networking", "1. Welcome to Networking", "Memahami apa itu jaringan dan konsep dasar pertukaran data.", 1);

  const l1_1 = await upsertLesson(mod1.id, "intro-to-networking", "Apa Itu Jaringan Komputer?", "Pengenalan konsep dasar jaringan, client, server, dan node.", 1, 50, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Apa Sebenarnya Jaringan Komputer Itu?" },
      { type: "text", content: "Jaringan komputer adalah sekumpulan perangkat otonom yang saling terhubung menggunakan media kabel atau nirkabel untuk bertukar data dan berbagi sumber daya." },
      { type: "callout", variant: "tip", title: "Konsep Dasar: Node & Host", content: "Setiap perangkat yang memiliki alamat IP atau MAC di jaringan disebut Node." },
      { type: "interactive", interactiveType: "packet_flow", config: {} },
      { type: "quiz", quizId: "q-1-1", question: "Manakah perangkat yang menjadi pusat penghubung kabel LAN di Layer 2?", quizType: "single_choice", options: [{ id: "opt-sw", text: "Switch" }, { id: "opt-hub", text: "Hub" }], explanation: "Switch menghubungkan host di LAN.", xpReward: 10 },
      { type: "summary", title: "Rangkuman Pelajaran", keyPoints: ["Jaringan menghubungkan host untuk berbagi sumber daya.", "Switch menghubungkan perangkat lokal secara terarah."] },
      { type: "reward", xp: 50, message: "Selamat menyelesaikan materi awal!" },
    ],
  });

  const l1_2 = await upsertLesson(mod1.id, "everyday-networks", "Jaringan di Sekitar Kita", "Studi kasus jaringan rumahan (Wi-Fi, Smart TV, Smartphone).", 2, 50, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Jaringan di Rumah Kita (Home Network)" },
      { type: "text", content: "Router Wi-Fi di rumah menggabungkan fungsi Router, Switch, dan Wireless Access Point dalam 1 kotak perangkat." },
      { type: "callout", variant: "info", title: "Tahukah Anda?", content: "Koneksi internet rumah Anda menggunakan modem/ONT serat optik menuju ISP." },
      { type: "quiz", quizId: "q-1-2", question: "Perangkat apa yang memancarkan sinyal Wi-Fi di rumah?", quizType: "single_choice", options: [{ id: "opt-ap", text: "Access Point / Router Wi-Fi" }, { id: "opt-patch", text: "Patch Panel" }], explanation: "Access point memancarkan sinyal radio nirkabel.", xpReward: 10 },
      { type: "reward", xp: 50, message: "Pelajaran 2 selesai!" },
    ],
  });

  // ==========================================
  // MODULE 2: Types of Networks
  // ==========================================
  const mod2 = await upsertModule("types-of-networks", "2. Types of Networks", "Klasifikasi jaringan berdasarkan skala geografis dan arsitektur.", 2);

  const l2_1 = await upsertLesson(mod2.id, "lan-man-wan", "Klasifikasi Skala: LAN, MAN, & WAN", "Perbedaan Local Area Network, Metropolitan, dan Wide Area Network.", 1, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Skala Geografis Jaringan" },
      { type: "text", content: "LAN mencakup satu ruangan/gedung, MAN mencakup area satu kota, dan WAN mencakup antar kota, pulau, atau seluruh dunia (Internet)." },
      { type: "callout", variant: "tip", title: "Karakteristik Kecepatan", content: "LAN memiliki kecepatan transfer data sangat tinggi (1Gbps - 10Gbps) dengan latensi sangat rendah." },
      { type: "quiz", quizId: "q-2-1", question: "Jaringan yang menghubungkan beberapa kantor cabang di berbagai kota disebut?", quizType: "single_choice", options: [{ id: "opt-wan", text: "WAN (Wide Area Network)" }, { id: "opt-lan", text: "LAN (Local Area Network)" }], explanation: "WAN mencakup jangkauan geografis luas antar wilayah.", xpReward: 10 },
      { type: "reward", xp: 75, message: "Pelajaran skala jaringan selesai!" },
    ],
  });

  const l2_2 = await upsertLesson(mod2.id, "soho-vs-enterprise", "Arsitektur: SOHO vs Enterprise", "Perbedaan skala Small Office Home Office dengan jaringan perusahaan besar.", 2, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Jaringan SOHO vs Enterprise" },
      { type: "text", content: "Jaringan Enterprise menggunakan perangkat modular terpisah (Core Switch, Distribution, Access, Firewall dedicated, Redundant Power) demi stabilitas 99.99% uptime." },
      { type: "interactive", interactiveType: "device_card", config: {} },
      { type: "reward", xp: 75, message: "Pelajaran arsitektur selesai!" },
    ],
  });

  // ==========================================
  // MODULE 3: Client, Server & Communication
  // ==========================================
  const mod3 = await upsertModule("client-server-communication", "3. Client, Server & Communication", "Pola komunikasi Client-Server dan Peer-to-Peer.", 3);

  const l3_1 = await upsertLesson(mod3.id, "client-server-model", "Model Komunikasi Client-Server", "Proses request, response, dan protokol layanan jaringan.", 1, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Pola Request & Response" },
      { type: "text", content: "Client adalah peminta layanan (request), dan Server adalah penyedia layanan terpusat (response) seperti Web Server, Database Server, dan DNS Server." },
      { type: "interactive", interactiveType: "packet_flow", config: {} },
      { type: "reward", xp: 75, message: "Pelajaran Client-Server selesai!" },
    ],
  });

  const l3_2 = await upsertLesson(mod3.id, "p2p-vs-client-server", "Peer-to-Peer vs Client-Server", "Analisis kelebihan dan kelemahan desentralisasi node.", 2, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Jaringan Peer-to-Peer (P2P)" },
      { type: "text", content: "Dalam P2P, setiap komputer dapat bertindak sebagai client sekaligus server secara bersamaan tanpa server pengendali terpusat." },
      { type: "quiz", quizId: "q-3-2", question: "Manakah arsitektur yang lebih mudah dikelola hak akses dan backup datanya secara terpusat?", quizType: "single_choice", options: [{ id: "opt-cs", text: "Client-Server" }, { id: "opt-p2p", text: "Peer-to-Peer" }], explanation: "Client-Server menempatkan data pada server pusat.", xpReward: 10 },
      { type: "reward", xp: 75, message: "Pelajaran P2P selesai!" },
    ],
  });

  // ==========================================
  // MODULE 4: Network Topology
  // ==========================================
  const mod4 = await upsertModule("network-topology", "4. Network Topology", "Analisis bentuk fisik dan ketahanan topologi jaringan.", 4);

  const l4_1 = await upsertLesson(mod4.id, "bus-star-ring", "Topologi Bus, Star, dan Ring", "Karakteristik topologi klasik dan standar modern.", 1, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Eksplorasi Topologi Jaringan" },
      { type: "text", content: "Topologi Star adalah standar mutlak jaringan lokal modern karena menawarkan isolasi gangguan port yang handal." },
      { type: "interactive", interactiveType: "topology_explorer", config: {} },
      { type: "reward", xp: 75, message: "Pelajaran topologi dasar selesai!" },
    ],
  });

  const l4_2 = await upsertLesson(mod4.id, "mesh-and-hybrid", "Topologi Mesh dan Hybrid", "Redundansi tinggi untuk Data Center dan backbone ISP.", 2, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Topologi Mesh dan Redundansi" },
      { type: "text", content: "Topologi Full Mesh menghubungkan setiap node ke semua node lain sehingga tidak ada single point of failure." },
      { type: "quiz", quizId: "q-4-2", question: "Topologi manakah yang memberikan jalur cadangan (redundansi) paling banyak?", quizType: "single_choice", options: [{ id: "opt-mesh", text: "Full Mesh" }, { id: "opt-bus", text: "Bus" }], explanation: "Full Mesh memiliki link langsung antar seluruh node.", xpReward: 10 },
      { type: "reward", xp: 75, message: "Pelajaran Mesh selesai!" },
    ],
  });

  // ==========================================
  // MODULE 5: Network Devices
  // ==========================================
  const mod5 = await upsertModule("network-devices", "5. Network Devices", "Mengenal perangkat keras jaringan utama dan fungsinya.", 5);

  const l5_1 = await upsertLesson(mod5.id, "hub-switch-router", "Hub, Switch, dan Router", "Perbedaan cara kerja perangkat Layer 1, 2, dan 3.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Perangkat Kunci: Hub, Switch, Router" },
      { type: "text", content: "Hub mem-broadcast sinyal ke semua port, Switch meneruskan frame berdasarkan MAC Address (Layer 2), dan Router meneruskan paket berdasarkan IP Address (Layer 3)." },
      { type: "interactive", interactiveType: "device_card", config: {} },
      { type: "reward", xp: 100, message: "Pelajaran perangkat inti selesai!" },
    ],
  });

  const l5_2 = await upsertLesson(mod5.id, "ap-modem-firewall", "Access Point, Modem, dan Firewall", "Perangkat nirkabel, gateway broadband, dan keamanan.", 2, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Perangkat Keamanan dan Konektivitas" },
      { type: "text", content: "Firewall bertindak sebagai garda terdepan menyaring paket mencurigakan sebelum masuk ke LAN kantor." },
      { type: "callout", variant: "warning", title: "Penting", content: "Jangan pernah menaruh server internal langsung tanpa proteksi firewall." },
      { type: "reward", xp: 100, message: "Pelajaran AP & Firewall selesai!" },
    ],
  });

  // ==========================================
  // MODULE 6: Physical Media & Cabling
  // ==========================================
  const mod6 = await upsertModule("physical-media-cabling", "6. Physical Media & Cabling", "Standar media transmisi kabel tembaga dan serat optik.", 6);

  const l6_1 = await upsertLesson(mod6.id, "utp-stp-cables", "Kabel UTP/STP & Kategori Cat5e/Cat6", "Mengenal twisted pair, shielding, dan batasan panjang 100 meter.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Kabel Twisted Pair (UTP / STP)" },
      { type: "text", content: "Kabel UTP memiliki batasan jarak maksimal 100 meter menurut standar TIA/EIA untuk transmisi Gigabit Ethernet." },
      { type: "callout", variant: "tip", title: "Cat5e vs Cat6", content: "Cat6 memiliki separator plastik di tengahnya untuk mengurangi crosstalk pada frekuensi 250 MHz." },
      { type: "reward", xp: 100, message: "Pelajaran kabel UTP selesai!" },
    ],
  });

  const l6_2 = await upsertLesson(mod6.id, "crimping-standards-fiber", "Standar Crimping T568A/B & Fiber Optic", "Praktek urutan pinout kabel RJ-45 dan pengenalan serat optik.", 2, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Standar Susunan Kawat T568A dan T568B" },
      { type: "text", content: "Kabel Straight-Through menggunakan standar yang sama di kedua ujung (misal T568B ke T568B) untuk menghubungkan PC ke Switch." },
      { type: "interactive", interactiveType: "cable_order", config: {} },
      { type: "reward", xp: 100, message: "Praktek crimping selesai!" },
    ],
  });

  // ==========================================
  // MODULE 7: How Data Travels
  // ==========================================
  const mod7 = await upsertModule("how-data-travels", "7. How Data Travels", "Cara paket data menemukan alamat fisik dan logika.", 7);

  const l7_1 = await upsertLesson(mod7.id, "mac-and-ip-addressing", "MAC Address & Pengalamatan Fisik", "Struktur 48-bit alamat fisik (OUI dan NIC Identifier).", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Apa Itu MAC Address?" },
      { type: "text", content: "MAC Address adalah alamat fisik 48-bit (12 digit heksadesimal) yang tertanam secara permanen pada chip NIC." },
      { type: "callout", variant: "info", title: "Contoh Format MAC", content: "00:1A:2B:3C:4D:5E — 3 oktet pertama adalah Organizationally Unique Identifier (OUI)." },
      { type: "reward", xp: 100, message: "Pelajaran MAC Address selesai!" },
    ],
  });

  const l7_2 = await upsertLesson(mod7.id, "unicast-broadcast-multicast", "Unicast, Broadcast, dan Multicast", "Tiga pola transmisi paket dalam arsitektur Ethernet.", 2, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Tiga Mode Transmisi Paket" },
      { type: "text", content: "Unicast (One-to-One), Broadcast (One-to-All dengan MAC FF:FF:FF:FF:FF:FF), dan Multicast (One-to-Specific-Group)." },
      { type: "quiz", quizId: "q-7-2", question: "Pengiriman data dari satu pengirim ke SELURUH host dalam subnet lokal disebut?", quizType: "single_choice", options: [{ id: "opt-bc", text: "Broadcast" }, { id: "opt-uc", text: "Unicast" }], explanation: "Broadcast menjangkau seluruh host dalam broadcast domain.", xpReward: 10 },
      { type: "reward", xp: 100, message: "Pelajaran transmisi data selesai!" },
    ],
  });

  // ==========================================
  // MODULE 8: OSI & TCP/IP Foundations
  // ==========================================
  const mod8 = await upsertModule("osi-tcpip-foundations", "8. OSI & TCP/IP Foundations", "Model referensi 7-Layer OSI dan protokol TCP/IP.", 8);

  const l8_1 = await upsertLesson(mod8.id, "osi-seven-layers", "7 Layer Model Referensi OSI", "Menganalisis fungsi Physical, Data Link, Network, Transport, Session, Presentation, Application.", 1, 120, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Eksplorasi 7 Layer Model OSI" },
      { type: "text", content: "Model OSI membagi proses komunikasi jaringan menjadi 7 lapisan terstandarisasi untuk mempermudah interoperabilitas perangkat lintas vendor." },
      { type: "interactive", interactiveType: "osi_stack", config: {} },
      { type: "reward", xp: 120, message: "Pelajaran 7 Layer OSI selesai!" },
    ],
  });

  const l8_2 = await upsertLesson(mod8.id, "tcpip-and-encapsulation", "TCP/IP Model & Enkapsulasi Paket", "Proses pembungkusan PDU Data → Segment → Packet → Frame → Bits.", 2, 120, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Enkapsulasi dan Dekapsulasi Paket" },
      { type: "text", content: "Setiap layer menambahkan header metadata khusus saat data dikirim (Enkapsulasi), dan melepasnya saat data diterima (Dekapsulasi)." },
      { type: "interactive", interactiveType: "encapsulation", config: {} },
      { type: "reward", xp: 120, message: "Selamat! Anda telah menyelesaikan seluruh modul Network Foundations!" },
    ],
  });

  // ==========================================
  // PREREQUISITES CHAIN ACROSS ALL 8 MODULES
  // ==========================================
  const allLessonsInOrder = [
    l1_1, l1_2,
    l2_1, l2_2,
    l3_1, l3_2,
    l4_1, l4_2,
    l5_1, l5_2,
    l6_1, l6_2,
    l7_1, l7_2,
    l8_1, l8_2,
  ];

  for (let i = 1; i < allLessonsInOrder.length; i++) {
    await connectPrereq(allLessonsInOrder[i].id, allLessonsInOrder[i - 1].id);
  }

  console.log("✅ Seed completed successfully for all 8 modules & 16 lessons!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
