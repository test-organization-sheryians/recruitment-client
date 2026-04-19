"use client";

import React, { useEffect, useState } from "react";
import { LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/features/auth/slice";

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!showConfirm) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoggingOut) {
        setShowConfirm(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showConfirm, isLoggingOut]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      try {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        Cookies.remove("role", { path: "/" });
      } catch {}

      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}

      try {
        dispatch(logoutAction());
      } catch {}

      router.replace("/login");

      setTimeout(() => {
        try {
          window.open("", "_self");
          window.close();
        } catch {}

        window.location.href = "/login";
      }, 50);
    } catch (error) {
      console.error("Logout failed:", error);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
          "text-red-600 hover:bg-red-50 transition-all duration-200",
          "border border-red-200 cursor-pointer",
          "min-h-[48px]",
        )}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        <span className="truncate">Logout</span>
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isLoggingOut) setShowConfirm(false);
          }}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
          >
            <button
              type="button"
              onClick={() => {
                if (!isLoggingOut) setShowConfirm(false);
              }}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <LogOut className="h-5 w-5" />
              </div>

              <h2
                id="logout-dialog-title"
                className="text-lg font-semibold text-slate-900"
              >
                Confirm logout
              </h2>

              <p
                id="logout-dialog-description"
                className="mt-2 text-sm leading-6 text-slate-500"
              >
                Are you sure you want to logout? You will need to sign in again
                to access your admin panel.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoggingOut}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Yes, logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
