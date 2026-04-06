import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = 'force-dynamic';

const CandidateLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!user && !refreshToken) {
    redirect("/login");
  }

  if (user && !user.isVerified) {
    redirect("/un-verified");
  }
  return (
  <div>
    <Navbar />

    {/* Content wrapper to offset fixed navbar */}
    <main className="pt-[60px]">
      {children}
    </main>
  </div>
);

};

export default CandidateLayout;
