// app/admin/layout.tsx
import Navbar from "@/components/Navbar";
import Sidebar from "@/features/admin/static_pages/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

if (!user) {
    redirect("/login");
  } else {
    if (!user?.isVerified) {
      redirect("/un-verified");
    }
  }
    if (user.role !== "admin") redirect("/unauthorized");

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] font-[satoshi]">
      <div className="flex">
        <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-50">
          <div className="h-full p-4">
            <Sidebar /> 
          </div>
        </aside>

        <div className="flex-1 md:ml-72">
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            <div className="mb-6">
               <Navbar />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
