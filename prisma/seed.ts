/**
 * Netloka Database Seed
 * Seeds initial Network Foundations learning path, modules, lessons, and prerequisites.
 */

import { prisma, closeDatabaseConnection } from "../src/lib/db/client";

async function main() {
  console.log("🌱 Seeding Netloka Learning Curriculum...");

  // 1. Create Learning Path: Network Foundations
  const path1 = await prisma.learningPath.upsert({
    where: { slug: "network-foundations" },
    update: {
      title: "Network Foundations",
      description:
        "Pelajari dasar-dasar jaringan komputer, cara data berpindah, model OSI, dan perangkat jaringan utama.",
      icon: "BookOpen",
      orderIndex: 1,
      published: true,
    },
    create: {
      slug: "network-foundations",
      title: "Network Foundations",
      description:
        "Pelajari dasar-dasar jaringan komputer, cara data berpindah, model OSI, dan perangkat jaringan utama.",
      icon: "BookOpen",
      orderIndex: 1,
      published: true,
    },
  });

  // 2. Module 1: Welcome to Networking
  const mod1 = await prisma.module.upsert({
    where: {
      pathId_slug: {
        pathId: path1.id,
        slug: "welcome-to-networking",
      },
    },
    update: {
      title: "1. Welcome to Networking",
      description: "Memahami apa itu jaringan dan konsep dasar pertukaran data.",
      orderIndex: 1,
      published: true,
    },
    create: {
      pathId: path1.id,
      slug: "welcome-to-networking",
      title: "1. Welcome to Networking",
      description: "Memahami apa itu jaringan dan konsep dasar pertukaran data.",
      orderIndex: 1,
      published: true,
    },
  });

  // Lesson 1.1: Intro to Networking
  const lesson1 = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: mod1.id,
        slug: "intro-to-networking",
      },
    },
    update: {
      title: "Apa Itu Jaringan Komputer?",
      description: "Pengenalan konsep dasar jaringan, client, server, dan node.",
      orderIndex: 1,
      xpReward: 50,
      published: true,
    },
    create: {
      moduleId: mod1.id,
      slug: "intro-to-networking",
      title: "Apa Itu Jaringan Komputer?",
      description: "Pengenalan konsep dasar jaringan, client, server, dan node.",
      orderIndex: 1,
      xpReward: 50,
      published: true,
    },
  });

  // Lesson 1.2: How Computers Communicate
  const lesson2 = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: mod1.id,
        slug: "how-computers-communicate",
      },
    },
    update: {
      title: "Bagaimana Komputer Berkomunikasi?",
      description: "Proses pengiriman pesan, request/response, dan protokol dasar.",
      orderIndex: 2,
      xpReward: 50,
      published: true,
    },
    create: {
      moduleId: mod1.id,
      slug: "how-computers-communicate",
      title: "Bagaimana Komputer Berkomunikasi?",
      description: "Proses pengiriman pesan, request/response, dan protokol dasar.",
      orderIndex: 2,
      xpReward: 50,
      published: true,
    },
  });

  // 3. Module 2: Types of Networks
  const mod2 = await prisma.module.upsert({
    where: {
      pathId_slug: {
        pathId: path1.id,
        slug: "types-of-networks",
      },
    },
    update: {
      title: "2. Types of Networks & Topology",
      description: "Klasifikasi jaringan berdasarkan skala geografis dan bentuk topologi.",
      orderIndex: 2,
      published: true,
    },
    create: {
      pathId: path1.id,
      slug: "types-of-networks",
      title: "2. Types of Networks & Topology",
      description: "Klasifikasi jaringan berdasarkan skala geografis dan bentuk topologi.",
      orderIndex: 2,
      published: true,
    },
  });

  // Lesson 2.1: LAN, MAN, WAN
  const lesson3 = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: mod2.id,
        slug: "lan-man-wan",
      },
    },
    update: {
      title: "Klasifikasi Skala: LAN, MAN, & WAN",
      description: "Membedakan karakteristik Local Area Network, Metropolitan, dan Wide Area Network.",
      orderIndex: 1,
      xpReward: 75,
      published: true,
    },
    create: {
      moduleId: mod2.id,
      slug: "lan-man-wan",
      title: "Klasifikasi Skala: LAN, MAN, & WAN",
      description: "Membedakan karakteristik Local Area Network, Metropolitan, dan Wide Area Network.",
      orderIndex: 1,
      xpReward: 75,
      published: true,
    },
  });

  // Lesson 2.2: Network Topologies
  const lesson4 = await prisma.lesson.upsert({
    where: {
      moduleId_slug: {
        moduleId: mod2.id,
        slug: "network-topologies",
      },
    },
    update: {
      title: "Topologi Jaringan (Star, Bus, Ring, Mesh)",
      description: "Menganalisis kelebihan dan kekurangan berbagai bentuk susunan fisik jaringan.",
      orderIndex: 2,
      xpReward: 75,
      published: true,
    },
    create: {
      moduleId: mod2.id,
      slug: "network-topologies",
      title: "Topologi Jaringan (Star, Bus, Ring, Mesh)",
      description: "Menganalisis kelebihan dan kekurangan berbagai bentuk susunan fisik jaringan.",
      orderIndex: 2,
      xpReward: 75,
      published: true,
    },
  });

  // 4. Connect Prerequisites
  // Lesson 2 requires Lesson 1
  await prisma.lessonPrerequisite.upsert({
    where: {
      lessonId_prerequisiteId: {
        lessonId: lesson2.id,
        prerequisiteId: lesson1.id,
      },
    },
    update: {},
    create: {
      lessonId: lesson2.id,
      prerequisiteId: lesson1.id,
    },
  });

  // Lesson 3 requires Lesson 2
  await prisma.lessonPrerequisite.upsert({
    where: {
      lessonId_prerequisiteId: {
        lessonId: lesson3.id,
        prerequisiteId: lesson2.id,
      },
    },
    update: {},
    create: {
      lessonId: lesson3.id,
      prerequisiteId: lesson2.id,
    },
  });

  // Lesson 4 requires Lesson 3
  await prisma.lessonPrerequisite.upsert({
    where: {
      lessonId_prerequisiteId: {
        lessonId: lesson4.id,
        prerequisiteId: lesson3.id,
      },
    },
    update: {},
    create: {
      lessonId: lesson4.id,
      prerequisiteId: lesson3.id,
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
