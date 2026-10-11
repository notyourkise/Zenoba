/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { requireDeveloperActor } from "@/features/authorization/guards";
import {
  requireElevatedDeveloperSession,
  ElevationError,
  ELEVATION_COOKIE_NAME,
} from "@/features/developer/elevation/service";
import {
  mutateDeveloperEntitlement,
  EntitlementMutationError,
} from "@/features/developer/access/mutations";
import { AuthorizationError } from "@/features/authorization/types";

vi.mock("@/features/authorization/guards", () => ({
  requireDeveloperActor: vi.fn(),
}));

vi.mock("@/features/developer/elevation/service", () => ({
  requireElevatedDeveloperSession: vi.fn(),
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
  ELEVATION_COOKIE_NAME: "zenoba_dev_elevation",
}));

vi.mock("@/features/developer/access/mutations", () => ({
  mutateDeveloperEntitlement: vi.fn(),
  EntitlementMutationSchema: {
    parse: vi.fn(),
    safeParse: (data: any) => {
      if (
        data &&
        (data.action === "GRANT" || data.action === "REVOKE") &&
        typeof data.targetUserId === "string" &&
        data.targetUserId.startsWith("c") &&
        typeof data.packageId === "string" &&
        data.packageId.startsWith("c") &&
        typeof data.reason === "string" &&
        data.reason.length >= 12 &&
        typeof data.requestId === "string" &&
        data.requestId.length >= 30
      ) {
        return { success: true, data };
      }
      return {
        success: false,
        error: {
          flatten: () => ({ fieldErrors: { reason: ["Too short"] } }),
        },
      };
    },
  },
  EntitlementMutationError: class extends Error {
    readonly code: string;
    readonly status: number;
    constructor(code: string, message: string, status = 400) {
      super(message);
      this.name = "EntitlementMutationError";
      this.code = code;
      this.status = status;
    }
  },
}));

describe("POST /api/developer/entitlements Route Handler", () => {
  const mockDeveloperActor = {
    id: "clrkactor1234567890123456",
    email: "dev@zenoba.tech",
    name: "Dev Anto",
    role: "DEVELOPER" as const,
    authVersion: 1,
    twoFactorEnabled: true,
  };

  const validPayload = {
    action: "GRANT",
    targetUserId: "clrkuser12345678901234567",
    packageId: "clrkpkg123456789012345678",
    reason: "Pemberian akses beasiswa pelatihan SMK TKJ",
    requestId: "11111111-2222-3333-4444-555555555555",
  };

  const validCookie = `${ELEVATION_COOKIE_NAME}=valid_elevation_token_32_bytes_long_here`;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireDeveloperActor).mockResolvedValue(mockDeveloperActor);
    vi.mocked(requireElevatedDeveloperSession).mockResolvedValue({
      id: "elev-1",
      userId: mockDeveloperActor.id,
      expiresAt: new Date(Date.now() + 600000),
    } as any);
  });

  it("returns 401 when actor is unauthenticated", async () => {
    vi.mocked(requireDeveloperActor).mockRejectedValueOnce(
      new AuthorizationError("UNAUTHENTICATED", "Authentication required"),
    );

    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: validCookie },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toContain("Authentication required");
  });

  it("returns 403 when elevation cookie is missing", async () => {
    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.code).toBe("ELEVATION_REQUIRED");
  });

  it("returns 403 when elevation session is expired or invalid", async () => {
    vi.mocked(requireElevatedDeveloperSession).mockRejectedValueOnce(
      new ElevationError("ELEVATION_EXPIRED", "Sesi elevasi telah kedaluwarsa.", 403),
    );

    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: validCookie },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.code).toBe("ELEVATION_EXPIRED");
  });

  it("returns 400 when body payload fails validation", async () => {
    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: validCookie },
      body: JSON.stringify({ ...validPayload, reason: "Pendek" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.code).toBe("VALIDATION_ERROR");
  });

  it("successfully performs entitlement mutation and returns 200", async () => {
    const mockResult = {
      success: true,
      idempotentReplay: false,
      action: "GRANT" as const,
      targetUserId: validPayload.targetUserId,
      packageId: validPayload.packageId,
      affectedCourses: ["course-1", "course-2"],
    };

    vi.mocked(mutateDeveloperEntitlement).mockResolvedValueOnce(mockResult);

    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: validCookie },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual(mockResult);
    expect(mutateDeveloperEntitlement).toHaveBeenCalledWith(
      validPayload,
      { actorUserId: mockDeveloperActor.id },
    );
  });

  it("returns 409 when mutation encounters conflicting duplicate request", async () => {
    vi.mocked(mutateDeveloperEntitlement).mockRejectedValueOnce(
      new EntitlementMutationError("CONFLICT_DUPLICATE_REQUEST", "Request ID exists with different payload", 409),
    );

    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: validCookie },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(409);
    const json = await response.json();
    expect(json.code).toBe("CONFLICT_DUPLICATE_REQUEST");
  });

  it("returns 403 when target user is a developer", async () => {
    vi.mocked(mutateDeveloperEntitlement).mockRejectedValueOnce(
      new EntitlementMutationError("DEVELOPER_TARGET_FORBIDDEN", "Forbidden for DEVELOPER role", 403),
    );

    const request = new Request("http://localhost:3000/api/developer/entitlements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: validCookie },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.code).toBe("DEVELOPER_TARGET_FORBIDDEN");
  });
});
