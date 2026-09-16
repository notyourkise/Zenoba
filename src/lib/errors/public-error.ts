export type PublicErrorCode =
  | "NOT_FOUND"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "LOCKED"
  | "NETWORK_ERROR"
  | "DRAFT_SYNC_FAILED"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface PublicErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PublicErrorDetail {
  code: PublicErrorCode;
  title: string;
  message: string;
  action?: PublicErrorAction;
}

/**
 * Sanitizes unknown, internal, or infrastructure errors into safe, actionable
 * Indonesian messages for learners. Never leaks raw SQL queries, Prisma details,
 * or server internals.
 */
export function sanitizePublicError(
  error: unknown,
  fallbackMessage?: string
): PublicErrorDetail {
  if (!error) {
    return {
      code: "INTERNAL_ERROR",
      title: "Kendala Sistem",
      message: fallbackMessage || "Terjadi kendala yang tidak terduga. Silakan coba kembali.",
    };
  }

  const rawMessage =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";

  // 1. Check for sensitive internal DB/Prisma error signatures FIRST to ensure zero leak
  const isPrismaOrDb =
    /prisma/i.test(rawMessage) ||
    /select\s+/i.test(rawMessage) ||
    /insert\s+into/i.test(rawMessage) ||
    /update\s+/i.test(rawMessage) ||
    /delete\s+from/i.test(rawMessage) ||
    /foreign\s+key/i.test(rawMessage) ||
    /unique\s+constraint/i.test(rawMessage) ||
    /database/i.test(rawMessage);

  if (isPrismaOrDb) {
    return {
      code: "INTERNAL_ERROR",
      title: "Kendala Sistem",
      message: "Terjadi kendala saat memproses data pada server. Silakan muat ulang halaman.",
      action: {
        label: "Muat Ulang Halaman",
      },
    };
  }

  // 2. Network / Fetch failures
  if (
    /failed to fetch/i.test(rawMessage) ||
    /networkerror/i.test(rawMessage) ||
    /fetch failed/i.test(rawMessage) ||
    /network\s+request\s+failed/i.test(rawMessage) ||
    /connection\s+refused/i.test(rawMessage)
  ) {
    return {
      code: "NETWORK_ERROR",
      title: "Koneksi Terputus",
      message: "Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi.",
      action: {
        label: "Coba Lagi",
      },
    };
  }

  // 3. Authentication required / expired
  if (
    /unauthenticated/i.test(rawMessage) ||
    /authentication required/i.test(rawMessage) ||
    /jwt\s+expired/i.test(rawMessage) ||
    /session\s+expired/i.test(rawMessage) ||
    /unauthorized/i.test(rawMessage)
  ) {
    return {
      code: "UNAUTHENTICATED",
      title: "Sesi Berakhir",
      message: "Sesi belajar Anda telah berakhir atau belum masuk. Silakan masuk kembali.",
      action: {
        label: "Masuk Akun",
        href: "/sign-in",
      },
    };
  }

  // 4. Forbidden / Access Denied
  if (
    /forbidden/i.test(rawMessage) ||
    /access\s+denied/i.test(rawMessage) ||
    /workspace isolation/i.test(rawMessage) ||
    /courseaccessdenied/i.test(rawMessage)
  ) {
    return {
      code: "FORBIDDEN",
      title: "Akses Ditolak",
      message: "Anda tidak memiliki izin untuk mengakses materi ini atau hak akses tidak sesuai.",
      action: {
        label: "Kembali ke Pembelajaran",
        href: "/learn",
      },
    };
  }

  // 5. Draft payload size / sanitization
  if (/64kb/i.test(rawMessage) || /payload exceeds/i.test(rawMessage) || /draft.*large/i.test(rawMessage)) {
    return {
      code: "DRAFT_SYNC_FAILED",
      title: "Draf Terlalu Besar",
      message: "Ukuran draf jawaban melebihi batas maksimal 64 KB. Harap kurangi data jawaban Anda.",
      action: {
        label: "Coba Lagi",
      },
    };
  }

  if (/forbidden secret key/i.test(rawMessage) || /script.*tag/i.test(rawMessage) || /draft.*invalid/i.test(rawMessage)) {
    return {
      code: "DRAFT_SYNC_FAILED",
      title: "Draf Tidak Valid",
      message: "Draf mengandung karakter atau format yang tidak diizinkan.",
      action: {
        label: "Coba Lagi",
      },
    };
  }

  // 6. Locked content
  if (/locked/i.test(rawMessage) || /terkunci/i.test(rawMessage) || /prasyarat/i.test(rawMessage)) {
    return {
      code: "LOCKED",
      title: "Materi Terkunci",
      message: "Materi ini belum dapat diakses. Selesaikan prasyarat modul terlebih dahulu.",
      action: {
        label: "Kembali ke Modul",
        href: "/learn",
      },
    };
  }

  // 7. Not found
  if (/not found/i.test(rawMessage) || /tidak ditemukan/i.test(rawMessage)) {
    return {
      code: "NOT_FOUND",
      title: "Tidak Ditemukan",
      message: "Materi pembelajaran tidak ditemukan atau telah dipindahkan.",
      action: {
        label: "Kembali ke Modul",
        href: "/learn",
      },
    };
  }

  // Fallback
  return {
    code: "INTERNAL_ERROR",
    title: "Kendala Sistem",
    message: fallbackMessage || (rawMessage ? rawMessage : "Terjadi kendala yang tidak terduga. Silakan coba kembali."),
  };
}
