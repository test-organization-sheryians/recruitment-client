"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./Logout";

interface SidebarProps {
  active?: string;
}

// Added "Users" here
const navItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Jobs", href: "/admin/jobs" },
  { name: "Clients", href: "/admin/clients" },
  { name: "Skill", href: "/admin/skills" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Users", href: "/admin/users" }, // ✅ New Users item
];

const Sidebar: React.FC<SidebarProps> = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin" || pathname.startsWith("/admin/dashboard");
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen rounded-2xl bg-white p-6 border border-gray-200 flex flex-col">
      <div className="text-3xl font-bold text-[#1270B0] mb-10">Require.</div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-[#E9EFF7] text-[#1270B0] font-bold shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#1270B0]"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
