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
import { binaryIpv4ModuleData } from "../src/features/learning/content/ipv4-subnetting/binary-ipv4";
import { addressTypesModuleData } from "../src/features/learning/content/ipv4-subnetting/address-types";
import { maskCidrModuleData } from "../src/features/learning/content/ipv4-subnetting/mask-cidr";
import { subnetCalculationsModuleData } from "../src/features/learning/content/ipv4-subnetting/subnet-calculations";
import { vlsmDesignModuleData } from "../src/features/learning/content/ipv4-subnetting/vlsm-design";
import { ethernetMacModuleData } from "../src/features/learning/content/switching-lan/ethernet-mac";
import { arpBroadcastModuleData } from "../src/features/learning/content/switching-lan/arp-broadcast";
import { vlanSegmentationModuleData } from "../src/features/learning/content/switching-lan/vlan-segmentation";
import { accessTrunkModuleData } from "../src/features/learning/content/switching-lan/access-trunk";

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
  // PATH 2: IPv4 & Subnetting (Full 5 Modules, 10 Lessons)
  // ==========================================
  const path2 = await upsertPath(
    "ipv4-subnetting",
    "IPv4 & Subnetting",
    "Kuasai logika biner, struktur 32-bit IPv4, subnet mask, kalkulasi CIDR, dan alokasi VLSM secara mendalam.",
    "Binary",
    2
  );

  const path2Modules = [
    binaryIpv4ModuleData,
    addressTypesModuleData,
    maskCidrModuleData,
    subnetCalculationsModuleData,
    vlsmDesignModuleData,
  ];

  const path2Lessons: Record<string, { id: string }> = {};

  for (let mIdx = 0; mIdx < path2Modules.length; mIdx++) {
    const modData = path2Modules[mIdx];
    const moduleRecord = await upsertModule(
      path2.id,
      modData.slug,
      `${mIdx + 1}. ${modData.title}`,
      modData.description,
      mIdx + 1
    );

    for (const lesson of modData.lessons) {
      path2Lessons[lesson.slug] = await upsertLesson(
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

  // Connect prerequisites for all Path 2 lessons (P2-L01 -> P2-L02 -> ... -> P2-L10)
  for (const modData of path2Modules) {
    for (const lesson of modData.lessons) {
      for (const prereqSlug of lesson.prerequisites) {
        if (path2Lessons[prereqSlug] && path2Lessons[lesson.slug]) {
          await connectPrereq(
            path2Lessons[lesson.slug].id,
            path2Lessons[prereqSlug].id
          );
        }
      }
    }
  }

  // Migrate progress from legacy prototype lessons if they exist in the database
  const legacyBinary = await prisma.lesson.findFirst({
    where: { slug: "binary-fundamentals" },
    include: { userProgress: true },
  });
  if (legacyBinary && path2Lessons["biner-8-bit"]) {
    for (const prog of legacyBinary.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path2Lessons["biner-8-bit"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path2Lessons["biner-8-bit"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
    await prisma.module.deleteMany({
      where: { pathId: path2.id, slug: "binary-ipv4-structure" },
    });
  }

  const legacySubnetLab = await prisma.lesson.findFirst({
    where: { slug: "subnet-calculator-lab" },
    include: { userProgress: true },
  });
  if (legacySubnetLab && path2Lessons["network-broadcast"]) {
    for (const prog of legacySubnetLab.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path2Lessons["network-broadcast"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path2Lessons["network-broadcast"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
    await prisma.module.deleteMany({
      where: { pathId: path2.id, slug: "subnet-calculations" },
    });
  }

  // ==========================================
  // PATH 3: Switching & LAN (Full 4 Modules, 8 Lessons)
  // ==========================================
  const path3 = await upsertPath(
    "switching-lan",
    "Switching & LAN",
    "Pahami Ethernet frame, MAC address table, protokol ARP, segmentasi broadcast domain VLAN, serta konfigurasi Access Port dan 802.1Q Trunk.",
    "Network",
    3
  );

  const path3Modules = [
    ethernetMacModuleData,
    arpBroadcastModuleData,
    vlanSegmentationModuleData,
    accessTrunkModuleData,
  ];

  const path3Lessons: Record<string, { id: string }> = {};

  for (let mIdx = 0; mIdx < path3Modules.length; mIdx++) {
    const modData = path3Modules[mIdx];
    const moduleRecord = await upsertModule(
      path3.id,
      modData.slug,
      `${mIdx + 1}. ${modData.title}`,
      modData.description,
      mIdx + 1
    );

    for (const lesson of modData.lessons) {
      path3Lessons[lesson.slug] = await upsertLesson(
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

  // Connect prerequisites for all Path 3 lessons (linear sequence)
  for (const modData of path3Modules) {
    for (const lesson of modData.lessons) {
      for (const prereqSlug of lesson.prerequisites) {
        if (path3Lessons[prereqSlug] && path3Lessons[lesson.slug]) {
          await connectPrereq(
            path3Lessons[lesson.slug].id,
            path3Lessons[prereqSlug].id
          );
        }
      }
    }
  }

  // Migrate progress from legacy prototype lessons if they exist in the database
  const legacyArp = await prisma.lesson.findFirst({
    where: { slug: "arp-resolution-flow" },
    include: { userProgress: true },
  });
  if (legacyArp && path3Lessons["arp-request-reply"]) {
    for (const prog of legacyArp.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path3Lessons["arp-request-reply"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path3Lessons["arp-request-reply"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
  }

  const legacyVlan = await prisma.lesson.findFirst({
    where: { slug: "vlan-segmentation-practice" },
    include: { userProgress: true },
  });
  if (legacyVlan && path3Lessons["broadcast-domain-vlan"]) {
    for (const prog of legacyVlan.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path3Lessons["broadcast-domain-vlan"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path3Lessons["broadcast-domain-vlan"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
  }

  // Clean up legacy path and modules if they exist
  const legacyPath3 = await prisma.learningPath.findUnique({
    where: { slug: "switching-vlan-routing" },
  });
  if (legacyPath3) {
    await prisma.learningPath.delete({
      where: { slug: "switching-vlan-routing" },
    });
  }

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
