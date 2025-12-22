"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { useCandidateTestDetail, useCandidateAttempts } from "@/features/candidate/tests/hooks/useTest";
import SingleTestDetail from "@/features/candidate/tests/components/SingleTestDetail";
import { Loader2, AlertCircle } from "lucide-react";

export default function TestDetailWrapper({ testId }: { testId: string }) {
  // Logged-in user
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch test details
  const {
    data: test,
    isLoading: testLoading,
    isError: testError,
    error,
  } = useCandidateTestDetail(testId);

  // Fetch ALL attempts of user
  const { data: attempts } = useCandidateAttempts(user?.id || "");

  // Find attempt for THIS test
  const attemptForThisTest = attempts?.find(
    (attempt: any) => attempt.testId === testId
  );

  if (testLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (testError || !test) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error?.message || "Test not found"}</p>
      </div>
    );
  }

  // 🔑 Pass attempt along with test (NO existing logic broken)
  return (
    <SingleTestDetail
      test={{
        ...test,
        attempt: attemptForThisTest,
      }}
    />
  );
}
