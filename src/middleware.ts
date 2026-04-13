import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/unauthorized")) {
    return NextResponse.next();
  }
  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".otf") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token");
  const role = req.cookies.get("role");
  const refreshToken = req.cookies.get("refreshToken");

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

  // ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    if (!token) {
      if (refreshToken) {
        return NextResponse.next();
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role && role.value !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  }

  //  PROTECTED ROUTES
  if (!token && !isPublic) {
    if (refreshToken) {
      // Allow the app to run client refresh flow, do not instantly force login.
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
