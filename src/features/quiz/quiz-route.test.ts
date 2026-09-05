import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as quizSubmitHandler } from "@/app/api/learning/quiz/submit/route";
import * as authLib from "@/lib/auth";
import * as assessmentService from "@/features/learning/assessment/service";
import {
  AssessmentNotFoundError,
  AssessmentMismatchError,
  AssessmentLockedError,
  AssessmentConflictError,
} from "@/features/learning/assessment/errors";
import { CourseAccessDeniedError } from "@/features/commerce/access";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/learning/assessment/service", () => ({
  submitQuizAttempt: vi.fn(),
}));

describe("POST /api/learning/quiz/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-b",
      }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when body payload is missing required fields", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "intro-to-networking" }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when question or lesson is not found", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockRejectedValueOnce(
      new AssessmentNotFoundError("Pertanyaan kuis 'unknown' tidak ditemukan.")
    );

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "unknown-quiz",
        answer: "opt-a",
      }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 when quiz belongs to another lesson", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockRejectedValueOnce(
      new AssessmentMismatchError("Kuis tidak terdaftar dalam materi ini.")
    );

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l2-q1",
        answer: "opt-a",
      }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(400);
  });

  it("returns 403 when lesson is locked", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockRejectedValueOnce(
      new AssessmentLockedError("Materi masih terkunci.")
    );

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "everyday-networks",
        quizId: "quiz-wn-l2-q1",
        answer: "opt-a",
      }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(403);
  });

  it("returns 403 when learning path access is denied", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockRejectedValueOnce(
      new CourseAccessDeniedError("Access denied")
    );

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-a",
      }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(403);
  });

  it("returns 409 when requestId has conflict with different answer payload", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockRejectedValueOnce(
      new AssessmentConflictError("Request ID telah digunakan untuk pengiriman berbeda.")
    );

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-a",
        requestId: "req-existing-123",
      }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(409);
  });

  it("returns 200 with passed: true and score 10 on correct submission", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockResolvedValueOnce({
      passed: true,
      score: 10,
      feedback: "Jawaban Anda tepat!",
      explanation: "Penjelasan materi valid.",
      xpResult: {
        awarded: true,
        amount: 10,
        totalXp: 10,
        message: "+10 XP",
      },
      isIdempotentReplay: false,
    });

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-b",
        requestId: "req-1",
      }),
    });

    const res = await quizSubmitHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(true);
    expect(data.score).toBe(10);
    expect(assessmentService.submitQuizAttempt).toHaveBeenCalledWith({
      userId: "u-1",
      lessonId: "intro-to-networking",
      quizId: "quiz-wn-l1-q1",
      answer: "opt-b",
      requestId: "req-1",
    });
  });

  it("returns 200 with passed: false on nonempty wrong answer", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(assessmentService.submitQuizAttempt).mockResolvedValueOnce({
      passed: false,
      score: 0,
      feedback: "Jawaban belum tepat, silakan coba lagi.",
      explanation: "Penjelasan materi.",
      xpResult: null,
      isIdempotentReplay: false,
    });

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-wrong",
        requestId: "req-2",
      }),
    });

    const res = await quizSubmitHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(false);
    expect(data.score).toBe(0);
  });
});
