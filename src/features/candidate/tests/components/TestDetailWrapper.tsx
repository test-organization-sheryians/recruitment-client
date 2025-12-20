"use client";

import React from "react";
import { useCandidateTestDetail } from "@/features/candidate/tests/hooks/useTest";
import SingleTestDetail from "@/features/candidate/tests/components/SingleTestDetail";
import { Loader2, AlertCircle } from "lucide-react";

export default function TestDetailWrapper({ testId }: { testId: string }) {
  const { data: test, isLoading, isError, error } = useCandidateTestDetail(testId);

  // --- DEBUGGING LOG ---
  // Open your browser console (F12) to see this!
  console.log("🔥 API RESPONSE FOR TEST ID:", testId, test);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (isError || !test) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error?.message || "Test not found"}</p>
      </div>
    );
  }

  return <SingleTestDetail test={test} />;
}