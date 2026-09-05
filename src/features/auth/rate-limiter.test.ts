import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  ensureMinimumDuration,
  resetRateLimits,
} from "./rate-limiter";

describe("Rate Limiter & Abuse Protection", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests within configured limit", () => {
    const key = "test:ip:192.168.1.1";
    const limit = 3;
    const windowMs = 60000;

    const res1 = checkRateLimit(key, limit, windowMs, 1000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(key, limit, windowMs, 2000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(key, limit, windowMs, 3000);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests exceeding limit and provides retryAfterSeconds", () => {
    const key = "test:ip:192.168.1.2";
    const limit = 2;
    const windowMs = 60000;

    checkRateLimit(key, limit, windowMs, 1000);
    checkRateLimit(key, limit, windowMs, 2000);

    // 3rd attempt at t = 3000ms should be blocked
    const res = checkRateLimit(key, limit, windowMs, 3000);
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
    // oldest is at 1000, resetTime = 1000 + 60000 = 61000
    // retryAfterSeconds = ceil((61000 - 3000) / 1000) = 58
    expect(res.retryAfterSeconds).toBe(58);
  });

  it("resets limit after sliding window expires", () => {
    const key = "test:ip:192.168.1.3";
    const limit = 1;
    const windowMs = 10000;

    const res1 = checkRateLimit(key, limit, windowMs, 1000);
    expect(res1.success).toBe(true);

    const res2 = checkRateLimit(key, limit, windowMs, 5000);
    expect(res2.success).toBe(false);

    // After window passes (t = 12000 > 1000 + 10000)
    const res3 = checkRateLimit(key, limit, windowMs, 12000);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("extracts IP correctly from x-forwarded-for and x-real-ip", () => {
    const req1 = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    expect(getClientIp(req1)).toBe("203.0.113.195");

    const req2 = new Request("http://localhost", {
      headers: { "x-real-ip": "198.51.100.42" },
    });
    expect(getClientIp(req2)).toBe("198.51.100.42");

    const req3 = new Request("http://localhost");
    expect(getClientIp(req3)).toBe("127.0.0.1");
  });

  it("ensures minimum duration for timing attack mitigation", async () => {
    const start = Date.now();
    await ensureMinimumDuration(start, 50, true);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // small tolerance for timers
  });
});
