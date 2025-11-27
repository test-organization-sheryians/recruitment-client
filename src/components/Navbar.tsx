"use client";

import { BellDot, UserIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import Logout from "@/features/auth/components/Logout";
import React, { useState } from "react";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const navlinks: { title: string; href: string }[] = [];

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-white">
        {/* LOGO */}
        <h1 className="text-2xl font-semibold">HRECT.</h1>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-12">
          {navlinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.title}</Link>
            </li>
          ))}
        </ul>

        {/* DESKTOP USER SECTION */}
        <div className="hidden md:flex items-center gap-4">
          <button className="w-10 aspect-square rounded-full bg-zinc-50 grid place-items-center hover:bg-zinc-100 transition-colors">
            <BellDot size={20} className="text-zinc-700" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon size={20} className="text-blue-600" />
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName}
              </p>
              {user.role && <p className="text-xs text-gray-500">{user.role}</p>}
            </div>

            <Logout />
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          <Menu size={26} />
        </button>
      </nav>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0  bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 p-6 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">HRECT.</h2>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* USER SECTION */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{user.firstName}</p>
            {user.role && <p className="text-sm text-gray-500">{user.role}</p>}
          </div>
        </div>

        {/* NAV LINKS */}
        <ul className="flex flex-col gap-4 flex-grow">
          {navlinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-2 text-lg"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            </li>
          ))}

          
        </ul>

        {/* LOGOUT FIXED AT BOTTOM */}
        <div className="mt-auto pt-4 border-t">
          <Logout />
        </div>
      </div>
    </>
  );
};

export default Navbar;
