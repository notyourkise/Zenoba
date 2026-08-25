import { expect, test } from "@playwright/test";

test.describe("Lesson Block & Reward Engine", () => {
  test("protects lesson runner from unauthenticated direct access", async ({
    page,
  }) => {
    await page.goto(
      "/learn/network-foundations/welcome-to-networking/intro-to-networking"
    );
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("redirects unauthenticated access to quiz submit API with 401", async ({
    request,
  }) => {
    const response = await request.post("/api/learning/quiz/submit", {
      data: {
        lessonId: "mock-lesson",
        quizId: "mock-quiz",
        answer: "mock-answer",
      },
    });

    expect(response.status()).toBe(401);
  });
});
