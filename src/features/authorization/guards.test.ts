/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  requireActorForArea,
  getFreshActor,
  requireDeveloperActor,
  requireLearnerActor,
} from "./guards";
import { AuthorizationError, type Actor } from "./types";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/auth", () => ({
  authOptions: {},
}));

describe("server-authoritative role guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const developerActor: Actor = {
    id: "dev-1",
    email: "dev@zenoba.tech",
    name: "Developer One",
    role: "DEVELOPER",
    authVersion: 1,
    twoFactorEnabled: true,
  };

  const learnerActor: Actor = {
    id: "learner-1",
    email: "learner@zenoba.tech",
    name: "Learner One",
    role: "LEARNER",
    authVersion: 1,
    twoFactorEnabled: false,
  };

  const internalLearnerActor: Actor = {
    id: "internal-1",
    email: "owner-test@zenoba.tech",
    name: "Internal Tester",
    role: "INTERNAL_LEARNER",
    authVersion: 1,
    twoFactorEnabled: false,
  };

  describe("requireActorForArea", () => {
    it("allows developer into developer workspace", async () => {
      const result = await requireActorForArea("developer", developerActor);
      expect(result.role).toBe("DEVELOPER");
      expect(result.id).toBe("dev-1");
    });

    it("rejects learner from developer workspace", async () => {
      await expect(
        requireActorForArea("developer", learnerActor)
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("rejects internal learner from developer workspace", async () => {
      await expect(
        requireActorForArea("developer", internalLearnerActor)
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("allows learner into learner workspace", async () => {
      const result = await requireActorForArea("learner", learnerActor);
      expect(result.role).toBe("LEARNER");
    });

    it("allows internal learner into learner workspace", async () => {
      const result = await requireActorForArea("learner", internalLearnerActor);
      expect(result.role).toBe("INTERNAL_LEARNER");
    });

    it("rejects developer from learner workspace", async () => {
      await expect(
        requireActorForArea("learner", developerActor)
      ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("rejects unauthenticated request with UNAUTHENTICATED error", async () => {
      await expect(
        requireActorForArea("developer", null)
      ).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
    });
  });

  describe("getFreshActor", () => {
    it("returns null when no active session exists", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const actor = await getFreshActor();
      expect(actor).toBeNull();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("fetches fresh database role ignoring stale session role", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "user-1",
          email: "user@example.com",
          role: "LEARNER", // stale JWT claim
        },
      } as any);

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
        name: "Upgraded Dev",
        role: "DEVELOPER", // fresh database state
        authVersion: 2,
        twoFactorEnabled: true,
      } as any);

      const actor = await getFreshActor();
      expect(actor).toBeDefined();
      expect(actor?.role).toBe("DEVELOPER");
      expect(actor?.authVersion).toBe(2);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          authVersion: true,
          twoFactorEnabled: true,
        },
      });
    });

    it("does not expose sensitive credential fields in actor projection", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user-1" },
      } as any);

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
        name: "User One",
        role: "LEARNER",
        authVersion: 1,
        twoFactorEnabled: false,
      } as any);

      const actor = await getFreshActor();
      expect(actor).not.toHaveProperty("passwordHash");
      expect(actor).not.toHaveProperty("twoFactorSecret");
      expect(actor).not.toHaveProperty("twoFactorBackupCodes");
    });
  });

  describe("requireDeveloperActor and requireLearnerActor", () => {
    it("requireDeveloperActor succeeds for developer", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "dev-1" },
      } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(developerActor as any);

      const actor = await requireDeveloperActor();
      expect(actor.role).toBe("DEVELOPER");
    });

    it("requireDeveloperActor throws FORBIDDEN for learner", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "learner-1" },
      } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(learnerActor as any);

      await expect(requireDeveloperActor()).rejects.toBeInstanceOf(AuthorizationError);
    });

    it("requireLearnerActor succeeds for learner and internal learner", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "learner-1" },
      } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(learnerActor as any);

      const actor = await requireLearnerActor();
      expect(actor.role).toBe("LEARNER");
    });

    it("requireLearnerActor throws FORBIDDEN for developer", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "dev-1" },
      } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(developerActor as any);

      await expect(requireLearnerActor()).rejects.toBeInstanceOf(AuthorizationError);
    });
  });
});
