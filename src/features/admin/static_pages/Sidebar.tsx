"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./Logout";

type User = {
  name?: string;
  email?: string;
};

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Jobs", href: "/admin/jobs" },
  { name: "Clients", href: "/admin/clients" },
  { name: "Skills", href: "/admin/skills" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Users", href: "/admin/users" },
  { name: "Tests", href: "/admin/tests" },
];

const AVATAR_COLORS = [
  "#1D4ED8",
  "#6D28D9",
  "#047857",
  "#B45309",
  "#BE185D",
  "#0E7490",
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const hashString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const avatarColor = useMemo(() => {
    const key = user?.email || user?.name || "user";
    return AVATAR_COLORS[hashString(key) % AVATAR_COLORS.length];
  }, [user?.email, user?.name]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="h-[calc(100vh-32px)] w-72 rounded-3xl bg-gradient-to-b from-white to-slate-50 shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col border border-slate-200">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4">
        <div className="text-xl font-extrabold tracking-tight text-slate-900">
          HRCT<span className="text-blue-600">.</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Admin Control Panel
        </p>
      </div>

      {/* Identity */}
      <div className="mx-4 mb-5 rounded-2xl bg-white/70 backdrop-blur p-3 flex items-center gap-3 shadow-sm border border-slate-200">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-inner"
          style={{ backgroundColor: avatarColor }}
        >
          {(user?.email?.[0] || user?.name?.[0] || "U").toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {user?.email || "admin@example.com"}
          </p>
          <span className="inline-flex items-center gap-1 mt-0.5 rounded-full bg-blue-50 px-2 py-[2px] text-[10px] font-semibold text-blue-700">
            ● Administrator
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-blue-50 to-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
              )}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
