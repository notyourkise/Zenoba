/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as challengeSubmitHandler } from "@/app/api/challenges/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    requireLearnerActor: vi.fn(),
  };
});

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learningPath: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn(),
    },
    assessmentAttempt: {
      create: vi.fn(),
    },
    challenge: {
      findUnique: vi.fn(),
    },
    challengeAttempt: {
      create: vi.fn(),
    },
  },
}));

describe("POST /api/challenges/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPassingSubmission = {
    challengeId: "first-day-it-support",
    selectedDeviceIds: ["router-1", "switch-1", "ap-1", "cable-cat6"],
    topologyChoice: "star",
    troubleshootAnswer: "check_layer1_cable",
  };

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("UNAUTHENTICATED", "Authentication required")
    );

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when actor is DEVELOPER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("FORBIDDEN", "Learner workspace access required")
    );

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Learner workspace access required");
  });

  it("evaluates submission and awards XP when passed in standalone mode", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
      id: "user-1",
      email: "u@example.com",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 150,
      totalXp: 250,
      message: "+150 XP",
    });

    vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
      id: "ch-1",
      slug: "first-day-it-support",
    } as any);

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(true);
    expect(data.score).toBe(100);
    expect(data.outcomeResults).toHaveLength(4);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "user-1",
      150,
      "CHALLENGE_SOLVED",
      "challenge-first-day-it-support"
    );

    expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          assessmentId: "challenge-first-day-it-support",
          score: 100,
          passed: true,
        }),
      })
    );

    expect(prisma.challengeAttempt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          challengeId: "ch-1",
          score: 100,
          passed: true,
        }),
      })
    );
  });

  it("rejects with 403 when submitted as isPathFinal: true and user has incomplete lessons", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
      id: "user-1",
      email: "u@example.com",
    });

    // 19 lessons mock
    const fakeLessons = Array.from({ length: 19 }, (_, i) => ({ id: `lesson-${i + 1}` }));
    vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
      id: "p1",
      slug: "network-foundations",
      modules: [
        {
          id: "m1",
          lessons: fakeLessons,
        },
      ],
    } as any);

    // User has only completed 10 lessons
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
      fakeLessons.slice(0, 10).map((l) => ({ lessonId: l.id })) as any
    );

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPassingSubmission,
        isPathFinal: true,
      }),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.code).toBe("PREREQUISITES_INCOMPLETE");
    expect(data.completedLessons).toBe(10);
    expect(data.totalLessons).toBe(19);
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });

  it("accepts and awards XP when submitted as isPathFinal: true and all 19 lessons are completed", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
      id: "user-1",
      email: "u@example.com",
    });

    const fakeLessons = Array.from({ length: 19 }, (_, i) => ({ id: `lesson-${i + 1}` }));
    vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
      id: "p1",
      slug: "network-foundations",
      modules: [
        {
          id: "m1",
          lessons: fakeLessons,
        },
      ],
    } as any);

    // User has completed all 19 lessons
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
      fakeLessons.map((l) => ({ lessonId: l.id })) as any
    );

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 150,
      totalXp: 350,
      message: "+150 XP",
    });

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPassingSubmission,
        isPathFinal: true,
      }),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(data.isPathFinal).toBe(true);

    expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          assessmentId: "path-network-foundations-final",
          score: 100,
          passed: true,
        }),
      })
    );
  });

  it("handles idempotent replay gracefully when XP has already been awarded", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
      id: "user-1",
      email: "u@example.com",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: false,
      amount: 0,
      totalXp: 350,
      message: "XP has already been awarded for this activity",
    });

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(data.xpResult.awarded).toBe(false);
  });

  describe("school-room-allocation (Path 2 Capstone)", () => {
    const validSchoolAllocations = [
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

    const schoolSubmission = {
      challengeId: "school-room-allocation",
      baseNetwork: "192.168.10.0/24",
      allocations: validSchoolAllocations,
    };

    it("evaluates school-room-allocation submission and awards 200 XP when passed", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-2",
        email: "student@example.com",
      });

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 200,
        totalXp: 450,
        message: "+200 XP",
      });

      vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
        id: "ch-2",
        slug: "school-room-allocation",
      } as any);

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schoolSubmission),
      });

      const res = await challengeSubmitHandler(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.passed).toBe(true);
      expect(data.score).toBe(100);
      expect(data.criteriaResults).toHaveLength(5);
      expect(xpLedger.awardXp).toHaveBeenCalledWith(
        "user-2",
        200,
        "CHALLENGE_SOLVED",
        "challenge-school-room-allocation"
      );

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-2",
            assessmentId: "challenge-school-room-allocation",
            score: 100,
            passed: true,
          }),
        })
      );

      expect(prisma.challengeAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-2",
            challengeId: "ch-2",
            score: 100,
            passed: true,
          }),
        })
      );
    });

    it("rejects school-room-allocation with 403 when submitted as isPathFinal: true and user has incomplete lessons", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-2",
        email: "student@example.com",
      });

      // 10 lessons in path 2
      const fakeLessons = Array.from({ length: 10 }, (_, i) => ({ id: `p2-lesson-${i + 1}` }));
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "p2",
        slug: "ipv4-subnetting",
        modules: [
          {
            id: "m2",
            lessons: fakeLessons,
          },
        ],
      } as any);

      // User has completed only 7 lessons
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.slice(0, 7).map((l) => ({ lessonId: l.id })) as any
      );

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...schoolSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("PREREQUISITES_INCOMPLETE");
      expect(data.completedLessons).toBe(7);
      expect(data.totalLessons).toBe(10);
    });

    it("allows school-room-allocation when user completed all 10 lessons in path 2", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-2",
        email: "student@example.com",
      });

      const fakeLessons = Array.from({ length: 10 }, (_, i) => ({ id: `p2-lesson-${i + 1}` }));
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "p2",
        slug: "ipv4-subnetting",
        modules: [
          {
            id: "m2",
            lessons: fakeLessons,
          },
        ],
      } as any);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.map((l) => ({ lessonId: l.id })) as any
      );

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 200,
        totalXp: 500,
        message: "+200 XP",
      });

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...schoolSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.passed).toBe(true);
      expect(data.isPathFinal).toBe(true);

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-2",
            assessmentId: "path-ipv4-subnetting-final",
            score: 100,
            passed: true,
          }),
        })
      );
    });
  });

  describe("staff-guest-vlan-repair", () => {
    const vlanSubmission = {
      challengeId: "staff-guest-vlan-repair",
      switch2Port2Vlan: 10,
      trunkAllowedVlans: [10, 20],
      interVlanReasonOption: "l2-isolation-needs-l3-router",
    };

    it("evaluates staff-guest-vlan-repair submission and awards 150 XP when passed", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-3",
        email: "switchmaster@example.com",
      });

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 150,
        totalXp: 300,
        message: "+150 XP",
      });

      vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
        id: "ch-3",
        slug: "staff-guest-vlan-repair",
      } as any);

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vlanSubmission),
      });

      const res = await challengeSubmitHandler(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.passed).toBe(true);
      expect(data.score).toBe(100);
      expect(data.criteriaResults).toHaveLength(3);
      expect(xpLedger.awardXp).toHaveBeenCalledWith(
        "user-3",
        150,
        "CHALLENGE_SOLVED",
        "challenge-staff-guest-vlan-repair"
      );

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-3",
            assessmentId: "challenge-staff-guest-vlan-repair",
            score: 100,
            passed: true,
          }),
        })
      );

      expect(prisma.challengeAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-3",
            challengeId: "ch-3",
            score: 100,
            passed: true,
          }),
        })
      );
    });

    it("rejects staff-guest-vlan-repair with 403 when submitted as isPathFinal: true and user has incomplete lessons", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-3",
        email: "switchmaster@example.com",
      });

      const fakeLessons = Array.from({ length: 8 }, (_, i) => ({ id: `p3-lesson-${i + 1}` }));
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "p3",
        slug: "switching-lan",
        modules: [
          {
            id: "m3",
            lessons: fakeLessons,
          },
        ],
      } as any);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.slice(0, 5).map((l) => ({ lessonId: l.id })) as any
      );

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vlanSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("PREREQUISITES_INCOMPLETE");
      expect(data.completedLessons).toBe(5);
      expect(data.totalLessons).toBe(8);
    });

    it("allows staff-guest-vlan-repair when user completed all 8 lessons in path 3", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-3",
        email: "switchmaster@example.com",
      });

      const fakeLessons = Array.from({ length: 8 }, (_, i) => ({ id: `p3-lesson-${i + 1}` }));
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "p3",
        slug: "switching-lan",
        modules: [
          {
            id: "m3",
            lessons: fakeLessons,
          },
        ],
      } as any);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.map((l) => ({ lessonId: l.id })) as any
      );

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 150,
        totalXp: 450,
        message: "+150 XP",
      });

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vlanSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.passed).toBe(true);
      expect(data.isPathFinal).toBe(true);

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-3",
            assessmentId: "path-switching-lan-final",
            score: 100,
            passed: true,
          }),
        })
      );
    });
  });

  describe("Path 4: named-service-outage", () => {
    const validOutageSubmission = {
      challengeId: "named-service-outage",
      dhcpDefaultGateway: "192.168.1.1",
      dhcpDnsServer: "192.168.1.10",
      natOverloadEnabled: true,
      transportOutageReasonOption: "port-blocked-or-service-down",
    };

    it("evaluates named-service-outage submission and awards XP when passed in standalone mode", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-4",
        email: "u4@example.com",
      });

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 150,
        totalXp: 350,
        message: "+150 XP",
      });

      vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
        id: "ch-4",
        slug: "named-service-outage",
      } as any);

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validOutageSubmission),
      });

      const res = await challengeSubmitHandler(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.passed).toBe(true);
      expect(data.score).toBe(100);
      expect(data.criteriaResults).toHaveLength(4);
      expect(xpLedger.awardXp).toHaveBeenCalledWith(
        "user-4",
        150,
        "CHALLENGE_SOLVED",
        "challenge-named-service-outage"
      );

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-4",
            assessmentId: "challenge-named-service-outage",
            score: 100,
            passed: true,
          }),
        })
      );
    });

    it("blocks named-service-outage with 403 when prerequisites are incomplete as Path 4 Final", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-4",
        email: "u4@example.com",
      });

      const fakeLessons = Array.from({ length: 10 }, (_, i) => ({
        id: `p4-l${i + 1}`,
      }));

      vi.mocked(prisma.learningPath.findFirst).mockResolvedValueOnce({
        id: "path-4",
        slug: "network-services",
        modules: [
          {
            id: "m4",
            lessons: fakeLessons,
          },
        ],
      } as any);

      // User has only completed 7 out of 10
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.slice(0, 7).map((l) => ({ lessonId: l.id })) as any
      );

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOutageSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("PREREQUISITES_INCOMPLETE");
      expect(data.completedLessons).toBe(7);
      expect(data.totalLessons).toBe(10);
    });

    it("allows named-service-outage and persists to path-network-services-final when all 10 Path 4 lessons completed", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-4",
        email: "u4@example.com",
      });

      const fakeLessons = Array.from({ length: 10 }, (_, i) => ({
        id: `p4-l${i + 1}`,
      }));

      vi.mocked(prisma.learningPath.findFirst).mockResolvedValueOnce({
        id: "path-4",
        slug: "network-services",
        modules: [
          {
            id: "m4",
            lessons: fakeLessons,
          },
        ],
      } as any);

      // User has completed all 10
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.map((l) => ({ lessonId: l.id })) as any
      );

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 200,
        totalXp: 550,
        message: "+200 XP",
      });

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validOutageSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.passed).toBe(true);
      expect(data.isPathFinal).toBe(true);
      expect(xpLedger.awardXp).toHaveBeenCalledWith(
        "user-4",
        200,
        "CHALLENGE_SOLVED",
        "challenge-named-service-outage"
      );

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-4",
            assessmentId: "path-network-services-final",
            score: 100,
            passed: true,
          }),
        })
      );
    });

    // =========================================================================
    // Challenge 5: Multi-Incident Investigation & Remediation (Path 5 Capstone)
    // =========================================================================
    const validMultiIncidentSubmission = {
      challengeId: "multi-incident-investigation",
      apipaRootCause: "dhcp-pool-exhausted",
      apipaCorrection: "expand-dhcp-scope-24",
      interVlanRootCause: "missing-8021q-trunk",
      interVlanCorrection: "reconfigure-port-trunk",
      gatewayRootCause: "wrong-default-gateway",
      gatewayCorrection: "restore-gateway-192-168-1-1",
      troubleshootingPrincipleOption: "isolate-single-variable-with-rollback",
      serviceVerificationOption: "verify-layer7-and-end-user-workflow",
    };

    it("evaluates multi-incident-investigation successfully and awards XP", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-5",
        email: "troubleshooter@example.com",
      });

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 150,
        totalXp: 750,
        message: "+150 XP",
      });

      vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
        id: "ch-multi-incident",
        slug: "multi-incident-investigation",
      } as any);

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validMultiIncidentSubmission),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.passed).toBe(true);
      expect(data.score).toBe(100);
      expect(data.criteriaResults.length).toBe(4);
      expect(xpLedger.awardXp).toHaveBeenCalledWith(
        "user-5",
        150,
        "CHALLENGE_SOLVED",
        "challenge-multi-incident-investigation"
      );
    });

    it("rejects multi-incident path final when user has not completed all 8 lessons", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-5",
        email: "troubleshooter@example.com",
      });

      const fakeLessons = Array.from({ length: 8 }, (_, i) => ({ id: `p5-lesson-${i + 1}` }));
      vi.mocked(prisma.learningPath.findFirst).mockResolvedValueOnce({
        id: "p5",
        slug: "wireless-troubleshooting",
        modules: [
          {
            id: "m5",
            lessons: fakeLessons,
          },
        ],
      } as any);

      // User has completed only 5
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.slice(0, 5).map((l) => ({ lessonId: l.id })) as any
      );

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validMultiIncidentSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("PREREQUISITES_INCOMPLETE");
      expect(data.completedLessons).toBe(5);
      expect(data.totalLessons).toBe(8);
    });

    it("allows multi-incident path final when user completed all 8 lessons, awards 200 XP", async () => {
      vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({ role: "LEARNER" as const, authVersion: 1, twoFactorEnabled: false, name: "Learner",
        id: "user-5",
        email: "troubleshooter@example.com",
      });

      const fakeLessons = Array.from({ length: 8 }, (_, i) => ({ id: `p5-lesson-${i + 1}` }));
      vi.mocked(prisma.learningPath.findFirst).mockResolvedValueOnce({
        id: "p5",
        slug: "wireless-troubleshooting",
        modules: [
          {
            id: "m5",
            lessons: fakeLessons,
          },
        ],
      } as any);

      // User has completed all 8
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
        fakeLessons.map((l) => ({ lessonId: l.id })) as any
      );

      vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
        awarded: true,
        amount: 200,
        totalXp: 950,
        message: "+200 XP",
      });

      const req = new Request("http://localhost:3000/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validMultiIncidentSubmission,
          isPathFinal: true,
        }),
      });

      const res = await challengeSubmitHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.passed).toBe(true);
      expect(data.isPathFinal).toBe(true);
      expect(xpLedger.awardXp).toHaveBeenCalledWith(
        "user-5",
        200,
        "CHALLENGE_SOLVED",
        "challenge-multi-incident-investigation"
      );

      expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-5",
            assessmentId: "path-wireless-troubleshooting-final",
            score: 100,
            passed: true,
          }),
        })
      );
    });
  });
});
