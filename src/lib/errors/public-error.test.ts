import { describe, it, expect } from "vitest";
import { sanitizePublicError } from "./public-error";

describe("sanitizePublicError", () => {
  it("sanitizes network and fetch failures", () => {
    const error = new TypeError("Failed to fetch");
    const result = sanitizePublicError(error);

    expect(result.code).toBe("NETWORK_ERROR");
    expect(result.title).toBe("Koneksi Terputus");
    expect(result.message).toMatch(/koneksi internet/i);
    expect(result.action?.label).toBe("Coba Lagi");
  });

  it("masks database and Prisma query errors without leaking SQL or schema", () => {
    const rawDbError = new Error(
      'Invalid `prisma.userLessonProgress.findMany()` invocation: SELECT "public"."user_lesson_progress"."id" FROM "public"."user_lesson_progress" WHERE "userId" = \'usr_secret_123\';'
    );
    const result = sanitizePublicError(rawDbError);

    expect(result.code).toBe("INTERNAL_ERROR");
    expect(result.title).toBe("Kendala Sistem");
    expect(result.message).not.toContain("SELECT");
    expect(result.message).not.toContain("prisma");
    expect(result.message).not.toContain("usr_secret_123");
    expect(result.action?.label).toBe("Muat Ulang Halaman");
  });

  it("maps authentication expiration errors cleanly with sign-in action", () => {
    const authError = new Error("Authentication required");
    const result = sanitizePublicError(authError);

    expect(result.code).toBe("UNAUTHENTICATED");
    expect(result.title).toBe("Sesi Berakhir");
    expect(result.message).toMatch(/masuk kembali/i);
    expect(result.action?.label).toBe("Masuk Akun");
    expect(result.action?.href).toBe("/sign-in");
  });

  it("maps workspace and permission errors with safe navigation action", () => {
    const forbiddenError = new Error("Forbidden: Workspace isolation active");
    const result = sanitizePublicError(forbiddenError);

    expect(result.code).toBe("FORBIDDEN");
    expect(result.title).toBe("Akses Ditolak");
    expect(result.message).toMatch(/tidak memiliki izin/i);
    expect(result.action?.label).toBe("Kembali ke Pembelajaran");
    expect(result.action?.href).toBe("/learn");
  });

  it("maps draft payload size errors", () => {
    const sizeError = new Error("Draft payload exceeds 64KB limit");
    const result = sanitizePublicError(sizeError);

    expect(result.code).toBe("DRAFT_SYNC_FAILED");
    expect(result.title).toBe("Draf Terlalu Besar");
    expect(result.message).toMatch(/64 KB/i);
  });

  it("maps not found errors", () => {
    const notFoundError = new Error("Pelajaran tidak ditemukan");
    const result = sanitizePublicError(notFoundError);

    expect(result.code).toBe("NOT_FOUND");
    expect(result.title).toBe("Tidak Ditemukan");
    expect(result.message).toMatch(/tidak ditemukan/i);
  });

  it("handles unknown or non-Error types safely", () => {
    const result = sanitizePublicError({ weird: "object" });

    expect(result.code).toBe("INTERNAL_ERROR");
    expect(result.title).toBe("Kendala Sistem");
    expect(result.message).toBe("Terjadi kendala yang tidak terduga. Silakan coba kembali.");
  });
});
