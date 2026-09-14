import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AppLayout from "./layout";
import { requireLearnerActor } from "@/features/authorization/guards";
import { getCurrentUser } from "@/lib/auth";
import { AuthorizationError } from "@/features/authorization/types";
import { touchUserActivity } from "@/features/analytics/activity";

vi.mock("@/features/authorization/guards", () => ({
  requireLearnerActor: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/analytics/activity", () => ({
  touchUserActivity: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/components/navigation/learner-workspace-shell", () => ({
  LearnerWorkspaceShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="learner-shell">{children}</div>
  ),
}));

describe("AppLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders learner workspace shell when actor has learner role", async () => {
    vi.mocked(requireLearnerActor).mockResolvedValue({
      id: "learner-1",
      email: "learner@netloka.biz.id",
      name: "Learner One",
      role: "LEARNER",
      authVersion: 1,
      twoFactorEnabled: false,
    });
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "learner-1",
      email: "learner@netloka.biz.id",
      name: "Learner One",
      role: "LEARNER",
    });

    const jsx = await AppLayout({ children: <div>Learner Content</div> });
    render(jsx);

    expect(screen.getByTestId("learner-shell")).toBeInTheDocument();
    expect(screen.getByText("Learner Content")).toBeInTheDocument();
    expect(touchUserActivity).toHaveBeenCalledWith("learner-1");
  });

  it("denies access when actor is DEVELOPER and requireLearnerActor throws FORBIDDEN", async () => {
    vi.mocked(requireLearnerActor).mockRejectedValue(
      new AuthorizationError("FORBIDDEN", "Learner workspace access required"),
    );

    await expect(
      AppLayout({ children: <div>Learner Content</div> }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Learner workspace access required",
    });
  });
});
