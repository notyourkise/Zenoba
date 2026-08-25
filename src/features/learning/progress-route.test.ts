import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as progressHandler } from "@/app/api/learning/progress/route";
import * as authLib from "@/lib/auth";
import * as progressService from "@/features/learning/progress";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/learning/progress", () => ({
  startLessonProgress: vi.fn(),
  completeLessonProgress: vi.fn(),
}));

describe("POST /api/learning/progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/learning/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-1", action: "start" }),
    });

    const res = await progressHandler(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid input action", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    const req = new Request("http://localhost:3000/api/learning/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-1", action: "invalid_action" }),
    });

    const res = await progressHandler(req);
    expect(res.status).toBe(400);
  });

  it("calls startLessonProgress on action start", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(progressService.startLessonProgress).mockResolvedValueOnce({
      id: "p-1",
      status: "IN_PROGRESS",
    });

    const req = new Request("http://localhost:3000/api/learning/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-1", action: "start" }),
    });

    const res = await progressHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Lesson started");
    expect(progressService.startLessonProgress).toHaveBeenCalledWith("u-1", "l-1");
  });

  it("calls completeLessonProgress on action complete", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(progressService.completeLessonProgress).mockResolvedValueOnce({
      id: "p-1",
      status: "COMPLETED",
      completedAt: new Date(),
      xpAwarded: 50,
      totalXp: 50,
    });

    const req = new Request("http://localhost:3000/api/learning/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-1", action: "complete" }),
    });

    const res = await progressHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Lesson completed");
    expect(progressService.completeLessonProgress).toHaveBeenCalledWith("u-1", "l-1");
  });

  it("returns 403 when trying to start a locked lesson", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(progressService.startLessonProgress).mockRejectedValueOnce(
      new Error("Cannot start a locked lesson. Prerequisite required.")
    );

    const req = new Request("http://localhost:3000/api/learning/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-2", action: "start" }),
    });

    const res = await progressHandler(req);
    expect(res.status).toBe(403);
  });
});
