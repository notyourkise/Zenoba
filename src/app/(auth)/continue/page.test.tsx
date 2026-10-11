import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import ContinuePage from "./page";
import { getFreshActor } from "@/features/authorization/guards";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/authorization/guards", () => ({
  getFreshActor: vi.fn(),
}));

describe("ContinuePage (/continue)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated visitor to sign-in modal", async () => {
    vi.mocked(getFreshActor).mockResolvedValue(null);

    await ContinuePage({});

    expect(redirect).toHaveBeenCalledWith("/?auth=sign-in");
  });

  it("redirects authenticated DEVELOPER to /developer", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "dev-1",
      email: "dev@zenoba.tech",
      name: "Developer One",
      role: "DEVELOPER",
      authVersion: 1,
      twoFactorEnabled: true,
    });

    await ContinuePage({});

    expect(redirect).toHaveBeenCalledWith("/developer");
  });

  it("redirects authenticated LEARNER to /dashboard", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "learner-1",
      email: "learner@zenoba.tech",
      name: "Learner One",
      role: "LEARNER",
      authVersion: 1,
      twoFactorEnabled: false,
    });

    await ContinuePage({});

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects authenticated INTERNAL_LEARNER to /dashboard", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "internal-1",
      email: "owner-test@zenoba.tech",
      name: "Internal Tester",
      role: "INTERNAL_LEARNER",
      authVersion: 1,
      twoFactorEnabled: false,
    });

    await ContinuePage({});

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects DEVELOPER to authorized developer sub-route when requested in callbackUrl", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "dev-1",
      email: "dev@zenoba.tech",
      name: "Developer One",
      role: "DEVELOPER",
      authVersion: 1,
      twoFactorEnabled: true,
    });

    await ContinuePage({
      searchParams: Promise.resolve({ callbackUrl: "/developer/audit" }),
    });

    expect(redirect).toHaveBeenCalledWith("/developer/audit");
  });

  it("denies DEVELOPER access to learner callbackUrl and defaults to /developer", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "dev-1",
      email: "dev@zenoba.tech",
      name: "Developer One",
      role: "DEVELOPER",
      authVersion: 1,
      twoFactorEnabled: true,
    });

    await ContinuePage({
      searchParams: Promise.resolve({ callbackUrl: "/learn" }),
    });

    expect(redirect).toHaveBeenCalledWith("/developer");
  });

  it("denies LEARNER access to developer callbackUrl and defaults to /dashboard", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "learner-1",
      email: "learner@zenoba.tech",
      name: "Learner One",
      role: "LEARNER",
      authVersion: 1,
      twoFactorEnabled: false,
    });

    await ContinuePage({
      searchParams: Promise.resolve({ callbackUrl: "/developer" }),
    });

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects LEARNER to valid learner callbackUrl when provided", async () => {
    vi.mocked(getFreshActor).mockResolvedValue({
      id: "learner-1",
      email: "learner@zenoba.tech",
      name: "Learner One",
      role: "LEARNER",
      authVersion: 1,
      twoFactorEnabled: false,
    });

    await ContinuePage({
      searchParams: Promise.resolve({ callbackUrl: "/challenges" }),
    });

    expect(redirect).toHaveBeenCalledWith("/challenges");
  });
});
