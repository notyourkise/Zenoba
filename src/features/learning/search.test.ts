import { describe, it, expect } from "vitest";
import {
  searchCurriculum,
  buildSearchIndex,
  type SearchableCurriculumItem,
} from "./search";
import type { LearningGraph } from "./continuation";

describe("Curriculum Search Engine", () => {
  const mockItems: SearchableCurriculumItem[] = [
    {
      lessonId: "les-1",
      lessonSlug: "what-is-a-network",
      lessonTitle: "Apa Itu Jaringan Komputer?",
      lessonDescription: "Pengenalan konsep dasar jaringan komputer, node, dan media transmisi.",
      moduleSlug: "intro-networking",
      moduleTitle: "Pengenalan Jaringan",
      pathSlug: "network-fundamentals",
      pathTitle: "Network Fundamentals",
      orderIndex: 0,
      outcomes: [
        { id: "WN-L1-A", text: "Menjelaskan definisi jaringan komputer dan perannya" },
        { id: "WN-L1-B", text: "Membedakan client dan server dalam pertukaran data" },
      ],
      href: "/learn/network-fundamentals/intro-networking/what-is-a-network",
    },
    {
      lessonId: "les-2",
      lessonSlug: "network-devices",
      lessonTitle: "Perangkat Jaringan Komputer",
      lessonDescription: "Mengenal switch, router, access point, dan fungsinya dalam topologi.",
      moduleSlug: "intro-networking",
      moduleTitle: "Pengenalan Jaringan",
      pathSlug: "network-fundamentals",
      pathTitle: "Network Fundamentals",
      orderIndex: 1,
      outcomes: [
        { id: "WN-L2-A", text: "Mengidentifikasi perangkat jaringan Layer 2 dan Layer 3" },
      ],
      href: "/learn/network-fundamentals/intro-networking/network-devices",
    },
    {
      lessonId: "les-3",
      lessonSlug: "ipv4-basics",
      lessonTitle: "Dasar Alamat IPv4",
      lessonDescription: "Format 32-bit IPv4, oktet, subnet mask, dan pembagian kelas alamat.",
      moduleSlug: "ip-addressing",
      moduleTitle: "Pengalamatan IP",
      pathSlug: "network-fundamentals",
      pathTitle: "Network Fundamentals",
      orderIndex: 0,
      outcomes: [
        { id: "IP-L1-A", text: "Menghitung notasi CIDR dan prefix mask /24" },
        { id: "IP-L1-B", text: "Menentukan network address dan broadcast address" },
      ],
      href: "/learn/network-fundamentals/ip-addressing/ipv4-basics",
    },
    {
      lessonId: "les-4",
      lessonSlug: "vlsm-subnetting",
      lessonTitle: "Subnetting Lanjut dan VLSM",
      lessonDescription: "Perhitungan Variable Length Subnet Mask untuk efisiensi alokasi IP.",
      moduleSlug: "ip-addressing",
      moduleTitle: "Pengalamatan IP",
      pathSlug: "network-fundamentals",
      pathTitle: "Network Fundamentals",
      orderIndex: 1,
      outcomes: [
        { id: "IP-L2-A", text: "Merancang subnetting VLSM bertingkat berdasarkan kebutuhan host" },
      ],
      href: "/learn/network-fundamentals/ip-addressing/vlsm-subnetting",
    },
  ];

  it("returns empty array when query is empty or whitespace", () => {
    expect(searchCurriculum(mockItems, "")).toEqual([]);
    expect(searchCurriculum(mockItems, "   ")).toEqual([]);
  });

  it("ranks exact title match higher than description or outcome match", () => {
    // "IPv4" appears in title of les-3, and in outcome of les-3/les-4
    const results = searchCurriculum(mockItems, "IPv4");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].lessonSlug).toBe("ipv4-basics");
    expect(results[0].matchedField).toBe("title");
  });

  it("matches keywords inside learning outcomes with relevant snippets", () => {
    // "CIDR" is only inside outcome of les-3
    const results = searchCurriculum(mockItems, "CIDR");
    expect(results.length).toBe(1);
    expect(results[0].lessonSlug).toBe("ipv4-basics");
    expect(results[0].matchedField).toBe("outcome");
    expect(results[0].matchSnippet).toContain("CIDR");
  });

  it("performs case-insensitive search", () => {
    const lowerResults = searchCurriculum(mockItems, "router");
    const upperResults = searchCurriculum(mockItems, "ROUTER");
    expect(lowerResults.length).toBe(1);
    expect(upperResults.length).toBe(1);
    expect(lowerResults[0].lessonSlug).toBe(upperResults[0].lessonSlug);
    expect(lowerResults[0].lessonSlug).toBe("network-devices");
  });

  it("matches multiple tokens across fields with additive scoring", () => {
    // "jaringan router" -> "jaringan" matches path/module/title, "router" matches description of les-2
    const results = searchCurriculum(mockItems, "jaringan router");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].lessonSlug).toBe("network-devices");
  });

  it("maintains deterministic sorting when scores are tied", () => {
    // "Pengenalan Jaringan" matches both les-1 and les-2 module title
    const results = searchCurriculum(mockItems, "Pengenalan Jaringan");
    expect(results.length).toBeGreaterThanOrEqual(2);
    // Tied scores should be ordered by orderIndex
    expect(results[0].orderIndex).toBeLessThanOrEqual(results[1].orderIndex);
  });

  it("builds searchable index from learning graph and registry", () => {
    const mockGraph: LearningGraph = {
      paths: [
        {
          id: "p1",
          slug: "net-fund",
          title: "Network Fundamentals",
          orderIndex: 0,
          modules: [
            {
              id: "m1",
              slug: "welcome-to-networking",
              title: "Welcome",
              orderIndex: 0,
              lessons: [
                {
                  id: "l1",
                  slug: "intro-to-networking",
                  title: "Intro",
                  orderIndex: 0,
                },
              ],
            },
          ],
        },
      ],
    };

    const index = buildSearchIndex(mockGraph);
    expect(index.length).toBe(1);
    expect(index[0].lessonSlug).toBe("intro-to-networking");
    expect(index[0].pathSlug).toBe("net-fund");
    expect(index[0].moduleSlug).toBe("welcome-to-networking");
    expect(index[0].href).toBe("/learn/net-fund/welcome-to-networking/intro-to-networking");
    // Outcomes should be attached from curriculum registry if available
    expect(index[0].outcomes).toBeDefined();
  });
});
