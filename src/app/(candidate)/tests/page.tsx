"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { useCandidateEnrollments } from "@/features/candidate/tests/hooks/useTest";
import TestDetails from "@/features/candidate/tests/components/TestDetails";
import { Loader2, AlertCircle } from "lucide-react";

export default function TestsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const userEmail = user?.email || "";

  const { data: tests, isLoading, isError, error } = useCandidateEnrollments(userEmail);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>Error loading tests.</p>
      </div>
    );
  }

  // Pass the raw data (Enrollments) to the component. 
  // The component now handles unwrapping the nested 'test' object.
  return <TestDetails tests={tests || []} />;
}