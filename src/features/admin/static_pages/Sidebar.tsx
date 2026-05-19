"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LogoutButton from "./Logout";
import {
  LayoutDashboard,
  Tags,
  Wrench,
  Users,
  ClipboardList,
  UsersRound,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type User = {
  name?: string;
  email?: string;
};

const NAV_ITEMS: Array<{
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Tests", href: "/admin/tests", icon: ClipboardList },
  { name: "View Groups", href: "/admin/groups", icon: UsersRound },
];

const AVATAR_COLORS = [
  "#1D4ED8",
  "#6D28D9",
  "#047857",
  "#B45309",
  "#BE185D",
  "#0E7490",
];

const Sidebar: React.FC<{
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}> = ({ collapsed = false, onCollapsedChange }) => {
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

  // Determine the single most-specific active nav item (longest matching href).
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

  const isActive = (href: string) => {
    return activeHref === href;
  };

  return (
    <TooltipProvider delayDuration={80}>
      <aside
        className={clsx(
          "relative w-full h-[calc(100vh-32px)] rounded-3xl bg-linear-to-b from-white to-slate-50 shadow-[0_20px_50px_rgba(15,23,42,0.08)] flex flex-col border border-slate-200",
          "transition-[padding] duration-300 ease-in-out",
        )}
      >
      {/* Brand */}
      <div className={clsx("pt-6 pb-4", collapsed ? "px-3" : "px-6")}>
        <div
          className={clsx(
            "flex items-start gap-3",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          <div className={clsx("min-w-0", collapsed && "hidden")}>
            <div className="text-xl font-extrabold tracking-tight text-slate-900">
              Sheryians<span className="text-blue-600">.</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Admin Control Panel
            </p>
          </div>

          <div className={clsx(!collapsed && "hidden")}>
            <div className="mx-auto h-9 w-9 rounded-2xl bg-white/70 border border-slate-200 shadow-sm flex items-center justify-center">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                S<span className="text-blue-600">.</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right-edge open/close handle (matches the screenshot style) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onCollapsedChange?.(!collapsed)}
            className={clsx(
              "absolute z-20",
              "top-7 -right-3",
              "h-9 w-6",
              "rounded-r-2xl rounded-l-lg",
              "border border-slate-200 bg-white/80 backdrop-blur",
              "shadow-[0_10px_20px_rgba(15,23,42,0.10)]",
              "flex items-center justify-center",
              "text-slate-700 hover:text-slate-900 hover:bg-white transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {collapsed ? "Expand" : "Collapse"}
        </TooltipContent>
      </Tooltip>

      {/* Identity */}
      {/* <Link
        href={"/admin/profile"}
        
      >
        <div 
        className={clsx(
          "mx-4 mb-5 rounded-2xl bg-white/70 backdrop-blur p-3 flex items-center gap-3 shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-100",
          pathname === "/admin/profile"
            ? "bg-linear-to-r from-blue-50 to-white text-blue-700 shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
        // className="mx-4 mb-5 rounded-2xl bg-white/70 backdrop-blur p-3 flex items-center gap-3 shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-100"
        >
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
            <span className="inline-flex items-center gap-1 mt-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              ● Administrator
            </span>
          </div>
        </div>
      </Link> */}
      <div className={clsx(collapsed ? "px-2" : "px-0")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={"/admin/profile"}
                className={clsx(
                  "mx-auto mb-5 rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-100",
                  "flex items-center justify-center h-12 w-12 transition-colors",
                  pathname === "/admin/profile"
                    ? "bg-linear-to-r from-blue-50 to-white text-blue-700"
                    : "text-slate-700",
                )}
                aria-label="Profile"
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-inner"
                  style={{ backgroundColor: avatarColor }}
                >
                  {(user?.email?.[0] || user?.name?.[0] || "U").toUpperCase()}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              Profile
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link href={"/admin/profile"}>
            <div
              className={clsx(
                "relative mx-4 mb-5 rounded-2xl bg-white/70 backdrop-blur p-3 flex items-center gap-3 shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-100",
                pathname === "/admin/profile"
                  ? "bg-linear-to-r from-blue-50 to-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {pathname === "/admin/profile" && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
              )}

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
                <span className="inline-flex items-center gap-1 mt-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  ● Administrator
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className={clsx("flex-1 space-y-1", collapsed ? "px-2" : "px-3")}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center rounded-xl font-medium transition-all duration-200",
                    collapsed
                      ? "justify-center px-0 py-2.5 text-sm"
                      : "gap-3 px-4 py-2.5 text-sm",
                    active
                      ? "bg-linear-to-r from-blue-50 to-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                  aria-label={item.name}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                  )}
                  <Icon className={clsx("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                  <span className={clsx("truncate", collapsed && "hidden")}>
                    {item.name}
                  </span>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={10}>
                  {item.name}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={clsx("border-t border-slate-200", collapsed ? "p-3" : "p-4")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                <LogoutButton collapsed />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <LogoutButton />
        )}
      </div>
    </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
