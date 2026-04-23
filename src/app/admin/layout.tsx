"use client";

import Sidebar from "@/features/admin/static_pages/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();

      if (!user) redirect("/login");
      if (!user?.isVerified) redirect("/un-verified");
      if (user.role !== "admin") redirect("/unauthorized");
    }

    checkUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[F0F2F5] font-[satoshi] overflow-x-hidden">
      <div className="flex">

        {/* ✅ Mobile Topbar (same as before) */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white p-3 flex items-center justify-between shadow">
          <button onClick={() => setOpen(true)}>☰</button>
          <h1 className="font-semibold">Admin Dashboard </h1>
        </div>

        {/* ✅ Mobile Sidebar (same as your OLD working version) */}
        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-84 bg-white p-4 shadow-lg overflow-y-auto overflow-x-hidden">
              <button
                className="mb-4"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>

              <Sidebar />
            </div>

            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpen(false)}
            />
          </div>
        )}

        {/* ✅ Desktop Sidebar (OLD stable version) */}
        <aside className="hidden md:block w-84 fixed inset-y-0 left-0 z-40">
          <div className="h-full p-4 overflow-y-auto overflow-x-hidden">
            <Sidebar />
          </div>
        </aside>

        {/* ✅ Main Content */}
        <div className="flex-1 md:ml-72 w-full pt-14 md:pt-0">
          <div className="w-full p-3 sm:p-4 md:p-6">
            <main className="w-full overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>

      </div>
    </div>
  );
}