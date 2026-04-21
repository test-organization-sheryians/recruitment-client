"use client";

import {
  BellDot,
  Menu,
  X,
  UserIcon,
} from "lucide-react";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import React, { useState, useEffect } from "react";
import Logout from "@/features/auth/components/Logout";
import { useNotification } from "@/hooks/useNotification";
import { useToast } from "./ui/Toast";
import { usePathname } from "next/navigation";

export interface UserRole {
  _id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole | null;
  firstName: string;
  lastName: string;
}

const Navbar = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user as User | null
  );

  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    setIsSubscribed,
    isLoading,
  } = useNotification();

  const toast = useToast();

  useEffect(() => {
    setOpenMenu(false);
    setOpenProfile(false);
  }, [pathname]);

  if (!user) return null;

  const handleToggle = async () => {
    const prev = isSubscribed;
    setIsSubscribed(!prev);

    try {
      if (prev) {
        await unsubscribe();
        toast.success("Notifications OFF");
      } else {
        await subscribe();
        toast.success("Notifications ON");
      }
    } catch {
      setIsSubscribed(prev);
      toast.error("Failed to update notifications");
    }
  };

  const closeAll = () => {
    setOpenMenu(false);
    setOpenProfile(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" onClick={closeAll}>
          <h1 className="text-lg sm:text-xl font-bold text-blue-900">
            Sheryians<span className="text-blue-600">.</span>
          </h1>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-5">
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <span className="text-sm font-medium">{user.firstName}</span>
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg p-2 z-50">

                <div className="p-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <NavItem href="/profile" label="Profile" closeAll={closeAll} />
                  <NavItem href="/appliedjobs" label="Applied Jobs" closeAll={closeAll} />
                  <NavItem href="/jobs/saved-job" label="Saved Jobs" closeAll={closeAll} />
                  <NavItem href="/tests" label="Test" closeAll={closeAll} />

                  {user?.role?.name === "admin" && (
                    <NavItem href="/admin" label="Admin Panel" closeAll={closeAll} />
                  )}

                  {/* 🔔 NOTIFICATION TOGGLE (DESKTOP) */}
                  <div className="flex items-center justify-between px-3 py-2 text-sm">

                    <div className="flex items-center gap-2">
                      <BellDot size={16} className="text-gray-600" />
                      <span className="font-medium">Notifications</span>
                    </div>

                    <button
                      onClick={handleToggle}
                      disabled={isLoading}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
                        ${isSubscribed ? "bg-green-500" : "bg-gray-300"}
                        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-300
                          ${isSubscribed ? "translate-x-6" : "translate-x-1"}
                        `}
                      />

                      {isLoading && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t mt-2 pt-2">
                  <Logout />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-2">

          {/* 🔔 Notification Icon */}
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative p-2 rounded-full transition ${isSubscribed ? "bg-green-100" : "bg-gray-100"
              }`}
          >
            <BellDot
              size={20}
              className={isSubscribed ? "text-green-600" : "text-gray-600"}
            />

            {isSubscribed && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>

          {/* ☰ Menu */}
          <button
            className="p-2"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${openMenu ? "max-h-[500px]" : "max-h-0"
          }`}
      >
        <div className="px-4 pb-4 space-y-2">

          <MobileItem href="/profile" label="Profile" closeAll={closeAll} />
          <MobileItem href="/appliedjobs" label="Applied Jobs" closeAll={closeAll} />
          <MobileItem href="/jobs/saved-job" label="Saved Jobs" closeAll={closeAll} />
          <MobileItem href="/tests" label="Test" closeAll={closeAll} />

          {user?.role?.name === "admin" && (
            <MobileItem href="/admin" label="Admin Panel" closeAll={closeAll} />
          )}

          <Logout />
        </div>
      </div>
    </nav>
  );
};

/* NAV ITEM */
const NavItem = ({
  href,
  label,
  closeAll,
}: {
  href: string;
  label: string;
  closeAll: () => void;
}) => (
  <Link
    href={href}
    onClick={closeAll}
    className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
  >
    {label}
  </Link>
);

/* MOBILE ITEM */
const MobileItem = ({
  href,
  label,
  closeAll,
}: {
  href: string;
  label: string;
  closeAll: () => void;
}) => (
  <Link
    href={href}
    onClick={closeAll}
    className="block py-2 text-sm border-b"
  >
    {label}
  </Link>
);

export default Navbar;