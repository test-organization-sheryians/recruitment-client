"use client";

import { useState } from "react";
import { useJobApplicant } from "../hooks/useJobApplicant";
import { useParams } from "next/navigation";

type Size = number | string;

type ApplicantsListProps = {
  height?: Size;
  width?: Size;
  className?: string;
};

export default function ApplicantsList({
  height = 520,
  width = 840,
  className = "",
}: ApplicantsListProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  const w = typeof width === "number" ? `${width}px` : width;

  const { id } = useParams()
  const { data, isLoading } = useJobApplicant(id as string);

  // ✅ Local state to store selected applicant IDs
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const toggleSelect = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleStatusChange = (id: string, status: string) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
  };

  // ✅ Transform backend API data
  const applicants =
    data?.applicants?.map((a: any) => ({
      id: a._id,
      name: `${a.candidateDetails.firstName} ${a.candidateDetails.lastName}`,
      email: a.candidateDetails.email,
      role: a.jobDetails.title,
      date: new Date(a.appliedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      experience: `${a.totalExperienceYears}-${a.jobDetails.requiredExperience} years`,
      status: a.status.charAt(0).toUpperCase() + a.status.slice(1),
      resume: a.resumeUrl,
    })) || [];

  const handleSubmit = () => {
    // Prepare payload
    const payload = selectedApplicants.map((id) => ({
      id,
      status: statusMap[id] || "Pending",
    }));

    // Send to backend (replace with your API call)
    console.log("Submitting:", payload);

    // Example: api.updateApplicationStatus(payload)
  };

  return (
    <div
      className={`h-[var(--h)] w-[var(--w)] bg-white rounded-2xl shadow-md p-4 flex flex-col overflow-hidden ${className}`}
      style={
        {
          ["--h"]: h,
          ["--w"]: w,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-lg font-semibold text-gray-900">
          Applicants Lists
        </span>

        <button
          className="rounded-xl border border-gray-200 bg-blue-600 text-white px-3 py-2 text-sm font-semibold"
          onClick={handleSubmit}
          disabled={selectedApplicants.length === 0}
        >
          Submit Selected ({selectedApplicants.length})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-y-auto border border-gray-200 rounded-xl flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="grid grid-cols-[0.4fr_1.6fr_1.1fr_1fr_1fr_1fr_1fr] text-xs font-semibold text-gray-500 px-4 py-2">
              <th>Select</th>
              <th>Name</th>
              <th>Role</th>
              <th>Date</th>
              <th>Experience</th>
              <th>Resume</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {applicants.map((a: any) => (
              <tr
                key={a.id}
                className="grid grid-cols-[0.4fr_1.6fr_1.1fr_1fr_1fr_1fr_1fr] items-center px-4 py-3"
              >
                {/* Checkbox */}
                <td className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                    className="h-4 w-4 text-blue-600"
                  />
                </td>

                {/* Name */}
                <td>
                  <div className="font-semibold text-gray-900">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.email}</div>
                </td>

                {/* Role */}
                <td className="text-gray-900">{a.role}</td>

                {/* Date */}
                <td className="text-gray-900">{a.date}</td>

                {/* Experience */}
                <td className="text-gray-900">{a.experience}</td>

                {/* Resume */}
                <td>
                  <a
                    href={a.resume}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900"
                  >
                    📄 Resume
                  </a>
                </td>

                {/* Status Dropdown */}
                <td>
                  <select
                    value={statusMap[a.id] || a.status}
                    onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applicants.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No applicants found.
          </div>
        )}
      </div>
    </div>
  );
}
