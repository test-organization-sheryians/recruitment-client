"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import InroletextEmail from "@/features/admin/test/components/EnrolledTestEmail";
import { useEnRollTest } from "@/features/admin/test/hooks/useTest";

export default function InroleEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const [emails, setEmails] = useState<string[]>([]);

  // --- Mutation Hook ---
  const { mutate, isPending } = useEnRollTest(id);

  const handleSubmit = () => {
    if (!id) {
      alert("Test ID is missing");
      return;
    }

    if (emails.length === 0) {
      alert("Please add at least one email");
      return;
    }

    mutate(
      { testId: id, emails },
      {
        onSuccess: () => {
          alert("Users enrolled successfully!");
          
        },
        onError: (err: Error) => {
          console.error("Enrollment error:", err);
          alert(`Failed to enroll users: ${err.message || "Unknown error"}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">
        Enroll Users for Test {id || "Unknown"}
      </h1>

      <InroletextEmail
        initialEmails={emails}
        onChange={(updated) => setEmails(updated)}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending || emails.length === 0}
        className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? "Enrolling..." : "Enroll Users"}
      </button>
    </div>
  );
}