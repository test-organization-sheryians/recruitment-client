// app/admin/layout.tsx
import Navbar from "@/components/Navbar";
import Sidebar from "@/features/admin/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/unauthorized");

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] font-[satoshi]">
      {/* Full Background */}
      <div className="flex">
        {/* Sidebar - Fixed */}
        <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-50">
          <div className="h-full p-4">
            <Sidebar /> {/* Auto active based on URL now! */}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-72">
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            {/* Top Navbar */}
            <div className="mb-6">
               <Navbar />
            </div>

            {/* Page Content - This is where children (your pages) go */}
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}