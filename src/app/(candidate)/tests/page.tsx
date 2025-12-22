"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import {
  useCandidateEnrollments,
  useCandidateAttempts,
} from "@/features/candidate/tests/hooks/useTest";
import TestDetails from "@/features/candidate/tests/components/TestDetails";
import { Loader2, AlertCircle } from "lucide-react";
import { Enrollment, TestAttempt } from "@/types/Test";

type FilterType = "ALL" | "ENROLLED" | "ATTEMPTED";

/**
 * Local derived type
 * (does NOT change backend or global types)
 */
type EnrollmentWithAttempts = Enrollment & {
  attemptCount: number;
  lastAttemptStatus?: TestAttempt["status"];
};

export default function TestsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const email = user?.email || "";
  const userId = user?.id || "";

  const { data: enrollments, isLoading, isError } =
    useCandidateEnrollments(email);

  const { data: attempts } = useCandidateAttempts(userId);

  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredTests: EnrollmentWithAttempts[] = useMemo(() => {
    if (!enrollments) return [];

    return enrollments
      .map((enrollment: Enrollment) => {
        const testAttempts =
          attempts?.filter(
            (a: TestAttempt) => a.testId === enrollment.test._id
          ) || [];

        return {
          ...enrollment,
          attemptCount: testAttempts.length,
          lastAttemptStatus: testAttempts[0]?.status,
        };
      })
      .filter((item: EnrollmentWithAttempts) => {
        if (filter === "ATTEMPTED") return item.attemptCount > 0;
        if (filter === "ENROLLED") return item.attemptCount === 0;
        return true;
      });
  }, [filter, enrollments, attempts]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        {["ALL", "ENROLLED", "ATTEMPTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as FilterType)}
            className={`px-4 py-2 rounded-full text-sm font-medium border
              ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <TestDetails tests={filteredTests} />
    </div>
  );
}
