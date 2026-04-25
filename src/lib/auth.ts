"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type Role = "admin" | "client" | "user";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
};

const JWT_SECRET = process.env.JWT_SECRET!;
console.log(JWT_SECRET);
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token && !refreshToken) {
    console.log("🔒 Server: No tokens found - skipping getCurrentUser");
    return null;
  }

  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
    /\/$/,
    "",
  );
  const usersMeUrl = `${apiBase}/api/users/me`;
  const refreshUrl = `${apiBase}/api/auth/refresh`;

  const callMe = async (): Promise<User | null> => {
    try {
      const response = await fetch(usersMeUrl, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) return null;

      const body = (await response.json()) as { data?: User };
      return body.data ?? null;
    } catch (error) {
      console.error("getCurrentUser callMe failed", error);
      return null;
    }
  };

  const callRefreshAndMe = async (): Promise<User | null> => {
    if (!refreshToken) return null;

    try {
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
      });

      if (!refreshResponse.ok) return null;

      return await callMe();
    } catch (error) {
      console.error("getCurrentUser refresh failed", error);
      return null;
    }
  };
  
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: false,
      }) as User;
      return payload;
    } catch (error: unknown) {
      const err = error as { name?: string; expiredAt?: Date };
      if (err?.name === "TokenExpiredError" || err?.name === "JsonWebTokenError") {
        console.log("Token invalid/expired in getCurrentUser:", err?.name);
        if (refreshToken) {
          return await callRefreshAndMe();
        }
        return null;
      }
      console.error("Unexpected error in getCurrentUser:", error);
      return null;
    }
  }

  // No token but maybe refresh token available
  if (refreshToken) {
    const meResult = await callMe();
    if (meResult) return meResult;
    return await callRefreshAndMe();
  }

  return null;
}
