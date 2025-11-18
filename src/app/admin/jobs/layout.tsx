import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function JobsLayout({
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
    <div className="min-h-screen w-full bg-[#F0F2F5] p-4 md:p-6 font-[satoshi]">
      {children}
    </div>
  );
}
