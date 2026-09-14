import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db/client";
import { recordSecurityEvent, sanitizeMetadata, getSecurityEvents } from "./events";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    securityEvent: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("Security Events Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sanitizeMetadata", () => {
    it("redacts sensitive keys including password, token, secret, hash, and cookie", () => {
      const dirty = {
        email: "student@example.com",
        password: "SuperSecretPassword123!",
        nested: {
          token: "eyJhbGciOi...",
          twoFactorSecret: "JBSWY3DPEHPK3PXP",
          safeKey: "safeValue",
        },
        items: [
          { authHeader: "Bearer 12345", id: "item-1" },
          "plain string",
        ],
      };

      const sanitized = sanitizeMetadata(dirty) as Record<string, unknown>;

      expect(sanitized.email).toBe("student@example.com");
      expect(sanitized.password).toBe("[REDACTED]");
      expect((sanitized.nested as Record<string, unknown>).token).toBe("[REDACTED]");
      expect((sanitized.nested as Record<string, unknown>).twoFactorSecret).toBe("[REDACTED]");
      expect((sanitized.nested as Record<string, unknown>).safeKey).toBe("safeValue");
      expect(
        ((sanitized.items as unknown[])[0] as Record<string, unknown>).authHeader
      ).toBe("[REDACTED]");
      expect(
        ((sanitized.items as unknown[])[0] as Record<string, unknown>).id
      ).toBe("item-1");
    });

    it("handles null, undefined, and non-object inputs safely", () => {
      expect(sanitizeMetadata(null)).toBeNull();
      expect(sanitizeMetadata(undefined)).toBeUndefined();
      expect(sanitizeMetadata("string" as unknown as Record<string, unknown>)).toBe("string");
    });
  });

  describe("recordSecurityEvent", () => {
    it("persists a valid security event with sanitized metadata", async () => {
      const mockCreated = {
        id: "sec-1",
        userId: "user-1",
        type: "AUTH_LOGIN_FAILED",
        severity: "WARN",
        metadata: { email: "user@example.com", password: "[REDACTED]" },
        createdAt: new Date(),
      };

      vi.mocked(prisma.securityEvent.create).mockResolvedValueOnce(mockCreated);

      const result = await recordSecurityEvent({
        userId: "user-1",
        type: "AUTH_LOGIN_FAILED",
        severity: "WARN",
        metadata: { email: "user@example.com", password: "raw_password_attempt" },
      });

      expect(result).toEqual(mockCreated);
      expect(prisma.securityEvent.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          type: "AUTH_LOGIN_FAILED",
          severity: "WARN",
          metadata: { email: "user@example.com", password: "[REDACTED]" },
        },
      });
    });

    it("defaults severity to INFO when unspecified", async () => {
      const mockCreated = {
        id: "sec-2",
        userId: null,
        type: "WORKSPACE_VIOLATION",
        severity: "INFO",
        metadata: null,
        createdAt: new Date(),
      };

      vi.mocked(prisma.securityEvent.create).mockResolvedValueOnce(mockCreated);

      const result = await recordSecurityEvent({
        type: "WORKSPACE_VIOLATION",
      });

      expect(result).toEqual(mockCreated);
      expect(prisma.securityEvent.create).toHaveBeenCalledWith({
        data: {
          userId: null,
          type: "WORKSPACE_VIOLATION",
          severity: "INFO",
          metadata: undefined,
        },
      });
    });

    it("is best-effort and does not throw when database fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(prisma.securityEvent.create).mockRejectedValueOnce(new Error("DB Connection Refused"));

      const result = await recordSecurityEvent({
        type: "CRITICAL_ATTEMPT",
        severity: "CRITICAL",
      });

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("getSecurityEvents", () => {
    it("caps query limit at 50", async () => {
      vi.mocked(prisma.securityEvent.findMany).mockResolvedValueOnce([]);

      await getSecurityEvents({ limit: 500 });

      expect(prisma.securityEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });
});
