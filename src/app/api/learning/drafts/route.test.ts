import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "./route";

vi.mock("@/lib/auth", () => ({
  requireLearnerActor: vi.fn(),
  AuthorizationError: class AuthorizationError extends Error {
    readonly code: string;
    readonly status: number;
    constructor(code: "UNAUTHENTICATED" | "FORBIDDEN" | "STALE_AUTH", message?: string) {
      super(message || code);
      this.name = "AuthorizationError";
      this.code = code;
      this.status = code === "UNAUTHENTICATED" ? 401 : 403;
    }
  },
}));

vi.mock("@/features/learning/drafts/service", () => ({
  saveLearningDraft: vi.fn(),
  getLearningDraft: vi.fn(),
  deleteLearningDraft: vi.fn(),
  listLessonDrafts: vi.fn(),
  DraftPayloadTooLargeError: class DraftPayloadTooLargeError extends Error {
    constructor(message = "Payload too large") {
      super(message);
      this.name = "DraftPayloadTooLargeError";
    }
  },
  DraftPayloadInvalidError: class DraftPayloadInvalidError extends Error {
    constructor(message = "Payload invalid") {
      super(message);
      this.name = "DraftPayloadInvalidError";
    }
  },
}));

import { requireLearnerActor, AuthorizationError } from "@/lib/auth";
import type { Actor } from "@/features/authorization/types";
import {
  saveLearningDraft,
  getLearningDraft,
  deleteLearningDraft,
  listLessonDrafts,
  DraftPayloadTooLargeError,
  DraftPayloadInvalidError,
} from "@/features/learning/drafts/service";

const mockRequireLearnerActor = vi.mocked(requireLearnerActor);
const mockSaveLearningDraft = vi.mocked(saveLearningDraft);
const mockGetLearningDraft = vi.mocked(getLearningDraft);
const mockDeleteLearningDraft = vi.mocked(deleteLearningDraft);
const mockListLessonDrafts = vi.mocked(listLessonDrafts);

const mockActor: Actor = {
  id: "user-1",
  email: "learner@zenoba.tech",
  name: "Learner Zenoba",
  role: "LEARNER",
  authVersion: 1,
  twoFactorEnabled: false,
};

describe("/api/learning/drafts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("returns 401 when actor is not authenticated", async () => {
      mockRequireLearnerActor.mockRejectedValue(
        new AuthorizationError("UNAUTHENTICATED", "Authentication required")
      );

      const request = new Request("http://localhost/api/learning/drafts?lessonId=les-1&activityId=act-1");
      const response = await GET(request);

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe("Authentication required");
    });

    it("returns 403 when actor is a DEVELOPER", async () => {
      mockRequireLearnerActor.mockRejectedValue(
        new AuthorizationError("FORBIDDEN", "Forbidden: Workspace isolation active")
      );

      const request = new Request("http://localhost/api/learning/drafts?lessonId=les-1&activityId=act-1");
      const response = await GET(request);

      expect(response.status).toBe(403);
      const json = await response.json();
      expect(json.error).toBe("Forbidden: Workspace isolation active");
    });

    it("returns 400 when lessonId is missing", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);

      const request = new Request("http://localhost/api/learning/drafts");
      const response = await GET(request);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toMatch(/lessonId/i);
    });

    it("returns a specific draft when lessonId and activityId are provided", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);
      mockGetLearningDraft.mockResolvedValue({
        id: "draft-1",
        userId: "user-1",
        lessonId: "les-1",
        activityId: "act-1",
        contentVersion: "1.0",
        payload: { state: "in-progress" },
        updatedAt: new Date("2026-09-15T10:00:00Z"),
        createdAt: new Date("2026-09-15T10:00:00Z"),
      });

      const request = new Request("http://localhost/api/learning/drafts?lessonId=les-1&activityId=act-1");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.draft).not.toBeNull();
      expect(json.draft.payload).toEqual({ state: "in-progress" });
      expect(mockGetLearningDraft).toHaveBeenCalledWith({
        userId: "user-1",
        lessonId: "les-1",
        activityId: "act-1",
      });
    });

    it("returns list of drafts when activityId is omitted", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);
      mockListLessonDrafts.mockResolvedValue([
        {
          id: "draft-1",
          userId: "user-1",
          lessonId: "les-1",
          activityId: "act-1",
          contentVersion: "1.0",
          payload: {},
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ]);

      const request = new Request("http://localhost/api/learning/drafts?lessonId=les-1");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.drafts).toHaveLength(1);
      expect(mockListLessonDrafts).toHaveBeenCalledWith({
        userId: "user-1",
        lessonId: "les-1",
      });
    });
  });

  describe("PUT", () => {
    it("returns 400 when body input is invalid", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);

      const request = new Request("http://localhost/api/learning/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: "" }),
      });
      const response = await PUT(request);

      expect(response.status).toBe(400);
    });

    it("returns 413 when payload exceeds 64KB", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);
      mockSaveLearningDraft.mockRejectedValue(
        new DraftPayloadTooLargeError("Payload exceeds 64KB")
      );

      const request = new Request("http://localhost/api/learning/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "les-1",
          activityId: "act-1",
          payload: { huge: "data" },
        }),
      });
      const response = await PUT(request);

      expect(response.status).toBe(413);
      const json = await response.json();
      expect(json.error).toBe("Payload exceeds 64KB");
    });

    it("returns 400 when payload content fails sanitization", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);
      mockSaveLearningDraft.mockRejectedValue(
        new DraftPayloadInvalidError("Forbidden secret key detected")
      );

      const request = new Request("http://localhost/api/learning/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "les-1",
          activityId: "act-1",
          payload: { secret: "123" },
        }),
      });
      const response = await PUT(request);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBe("Forbidden secret key detected");
    });

    it("saves draft successfully and returns 200", async () => {
      const updatedAt = new Date("2026-09-15T10:00:00Z");
      mockRequireLearnerActor.mockResolvedValue(mockActor);
      mockSaveLearningDraft.mockResolvedValue({
        success: true,
        activityId: "act-1",
        updatedAt,
      });

      const request = new Request("http://localhost/api/learning/drafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "les-1",
          activityId: "act-1",
          contentVersion: "1.0",
          payload: { selections: { q1: "optA" } },
        }),
      });
      const response = await PUT(request);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.activityId).toBe("act-1");
      expect(mockSaveLearningDraft).toHaveBeenCalledWith({
        userId: "user-1",
        lessonId: "les-1",
        activityId: "act-1",
        contentVersion: "1.0",
        payload: { selections: { q1: "optA" } },
      });
    });
  });

  describe("DELETE", () => {
    it("deletes draft and returns 200", async () => {
      mockRequireLearnerActor.mockResolvedValue(mockActor);
      mockDeleteLearningDraft.mockResolvedValue({ deleted: true });

      const request = new Request("http://localhost/api/learning/drafts?lessonId=les-1&activityId=act-1", {
        method: "DELETE",
      });
      const response = await DELETE(request);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.deleted).toBe(true);
      expect(mockDeleteLearningDraft).toHaveBeenCalledWith({
        userId: "user-1",
        lessonId: "les-1",
        activityId: "act-1",
      });
    });
  });
});
