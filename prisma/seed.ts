/**
 * Netloka Database Seed
 * Seeds initial Network Foundations learning path, modules, lessons, and rich block content.
 */

import { prisma, closeDatabaseConnection } from "../src/lib/db/client";

async function main() {
  console.log("🌱 Seeding Netloka Learning Curriculum & Block Content...");

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

  // Lesson 1.1: Intro to Networking (With Complete Block Loop)
  const lesson1Content = {
    version: "1.0",
    blocks: [
      {
        type: "heading",
        level: 2,
        text: "Apa Sebenarnya Jaringan Komputer Itu?",
      },
      {
        type: "text",
        content:
          "Secara sederhana, jaringan komputer adalah kumpulan dua atau lebih perangkat komputasi yang saling terhubung menggunakan media kabel atau nirkabel. Tujuannya adalah untuk bertukar data, berbagi sumber daya (seperti printer dan file server), serta menjalankan layanan komunikasi.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Konsep Dasar: Node & Host",
        content:
          "Setiap perangkat yang terhubung ke jaringan dan memiliki alamat IP atau MAC disebut sebagai Node. Perangkat pengguna akhir seperti laptop atau smartphone sering disebut sebagai Host.",
      },
      {
        type: "heading",
        level: 3,
        text: "Bagaimana Perangkat Saling Terhubung?",
      },
      {
        type: "diagram",
        diagramType: "topology",
        data: {
          topology: "star",
          centralNode: "Switch L2",
          endpoints: ["PC-Admin", "PC-Staff", "Server-File"],
        },
        caption: "Topologi Star Dasar: Perangkat terhubung ke Switch terpusat",
      },
      {
        type: "quiz",
        quizId: "quiz-intro-net-1",
        question: "Perangkat jaringan apakah yang bertugas meneruskan frame data ke port tujuan berdasarkan MAC Address di jaringan lokal (LAN)?",
        quizType: "single_choice",
        options: [
          { id: "opt-hub", text: "Hub (Layer 1)" },
          { id: "opt-switch", text: "Switch (Layer 2)" },
          { id: "opt-repeater", text: "Repeater (Layer 1)" },
        ],
        explanation: "Switch bekerja di Data Link Layer (Layer 2) dan menggunakan MAC Address Table untuk meneruskan frame hanya ke port tujuan.",
        xpReward: 10,
      },
      {
        type: "summary",
        title: "Rangkuman Pelajaran 1",
        keyPoints: [
          "Jaringan komputer memungkinkan pertukaran informasi dan sharing resources.",
          "Node adalah perangkat apa pun yang terhubung ke jaringan.",
          "Switch adalah perangkat inti jaringan lokal untuk menghubungkan berbagai host.",
        ],
      },
      {
        type: "reward",
        xp: 50,
        badgeTitle: "Network Pioneer",
        message: "Luar biasa! Anda telah memahami konsep dasar jaringan komputer.",
      },
    ],
  };

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
      content: lesson1Content,
      published: true,
    },
    create: {
      moduleId: mod1.id,
      slug: "intro-to-networking",
      title: "Apa Itu Jaringan Komputer?",
      description: "Pengenalan konsep dasar jaringan, client, server, dan node.",
      orderIndex: 1,
      xpReward: 50,
      content: lesson1Content,
      published: true,
    },
  });

  // Lesson 1.2: How Computers Communicate
  const lesson2Content = {
    version: "1.0",
    blocks: [
      {
        type: "heading",
        level: 2,
        text: "Mekanisme Pertukaran Pesan Antar Komputer",
      },
      {
        type: "text",
        content:
          "Agar dua komputer dapat saling mengerti, komunikasi harus mengikuti aturan standar yang disebut Protokol. Protokol mengatur format pesan, metode enkapsulasi, dan cara penanganan kesalahan pengiriman data.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Model Klien - Server",
        content:
          "Dalam arsitektur Client-Server, Client mengirimkan Permintaan (Request), dan Server memproses lalu mengirimkan Tanggapan (Response).",
      },
      {
        type: "quiz",
        quizId: "quiz-how-comm-1",
        question: "Apa istilah untuk aturan dan format standar yang disepakati agar komputer dapat saling bertukar data?",
        quizType: "single_choice",
        options: [
          { id: "opt-protokol", text: "Protokol Komunikasi" },
          { id: "opt-hardware", text: "Hardware Port" },
          { id: "opt-firmware", text: "Firmware Driver" },
        ],
        explanation: "Protokol adalah seperangkat aturan standar yang mengatur bagaimana data ditransmisikan dan diterima antar sistem.",
        xpReward: 10,
      },
      {
        type: "summary",
        title: "Rangkuman Pelajaran 2",
        keyPoints: [
          "Protokol adalah bahasa standar komunikasi perangkat jaringan.",
          "Model Request-Response adalah fondasi utama layanan web dan aplikasi jaringan modern.",
        ],
      },
      {
        type: "reward",
        xp: 50,
        badgeTitle: "Packet Messenger",
        message: "Selamat! Anda telah memahami bagaimana paket data mengalir antar perangkat.",
      },
    ],
  };

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
      content: lesson2Content,
      published: true,
    },
    create: {
      moduleId: mod1.id,
      slug: "how-computers-communicate",
      title: "Bagaimana Komputer Berkomunikasi?",
      description: "Proses pengiriman pesan, request/response, dan protokol dasar.",
      orderIndex: 2,
      xpReward: 50,
      content: lesson2Content,
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

  console.log("✅ Seed completed successfully with block curriculum!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
