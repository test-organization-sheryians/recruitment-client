"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { clsx } from "clsx"; // 👈 Add this import

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

  // Width and Offset Logic
  const sidebarWidthClass = collapsed ? "md:w-24" : "md:w-72"; 
const contentOffsetClass = collapsed ? "md:ml-24" : "md:ml-72"
  // The actual width of the sidebar card
// const sidebarWidthClass = collapsed ? "md:w-24" : "md:w-72"; 

// The margin-left of the content must be wider to create the background gap
// w-24 (96px) + 16px gap = ml-28 (112px)
// w-72 (288px) + 16px gap = ml-76 (304px)
// const contentOffsetClass = collapsed ? "md:ml-28" : "md:ml-76";

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] font-[satoshi]">
      <div className="flex">
        <aside
          className={clsx(
            "hidden md:block fixed inset-y-0 left-0 z-50 transition-[width] duration-300 ease-in-out",
            sidebarWidthClass
          )}
        >
          {/* Padding right creates the gap between Sidebar and Content */}
          <div className="h-full py-4 pl-4 pr-0"> 
            <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
          </div>
        </aside>

        <div 
          className={clsx(
            "flex-1 transition-[margin] duration-300 ease-in-out", 
            contentOffsetClass
          )}
        >
          <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}