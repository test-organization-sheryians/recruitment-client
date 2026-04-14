"use client";

import React from "react";
import Sidebar from "./Sidebar";

const STORAGE_KEY = "admin_sidebar_collapsed";

function readInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCollapsed(readInitialCollapsed());
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  // Bigger collapsed width (still compact, but comfortable)
  const sidebarWidthClass = collapsed ? "md:w-32" : "md:w-72";
  const contentOffsetClass = collapsed ? "md:ml-32" : "md:ml-72";

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] font-[satoshi]">
      <div className="flex">
        <aside
          className={[
            "hidden md:block fixed inset-y-0 left-0 z-50",
            "transition-[width] duration-300 ease-in-out",
            sidebarWidthClass,
          ].join(" ")}
        >
          <div className="h-full p-4">
            <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
          </div>
        </aside>

        <div
          className={[
            "flex-1 transition-[margin] duration-300 ease-in-out",
            contentOffsetClass,
          ].join(" ")}
        >
          <div className="p-4 md:p-6 max-w-350 mx-auto">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

