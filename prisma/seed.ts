/**
 * Netloka Database Seed - Milestone 4 Complete
 * Seeds Path 1 (Network Foundations), Path 2 (IPv4 & Subnetting), and Path 3 (Switching & Routing).
 */

import { prisma, closeDatabaseConnection } from "../src/lib/db/client";

async function main() {
  console.log("🌱 Seeding Paths 1, 2, and 3...");

  // Helper to upsert Path
  const upsertPath = async (slug: string, title: string, description: string, icon: string, orderIndex: number) => {
    return prisma.learningPath.upsert({
      where: { slug },
      update: { title, description, icon, orderIndex, published: true },
      create: { slug, title, description, icon, orderIndex, published: true },
    });
  };

  // Helper to upsert Module
  const upsertModule = async (pathId: string, slug: string, title: string, description: string, orderIndex: number) => {
    return prisma.module.upsert({
      where: { pathId_slug: { pathId, slug } },
      update: { title, description, orderIndex, published: true },
      create: { pathId, slug, title, description, orderIndex, published: true },
    });
  };

  // Helper to upsert Lesson
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
  // PATH 1: Network Foundations
  // ==========================================
  const path1 = await upsertPath(
    "network-foundations",
    "Network Foundations",
    "Pelajari dasar-dasar jaringan komputer, perangkat jaringan, media kabel, topologi, dan model OSI 7-Layer secara interaktif.",
    "BookOpen",
    1
  );

  const mod1 = await upsertModule(path1.id, "welcome-to-networking", "1. Welcome to Networking", "Memahami apa itu jaringan dan konsep dasar pertukaran data.", 1);
  const l1_1 = await upsertLesson(mod1.id, "intro-to-networking", "Apa Itu Jaringan Komputer?", "Pengenalan konsep dasar jaringan, client, server, dan node.", 1, 50, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Apa Sebenarnya Jaringan Komputer Itu?" },
      { type: "text", content: "Jaringan komputer adalah sekumpulan perangkat otonom yang saling terhubung menggunakan media kabel atau nirkabel untuk bertukar data dan berbagi sumber daya." },
      { type: "interactive", interactiveType: "packet_flow", config: {} },
      { type: "reward", xp: 50, message: "Pelajaran awal selesai!" },
    ],
  });
  const l1_2 = await upsertLesson(mod1.id, "everyday-networks", "Jaringan di Sekitar Kita", "Studi kasus jaringan rumahan (Wi-Fi, Smart TV, Smartphone).", 2, 50, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Jaringan di Rumah Kita" },
      { type: "text", content: "Router Wi-Fi rumah menggabungkan fungsi Router, Switch, dan Access Point." },
      { type: "reward", xp: 50, message: "Pelajaran 2 selesai!" },
    ],
  });

  // Modules 2-8 simplified seed connectors
  const mod2 = await upsertModule(path1.id, "types-of-networks", "2. Types of Networks", "Klasifikasi jaringan LAN, MAN, WAN, SOHO & Enterprise.", 2);
  const l2_1 = await upsertLesson(mod2.id, "lan-man-wan", "Klasifikasi Skala: LAN, MAN, & WAN", "Perbedaan Local Area Network, Metropolitan, dan Wide Area Network.", 1, 75, {
    version: "1.0",
    blocks: [{ type: "heading", level: 2, text: "Skala Geografis" }, { type: "reward", xp: 75, message: "Selesai!" }],
  });

  const mod4 = await upsertModule(path1.id, "network-topology", "4. Network Topology", "Analisis bentuk fisik dan ketahanan topologi jaringan.", 4);
  const l4_1 = await upsertLesson(mod4.id, "bus-star-ring", "Topologi Bus, Star, dan Ring", "Karakteristik topologi klasik dan standar modern.", 1, 75, {
    version: "1.0",
    blocks: [{ type: "heading", level: 2, text: "Topologi Jaringan" }, { type: "interactive", interactiveType: "topology_explorer", config: {} }, { type: "reward", xp: 75, message: "Topologi selesai!" }],
  });

  const mod6 = await upsertModule(path1.id, "physical-media-cabling", "6. Physical Media & Cabling", "Standar media kabel tembaga dan serat optik.", 6);
  const l6_2 = await upsertLesson(mod6.id, "crimping-standards-fiber", "Standar Crimping T568A/B & Fiber", "Praktek pinout RJ-45.", 2, 100, {
    version: "1.0",
    blocks: [{ type: "heading", level: 2, text: "Crimping RJ-45" }, { type: "interactive", interactiveType: "cable_order", config: {} }, { type: "reward", xp: 100, message: "Crimping selesai!" }],
  });

  const mod8 = await upsertModule(path1.id, "osi-tcpip-foundations", "8. OSI & TCP/IP Foundations", "Model referensi 7-Layer OSI dan protokol TCP/IP.", 8);
  const l8_1 = await upsertLesson(mod8.id, "osi-seven-layers", "7 Layer Model Referensi OSI", "Menganalisis fungsi 7 Layer OSI.", 1, 120, {
    version: "1.0",
    blocks: [{ type: "heading", level: 2, text: "7 Layer OSI" }, { type: "interactive", interactiveType: "osi_stack", config: {} }, { type: "reward", xp: 120, message: "OSI selesai!" }],
  });

  // Connect prerequisites for Path 1
  await connectPrereq(l1_2.id, l1_1.id);
  await connectPrereq(l2_1.id, l1_2.id);
  await connectPrereq(l4_1.id, l2_1.id);
  await connectPrereq(l6_2.id, l4_1.id);
  await connectPrereq(l8_1.id, l6_2.id);

  // ==========================================
  // PATH 2: IPv4 & Subnetting (Sprint 7)
  // ==========================================
  const path2 = await upsertPath(
    "ipv4-subnetting",
    "IPv4 & Subnetting",
    "Kuasai logika biner, struktur 32-bit IPv4, subnet mask, kalkulasi CIDR, dan alokasi VLSM secara mendalam.",
    "Binary",
    2
  );

  const mod9 = await upsertModule(path2.id, "binary-ipv4-structure", "1. Biner & Struktur IPv4", "Konversi bit dan anatomi alamat 32-bit.", 1);
  const l9_1 = await upsertLesson(mod9.id, "binary-fundamentals", "Konversi Biner ke Desimal", "Latihan 8-bit octet dan powers of two.", 1, 75, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Dasar Sistem Biner dalam IPv4" },
      { type: "text", content: "Setiap alamat IPv4 terdiri dari 32 bit yang dibagi menjadi 4 oktet (masing-masing 8 bit bernilai 0 s/d 255)." },
      { type: "interactive", interactiveType: "binary_converter", config: {} },
      { type: "summary", title: "Rangkuman Biner", keyPoints: ["1 oktet = 8 bit.", "Nilai bit: 128, 64, 32, 16, 8, 4, 2, 1."] },
      { type: "reward", xp: 75, message: "Pelajaran biner selesai!" },
    ],
  });

  const mod10 = await upsertModule(path2.id, "subnet-calculations", "2. Kalkulasi Subnetting", "Menghitung Network ID, Broadcast, dan Usable Host.", 2);
  const l10_1 = await upsertLesson(mod10.id, "subnet-calculator-lab", "Kalkulator Subnet & Pembagian Host", "Praktek menghitung parameter subnet.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Kalkulasi Subnetting Interaktif" },
      { type: "text", content: "Gunakan kalkulator di bawah untuk memahami langkah demi langkah operasi bitwise AND antara IP dan Subnet Mask." },
      { type: "interactive", interactiveType: "subnet_calculator", config: {} },
      { type: "interactive", interactiveType: "subnet_practice", config: {} },
      { type: "reward", xp: 100, message: "Kalkulasi subnetting selesai!" },
    ],
  });

  // ==========================================
  // PATH 3: Switching, VLAN & Routing (Sprint 8)
  // ==========================================
  const path3 = await upsertPath(
    "switching-vlan-routing",
    "Switching, VLAN & Routing",
    "Pahami cara switch mempelajari MAC address, segmentasi VLAN, dan penentuan rute tabel routing L3.",
    "Network",
    3
  );

  const mod11 = await upsertModule(path3.id, "switching-and-arp", "1. Switching & Protokol ARP", "Resolusi MAC dan cara kerja tabel CAM switch.", 1);
  const l11_1 = await upsertLesson(mod11.id, "arp-resolution-flow", "Proses Resolusi Address Resolution Protocol (ARP)", "Simulasi Request Broadcast dan Reply Unicast.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Bagaimana Komputer Menemukan Alamat MAC Fisik?" },
      { type: "text", content: "Protokol ARP memetakan IP tujuan ke MAC Address menggunakan paket ARP Request broadcast." },
      { type: "interactive", interactiveType: "arp_visualizer", config: {} },
      { type: "reward", xp: 100, message: "Pelajaran ARP selesai!" },
    ],
  });

  const mod12 = await upsertModule(path3.id, "vlan-and-routing", "2. Segmentasi VLAN & Routing Table", "Isolasi broadcast domain dan Longest Prefix Match.", 2);
  const l12_1 = await upsertLesson(mod12.id, "vlan-segmentation-practice", "Konfigurasi Port VLAN & Evaluasi Routing", "Simulasi Access Port dan Longest Prefix Match.", 1, 120, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Segmentasi Traffic dengan Virtual LAN (VLAN)" },
      { type: "interactive", interactiveType: "vlan_builder", config: {} },
      { type: "heading", level: 3, text: "Evaluasi Tabel Routing L3" },
      { type: "interactive", interactiveType: "routing_table", config: {} },
      { type: "reward", xp: 120, message: "Pelajaran VLAN & Routing selesai!" },
    ],
  });

  // Connect prerequisites for Path 2 & 3
  await connectPrereq(l10_1.id, l9_1.id);
  await connectPrereq(l12_1.id, l11_1.id);

  console.log("✅ Seed completed successfully for Paths 1, 2, and 3!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
