"use client";

import JobDashboardPage from "@/features/candidate/jobs/components/JobDashboard";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify"

export default function CandidateHomePage() {
 useEffect(() => {
    const flag = sessionStorage.getItem("disqualified");

    if (flag) {
      toast.error(
        ({ closeToast }) => (
          <div className="flex flex-col gap-3 p-4 text-center">
  <span className="text-xl font-extrabold text-red-600">
 Violation Detected
  </span>

  <p className="text-sm text-gray-700 leading-relaxed">
    You have been <span className="font-semibold">disqualified</span> due to a rule violation.
    This action cannot be undone.
  </p>

  <button
    onClick={() => {
      sessionStorage.removeItem("disqualified");
      closeToast?.();
    }}
    className="
      mt-2
      w-full
      rounded-lg
      bg-red-600
      py-2.5
      text-sm
      font-bold
      text-white
      shadow-md
      transition
      hover:bg-red-700
      active:scale-95
    "
  >
    OK, I UNDERSTAND
  </button>
</div>

        ),
        {
          toastId: "disqualify-toast", // Prevents multiple toasts
          position: "top-right",
          autoClose: false,      // WILL NOT CLOSE AUTOMATICALLY
          closeOnClick: false,   // Clicking background won't close it
          draggable: false,      // Can't swipe it away
          closeButton: false,    // Hides the 'X' so they must click your button
        }
      );
    }
  }, []);

  return <JobDashboardPage />;
}
