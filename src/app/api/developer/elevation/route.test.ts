/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST, GET, DELETE } from "./route";
import { requireDeveloperActor } from "@/features/authorization/guards";
import {
  createDeveloperElevation,
  revokeDeveloperElevation,
  getDeveloperElevationStatus,
  ElevationError,
  ELEVATION_COOKIE_NAME,
} from "@/features/developer/elevation/service";
import { AuthorizationError } from "@/features/authorization/types";

vi.mock("@/features/authorization/guards", () => ({
  requireDeveloperActor: vi.fn(),
}));

vi.mock("@/features/developer/elevation/service", () => ({
  createDeveloperElevation: vi.fn(),
  revokeDeveloperElevation: vi.fn(),
  getDeveloperElevationStatus: vi.fn(),
  ElevationError: class extends Error {
    readonly code: string;
    readonly status: number;
    constructor(code: string, message: string, status = 400) {
      super(message);
      this.name = "ElevationError";
      this.code = code;
      this.status = status;
    }
  },
  ELEVATION_COOKIE_NAME: "netloka_dev_elevation",
  ELEVATION_TTL_MS: 10 * 60 * 1000,
}));

describe("/api/developer/elevation Route Handler", () => {
  const mockDeveloperActor = {
    id: "dev-1",
    email: "dev@netloka.biz.id",
    name: "Dev Anto",
    role: "DEVELOPER" as const,
    authVersion: 1,
    twoFactorEnabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/developer/elevation", () => {
    it("returns 403 if caller is not a developer actor", async () => {
      vi.mocked(requireDeveloperActor).mockRejectedValueOnce(
        new AuthorizationError("FORBIDDEN", "Developer workspace access required"),
      );

      const request = new Request("http://localhost:3000/api/developer/elevation", {
        method: "POST",
        body: JSON.stringify({ password: "pass", code: "123456" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(403);
    });

    it("returns 400 when password or code is missing", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

      const request = new Request("http://localhost:3000/api/developer/elevation", {
        method: "POST",
        body: JSON.stringify({ password: "" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("returns 401 when password or 2FA code is invalid", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
      vi.mocked(createDeveloperElevation).mockRejectedValueOnce(
        new ElevationError("INVALID_ELEVATION", "Invalid password or two-factor code", 401),
      );

      const request = new Request("http://localhost:3000/api/developer/elevation", {
        method: "POST",
        body: JSON.stringify({ password: "wrong", code: "000000" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.code).toBe("INVALID_ELEVATION");
    });

    it("sets secure httpOnly cookie and returns 200 on successful elevation", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
      const expiresAt = new Date(Date.now() + 600000);
      vi.mocked(createDeveloperElevation).mockResolvedValueOnce({
        rawToken: "raw_elevation_token_32_bytes_hex_string",
        expiresAt,
        session: { id: "elev-1" } as any,
      });

      const request = new Request("http://localhost:3000/api/developer/elevation", {
        method: "POST",
        body: JSON.stringify({ password: "ValidPassword123!", code: "123456" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain(ELEVATION_COOKIE_NAME);
      expect(setCookie).toContain("HttpOnly");
      expect(setCookie?.toLowerCase()).toContain("samesite=strict");
      expect(setCookie).toContain("Path=/developer");

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.expiresAt).toBe(expiresAt.toISOString());
    });
  });

  describe("GET /api/developer/elevation", () => {
    it("returns elevation status from cookie", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
      vi.mocked(getDeveloperElevationStatus).mockResolvedValueOnce({
        isElevated: true,
        remainingSeconds: 450,
        expiresAt: new Date().toISOString(),
      });

      const request = new Request("http://localhost:3000/api/developer/elevation", {
        headers: {
          cookie: `${ELEVATION_COOKIE_NAME}=mock_token`,
        },
      });

      const response = await GET(request);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.isElevated).toBe(true);
      expect(json.remainingSeconds).toBe(450);
    });
  });

  describe("DELETE /api/developer/elevation", () => {
    it("revokes elevation session and clears cookie", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
      vi.mocked(revokeDeveloperElevation).mockResolvedValueOnce(true);

      const request = new Request("http://localhost:3000/api/developer/elevation", {
        method: "DELETE",
        headers: {
          cookie: `${ELEVATION_COOKIE_NAME}=mock_token`,
        },
      });

      const response = await DELETE(request);
      expect(response.status).toBe(200);

      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain("Max-Age=0");
    });
  });
});
