"use client";

import {
  BellDot,
  Menu,
  X,
  UserIcon,
  LogOut,
  Settings,
  User,
  ChevronRight,
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
      
      {/* --- BACKDROPS (Click Outside Logic) --- */}
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

      {/* --- LOGO --- */}
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer text-blue-950">HRECT.</h1>
      </Link>

      {/* --- DESKTOP NAV --- */}
      <div className="hidden md:flex items-center gap-6">
        <button 
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" 
          onClick={() => setOpenNotif(!openNotif)}
        >
          <BellDot className="text-gray-600" size={22} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 relative z-40 hover:bg-gray-50 p-1 pr-3 rounded-full transition-all border border-transparent hover:border-gray-200"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <UserIcon size={18} />
            </div>
            <p className="text-sm font-semibold text-gray-700">{user.firstName}</p>
          </button>

          {/* DESKTOP DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 top-14 w-72 bg-white shadow-xl rounded-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 bg-gray-50 rounded-xl mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <UserIcon size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setOpenProfile(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <User size={18} /> My Profile
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
                  <Settings size={18} /> Settings
                </button>
              </div>

              <div className="mt-2 pt-2 border-t">
                 {/* Adjust your Logout component to accept styling props if possible, 
                     otherwise wrap it in a styled div */}
                <div className="px-1">
                    <Logout /> 
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE TOGGLE --- */}
      <button 
        className="md:hidden p-2 text-gray-600" 
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? <X size={28} /> : <Menu size={28} />}
      </button>


      {/* --- MOBILE MENU (Redesigned) --- */}
      <div
        className={`
          absolute top-[73px] left-0 w-full bg-white shadow-lg border-t md:hidden z-40 overflow-hidden
          transition-all duration-300 ease-in-out origin-top
          ${openMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="p-4 flex flex-col gap-4">
          
          {/* 1. User Info Card */}
          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md text-lg">
              {user.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* 2. Menu Links */}
          <div className="flex flex-col gap-1">
            <Link 
              href="/profile" 
              onClick={() => setOpenMenu(false)}
              className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <User size={20} /> <span className="font-medium">My Profile</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <button 
                onClick={() => {
                    setOpenNotif(!openNotif);
                    setOpenMenu(false);
                }}
                className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                    <BellDot size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <Settings size={20} /> <span className="font-medium">Settings</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="h-px bg-gray-100 my-1"></div>

          {/* 3. Logout (Styled to be cleaner) */}
          <div className="pb-2">
             {/* If your Logout component renders a button, add className="w-full" to it. 
                 Or wrap it here to control width */}
             <div className="w-full [&>button]:w-full [&>button]:justify-center [&>button]:bg-white [&>button]:border [&>button]:border-red-200 [&>button]:text-red-600 [&>button]:hover:bg-red-50">
                <Logout />
             </div>
          </div>

        </div>
      </div>

      {/* --- NOTIFICATIONS SIDEBAR (Unchanged) --- */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l 
          transition-transform duration-300 ease-out z-[999]
          ${openNotif ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={() => setOpenNotif(false)} className="p-1 hover:bg-gray-100 rounded-md">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-900">Your React Test is scheduled!</p>
            <p className="text-xs text-blue-400 mt-1">2 hours ago</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;