"use client";

import {
  BellDot,
  Menu,
  X,
  UserIcon,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import React, { useState, useRef, useEffect } from "react";
import Logout from "@/features/auth/components/Logout";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopProfileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(false);
      }
      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(e.target as Node)
      ) {
        setOpenProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className="w-full border-b bg-white px-6 py-4 flex items-center justify-between relative">
      {/* FIX 1: Wrapped Logo in Link */}
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer">HRECT.</h1>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <button className="relative" onClick={() => setOpenNotif(!openNotif)}>
          <BellDot className="text-gray-600" size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative" ref={desktopProfileRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium">{user.firstName}</p>
          </button>

          {openProfile && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-xl rounded-xl border p-4 z-50">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-3">
                {/* FIX 2: Added onClick to close popup */}
                <Link
                  href="/profile"
                  onClick={() => setOpenProfile(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-black"
                >
                  <User size={18} /> My Profile
                </Link>

                <li className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                  <Settings size={18} /> Settings
                </li>
              </ul>

              <div className="mt-4 w-full">
                <Logout />
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="md:hidden" onClick={() => setOpenMenu(!openMenu)}>
        {openMenu ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        ref={mobileMenuRef}
        className={`
          absolute left-0 top-16 w-full bg-white shadow-lg border-t md:hidden z-40
          transition-all duration-300 ease-out
          ${
            openMenu
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
          }
        `}
      >
        <div className="p-5 flex flex-col gap-6">
          <button
            className="relative w-fit"
            onClick={() => setOpenNotif(!openNotif)}
          >
            <BellDot className="text-gray-600" size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{user.firstName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-gray-700">
             {/* Optional Fix: Close mobile menu on click too */}
            <Link 
                href="/profile" 
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-2"
            >
              <User size={18} /> My Profile
            </Link>

            <button className="flex items-center gap-2">
              <Settings size={18} /> Settings
            </button>

            <div className="w-full">
              <Logout />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={notifRef}
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l 
          transition-all duration-300 ease-out z-[999]
          ${
            openNotif
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
        `}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={() => setOpenNotif(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition">
            <p className="text-sm font-medium">Your React Test is scheduled!</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition">
            <p className="text-sm font-medium">A new course has been added.</p>
            <p className="text-xs text-gray-500">1 day ago</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;