import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants/auth";

const PUBLIC_ROUTES = ["/login"];
const PROTECTED_ROUTES = ["/settings"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/settings" : "/login", request.url),
    );
  }

  if (!token && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/settings", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/settings/:path*"],
};
