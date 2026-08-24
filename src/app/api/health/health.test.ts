import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("Health Check Endpoint", () => {
  it("returns the health contract", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body.status).toBe("ok");
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });
});
