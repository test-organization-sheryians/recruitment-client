"use client";

import { BellDot, UserIcon } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Logout from "@/features/auth/components/Logout";
import React from "react";

const Navbar = () => {
  const user = useSelector((state: any) => state.auth.user);
 
  // If user NOT logged in → do NOT show navbar
  if (!user) return null;

  const navlinks = [
    { title: "Home", href: "/" },
    { title: "Courses", href: "/courses" },
    { title: "About", href: "/about" },
    { title: "Hire from us", href: "/hire-us" },
    { title: "Interviews", href: "/interviews" },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4">
      <h1 className="text-2xl font-semibold">HRECT.</h1>

      <ul className="flex items-center gap-20">
        {navlinks.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.title}</Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="w-10 aspect-square rounded-full bg-zinc-50 grid place-items-center hover:bg-zinc-100 transition-colors"
          title="Notifications"
        >
          <BellDot size={20} className="text-zinc-700" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon size={20} className="text-blue-600" />
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user.name || "User"}
            </p>

            {user.role?.name && (
              <p className="text-xs text-gray-500">{user.role}</p>
            )}
          </div>

          <Logout />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
