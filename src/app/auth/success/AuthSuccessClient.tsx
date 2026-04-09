"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/slice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  exp: number;
}

const AuthSuccessClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      Cookies.set("access", token, { expires: 7, path: "/" });
      Cookies.set("role", decoded.role || "candidate", {
        expires: 7,
        path: "/",
      });

      dispatch(
        setUser({
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
          role: decoded.role || "candidate",
          isVerified: true,
        }),
      );

      if (decoded.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch {
      router.replace("/login");
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#4C62ED]" />
        <p className="text-sm text-gray-500 font-[satoshi]">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccessClient;