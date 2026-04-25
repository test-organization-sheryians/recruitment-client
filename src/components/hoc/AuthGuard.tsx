"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

interface AuthGuardProps {
  children: React.ReactNode;
}

const INVALID_VALUES = new Set(["", "null", "undefined"]);

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/unauthorized",
  "/un-verified",
];

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    const token = Cookies.get("token");
    const role = Cookies.get("role")?.toLowerCase() ?? null;
    const isAuthenticated = !!token && !!role && !INVALID_VALUES.has(role);

    if (!isAuthenticated) {
      return;
    }

    setIsChecking(false);
  }, [pathname]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
