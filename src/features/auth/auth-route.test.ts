import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as registerHandler } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/db/client";

// Mock prisma client for unit tests
vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid email format with 400", async () => {
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        password: "ValidPassword123!",
      }),
    });

    const res = await registerHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid email format");
  });

  it("rejects short password with 400", async () => {
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@example.com",
        password: "123",
      }),
    });

    const res = await registerHandler(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Password must be at least 8 characters");
  });

  it("rejects existing email with 409", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "existing-id",
      email: "user@example.com",
      name: "Existing User",
      passwordHash: "hash",
      emailVerified: null,
      image: null,
      role: "LEARNER",
      createdAt: new Date(),
      updatedAt: new Date(),
      headline: null,
      streakCount: 1,
      lastStreakDate: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    });

    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@example.com",
        password: "ValidPassword123!",
        name: "Test User",
      }),
    });

    const res = await registerHandler(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe("An account with this email already exists");
  });

  it("registers a new user successfully with 201", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: "new-user-id",
      email: "newuser@example.com",
      name: "New User",
      role: "LEARNER",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "NewUser@Example.com",
        password: "SecurePassword123!",
        name: "New User",
      }),
    });

    const res = await registerHandler(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toBe("Account created successfully");
    expect(data.user.email).toBe("newuser@example.com");
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "newuser@example.com",
          name: "New User",
          role: "LEARNER",
        }),
      })
    );
  });
});
