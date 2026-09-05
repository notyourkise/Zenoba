import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("Security Headers (next.config.ts)", () => {
  it("defines comprehensive security headers including Content-Security-Policy", async () => {
    expect(nextConfig.headers).toBeDefined();
    const headersList = await nextConfig.headers!();
    expect(headersList.length).toBeGreaterThan(0);

    const rootConfig = headersList.find((h) => h.source === "/:path*");
    expect(rootConfig).toBeDefined();

    const headersMap = new Map(
      rootConfig!.headers.map((item) => [item.key, item.value]),
    );

    // Verify CSP
    expect(headersMap.has("Content-Security-Policy")).toBe(true);
    const csp = headersMap.get("Content-Security-Policy")!;
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    expect(csp).toContain("img-src 'self' data: blob: https:");
    expect(csp).toContain("font-src 'self' data:");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");

    // Verify other mandatory security headers
    expect(headersMap.get("X-Frame-Options")).toBe("DENY");
    expect(headersMap.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headersMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headersMap.get("Strict-Transport-Security")).toContain("max-age=");
    expect(headersMap.get("Permissions-Policy")).toContain("camera=()");
  });
});
