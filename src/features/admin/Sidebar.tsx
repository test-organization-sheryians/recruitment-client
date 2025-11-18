"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", path: "/admin" },
  { label: "Jobs", path: "/admin/jobs" },
  { label: "Shortlist", path: "/admin/shortlist" },
  { label: "Interviews", path: "/admin/interviews" },
  { label: "Clients", path: "/admin/clients" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-[100vh] rounded-2xl bg-white p-4 border border-gray-200 flex flex-col">
      <div className="text-2xl font-semibold mb-6">Require.</div>

      <nav className="space-y-2 text-sm">
        {items.map((item) => {
          let isActive = false;

          if (item.path === "/admin") {
            // Dashboard exact match only
            isActive = pathname === "/admin";
          } else {
            // Other pages: /admin/job, /admin/job/create etc.
            isActive = pathname.startsWith(item.path);
          }

          return (
            <Link key={item.label} href={item.path}>
              <div
                className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  isActive
                    ? "bg-[#E9EFF7] text-[#1270B0] font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}