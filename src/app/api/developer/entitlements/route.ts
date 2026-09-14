import { NextResponse } from "next/server";
import { requireDeveloperActor } from "@/features/authorization/guards";
import { AuthorizationError } from "@/features/authorization/types";
import {
  requireElevatedDeveloperSession,
  ElevationError,
  ELEVATION_COOKIE_NAME,
} from "@/features/developer/elevation/service";
import {
  mutateDeveloperEntitlement,
  EntitlementMutationSchema,
  EntitlementMutationError,
} from "@/features/developer/access/mutations";

function getElevationCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ELEVATION_COOKIE_NAME}=`));

  return match ? match.slice(`${ELEVATION_COOKIE_NAME}=`.length) : undefined;
}

export async function POST(request: Request) {
  try {
    const actor = await requireDeveloperActor();

    // Enforce active elevated session
    const elevationToken = getElevationCookie(request);
    if (!elevationToken) {
      return NextResponse.json(
        {
          error: "Sesi elevasi hak akses diperlukan untuk melakukan mutasi entitlement.",
          code: "ELEVATION_REQUIRED",
        },
        { status: 403 },
      );
    }

    try {
      await requireElevatedDeveloperSession(elevationToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sesi elevasi tidak valid.";
      const code = err instanceof ElevationError ? err.code : "ELEVATION_REQUIRED";
      return NextResponse.json({ error: message, code }, { status: 403 });
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Format payload JSON tidak valid.", code: "INVALID_JSON" },
        { status: 400 },
      );
    }

    const parseResult = EntitlementMutationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Data mutasi entitlement tidak valid.",
          code: "VALIDATION_ERROR",
          details: parseResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await mutateDeveloperEntitlement(parseResult.data, {
      actorUserId: actor.id,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status },
      );
    }

    if (err instanceof EntitlementMutationError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status },
      );
    }

    console.error("[POST /api/developer/entitlements] Unexpected error:", err);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal saat memproses mutasi entitlement.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
