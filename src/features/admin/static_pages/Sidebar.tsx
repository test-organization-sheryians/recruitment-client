"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./Logout";
import { Menu, X } from "lucide-react";

type User = {
  name?: string;
  email?: string;
};

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Skills", href: "/admin/skills" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Users", href: "/admin/users" },
  { name: "Tests", href: "/admin/tests" },
  { name: "View Groups", href: "/admin/groups" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const activeHref = useMemo(() => {
    if (!pathname) return null;
    let bestMatch: string | null = null;
    for (const item of NAV_ITEMS) {
      const href = item.href;
      if (pathname === href || pathname.startsWith(href + "/")) {
        if (!bestMatch || href.length > bestMatch.length) {
          bestMatch = href;
        }
      }
    }
    return bestMatch;
  }, [pathname]);

  const isActive = (href: string) => activeHref === href;

  const SidebarContent = (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="px-6 pt-6 pb-4">
        <div className="text-xl font-extrabold tracking-tight text-slate-900">
          Sheryians<span className="text-blue-600">.</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500">Admin Control Panel</p>
      </div>

      <Link href="/admin/profile" onClick={() => setMobileOpen(false)}>
        <div
          className={clsx(
            "relative mx-4 mb-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur hover:bg-slate-100",
            pathname === "/admin/profile"
              ? "bg-linear-to-r from-blue-50 to-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          {pathname === "/admin/profile" && (
            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
          )}

          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-inner"
            style={{ backgroundColor: avatarColor }}
          >
            {(user?.email?.[0] || user?.name?.[0] || "U").toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">
              {user?.email || "admin@example.com"}
            </p>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              ● Administrator
            </span>
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-linear-to-r from-blue-50 to-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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

      <div className="border-t border-slate-200 p-4">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top navbar */}
      <div className="sticky top-0 z-40 w-full border-b border-slate-200 bg-[#F0F2F5]/95 backdrop-blur md:hidden">
        <div className="flex h-16 w-full items-center px-4">
          <div className="text-lg font-extrabold tracking-tight text-slate-900">
            Sheryians<span className="text-blue-600">.</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-95"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-50 w-72">
        <div className="h-full p-4">{SidebarContent}</div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile full-width sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-full transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative h-full w-full overflow-y-auto bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>

          <div className="h-full w-full pt-0">{SidebarContent}</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
