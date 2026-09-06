import { describe, it, expect } from "vitest";
import { ipv4FormativeQuestions } from "./ipv4.server";
import { findFormativeQuestion } from "./service";
import {
  evaluateSchoolRoomAllocation,
  RoomAllocationInput,
} from "@/features/learning/practice/ipv4/room-allocation";

describe("Path 2: IPv4 Assessment & Capstone Evaluator", () => {
  describe("Formative Assessment Questions (Server-Side)", () => {
    it("contains exactly 30 formative questions across 10 lessons", () => {
      expect(ipv4FormativeQuestions.length).toBe(30);

      const expectedLessons = [
        "biner-8-bit",
        "struktur-ipv4",
        "public-private",
        "loopback-apipa",
        "subnet-mask",
        "cidr-notation",
        "network-broadcast",
        "host-range",
        "pembagian-subnet",
        "vlsm-design",
      ];

      for (const slug of expectedLessons) {
        const questionsForLesson = ipv4FormativeQuestions.filter(
          (q) => q.lessonSlug === slug
        );
        expect(
          questionsForLesson.length,
          `Lesson '${slug}' must have exactly 3 formative questions`
        ).toBe(3);
      }
    });

    it("verifies every question has valid 4 options, a correct answer, and misconception feedback", () => {
      for (const q of ipv4FormativeQuestions) {
        expect(q.id).toMatch(/^quiz-/);
        expect(q.question.length).toBeGreaterThan(10);
        expect(q.options.length).toBe(4);

        const optionIds = q.options.map((o) => o.id);
        expect(optionIds).toContain(q.correctAnswer);

        expect(q.explanation.length).toBeGreaterThan(15);
        expect(q.misconceptionFeedback?.length).toBeGreaterThan(15);
      }
    });

    it("finds questions via findFormativeQuestion service without leaking client state", () => {
      const q1 = findFormativeQuestion("quiz-bin-l1-q1");
      expect(q1).toBeDefined();
      expect(q1?.correctAnswer).toBe("opt-b");

      const qLast = findFormativeQuestion("quiz-vlsm-l10-q3");
      expect(qLast).toBeDefined();
      expect(qLast?.correctAnswer).toBe("opt-c");

      const notFound = findFormativeQuestion("quiz-non-existent-999");
      expect(notFound).toBeNull();
    });
  });

  describe("School Multi-Room Subnet Allocation Evaluator (Path 2 Final Capstone)", () => {
    const validAllocations: RoomAllocationInput[] = [
      {
        roomId: "lab-tkj",
        roomName: "Lab Komputer TKJ",
        requiredHosts: 50,
        prefix: 26,
        networkAddress: "192.168.10.0",
        gateway: "192.168.10.1",
        broadcastAddress: "192.168.10.63",
      },
      {
        roomId: "ruang-guru",
        roomName: "Ruang Guru & Staff",
        requiredHosts: 25,
        prefix: 27,
        networkAddress: "192.168.10.64",
        gateway: "192.168.10.65",
        broadcastAddress: "192.168.10.95",
      },
      {
        roomId: "ruang-tu",
        roomName: "Ruang Tata Usaha (TU)",
        requiredHosts: 12,
        prefix: 28,
        networkAddress: "192.168.10.96",
        gateway: "192.168.10.97",
        broadcastAddress: "192.168.10.111",
      },
      {
        roomId: "server-mgmt",
        roomName: "Server & Manajemen Jaringan",
        requiredHosts: 5,
        prefix: 29,
        networkAddress: "192.168.10.112",
        gateway: "192.168.10.113",
        broadcastAddress: "192.168.10.119",
      },
      {
        roomId: "link-p2p",
        roomName: "Link Point-to-Point Router-ke-Firewall",
        requiredHosts: 2,
        prefix: 30,
        networkAddress: "192.168.10.120",
        gateway: "192.168.10.121",
        broadcastAddress: "192.168.10.123",
      },
    ];

    it("evaluates a perfect VLSM multi-room allocation as PASSED with score 100", () => {
      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: "192.168.10.0/24",
        allocations: validAllocations,
      });

      expect(evaluation.passed).toBe(true);
      expect(evaluation.score).toBe(100);
      expect(evaluation.criteriaResults.every((c) => c.passed)).toBe(true);
      expect(evaluation.unmetOutcomes).toEqual([]);
      expect(evaluation.roomDetails.every((r) => r.passed)).toBe(true);
    });

    it("fails CAPACITY criterion when a room has fewer usable hosts than required", () => {
      const deficientAllocations = validAllocations.map((a) =>
        a.roomId === "lab-tkj"
          ? {
              ...a,
              prefix: 28, // /28 provides only 14 hosts, but lab needs 50
              networkAddress: "192.168.10.0",
              gateway: "192.168.10.1",
              broadcastAddress: "192.168.10.15",
            }
          : a
      );

      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: "192.168.10.0/24",
        allocations: deficientAllocations,
      });

      expect(evaluation.passed).toBe(false);
      const capCrit = evaluation.criteriaResults.find((c) => c.id === "CAPACITY");
      expect(capCrit?.passed).toBe(false);
      expect(evaluation.unmetOutcomes).toContain("P2-OUT-CAPACITY");
    });

    it("fails NO_OVERLAP criterion when two subnets occupy overlapping IP ranges", () => {
      const overlappingAllocations = validAllocations.map((a) =>
        a.roomId === "ruang-guru"
          ? {
              ...a,
              prefix: 27,
              networkAddress: "192.168.10.32", // Overlaps with lab-tkj (192.168.10.0 - .63)
              gateway: "192.168.10.33",
              broadcastAddress: "192.168.10.63",
            }
          : a
      );

      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: "192.168.10.0/24",
        allocations: overlappingAllocations,
      });

      expect(evaluation.passed).toBe(false);
      const overlapCrit = evaluation.criteriaResults.find((c) => c.id === "NO_OVERLAP");
      expect(overlapCrit?.passed).toBe(false);
      expect(evaluation.unmetOutcomes).toContain("P2-OUT-NO_OVERLAP");
    });

    it("fails CONSISTENCY criterion when Network ID or Broadcast does not match prefix boundaries", () => {
      const inconsistentAllocations = validAllocations.map((a) =>
        a.roomId === "lab-tkj"
          ? {
              ...a,
              networkAddress: "192.168.10.5", // Not a valid boundary for /26
              broadcastAddress: "192.168.10.63",
            }
          : a
      );

      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: "192.168.10.0/24",
        allocations: inconsistentAllocations,
      });

      expect(evaluation.passed).toBe(false);
      const constCrit = evaluation.criteriaResults.find((c) => c.id === "CONSISTENCY");
      expect(constCrit?.passed).toBe(false);
    });

    it("fails GATEWAY criterion when gateway is set to Network ID or Broadcast address", () => {
      const badGatewayAllocations = validAllocations.map((a) =>
        a.roomId === "ruang-guru"
          ? {
              ...a,
              gateway: "192.168.10.64", // Network ID is forbidden as host gateway
            }
          : a
      );

      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: "192.168.10.0/24",
        allocations: badGatewayAllocations,
      });

      expect(evaluation.passed).toBe(false);
      const gwCrit = evaluation.criteriaResults.find((c) => c.id === "GATEWAY");
      expect(gwCrit?.passed).toBe(false);
      expect(evaluation.unmetOutcomes).toContain("P2-OUT-GATEWAY");
    });

    it("fails BASE_CONTAINMENT when a subnet is configured outside the allocated school network", () => {
      const outsideAllocations = validAllocations.map((a) =>
        a.roomId === "link-p2p"
          ? {
              ...a,
              networkAddress: "10.0.0.0", // Completely outside 192.168.10.0/24
              gateway: "10.0.0.1",
              broadcastAddress: "10.0.0.3",
            }
          : a
      );

      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: "192.168.10.0/24",
        allocations: outsideAllocations,
      });

      expect(evaluation.passed).toBe(false);
      const baseCrit = evaluation.criteriaResults.find((c) => c.id === "BASE_CONTAINMENT");
      expect(baseCrit?.passed).toBe(false);
      expect(evaluation.unmetOutcomes).toContain("P2-OUT-BASE_CONTAINMENT");
    });
  });
});
