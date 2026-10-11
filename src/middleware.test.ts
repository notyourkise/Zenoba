import { describe, it, expect, vi, beforeEach } from "vitest";
import { config, middleware } from "./middleware";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import {
  revokeUserSessions,
  clearRevokedSessions,
} from "@/features/auth/session-revocation";

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

function createMockRequest(pathname: string): NextRequest {
  const url = new URL(pathname, "https://zenoba.tech");
  return {
    url: url.toString(),
    nextUrl: url,
  } as unknown as NextRequest;
}

describe("Middleware Route Guard & Session Invalidation (TD-01 & TD-08)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearRevokedSessions();
  });

  it("allows unauthenticated requests on public routes", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const req = createMockRequest("/");
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("keeps the Zenoba About page outside protected route matching", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const req = createMockRequest("/about");
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(config.matcher).not.toContain("/about");
  });

  it("redirects unauthenticated requests on protected routes to sign-in modal", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const req = createMockRequest("/dashboard");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/?auth=sign-in");
    expect(location).toContain("callbackUrl=%2Fdashboard");
  });

  it("allows authenticated requests on protected routes when session is valid", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "user-1",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/dashboard");
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it("redirects authenticated request on protected routes when session is revoked (TD-08)", async () => {
    const issuedAtSeconds = 100;
    const revocationTimeMs = 150000; // revoked after issue time
    revokeUserSessions("user-revoked", revocationTimeMs);

    vi.mocked(getToken).mockResolvedValue({
      id: "user-revoked",
      iat: issuedAtSeconds, // 100000 ms < 150000 ms
    });

    const req = createMockRequest("/dashboard");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/?auth=sign-in");
    expect(location).toContain("callbackUrl=%2Fdashboard");
  });

  it("redirects valid authenticated users away from /sign-in to /dashboard", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "user-1",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/sign-in");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zenoba.tech/dashboard");
  });

  it("redirects valid authenticated users away from / to /dashboard", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "user-1",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zenoba.tech/dashboard");
  });

  it("redirects authenticated DEVELOPER away from / to /developer", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "dev-1",
      role: "DEVELOPER",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zenoba.tech/developer");
  });

  it("allows users with revoked sessions to access /sign-in", async () => {
    const revocationTimeMs = 200000;
    revokeUserSessions("user-revoked", revocationTimeMs);

    vi.mocked(getToken).mockResolvedValue({
      id: "user-revoked",
      iat: 100, // 100000 ms < 200000 ms
    });

    const req = createMockRequest("/sign-in");
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it("allows users with revoked sessions to access /", async () => {
    const revocationTimeMs = 200000;
    revokeUserSessions("user-revoked", revocationTimeMs);

    vi.mocked(getToken).mockResolvedValue({
      id: "user-revoked",
      iat: 100,
    });

    const req = createMockRequest("/");
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it("denies DEVELOPER requests to learner route /learn and redirects to /developer", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "dev-1",
      role: "DEVELOPER",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/learn");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zenoba.tech/developer");
  });

  it("denies LEARNER requests to /developer and redirects to /dashboard", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "learner-1",
      role: "LEARNER",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/developer");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zenoba.tech/dashboard");
  });

  it("redirects unauthenticated requests on /developer to sign-in modal with callbackUrl", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    const req = createMockRequest("/developer");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/?auth=sign-in");
    expect(location).toContain("callbackUrl=%2Fdeveloper");
  });

  it("allows authenticated DEVELOPER to access /developer", async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: "dev-1",
      role: "DEVELOPER",
      iat: Math.floor(Date.now() / 1000),
    });

    const req = createMockRequest("/developer");
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });
});
