import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { isSessionRevoked } from "@/features/auth/session-revocation";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  const protectedPrefixes = [
    "/dashboard",
    "/learn",
    "/labs",
    "/challenges",
    "/consultant",
    "/profile",
    "/settings",
    "/catalog",
    "/my-learning",
    "/my-packages",
    "/orders",
  ];

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const tokenIatMs = typeof token?.iat === "number" ? token.iat * 1000 : undefined;
  const isRevoked = token?.id ? isSessionRevoked(token.id as string, tokenIatMs) : false;

  if (isProtected && (!token || isRevoked)) {
    const signInUrl = new URL("/", request.url);
    signInUrl.searchParams.set("auth", "sign-in");
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (token && !isRevoked && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/labs/:path*",
    "/challenges/:path*",
    "/consultant/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/catalog/:path*",
    "/my-learning/:path*",
    "/my-packages/:path*",
    "/orders/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
