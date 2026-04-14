// app/admin/layout.tsx
import AdminShell from "@/features/admin/static_pages/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

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
    console.log("user is", user);
    redirect("/un-verified");
  }

  if (user && user.role !== "admin") {
    redirect("/unauthorized");
  }

  return <AdminShell>{children}</AdminShell>;
}
