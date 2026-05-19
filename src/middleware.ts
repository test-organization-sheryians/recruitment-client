import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ STATIC FILES (same as yours)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".otf") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/un-verified',
    '/unauthorized',
    '/reset-password',
    '/user-verification',
    '/selected-candidates',
  ];

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // ✅ 🔥 ADMIN ROUTES FIXED
  if (pathname.startsWith("/admin")) {

    // 🔴 ALWAYS CHECK TOKEN FIRST
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl); // ✅ FIXED
    }

    // 🔴 THEN CHECK ROLE
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  }

  // ✅ 🔥 PROTECTED ROUTES FIXED
  if (!token && !isPublic) {

    // ❌ REMOVED WRONG refreshToken BYPASS

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}