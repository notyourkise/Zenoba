/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import {
  authOptions,
  buildAuthProviders,
  isGoogleAuthConfigured,
} from "@/features/auth/auth";

describe("authentication provider configuration", () => {
  it.each([
    [{}, false],
    [{ GOOGLE_CLIENT_ID: "client-id" }, false],
    [{ GOOGLE_CLIENT_SECRET: "client-secret" }, false],
    [
      {
        GOOGLE_CLIENT_ID: "client-id",
        GOOGLE_CLIENT_SECRET: "client-secret",
      },
      true,
    ],
  ] as const)("reports Google availability from a complete credential pair", (env, expected) => {
    expect(isGoogleAuthConfigured(env)).toBe(expected);
  });

  it("always includes credentials and adds Google only when configured", () => {
    expect(buildAuthProviders({}).map((provider) => provider.id)).toEqual([
      "credentials",
    ]);
    expect(
      buildAuthProviders({
        GOOGLE_CLIENT_ID: "client-id",
        GOOGLE_CLIENT_SECRET: "client-secret",
      }).map((provider) => provider.id),
    ).toEqual(["credentials", "google"]);
  });

  describe("NextAuth callbacks", () => {
    it("handles initial user in jwt callback", async () => {
      const jwtCallback = authOptions.callbacks?.jwt as any;
      expect(jwtCallback).toBeDefined();

      const token = await jwtCallback({
        token: {},
        user: {
          id: "user-1",
          name: "Original Name",
          role: "LEARNER",
          image: "https://avatar.png",
          headline: "Networking Enthusiast",
          streakCount: 3,
          lastStreakDate: "2026-09-05",
        },
      });

      expect(token.id).toBe("user-1");
      expect(token.role).toBe("LEARNER");
      expect(token.picture).toBe("https://avatar.png");
      expect(token.headline).toBe("Networking Enthusiast");
      expect(token.streakCount).toBe(3);
      expect(token.lastStreakDate).toBe("2026-09-05");
    });

    it("updates token name on trigger === 'update'", async () => {
      const jwtCallback = authOptions.callbacks?.jwt as any;
      expect(jwtCallback).toBeDefined();

      const existingToken = {
        id: "user-1",
        name: "Original Name",
      };

      const updatedToken = await jwtCallback({
        token: existingToken,
        trigger: "update",
        session: { name: "Updated Name" },
      });

      expect(updatedToken.name).toBe("Updated Name");
    });

    it("populates session.user.name from token.name in session callback", async () => {
      const sessionCallback = authOptions.callbacks?.session as any;
      expect(sessionCallback).toBeDefined();

      const result = await sessionCallback({
        session: {
          user: { id: "user-1" },
          expires: "2026-10-01",
        },
        token: {
          id: "user-1",
          name: "Fresh Name",
          role: "LEARNER",
          headline: "Network Engineer",
          streakCount: 5,
          lastStreakDate: "2026-09-05",
        },
      });

      expect(result.user?.name).toBe("Fresh Name");
      expect((result.user as any)?.headline).toBe("Network Engineer");
      expect((result.user as any)?.streakCount).toBe(5);
    });
  });
});
