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
import { gatewayRouteModuleData } from "../src/features/learning/content/routing-services/gateway-route";
import { staticIntervlanModuleData } from "../src/features/learning/content/routing-services/static-intervlan";
import { dhcpDnsModuleData } from "../src/features/learning/content/routing-services/dhcp-dns";
import { natPatModuleData } from "../src/features/learning/content/routing-services/nat-pat";
import { transportServicesModuleData } from "../src/features/learning/content/routing-services/transport-services";
import { wirelessBasicsModuleData } from "../src/features/learning/content/wireless-troubleshooting/wireless-basics";
import { wirelessSecurityModuleData } from "../src/features/learning/content/wireless-troubleshooting/wireless-security";
import { diagnosticToolsModuleData } from "../src/features/learning/content/wireless-troubleshooting/diagnostic-tools";
import { troubleshootingMethodologyModuleData } from "../src/features/learning/content/wireless-troubleshooting/troubleshooting-methodology";
import { requirementsAnalysisModuleData } from "../src/features/learning/content/network-planning/requirements-analysis";
import { capacityProcurementModuleData } from "../src/features/learning/content/network-planning/capacity-procurement";
import { topologyIpVlanDesignModuleData } from "../src/features/learning/content/network-planning/topology-ip-vlan-design";
import { proposalReviewModuleData } from "../src/features/learning/content/network-planning/proposal-review";
import { appliedCasesModuleData } from "../src/features/learning/content/network-planning/applied-cases";

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
  // PATH 4: Routing & Network Services (Full 5 Modules, 10 Lessons)
  // ==========================================
  const path4 = await upsertPath(
    "network-services",
    "Routing & Network Services",
    "Kuasai konsep routing IP, Default Gateway, Longest Prefix Match, rute statis, Inter-VLAN Routing, DHCP, DNS, NAT/PAT, dan protokol transport.",
    "Server",
    4
  );

  const path4Modules = [
    gatewayRouteModuleData,
    staticIntervlanModuleData,
    dhcpDnsModuleData,
    natPatModuleData,
    transportServicesModuleData,
  ];

  const path4Lessons: Record<string, { id: string }> = {};

  for (let mIdx = 0; mIdx < path4Modules.length; mIdx++) {
    const modData = path4Modules[mIdx];
    const moduleRecord = await upsertModule(
      path4.id,
      modData.slug,
      `${mIdx + 1}. ${modData.title}`,
      modData.description,
      mIdx + 1
    );

    for (const lesson of modData.lessons) {
      path4Lessons[lesson.slug] = await upsertLesson(
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

  // Connect prerequisites for all Path 4 lessons (linear sequence)
  for (const modData of path4Modules) {
    for (const lesson of modData.lessons) {
      for (const prereqSlug of lesson.prerequisites) {
        if (path4Lessons[prereqSlug] && path4Lessons[lesson.slug]) {
          await connectPrereq(
            path4Lessons[lesson.slug].id,
            path4Lessons[prereqSlug].id
          );
        }
      }
    }
  }

  // Migrate progress from legacy prototype lessons if they exist in the database
  const legacyNat = await prisma.lesson.findFirst({
    where: { slug: "nat-pat-translation" },
    include: { userProgress: true },
  });
  if (legacyNat && path4Lessons["pat-port-address-translation"]) {
    for (const prog of legacyNat.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path4Lessons["pat-port-address-translation"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path4Lessons["pat-port-address-translation"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
    await prisma.lesson.deleteMany({
      where: { slug: "nat-pat-translation" },
    });
  }

  // Clean up legacy prototype modules if they exist
  await prisma.module.deleteMany({
    where: {
      pathId: path4.id,
      slug: { in: ["dhcp-and-dns-services", "nat-pat-security"] },
    },
  });

  // Seed Path 4 Capstone Challenge
  await prisma.challenge.upsert({
    where: { slug: "named-service-outage" },
    update: {
      title: "Enterprise Named-Service Outage Diagnosis & Repair",
      description:
        "Investigasi kegagalan layanan jaringan kantor: default gateway salah, DNS resolver tidak aktif, NAT overload mati, dan analisis pemblokiran port web.",
      difficulty: "intermediate",
      xpReward: 150,
      scenario: {
        network: "192.168.1.0/24",
        gateway: "192.168.1.1",
        dns: "192.168.1.10",
      },
    },
    create: {
      slug: "named-service-outage",
      title: "Enterprise Named-Service Outage Diagnosis & Repair",
      description:
        "Investigasi kegagalan layanan jaringan kantor: default gateway salah, DNS resolver tidak aktif, NAT overload mati, dan analisis pemblokiran port web.",
      difficulty: "intermediate",
      xpReward: 150,
      scenario: {
        network: "192.168.1.0/24",
        gateway: "192.168.1.1",
        dns: "192.168.1.10",
      },
    },
  });

  // ==========================================
  // PATH 5: Wireless & Troubleshooting (Full 4 Modules, 8 Lessons)
  // ==========================================
  const path5 = await upsertPath(
    "wireless-troubleshooting",
    "Wireless & Troubleshooting",
    "Kuasai karakteristik frekuensi nirkabel Wi-Fi 2.4/5/6 GHz, channel interference, WPA2/WPA3, isolasi jaringan tamu, utilitas CLI diagnostik, dan metodologi troubleshooting terstruktur.",
    "Wifi",
    5
  );

  const path5Modules = [
    wirelessBasicsModuleData,
    wirelessSecurityModuleData,
    diagnosticToolsModuleData,
    troubleshootingMethodologyModuleData,
  ];

  const path5Lessons: Record<string, { id: string }> = {};

  for (let mIdx = 0; mIdx < path5Modules.length; mIdx++) {
    const modData = path5Modules[mIdx];
    const moduleRecord = await upsertModule(
      path5.id,
      modData.slug,
      `${mIdx + 1}. ${modData.title}`,
      modData.description,
      mIdx + 1
    );

    for (const lesson of modData.lessons) {
      path5Lessons[lesson.slug] = await upsertLesson(
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

  // Connect prerequisites for all Path 5 lessons (linear sequence)
  for (const modData of path5Modules) {
    for (const lesson of modData.lessons) {
      for (const prereqSlug of lesson.prerequisites) {
        if (path5Lessons[prereqSlug] && path5Lessons[lesson.slug]) {
          await connectPrereq(
            path5Lessons[lesson.slug].id,
            path5Lessons[prereqSlug].id
          );
        }
      }
    }
  }

  // Migrate progress from legacy prototype lessons if they exist in the database
  const legacyWifi = await prisma.lesson.findFirst({
    where: { slug: "wifi-bands-and-security" },
    include: { userProgress: true },
  });
  if (legacyWifi && path5Lessons["band-frekuensi-wifi"]) {
    for (const prog of legacyWifi.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path5Lessons["band-frekuensi-wifi"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path5Lessons["band-frekuensi-wifi"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
    await prisma.lesson.deleteMany({
      where: { slug: "wifi-bands-and-security" },
    });
  }

  const legacyCli = await prisma.lesson.findFirst({
    where: { slug: "terminal-diagnostics-lab" },
    include: { userProgress: true },
  });
  if (legacyCli && path5Lessons["ipconfig-ping-diagnostic"]) {
    for (const prog of legacyCli.userProgress) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: prog.userId,
            lessonId: path5Lessons["ipconfig-ping-diagnostic"].id,
          },
        },
        update: { status: prog.status, completedAt: prog.completedAt },
        create: {
          userId: prog.userId,
          lessonId: path5Lessons["ipconfig-ping-diagnostic"].id,
          status: prog.status,
          completedAt: prog.completedAt,
        },
      });
    }
    await prisma.lesson.deleteMany({
      where: { slug: "terminal-diagnostics-lab" },
    });
  }

  // Clean up legacy prototype modules if they exist
  await prisma.module.deleteMany({
    where: {
      pathId: path5.id,
      slug: { in: ["wireless-technologies", "cli-troubleshooting-tools"] },
    },
  });

  // Seed Path 5 Capstone Challenge
  await prisma.challenge.upsert({
    where: { slug: "multi-incident-investigation" },
    update: {
      title: "Multi-Incident Network Investigation & Remediation",
      description:
        "Investigasi multi-insiden jaringan enterprise: diagnosis APIPA DHCP pool exhausted, perbaikan VLAN trunking, penyesuaian gateway kantor cabang, dan metodologi troubleshooting terstruktur.",
      difficulty: "advanced",
      xpReward: 200,
      scenario: {
        network: "192.168.0.0/16",
        incidents: ["dhcp-apipa", "inter-vlan", "branch-gateway", "methodology"],
      },
    },
    create: {
      slug: "multi-incident-investigation",
      title: "Multi-Incident Network Investigation & Remediation",
      description:
        "Investigasi multi-insiden jaringan enterprise: diagnosis APIPA DHCP pool exhausted, perbaikan VLAN trunking, penyesuaian gateway kantor cabang, dan metodologi troubleshooting terstruktur.",
      difficulty: "advanced",
      xpReward: 200,
      scenario: {
        network: "192.168.0.0/16",
        incidents: ["dhcp-apipa", "inter-vlan", "branch-gateway", "methodology"],
      },
    },
  });

  // ==========================================
  // PATH 6: Network Planning & IT Consultant (Modules 1-5, 10 Lessons)
  // ==========================================
  const path6 = await upsertPath(
    "network-planning",
    "Network Planning & IT Consultant",
    "Pelajari analisis kebutuhan klien, kalkulasi kapasitas port/AP/PoE, penyusunan BoQ, desain topologi hirarkis, segmentasi VLAN, serta dokumentasi proposal teknis profesional.",
    "Briefcase",
    6
  );

  const path6Modules = [
    requirementsAnalysisModuleData,
    capacityProcurementModuleData,
    topologyIpVlanDesignModuleData,
    proposalReviewModuleData,
    appliedCasesModuleData,
  ];

  const path6Lessons: Record<string, { id: string }> = {};

  for (let mIdx = 0; mIdx < path6Modules.length; mIdx++) {
    const modData = path6Modules[mIdx];
    const moduleRecord = await upsertModule(
      path6.id,
      modData.slug,
      `${mIdx + 1}. ${modData.title}`,
      modData.description,
      mIdx + 1
    );

    for (const lesson of modData.lessons) {
      path6Lessons[lesson.slug] = await upsertLesson(
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

  // Connect prerequisites for all Path 6 lessons (linear sequence)
  for (const modData of path6Modules) {
    for (const lesson of modData.lessons) {
      for (const prereqSlug of lesson.prerequisites) {
        if (path6Lessons[prereqSlug] && path6Lessons[lesson.slug]) {
          await connectPrereq(
            path6Lessons[lesson.slug].id,
            path6Lessons[prereqSlug].id
          );
        }
      }
    }
  }

  console.log("🌱 Seeding IT Consultant Cases...");
  await seedConsultantCases(prisma);

  console.log("🌱 Seeding Course Commerce Catalog & Packages...");
  await seedCommerceCatalog(prisma);

  console.log("✅ Seed completed successfully for all 6 Paths (1 to 6), Consultant Cases, and Commerce Catalog!");
}

async function seedConsultantCases(prismaClient: typeof prisma) {
  const cases = [
    {
      slug: "small-office-notaris",
      title: "1. Kantor Notaris & PPAT (SOHO)",
      clientName: "Kantor Notaris & PPAT H. Suryadi, S.H.",
      clientType: "small-office",
      description: "Perancangan jaringan LAN kantor notaris untuk 12 workstation staf, printer sharing, dan 2 Access Point Wi-Fi tamu.",
      budget: 15000000,
      difficulty: "Beginner",
      orderIndex: 1,
      requirements: {
        wiredClientCount: 12,
        apCount: 2,
        requireVlan: false,
        requirePoe: true,
      },
      constraints: {
        maxBudget: 15000000,
        minAccessPorts: 12,
      },
    },
    {
      slug: "warnet-gaming-center",
      title: "2. Warnet & Esports Gaming Center",
      clientName: "CyberArena Esports Cafe",
      clientType: "warnet",
      description: "Infrastruktur jaringan 30 PC Gaming dengan throughput tinggi, Dual-WAN ISP Failover, dan bandwidth management rendah latensi.",
      budget: 25000000,
      difficulty: "Intermediate",
      orderIndex: 2,
      requirements: {
        wiredClientCount: 30,
        apCount: 2,
        requireVlan: false,
        requireDualWan: true,
        requirePoe: false,
      },
      constraints: {
        maxBudget: 25000000,
        minAccessPorts: 30,
      },
    },
    {
      slug: "medium-office-logistics",
      title: "3. Kantor Logistik & Gudang Distribusi",
      clientName: "PT Nusantara Express Logistics",
      clientType: "medium-office",
      description: "Jaringan 40 PC staf, server lokal, CCTV IP, dan segmentasi 3 VLAN (Staff, Server, Guest) dengan Wi-Fi 6.",
      budget: 50000000,
      difficulty: "Intermediate",
      orderIndex: 3,
      requirements: {
        wiredClientCount: 40,
        apCount: 3,
        requireVlan: true,
        requireDualWan: true,
        requirePoe: true,
        vlanList: [
          { vlanId: 10, name: "Staff Operasional", requiredHosts: 40 },
          { vlanId: 20, name: "Server & CCTV", requiredHosts: 10 },
          { vlanId: 30, name: "Tamu (Guest)", requiredHosts: 30 },
        ],
      },
      constraints: {
        maxBudget: 50000000,
        minAccessPorts: 40,
      },
    },
    {
      slug: "smk-tkj-school-lab",
      title: "4. Laboratorium Jaringan Komputer SMK TKJ",
      clientName: "SMK Negeri 1 Teknologi",
      clientType: "school",
      description: "Perancangan 2 Lab Komputer (@ 36 PC) + Ruang Guru & Server Room dengan arsitektur Core-Distribution Switch dan VLAN.",
      budget: 75000000,
      difficulty: "Advanced",
      orderIndex: 4,
      requirements: {
        wiredClientCount: 72,
        apCount: 4,
        requireVlan: true,
        requirePoe: true,
        vlanList: [
          { vlanId: 10, name: "Lab Komputer 1", requiredHosts: 36 },
          { vlanId: 20, name: "Lab Komputer 2", requiredHosts: 36 },
          { vlanId: 99, name: "Guru & Manajemen", requiredHosts: 20 },
        ],
      },
      constraints: {
        maxBudget: 75000000,
        minAccessPorts: 72,
      },
    },
    {
      slug: "multi-floor-corporate",
      title: "5. Gedung Korporat Multi-Lantai (3 Lantai)",
      clientName: "Gedung Menara Finansial 3-Lantai",
      clientType: "enterprise",
      description: "Infrastruktur enterprise 100 node dengan backbone Fiber Optic 10G SFP+, Redundant Core Switch, dan Wi-Fi 6 multi-SSID.",
      budget: 120000000,
      difficulty: "Advanced",
      orderIndex: 5,
      requirements: {
        wiredClientCount: 100,
        apCount: 6,
        requireVlan: true,
        requireDualWan: true,
        requirePoe: true,
        vlanList: [
          { vlanId: 10, name: "Lantai 1 Front Office", requiredHosts: 30 },
          { vlanId: 20, name: "Lantai 2 Finance & HR", requiredHosts: 40 },
          { vlanId: 30, name: "Lantai 3 Executive", requiredHosts: 30 },
          { vlanId: 50, name: "Wi-Fi Tamu", requiredHosts: 50 },
        ],
      },
      constraints: {
        maxBudget: 120000000,
        minAccessPorts: 100,
      },
    },
  ];

  for (const c of cases) {
    await prismaClient.consultantCase.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        clientName: c.clientName,
        clientType: c.clientType,
        description: c.description,
        budget: c.budget,
        difficulty: c.difficulty,
        orderIndex: c.orderIndex,
        requirements: c.requirements,
        constraints: c.constraints,
        published: true,
      },
      create: {
        slug: c.slug,
        title: c.title,
        clientName: c.clientName,
        clientType: c.clientType,
        description: c.description,
        budget: c.budget,
        difficulty: c.difficulty,
        orderIndex: c.orderIndex,
        requirements: c.requirements,
        constraints: c.constraints,
        published: true,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
