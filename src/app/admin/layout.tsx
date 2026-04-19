import Sidebar from "@/features/admin/static_pages/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const refreshToken = (await cookies()).get("refreshToken");

  if (!user && !refreshToken) {
    redirect("/login");
  }

  if (user && !user.isVerified) {
    redirect("/un-verified");
  }

  if (user && user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] font-[satoshi]">
      {/* <div className="flex"> */}
      <Sidebar />

      <div className="md:ml-72">
        <div className="p-4 md:p-6">
          <main>{children}</main>
        </div>
      </div>
    </div>
    // </div>
  );
}
