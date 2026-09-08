import { describe, expect, it } from "vitest";
import { getPostLoginDestination } from "./post-login";

describe("getPostLoginDestination", () => {
  it("routes DEVELOPER to /developer by default", () => {
    expect(getPostLoginDestination("DEVELOPER")).toBe("/developer");
  });

  it("routes DEVELOPER to a valid /developer sub-path", () => {
    expect(
      getPostLoginDestination("DEVELOPER", "/developer/deployments"),
    ).toBe("/developer/deployments");
  });

  it("ignores learner callbackUrl for DEVELOPER and defaults to /developer", () => {
    expect(getPostLoginDestination("DEVELOPER", "/dashboard")).toBe(
      "/developer",
    );
    expect(getPostLoginDestination("DEVELOPER", "/learn/networking")).toBe(
      "/developer",
    );
  });

  it("routes LEARNER to /dashboard by default", () => {
    expect(getPostLoginDestination("LEARNER")).toBe("/dashboard");
  });

  it("routes INTERNAL_LEARNER to /dashboard by default", () => {
    expect(getPostLoginDestination("INTERNAL_LEARNER")).toBe("/dashboard");
  });

  it("routes LEARNER to a safe learner callbackUrl", () => {
    expect(getPostLoginDestination("LEARNER", "/learn")).toBe("/learn");
    expect(getPostLoginDestination("LEARNER", "/labs")).toBe("/labs");
  });

  it("ignores developer callbackUrl for LEARNER and defaults to /dashboard", () => {
    expect(getPostLoginDestination("LEARNER", "/developer")).toBe(
      "/dashboard",
    );
    expect(
      getPostLoginDestination("LEARNER", "/developer/system-health"),
    ).toBe("/dashboard");
  });

  it("ignores external/unsafe callbackUrl and uses default destination", () => {
    expect(
      getPostLoginDestination("LEARNER", "https://attacker.com/malicious"),
    ).toBe("/dashboard");
    expect(
      getPostLoginDestination("DEVELOPER", "//malicious.com/exploit"),
    ).toBe("/developer");
  });
});
