/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  authOptions,
  buildAuthProviders,
  isGoogleAuthConfigured,
} from "@/features/auth/auth";
import {
  revokeUserSessions,
  clearRevokedSessions,
} from "@/features/auth/session-revocation";
import { recordSecurityEvent } from "@/features/security/events";
import { touchUserActivity } from "@/features/analytics/activity";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    account: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/features/security/events", () => ({
  recordSecurityEvent: vi.fn().mockResolvedValue({ id: "mock-sec-id" }),
}));

vi.mock("@/features/analytics/activity", () => ({
  touchUserActivity: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/features/auth/password", () => ({
  verifyPassword: vi.fn().mockResolvedValue(true),
  hashPassword: vi.fn().mockResolvedValue("mocked-hash"),
}));

describe("authentication provider configuration", () => {
  beforeEach(() => {
    clearRevokedSessions();
  });
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

  it("does not allow dangerous email account linking in Google provider", () => {
    const providers = buildAuthProviders({
      GOOGLE_CLIENT_ID: "client-id",
      GOOGLE_CLIENT_SECRET: "client-secret",
    });
    const google = providers.find((provider) => provider.id === "google") as any;
    expect(google).toBeDefined();
    expect(google.allowDangerousEmailAccountLinking).toBeFalsy();
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

    it("invalidates session when user session is revoked (TD-08)", async () => {
      const sessionCallback = authOptions.callbacks?.session as any;
      const revocationTime = 100000;
      revokeUserSessions("revoked-user", revocationTime);

      const result = await sessionCallback({
        session: {
          user: { id: "revoked-user" },
          expires: "2026-10-01",
        },
        token: {
          id: "revoked-user",
          iat: 90, // 90000 ms < 100000 ms
        },
      });

      expect(result.user).toBeUndefined();
      expect(result.expires).toBe(new Date(0).toISOString());
    });

    describe("signIn callback", () => {
      it("rejects Google sign-in when database user is DEVELOPER and records security event", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
          id: "dev-1",
          email: "dev@zenoba.tech",
          role: "DEVELOPER",
        } as any);

        const allowed = await signInCallback({
          user: { email: "dev@zenoba.tech" },
          account: { provider: "google" },
        });

        expect(allowed).toBe(false);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { email: "dev@zenoba.tech" },
          select: { id: true, role: true, passwordHash: true },
        });
        expect(recordSecurityEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: "dev-1",
            type: "AUTH_OAUTH_DEVELOPER_REJECTED",
            severity: "WARN",
          }),
        );
      });

      it("allows Google sign-in when database user is LEARNER", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
          id: "learner-1",
          email: "learner@zenoba.tech",
          role: "LEARNER",
        } as any);

        const allowed = await signInCallback({
          user: { email: "learner@zenoba.tech" },
          account: { provider: "google" },
        });

        expect(allowed).toBe(true);
      });

      it("allows Google sign-in when user does not exist in database yet (Google-first registration)", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

        const allowed = await signInCallback({
          user: { email: "newuser@example.com" },
          account: { provider: "google" },
        });

        expect(allowed).toBe(true);
      });

      it("rejects Google sign-in when profile email_verified is false and records security event", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        const allowed = await signInCallback({
          user: { email: "unverified@example.com" },
          account: { provider: "google" },
          profile: { email_verified: false },
        });

        expect(allowed).toBe(false);
        expect(recordSecurityEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "AUTH_OAUTH_UNVERIFIED_EMAIL_REJECTED",
            severity: "WARN",
            metadata: { email: "unverified@example.com", provider: "google" },
          }),
        );
      });

      it("rejects Google sign-in for credentials-first accounts without prior linked Google account", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
          id: "cred-user-1",
          email: "learner@example.com",
          role: "LEARNER",
          passwordHash: "stored-bcrypt-password-hash",
        } as any);
        vi.mocked(prisma.account.findFirst).mockResolvedValueOnce(null);

        const allowed = await signInCallback({
          user: { email: "learner@example.com" },
          account: { provider: "google", providerAccountId: "new-google-id" },
          profile: { email_verified: true },
        });

        expect(allowed).toBe(false);
        expect(recordSecurityEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: "cred-user-1",
            type: "AUTH_OAUTH_CONFLICTING_CREDENTIALS_REJECTED",
            severity: "WARN",
          }),
        );
      });

      it("rejects Google sign-in when linked Google account has a conflicting providerAccountId", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
          id: "google-user-1",
          email: "google.student@example.com",
          role: "LEARNER",
          passwordHash: null,
        } as any);
        vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
          providerAccountId: "original-google-account-id",
        } as any);

        const allowed = await signInCallback({
          user: { email: "google.student@example.com" },
          account: { provider: "google", providerAccountId: "different-google-account-id" },
          profile: { email_verified: true },
        });

        expect(allowed).toBe(false);
        expect(recordSecurityEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: "google-user-1",
            type: "AUTH_OAUTH_CONFLICTING_ACCOUNT_ID_REJECTED",
            severity: "CRITICAL",
          }),
        );
      });

      it("allows Google sign-in for existing user when providerAccountId matches", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
          id: "google-user-1",
          email: "google.student@example.com",
          role: "LEARNER",
          passwordHash: null,
        } as any);
        vi.mocked(prisma.account.findFirst).mockResolvedValueOnce({
          providerAccountId: "matching-google-account-id",
        } as any);

        const allowed = await signInCallback({
          user: { email: "google.student@example.com" },
          account: { provider: "google", providerAccountId: "matching-google-account-id" },
          profile: { email_verified: true },
        });

        expect(allowed).toBe(true);
      });

      it("allows credentials sign-in in signIn callback", async () => {
        const signInCallback = authOptions.callbacks?.signIn as any;
        expect(signInCallback).toBeDefined();

        const allowed = await signInCallback({
          user: { email: "user@example.com" },
          account: { provider: "credentials" },
        });

        expect(allowed).toBe(true);
      });

      it("jwt callback defaults role to LEARNER if user has no role", async () => {
        const jwtCallback = authOptions.callbacks?.jwt as any;
        expect(jwtCallback).toBeDefined();

        const token = await jwtCallback({
          token: {},
          user: { id: "oauth-user-1", email: "oauth@example.com" },
        });

        expect(token.id).toBe("oauth-user-1");
        expect(token.role).toBe("LEARNER");
      });

      it("jwt callback preserves existing user role", async () => {
        const jwtCallback = authOptions.callbacks?.jwt as any;
        expect(jwtCallback).toBeDefined();

        const token = await jwtCallback({
          token: {},
          user: { id: "oauth-user-2", role: "INTERNAL_LEARNER" },
        });

        expect(token.role).toBe("INTERNAL_LEARNER");
      });

      it("session callback attaches user info and enforces default LEARNER role", async () => {
        const sessionCallback = authOptions.callbacks?.session as any;
        expect(sessionCallback).toBeDefined();

        const session = await sessionCallback({
          session: { user: {} },
          token: { id: "oauth-user-1", role: undefined, iat: 123456 },
        });

        expect(session.user.id).toBe("oauth-user-1");
        expect(session.user.role).toBe("LEARNER");
        expect(session.user.issuedAtMs).toBe(123456000);
      });
    });

    describe("events", () => {
      it("updates lastLoginAt and touches activity on successful signIn event", async () => {
        const signInEvent = authOptions.events?.signIn as any;
        expect(signInEvent).toBeDefined();

        await signInEvent({
          user: { id: "user-123", email: "learner@zenoba.tech" },
        });

        expect(prisma.user.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: "user-123" },
            data: expect.objectContaining({
              lastLoginAt: expect.any(Date),
            }),
          }),
        );
        expect(touchUserActivity).toHaveBeenCalledWith("user-123");
      });
    });
  });

  describe("CredentialsProvider authorize", () => {
    it("rejects DEVELOPER credentials login if twoFactorEnabled is false and records security event", async () => {
      const provider = buildAuthProviders({}).find(
        (p) => p.id === "credentials",
      ) as any;

      const authorizeFn = provider.options?.authorize ?? provider.authorize;

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "dev-1",
        email: "dev@zenoba.tech",
        passwordHash: "valid-hash",
        role: "DEVELOPER",
        twoFactorEnabled: false,
      } as any);

      await expect(
        authorizeFn({
          email: "dev@zenoba.tech",
          password: "ValidPassword123!",
        }),
      ).rejects.toThrow(/two-factor|2FA/i);

      expect(recordSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "dev-1",
          type: "AUTH_LOGIN_FAILED",
          severity: "HIGH",
        }),
      );
    });

    it("requires 2FA code (throws 2FA_REQUIRED) for DEVELOPER login when code is omitted", async () => {
      const provider = buildAuthProviders({}).find(
        (p) => p.id === "credentials",
      ) as any;

      const authorizeFn = provider.options?.authorize ?? provider.authorize;

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "dev-1",
        email: "dev@zenoba.tech",
        passwordHash: "valid-hash",
        role: "DEVELOPER",
        twoFactorEnabled: true,
        twoFactorSecret: "SECRET",
      } as any);

      await expect(
        authorizeFn({
          email: "dev@zenoba.tech",
          password: "ValidPassword123!",
        }),
      ).rejects.toThrow("2FA_REQUIRED");
    });
  });
});
