"use client";

import JobDashboardPage from "@/features/candidate/jobs/components/JobDashboard";
import { useEffect } from "react";
import { toast } from "react-toastify"

export default function CandidateHomePage() {
  useEffect(() => {
    const flag = sessionStorage.getItem("disqualified");

    if (flag) {
      toast.error("❌ You have been disqualified due to rule violation", {
        autoClose: 3000,
      });
      sessionStorage.removeItem("disqualified");
    }
  }, []);

  return <JobDashboardPage />;
}
