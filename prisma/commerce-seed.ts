import type { PrismaClient } from "../src/generated/prisma/client";
import { validateCourseAvailability, validatePackageDefinition } from "../src/features/commerce/catalog-rules";
import type { CourseAccessTier, CatalogStatus, PackageKind } from "../src/features/commerce/types";

export interface SeedCourseDef {
  slug: string;
  title: string;
  track: string;
  accessTier: CourseAccessTier;
  catalogStatus: CatalogStatus;
  description: string;
  orderIndex: number;
}

export interface SeedPackageDef {
  slug: string;
  title: string;
  kind: PackageKind;
  catalogStatus: CatalogStatus;
  description: string;
  amountIdr: number | null;
  currency: string;
  orderIndex: number;
  courseSlugs: string[];
}

export const INITIAL_COURSES: SeedCourseDef[] = [
  {
    slug: "networking",
    title: "Network Foundations",
    track: "networking",
    accessTier: "FREE",
    catalogStatus: "AVAILABLE",
    description: "Fondasi fundamental jaringan komputer, IPv4 subnetting, switching, routing, dan troubleshooting.",
    orderIndex: 1,
  },
  {
    slug: "cctv",
    title: "CCTV & Video Surveillance",
    track: "cctv",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Perancangan IP Camera, NVR, topologi PoE, bandwidth video, dan integrasi pengawasan keamanan.",
    orderIndex: 2,
  },
  {
    slug: "fiber-optic",
    title: "Fiber Optic Installation & Splicing",
    track: "fiber-optic",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Instalasi kabel serat optik, teknik fusion splicing, OTB, optical power budget, dan OTDR testing.",
    orderIndex: 3,
  },
  {
    slug: "voip",
    title: "PABX, IP PBX & VoIP Telephony",
    track: "voip",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Telefoni IP modern, SIP trunking, dial plan Asterisk/FreePBX, codec audio, dan voice QoS.",
    orderIndex: 4,
  },
  {
    slug: "mikrotik",
    title: "MikroTik Certified Network Associate",
    track: "mikrotik",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Konfigurasi RouterOS, firewall filtering, bandwidth queue, hotspot gateway, dan routing dinamis.",
    orderIndex: 5,
  },
  {
    slug: "cisco",
    title: "Cisco Certified Network Associate",
    track: "cisco",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Konfigurasi Cisco IOS enterprise, VLAN trunking, STP/RSTP, OSPF, ACL, dan automation.",
    orderIndex: 6,
  },
  {
    slug: "linux-server",
    title: "Linux & Server Administration",
    track: "linux-server",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Administrasi sistem operasi Linux, SSH hardening, web server Nginx, DNS BIND9, dan monitoring server.",
    orderIndex: 7,
  },
  {
    slug: "security",
    title: "Network Security & Cyber Defense",
    track: "security",
    accessTier: "PREMIUM",
    catalogStatus: "COMING_SOON",
    description: "Pertahanan perimeter jaringan, IDS/IPS Snort, VPN tunneling WireGuard/IPsec, dan network vulnerability assessment.",
    orderIndex: 8,
  },
];

export const INITIAL_PACKAGES: SeedPackageDef[] = [
  // 7 Single Packages
  {
    slug: "cctv-course",
    title: "Kursus Mandiri CCTV & Video Surveillance",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup modul pembelajaran interaktif dan simulasi IP Camera & NVR.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 1,
    courseSlugs: ["cctv"],
  },
  {
    slug: "fiber-optic-course",
    title: "Kursus Mandiri Fiber Optic",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup modul praktikum interaktif serat optik dan optical loss calculation.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 2,
    courseSlugs: ["fiber-optic"],
  },
  {
    slug: "voip-course",
    title: "Kursus Mandiri VoIP & IP PBX",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup modul rancang bangun telepon IP dan PBX enterprise.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 3,
    courseSlugs: ["voip"],
  },
  {
    slug: "mikrotik-course",
    title: "Kursus Mandiri MikroTik MTCNA",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup simulator konfigurasi RouterOS dan manajemen bandwidth profesional.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 4,
    courseSlugs: ["mikrotik"],
  },
  {
    slug: "cisco-course",
    title: "Kursus Mandiri Cisco CCNA",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup materi kurikulum Cisco enterprise dan simulasi routing switching.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 5,
    courseSlugs: ["cisco"],
  },
  {
    slug: "linux-server-course",
    title: "Kursus Mandiri Linux Server Administration",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup modul sysadmin Linux, manajemen service, dan server security.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 6,
    courseSlugs: ["linux-server"],
  },
  {
    slug: "security-course",
    title: "Kursus Mandiri Network Security",
    kind: "SINGLE",
    catalogStatus: "COMING_SOON",
    description: "Akses seumur hidup modul cyber defense, VPN, firewall audit, dan security hardening.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 7,
    courseSlugs: ["security"],
  },

  // 3 Combo Packages
  {
    slug: "field-infrastructure-bundle",
    title: "Field Infrastructure Bundle (CCTV + Fiber Optic)",
    kind: "COMBO",
    catalogStatus: "COMING_SOON",
    description: "Paket lengkap infrastruktur fisik lapangan: pengawasan kamera IP dan transmisi fiber optik.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 8,
    courseSlugs: ["cctv", "fiber-optic"],
  },
  {
    slug: "network-operations-bundle",
    title: "Network Operations Bundle (MikroTik + Linux Server)",
    kind: "COMBO",
    catalogStatus: "COMING_SOON",
    description: "Paket operasional jaringan ISP & Enterprise: routing MikroTik dan server Linux terpadu.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 9,
    courseSlugs: ["mikrotik", "linux-server"],
  },
  {
    slug: "secure-connectivity-bundle",
    title: "Secure Connectivity Bundle (Cisco + Network Security)",
    kind: "COMBO",
    catalogStatus: "COMING_SOON",
    description: "Paket spesialis keamanan jaringan: routing enterprise Cisco dan pertahanan cyber defense.",
    amountIdr: null,
    currency: "IDR",
    orderIndex: 10,
    courseSlugs: ["cisco", "security"],
  },
];

