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
import React, { useState } from "react"; // Removed useRef, useEffect
import Logout from "@/features/auth/components/Logout";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  if (!user) return null;

  return (
    <nav className="w-full border-b bg-white px-6 py-4 flex items-center justify-between relative">
      {/* --- INVISIBLE OVERLAYS (Backdrops) --- */}
      {/* These act as the "Click Outside" detector */}
      
      {openProfile && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={() => setOpenProfile(false)} 
        />
      )}
      
      {openMenu && (
        <div 
          className="fixed inset-0 z-30 bg-transparent" 
          onClick={() => setOpenMenu(false)} 
        />
      )}

      {openNotif && (
        <div 
          className="fixed inset-0 z-[900] bg-black/20" /* lightly dimmed for sidebar */
          onClick={() => setOpenNotif(false)} 
        />
      )}


      {/* --- MAIN CONTENT --- */}
      
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer">HRECT.</h1>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <button className="relative" onClick={() => setOpenNotif(!openNotif)}>
          <BellDot className="text-gray-600" size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 relative z-40" // z-40 ensures button stays clickable
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

      {/* MOBILE MENU */}
      <div
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
            onClick={() => {
                setOpenNotif(!openNotif);
                setOpenMenu(false); // Close menu when opening notifications
            }}
          >
            <BellDot className="text-gray-600" size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ...Rest of Mobile Menu... */}
          <div className="flex items-center gap-3">
             {/* ...User Info... */}
          </div>

          <div className="flex flex-col gap-3 text-gray-700">
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

      {/* NOTIFICATION SIDEBAR */}
      <div
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