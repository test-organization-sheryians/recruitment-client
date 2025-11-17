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
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
