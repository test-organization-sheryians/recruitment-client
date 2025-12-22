"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { useCandidateAttempts } from "@/features/candidate/tests/hooks/useTest";
import SingleTestDetail from "@/features/candidate/tests/components/SingleTestDetail";
import { Loader2, AlertCircle } from "lucide-react";
import { TestAttempt } from "@/types/Test";

export default function TestDetailWrapper({ testId }: { testId: string }) {
  // Logged-in user
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch ALL attempts of user (This now contains the Test Details nested inside)
  const {
    data: attempts,
    isLoading,
    isError,
    error,
  } = useCandidateAttempts(user?.id || "");

  // Find attempt for THIS test
  const attemptForThisTest = attempts?.find(
    (attempt: TestAttempt) => attempt.testId === testId
  );

  // Extract the nested 'test' object from the attempt
  const testDetails = attemptForThisTest?.test;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  // If error, or if attempt is missing, or if nested test details are missing
  if (isError || !attemptForThisTest || !testDetails) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error?.message || "Test details not found in your attempts."}</p>
      </div>
    );
  }

  // 🔑 Combine the extracted test details with the attempt status
  return (
    <SingleTestDetail
      test={{
        ...testDetails,          // The Test object (Title, Duration, etc.)
        attempt: attemptForThisTest, // The status (Started, Score, etc.)
      }}
    />
  );
}