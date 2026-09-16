import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { AuthorizationError } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  requireLearnerActor: vi.fn(),
  AuthorizationError: class extends Error {
    status: number;
    constructor(message: string, status = 401) {
      super(message);
      this.status = status;
    }
  },
}));

vi.mock("@/features/learning/bookmarks/service", () => ({
  toggleBookmark: vi.fn(),
  isLessonBookmarked: vi.fn(),
  getUserBookmarks: vi.fn(),
}));

import { requireLearnerActor } from "@/lib/auth";
import {
  toggleBookmark,
  isLessonBookmarked,
  getUserBookmarks,
} from "@/features/learning/bookmarks/service";

const mockRequireLearnerActor = requireLearnerActor as unknown as ReturnType<typeof vi.fn>;
const mockToggleBookmark = toggleBookmark as unknown as ReturnType<typeof vi.fn>;
const mockIsLessonBookmarked = isLessonBookmarked as unknown as ReturnType<typeof vi.fn>;
const mockGetUserBookmarks = getUserBookmarks as unknown as ReturnType<typeof vi.fn>;

describe("GET /api/learning/bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if user is unauthenticated", async () => {
    mockRequireLearnerActor.mockRejectedValue(new AuthorizationError("UNAUTHENTICATED"));

    const req = new Request("http://localhost/api/learning/bookmarks");
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it("returns 403 if user is DEVELOPER", async () => {
    mockRequireLearnerActor.mockRejectedValue(new AuthorizationError("FORBIDDEN"));

    const req = new Request("http://localhost/api/learning/bookmarks");
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  it("returns list of bookmarks when lessonId is omitted", async () => {
    mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });
    mockGetUserBookmarks.mockResolvedValue([
      {
        id: "bm-1",
        lessonId: "les-1",
        createdAt: new Date(),
        isStale: false,
        lesson: {
          title: "Intro",
          slug: "intro",
          moduleSlug: "mod-1",
          pathSlug: "path-1",
          pathTitle: "Path 1",
          moduleTitle: "Mod 1",
          href: "/learn/path-1/mod-1/intro",
        },
      },
    ]);

    const req = new Request("http://localhost/api/learning/bookmarks");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.bookmarks).toHaveLength(1);
    expect(mockGetUserBookmarks).toHaveBeenCalledWith("user-1");
  });

  it("returns single bookmark status when lessonId is provided", async () => {
    mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });
    mockIsLessonBookmarked.mockResolvedValue(true);

    const req = new Request("http://localhost/api/learning/bookmarks?lessonId=les-1");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.bookmarked).toBe(true);
    expect(mockIsLessonBookmarked).toHaveBeenCalledWith("user-1", "les-1");
  });
});

describe("POST /api/learning/bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if user is unauthenticated", async () => {
    mockRequireLearnerActor.mockRejectedValue(new AuthorizationError("UNAUTHENTICATED"));

    const req = new Request("http://localhost/api/learning/bookmarks", {
      method: "POST",
      body: JSON.stringify({ lessonId: "les-1" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 400 when lessonId is missing or empty", async () => {
    mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });

    const req = new Request("http://localhost/api/learning/bookmarks", {
      method: "POST",
      body: JSON.stringify({ lessonId: "" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(mockToggleBookmark).not.toHaveBeenCalled();
  });

  it("toggles bookmark and returns result", async () => {
    mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });
    mockToggleBookmark.mockResolvedValue({ bookmarked: true, bookmarkId: "bm-1" });

    const req = new Request("http://localhost/api/learning/bookmarks", {
      method: "POST",
      body: JSON.stringify({ lessonId: "les-1" }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ bookmarked: true, bookmarkId: "bm-1" });
    expect(mockToggleBookmark).toHaveBeenCalledWith("user-1", "les-1");
  });
});
