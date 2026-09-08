import { describe, expect, it } from "vitest";
import {
  APP_ROLES,
  isDeveloperRole,
  isLearnerRole,
  isPrivilegedRole,
  type AppRole,
} from "./role";

describe("role boundaries", () => {
  it("defines the canonical list of app roles", () => {
    expect(APP_ROLES).toEqual(["LEARNER", "INTERNAL_LEARNER", "DEVELOPER"]);
  });

  it("identifies learner roles correctly", () => {
    expect(isLearnerRole("LEARNER")).toBe(true);
    expect(isLearnerRole("INTERNAL_LEARNER")).toBe(true);
    expect(isLearnerRole("DEVELOPER")).toBe(false);
    expect(isLearnerRole("UNKNOWN")).toBe(false);
    expect(isLearnerRole(null as unknown as string)).toBe(false);
    expect(isLearnerRole(undefined as unknown as string)).toBe(false);
  });

  it("identifies developer roles correctly", () => {
    expect(isDeveloperRole("DEVELOPER")).toBe(true);
    expect(isDeveloperRole("LEARNER")).toBe(false);
    expect(isDeveloperRole("INTERNAL_LEARNER")).toBe(false);
    expect(isDeveloperRole("UNKNOWN")).toBe(false);
    expect(isDeveloperRole(null as unknown as string)).toBe(false);
  });

  it("identifies privileged roles correctly", () => {
    expect(isPrivilegedRole("DEVELOPER")).toBe(true);
    expect(isPrivilegedRole("INTERNAL_LEARNER")).toBe(true);
    expect(isPrivilegedRole("LEARNER")).toBe(false);
    expect(isPrivilegedRole("UNKNOWN")).toBe(false);
  });

  it("satisfies TypeScript type-narrowing for AppRole", () => {
    const role: AppRole = "INTERNAL_LEARNER";
    if (isLearnerRole(role)) {
      expect(["LEARNER", "INTERNAL_LEARNER"]).toContain(role);
    }
  });
});
