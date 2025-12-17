// import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = 'force-dynamic';

const CandidateLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }else {
     if (!user?.isVerified){
        redirect("/un-verified")
     }
  }
  return (
    <div>
      {/* <Navbar /> */}
      {children}
    </div>
  );
};

export default CandidateLayout;
