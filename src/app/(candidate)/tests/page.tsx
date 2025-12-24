"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";
import { useCandidateEnrollments } from "@/features/enrolled-test/hooks/candEnroll";
import { useCandidateAttempts } from "@/features/enrolled-test/hooks/CandidateAttempts";
import { TestCard } from "@/features/enrolled-test/TestCard";
import { TestModal } from "@/features/enrolled-test/TestModal";

export default function EnrolledTestsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const email = user?.email;

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "ATTEMPTED">("ALL");

  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useCandidateEnrollments(email);

  // Fetch attempts for selected test (for modal only)
  const { data: selectedTestAttempts } =
    useCandidateAttempts(selectedTestId || undefined);

  // Loading state
  if (isEnrollmentsLoading || !email) {
    return <div className="p-10 text-center">Loading tests...</div>;
  }

  // Filter enrollments based on selected filter
  const filteredEnrollments =
    filter === "ATTEMPTED"
      ? enrollments?.filter(e => e.hasAttempt)
      : enrollments;

  const selectedEnrollment = enrollments?.find(
    e => e.test._id === selectedTestId
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">My Enrolled Tests</h1>

        {/* FILTER BUTTONS */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded ${
              filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("ATTEMPTED")}
            className={`px-4 py-2 rounded ${
              filter === "ATTEMPTED" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Attempted
          </button>
        </div>

        {/* TEST CARDS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments?.map(e => (
            <TestCard
              key={e._id}
              enrollment={e}
              onViewDetails={setSelectedTestId}
            />
          ))}
        </div>

        {/* MODAL */}
        {selectedEnrollment && (
          <TestModal
            enrollment={selectedEnrollment}
            attempts={selectedTestAttempts}
            onClose={() => setSelectedTestId(null)}
          />
        )}
      </div>
    </div>
  );
}
