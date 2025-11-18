import Sidebar from "@/features/admin/Sidebar";
import Navbar from "../../features/admin/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
  <div className='min-h-screen w-full bg-[#F0F2F5] font-[satoshi] flex'>

    {/* Fixed Sidebar */}
    <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <Sidebar />
    </div>

    {/* Page Wrapper (content area shifts right because sidebar is fixed) */}
    <div className="flex-1 md:ml-64">

      {/* Fixed Navbar */}
      <div className="fixed m-3 w-full z-50 flex items-center ">
        <Navbar />
      </div>

      {/* Page Content (scrollable area below navbar) */}
      <main className="pt-20 p-6">
        {children}
      </main>

    </div>
  </div>
);
}