export async function seedCommerceCatalog(prisma: PrismaClient): Promise<void> {
  // 1. Seed Courses with rule validation
  const seededCoursesBySlug = new Map<string, { id: string }>();

  for (const courseDef of INITIAL_COURSES) {
    validateCourseAvailability({
      slug: courseDef.slug,
      title: courseDef.title,
      accessTier: courseDef.accessTier,
      catalogStatus: courseDef.catalogStatus,
    });

    const courseRecord = await prisma.course.upsert({
      where: { slug: courseDef.slug },
      update: {
        title: courseDef.title,
        track: courseDef.track,
        accessTier: courseDef.accessTier,
        catalogStatus: courseDef.catalogStatus,
        description: courseDef.description,
        orderIndex: courseDef.orderIndex,
      },
      create: {
        slug: courseDef.slug,
        title: courseDef.title,
        track: courseDef.track,
        accessTier: courseDef.accessTier,
        catalogStatus: courseDef.catalogStatus,
        description: courseDef.description,
        orderIndex: courseDef.orderIndex,
      },
    });

    seededCoursesBySlug.set(courseDef.slug, courseRecord);
  }

  // Link networking course to existing Network Foundations path if present
  try {
    const prismaWithPaths = prisma as unknown as {
      learningPath?: {
        findUnique?: (args: { where: { slug: string } }) => Promise<{ id: string } | null>;
      };
    };
    const networkingPath = await prismaWithPaths.learningPath?.findUnique?.({
      where: { slug: "network-foundations" },
    });
    if (networkingPath) {
      await prisma.course.update({
        where: { slug: "networking" },
        data: { learningPathId: networkingPath.id },
      });
    }
  } catch {
    // Ignore if learningPath model not yet available in unit test mock
  }

  // 2. Seed Packages & PackageCourses
  for (const pkgDef of INITIAL_PACKAGES) {
    const includedCourses = pkgDef.courseSlugs.map((slug) => {
      const found = INITIAL_COURSES.find((c) => c.slug === slug);
      if (!found) throw new Error(`Missing course definition for slug: ${slug}`);
      return {
        slug: found.slug,
        title: found.title,
        accessTier: found.accessTier,
        catalogStatus: found.catalogStatus,
      };
    });

    validatePackageDefinition({
      slug: pkgDef.slug,
      title: pkgDef.title,
      kind: pkgDef.kind,
      catalogStatus: pkgDef.catalogStatus,
      amountIdr: pkgDef.amountIdr,
      courses: includedCourses,
    });

    const pkgRecord = await prisma.package.upsert({
      where: { slug: pkgDef.slug },
      update: {
        title: pkgDef.title,
        kind: pkgDef.kind,
        catalogStatus: pkgDef.catalogStatus,
        description: pkgDef.description,
        amountIdr: pkgDef.amountIdr,
        currency: pkgDef.currency,
        orderIndex: pkgDef.orderIndex,
      },
      create: {
        slug: pkgDef.slug,
        title: pkgDef.title,
        kind: pkgDef.kind,
        catalogStatus: pkgDef.catalogStatus,
        description: pkgDef.description,
        amountIdr: pkgDef.amountIdr,
        currency: pkgDef.currency,
        orderIndex: pkgDef.orderIndex,
      },
    });

    // Link package courses
    for (let i = 0; i < pkgDef.courseSlugs.length; i++) {
      const courseSlug = pkgDef.courseSlugs[i];
      const course = seededCoursesBySlug.get(courseSlug);
      if (course) {
        await prisma.packageCourse.upsert({
          where: {
            packageId_courseId: {
              packageId: pkgRecord.id,
              courseId: course.id,
            },
          },
          update: {
            orderIndex: i,
          },
          create: {
            packageId: pkgRecord.id,
            courseId: course.id,
            orderIndex: i,
          },
        });
      }
    }
  }
}
