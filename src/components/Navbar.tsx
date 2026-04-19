"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import type { RootState } from "@/config/store";
import Logout from "@/features/auth/components/Logout";
import {
  Menu,
  X,
  UserIcon,
  User,
  ChevronRight,
  Bookmark,
  BookCheck,
  Briefcase,
} from "lucide-react";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    setOpenMenu(false);
    setOpenProfile(false);
  }, [pathname]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(false);
        setOpenProfile(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const closeAll = () => {
    setOpenMenu(false);
    setOpenProfile(false);
  };

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
    setOpenProfile(false);
  };

  const toggleProfile = () => {
    setOpenProfile((prev) => !prev);
    setOpenMenu(false);
  };

  const navLinks = [
    {
      href: "/profile",
      label: "My Profile",
      icon: <User size={18} />,
    },
    {
      href: "/appliedjobs",
      label: "Applied Jobs",
      icon: <Briefcase size={18} />,
    },
    {
      href: "/jobs/saved-job",
      label: "Saved Jobs",
      icon: <Bookmark size={18} />,
    },
    {
      href: "/tests",
      label: "Test",
      icon: <BookCheck size={18} />,
    },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <h1 className="text-xl font-bold tracking-wide text-blue-950 sm:text-2xl">
              Sheryians<span className="text-blue-600">.</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={toggleProfile}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 pr-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                    <UserIcon size={18} />
                  </div>
                  <p className="max-w-[120px] truncate text-sm font-semibold text-gray-700 lg:max-w-[160px]">
                    {user.firstName || "User"}
                  </p>
                </button>

                {openProfile && (
                  <div className="absolute right-4 top-[72px] w-[280px] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl sm:right-6 lg:right-8">
                    <div className="mb-2 flex gap-3 rounded-xl bg-gray-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <UserIcon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {user.firstName || "User"} {user.lastName || ""}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email || "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {navLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenProfile(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-2 border-t pt-2">
                      <Logout />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            onClick={toggleMenu}
            aria-label={openMenu ? "Close menu" : "Open menu"}
            aria-expanded={openMenu}
          >
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {(openMenu || openProfile) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:bg-black/10"
          onClick={closeAll}
        />
      )}

      <div
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-full overflow-y-auto bg-white shadow-xl transition-transform duration-300 md:hidden ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-5 p-4">
          {user ? (
            <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
                {user.firstName?.charAt(0) || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-gray-900">
                  {user.firstName || "User"} {user.lastName || ""}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {user.email || "No email available"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">Welcome</p>
              <p className="mt-1 text-sm text-gray-500">
                Please login to access your profile and activity.
              </p>
              <Link
                href="/login"
                onClick={() => setOpenMenu(false)}
                className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Login
              </Link>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenMenu(false)}
                className="flex items-center justify-between rounded-xl p-3 text-gray-800 transition hover:bg-blue-50"
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>

          {user && (
            <div className="border-t pt-3">
              <Logout />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
