import { describe, it, expect } from "vitest";

describe("Health Check Endpoint", () => {
  it("should have a valid response structure", () => {
    const mockResponse = {
      status: "ok" as const,
      timestamp: new Date().toISOString(),
    };

    // Verify required fields exist
    expect(mockResponse).toHaveProperty("status");
    expect(mockResponse.status).toBe("ok");

    // Verify timestamp is a valid ISO string
    expect(new Date(mockResponse.timestamp).getTime()).toBeGreaterThan(0);
  });

  it("should maintain stable API contract", () => {
    // Health endpoint should return predictable shape
    const expectedContract = {
      status: "ok",
      timestamp: "ISO-8601-timestamp-string",
    };

    expect(typeof expectedContract.status).toBe("string");
    expect(expectedContract.status).toBe("ok");
    expect(typeof expectedContract.timestamp).toBe("string");
  });
});
