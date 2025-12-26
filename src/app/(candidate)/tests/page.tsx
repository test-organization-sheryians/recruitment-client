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

  const { data: selectedTestAttempts } =
    useCandidateAttempts(selectedTestId || undefined);

  if (isEnrollmentsLoading || !email) {
    return <div className="p-10 text-center">Loading tests...</div>;
  }

  // ✅ Only include enrollments that have valid test
  const validEnrollments = enrollments?.filter(e => e.test) || [];

  // 👇 ADD-ON (only new logic)
  const noTestsFound = validEnrollments.length === 0;

  // Filter based on "ATTEMPTED" or "ALL"
  const filteredEnrollments =
    filter === "ATTEMPTED"
      ? validEnrollments.filter(e => e.hasAttempt)
      : validEnrollments;

  // Selected enrollment for modal (safely)
  const selectedEnrollment = validEnrollments.find(
    e => e.test?._id === selectedTestId
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">My Enrolled Tests</h1>

        {/* FILTER BUTTONS */}
        <div className="mb-6 flex w-fit rounded-lg border border-gray-200 bg-gray-100 p-1 shadow-sm">
          {["ALL", "ATTEMPTED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as "ALL" | "ATTEMPTED")}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filter === f
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "ALL" ? "All" : "Attempted"}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {noTestsFound && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <div>
              <h2 className="text-lg font-medium text-gray-700">
                You are not enrolled in any tests
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please wait for test assignment.
              </p>
            </div>
          </div>
        )}

        {/* TEST CARDS */}
        {!noTestsFound && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments.map(e => (
              <TestCard
                key={e._id}
                enrollment={e}
                onViewDetails={setSelectedTestId}
              />
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedEnrollment && selectedEnrollment.test && (
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
