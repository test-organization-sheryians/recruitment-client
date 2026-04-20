
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //  Ignore static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".otf")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value?.toLowerCase();

  //  Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/un-verified",
    "/unauthorized",
    "/reset-password",
  ];

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  //  Prevent logged-in users from login/register
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  //  ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    // ❌ No token → login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ❌ Not admin → unauthorized
    if (!role || role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  }

  //  PROTECTED ROUTES
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}