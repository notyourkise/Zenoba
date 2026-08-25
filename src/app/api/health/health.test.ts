import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("Health Check Endpoint", () => {
  it("returns the comprehensive production health contract", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(["healthy", "degraded"]).toContain(body.status);
    expect(body.version).toBe("1.0.0");
    expect(body.database).toBeDefined();
    expect(body.system).toBeDefined();
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });
});
