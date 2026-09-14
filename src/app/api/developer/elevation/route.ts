import { NextResponse } from "next/server";
import { requireDeveloperActor } from "@/features/authorization/guards";
import { AuthorizationError } from "@/features/authorization/types";
import {
  createDeveloperElevation,
  revokeDeveloperElevation,
  getDeveloperElevationStatus,
  ElevationError,
  ELEVATION_COOKIE_NAME,
} from "@/features/developer/elevation/service";

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? undefined;
}

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

    let body: { password?: string; code?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    if (!body?.password?.trim() || !body?.code?.trim()) {
      return NextResponse.json(
        { error: "Password and two-factor code are required", code: "MISSING_CREDENTIALS" },
        { status: 400 },
      );
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const { rawToken, expiresAt } = await createDeveloperElevation({
      userId: actor.id,
      password: body.password.trim(),
      code: body.code.trim(),
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
    });

    response.cookies.set({
      name: ELEVATION_COOKIE_NAME,
      value: rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/developer",
      maxAge: 600, // 10 minutes in seconds
    });

    return response;
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    if (error instanceof ElevationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    console.error("[DeveloperElevationRoute] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error during elevation", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    await requireDeveloperActor();

    const token = getElevationCookie(request);
    const status = await getDeveloperElevationStatus(token);

    return NextResponse.json(status);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { isElevated: false, remainingSeconds: 0, expiresAt: null },
      { status: 200 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireDeveloperActor();

    const token = getElevationCookie(request);
    if (token) {
      await revokeDeveloperElevation(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Elevation session revoked",
    });

    response.cookies.set({
      name: ELEVATION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/developer",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    console.error("[DeveloperElevationRoute] DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error revoking elevation", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
