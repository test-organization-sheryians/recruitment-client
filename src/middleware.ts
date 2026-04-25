import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //  Ignore static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".otf")
  ) {
    return NextResponse.next();
  }

  if(pathname === "/unauthorized") {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const roleCookie = req.cookies.get("role")?.value;
  const role = roleCookie?.toLowerCase() ?? null;

  const INVALID_ROLE_VALUES = new Set(["", "null", "undefined"]);
  const hasValidRole = !!role && !INVALID_ROLE_VALUES.has(role);
  const isAuthenticated = !!token && hasValidRole;

  //  Public routes
  const PUBLIC_ROUTES = new Set([
    "/login",
    "/register",
    "/forgot-password",
    "/un-verified",
    "/reset-password",
  ]);

  const AUTH_REDIRECT_ROUTES = new Set(["/login", "/register"]);

  const isPublic = [...PUBLIC_ROUTES].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (AUTH_REDIRECT_ROUTES.has(pathname) && isAuthenticated) {
    const destination = role === "admin" ? "/admin" : "/";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  if(isAuthenticated) {
    return NextResponse.next();
  }

  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|fonts).*)"],
};
