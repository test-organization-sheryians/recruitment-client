"use client";

import {
  BellDot,
  Menu,
  X,
  UserIcon,
  User,
  ChevronRight,
  Bookmark,
} from "lucide-react";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import React, { useState } from "react";
import Logout from "@/features/auth/components/Logout";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  if (!user) return null;

  return (
    <nav className="w-full border-b bg-white px-6 py-4 flex items-center justify-between relative z-50">
      {/* ---------- BACKDROPS ---------- */}
      {(openMenu || openProfile) && (
        <div
          className="fixed inset-0 z-30 bg-black/5"
          onClick={() => {
            setOpenMenu(false);
            setOpenProfile(false);
          }}
        />
      )}

      {openNotif && (
        <div
          className="fixed inset-0 z-[900] bg-black/20 backdrop-blur-sm"
          onClick={() => setOpenNotif(false)}
        />
      )}

      {/* ---------- LOGO ---------- */}
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer text-blue-950">
          HRECT.
        </h1>
      </Link>

      {/* ---------- DESKTOP NAV ---------- */}
      <div className="hidden md:flex items-center gap-6">
        {/* Notifications */}
        <button
          className="relative p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setOpenNotif(!openNotif)}
        >
          <BellDot size={22} className="text-gray-600" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 border hover:border-gray-200 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <UserIcon size={18} />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {user.firstName}
            </p>
          </button>

          {/* ---------- DESKTOP DROPDOWN ---------- */}
          {openProfile && (
            <div className="absolute right-0 top-14 w-72 bg-white shadow-xl rounded-2xl border p-2 z-50">
              {/* User Info */}
              <div className="p-3 bg-gray-50 rounded-xl mb-2 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Menu */}
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setOpenProfile(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  <User size={18} /> My Profile
                </Link>

                <Link
                  href="/jobs/saved-job"
                  onClick={() => setOpenProfile(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  <Bookmark size={18} /> Saved Jobs
                </Link>
              </div>

              {/* Logout */}
              <div className="mt-2 pt-2 border-t">
                <Logout />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- MOBILE TOGGLE ---------- */}
      <button
        className="md:hidden p-2"
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* ---------- MOBILE MENU ---------- */}
      <div
        className={`absolute top-[73px] left-0 w-full bg-white border-t shadow md:hidden z-40 transition-all ${
          openMenu ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* User Card */}
          <div className="bg-gray-50 p-4 rounded-xl flex gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-bold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1">
            <Link
              href="/profile"
              onClick={() => setOpenMenu(false)}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50"
            >
              <div className="flex gap-3">
                <User size={20} /> My Profile
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/jobs-savedjob"
              onClick={() => setOpenMenu(false)}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50"
            >
              <div className="flex gap-3">
                <Bookmark size={20} /> Saved Jobs
              </div>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t">
            <Logout />
          </div>
        </div>
      </div>

      {/* ---------- NOTIFICATIONS ---------- */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l z-[999] transition-transform ${
          openNotif ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b flex justify-between">
          <h2 className="font-semibold">Notifications</h2>
          <button onClick={() => setOpenNotif(false)}>
            <X size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
