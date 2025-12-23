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

  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useCandidateEnrollments(email);

  // Fetch attempts for selected test (for modal only)
  const { data: selectedTestAttempts } =
    useCandidateAttempts(selectedTestId || undefined);

  // Loading state
  if (isEnrollmentsLoading || !email) {
    return <div className="p-10 text-center">Loading tests...</div>;
  }

  const selectedEnrollment = enrollments?.find(
    e => e.test._id === selectedTestId
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">My Enrolled Tests</h1>

        {/* TEST CARDS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments?.map(e => (
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
