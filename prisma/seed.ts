/**
 * Netloka Database Seed - Complete Paths 1 to 5
 * Seeds Path 1 (Foundations), Path 2 (IPv4), Path 3 (Switching/Routing), Path 4 (Services), and Path 5 (Wireless/Troubleshooting).
 */

import { prisma, closeDatabaseConnection } from "../src/lib/db/client";
import { seedCommerceCatalog } from "./commerce-seed";
import { welcomeModuleData } from "../src/features/learning/content/network-foundations/welcome";
import { typesOfNetworksModuleData } from "../src/features/learning/content/network-foundations/types-of-networks";
import { clientServerModuleData } from "../src/features/learning/content/network-foundations/client-server";
import { topologyModuleData } from "../src/features/learning/content/network-foundations/topology";
import { networkDevicesModuleData } from "../src/features/learning/content/network-foundations/devices";
import { physicalMediaCablingModuleData } from "../src/features/learning/content/network-foundations/media-cabling";
import { howDataTravelsModuleData } from "../src/features/learning/content/network-foundations/how-data-travels";
import { osiTcpipModuleData } from "../src/features/learning/content/network-foundations/osi-tcpip";

async function main() {
  console.log("🌱 Seeding Paths 1 to 5 (Full Curriculum)...");

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
  // PATH 1: Network Foundations (Full 8 Modules, 19 Lessons)
  // ==========================================
  const path1 = await upsertPath(
    "network-foundations",
    "Network Foundations",
    "Pelajari dasar-dasar jaringan komputer, perangkat jaringan, media kabel, topologi, dan model OSI 7-Layer secara interaktif.",
    "BookOpen",
    1
  );

  const path1Modules = [
    welcomeModuleData,
    typesOfNetworksModuleData,
    clientServerModuleData,
    topologyModuleData,
    networkDevicesModuleData,
    physicalMediaCablingModuleData,
    howDataTravelsModuleData,
    osiTcpipModuleData,
  ];

  const path1Lessons: Record<string, { id: string }> = {};

  for (let mIdx = 0; mIdx < path1Modules.length; mIdx++) {
    const modData = path1Modules[mIdx];
    const moduleRecord = await upsertModule(
      path1.id,
      modData.slug,
      `${mIdx + 1}. ${modData.title}`,
      modData.description,
      mIdx + 1
    );

    // Clean up legacy placeholder lesson if it exists from previous prototypes
    if (modData.slug === "physical-media-cabling") {
      await prisma.lesson.deleteMany({
        where: {
          moduleId: moduleRecord.id,
          slug: "crimping-standards-fiber",
        },
      });
    }

    for (const lesson of modData.lessons) {
      path1Lessons[lesson.slug] = await upsertLesson(
        moduleRecord.id,
        lesson.slug,
        lesson.title,
        lesson.description,
        lesson.orderIndex + 1,
        lesson.xpReward,
        lesson.content
      );
    }
  }

  // Connect prerequisites for all Path 1 lessons
  for (const modData of path1Modules) {
    for (const lesson of modData.lessons) {
      for (const prereqSlug of lesson.prerequisites) {
        if (path1Lessons[prereqSlug] && path1Lessons[lesson.slug]) {
          await connectPrereq(
            path1Lessons[lesson.slug].id,
            path1Lessons[prereqSlug].id
          );
        }
      }
    }
  }

  // ==========================================
  // PATH 2: IPv4 & Subnetting
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
      { type: "interactive", interactiveType: "binary_converter", config: {} },
      { type: "reward", xp: 75, message: "Pelajaran biner selesai!" },
    ],
  });

  const mod10 = await upsertModule(path2.id, "subnet-calculations", "2. Kalkulasi Subnetting", "Menghitung Network ID, Broadcast, dan Usable Host.", 2);
  const l10_1 = await upsertLesson(mod10.id, "subnet-calculator-lab", "Kalkulator Subnet & Pembagian Host", "Praktek menghitung parameter subnet.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Kalkulasi Subnetting Interaktif" },
      { type: "interactive", interactiveType: "subnet_calculator", config: {} },
      { type: "interactive", interactiveType: "subnet_practice", config: {} },
      { type: "reward", xp: 100, message: "Kalkulasi subnetting selesai!" },
    ],
  });

  await connectPrereq(l10_1.id, l9_1.id);

  // ==========================================
  // PATH 3: Switching, VLAN & Routing
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
      { type: "heading", level: 2, text: "Proses Resolusi ARP" },
      { type: "interactive", interactiveType: "arp_visualizer", config: {} },
      { type: "reward", xp: 100, message: "Pelajaran ARP selesai!" },
    ],
  });

  const mod12 = await upsertModule(path3.id, "vlan-and-routing", "2. Segmentasi VLAN & Routing Table", "Isolasi broadcast domain dan Longest Prefix Match.", 2);
  const l12_1 = await upsertLesson(mod12.id, "vlan-segmentation-practice", "Konfigurasi Port VLAN & Evaluasi Routing", "Simulasi Access Port dan Longest Prefix Match.", 1, 120, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Virtual LAN (VLAN)" },
      { type: "interactive", interactiveType: "vlan_builder", config: {} },
      { type: "heading", level: 3, text: "Tabel Routing L3" },
      { type: "interactive", interactiveType: "routing_table", config: {} },
      { type: "reward", xp: 120, message: "Pelajaran VLAN & Routing selesai!" },
    ],
  });

  await connectPrereq(l12_1.id, l11_1.id);

  // ==========================================
  // PATH 4: Network Services (Sprint 9)
  // ==========================================
  const path4 = await upsertPath(
    "network-services",
    "Network Services & Security",
    "Pelajari protokol esensial: DHCP, DNS, NAT/PAT, HTTP/HTTPS, dan manajemen port jaringan.",
    "Server",
    4
  );

  const mod13 = await upsertModule(path4.id, "dhcp-and-dns-services", "1. Layanan DHCP & DNS", "Otomatisasi pengalamatan IP dan resolusi nama domain.", 1);
  const l13_1 = await upsertLesson(mod13.id, "dhcp-dora-process", "Proses 4-Tahap DHCP (DORA)", "Discover, Offer, Request, dan Acknowledge.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Alur Kerja Protokol DHCP (DORA)" },
      { type: "text", content: "DHCP memungkinkan klien mendapatkan konfigurasi IP, subnet mask, default gateway, dan DNS server secara otomatis saat terhubung ke jaringan." },
      { type: "interactive", interactiveType: "dhcp_dora", config: {} },
      { type: "reward", xp: 100, message: "Pelajaran DHCP selesai!" },
    ],
  });

  const l13_2 = await upsertLesson(mod13.id, "dns-query-resolution", "Hirarki Resolusi Domain DNS", "Root Server, TLD Server, dan Authoritative Record.", 2, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Bagaimana DNS Menerjemahkan Nama Domain?" },
      { type: "text", content: "DNS adalah buku telepon internet yang memetakan nama domain ramah manusia ke alamat IP server." },
      { type: "interactive", interactiveType: "dns_query", config: {} },
      { type: "reward", xp: 100, message: "Pelajaran DNS selesai!" },
    ],
  });

  const mod14 = await upsertModule(path4.id, "nat-pat-security", "2. NAT/PAT & Port Security", "Translasi IP privat ke publik dan pemetaan port.", 2);
  const l14_1 = await upsertLesson(mod14.id, "nat-pat-translation", "Network Address Translation (NAT/PAT)", "Inside Local ke Inside Global port forwarding.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Translasi Alamat Jaringan (NAT/PAT)" },
      { type: "interactive", interactiveType: "nat_visualizer", config: {} },
      { type: "reward", xp: 100, message: "Pelajaran NAT/PAT selesai!" },
    ],
  });

  await connectPrereq(l13_2.id, l13_1.id);
  await connectPrereq(l14_1.id, l13_2.id);

  // ==========================================
  // PATH 5: Wireless & Troubleshooting (Sprint 9)
  // ==========================================
  const path5 = await upsertPath(
    "wireless-troubleshooting",
    "Wireless & Troubleshooting",
    "Pelajari teknologi nirkabel Wi-Fi 6, frekuensi 2.4/5/6 GHz, keamanan WPA3, dan diagnostik CLI.",
    "Wifi",
    5
  );

  const mod15 = await upsertModule(path5.id, "wireless-technologies", "1. Teknologi Wi-Fi & Nirkabel", "Frekuensi gelombang radio, kanal, dan enkripsi.", 1);
  const l15_1 = await upsertLesson(mod15.id, "wifi-bands-and-security", "Frekuensi 2.4GHz vs 5GHz & WPA3", "Interferensi kanal dan standar keamanan nirkabel.", 1, 100, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Karakteristik Frekuensi Wi-Fi" },
      { type: "text", content: "Frekuensi 2.4 GHz memiliki jangkauan lebih jauh namun rentan interferensi, sedangkan 5 GHz & 6 GHz menawarkan bandwidth jauh lebih tinggi dengan jangkauan lebih pendek." },
      { type: "callout", variant: "tip", title: "Keamanan Nirkabel", content: "Gunakan standar WPA3 atau WPA2-Enterprise untuk perlindungan dari serangan brute-force." },
      { type: "reward", xp: 100, message: "Pelajaran nirkabel selesai!" },
    ],
  });

  const mod16 = await upsertModule(path5.id, "cli-troubleshooting-tools", "2. Diagnostik Jaringan & CLI", "Praktik perintah diagnostik jaringan langsung.", 2);
  const l16_1 = await upsertLesson(mod16.id, "terminal-diagnostics-lab", "Simulasi Perintah Diagnostik Jaringan", "Eksplorasi perintah ipconfig, ping, arp, tracert, nslookup, dan netstat.", 1, 150, {
    version: "1.0",
    blocks: [
      { type: "heading", level: 2, text: "Terminal Diagnostik Interaktif" },
      { type: "text", content: "Jalankan perintah diagnostik jaringan di bawah ini untuk memeriksa konfigurasi adapter, tabel ARP, dan konektivitas ICMP." },
      { type: "interactive", interactiveType: "terminal", config: {} },
      { type: "interactive", interactiveType: "icmp_ping", config: {} },
      { type: "reward", xp: 150, message: "Selamat! Anda telah menguasai diagnostik jaringan dasar!" },
    ],
  });

  await connectPrereq(l16_1.id, l15_1.id);

  console.log("🌱 Seeding Course Commerce Catalog & Packages...");
  await seedCommerceCatalog(prisma);

  console.log("✅ Seed completed successfully for all 5 Paths (1 to 5) and Commerce Catalog!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
