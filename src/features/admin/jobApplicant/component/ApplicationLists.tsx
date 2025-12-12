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

// Status colors map
const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  forwareded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
};

// Tabs list
const tabs = [
  "all",
  "applied",
  "shortlisted",
  "rejected",
  "forwareded",
  "interview",
  "hired",
];

export default function ApplicantsList({
  height = 520,
  width = 840,
  className = "",
}: ApplicantsListProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  const w = typeof width === "number" ? `${width}px` : width;

  const { id } = useParams();
  const { data, isLoading } = useJobApplicant(id as string);

  // Selected applicant IDs
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  // Bulk status dropdown
  const [bulkStatus, setBulkStatus] = useState("applied");

  // Active tab (default: all)
  const [activeTab, setActiveTab] = useState("all");

  const toggleSelect = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Transform backend API data
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

      // Keep lowercase to match backend + filters + colors
      status: a.status.toLowerCase(),

      resume: a.resumeUrl,
    })) || [];

  // Filter applicants by tab
  const filteredApplicants =
    activeTab === "all"
      ? applicants
      : applicants.filter((a: any) => a.status === activeTab);

  // Submit bulk update
  const handleSubmit = () => {
    const payload = {
      applicationIds: selectedApplicants,
      status: bulkStatus,
    };

    console.log("Submitting to backend:", payload);

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

        {/* Bulk Status + Submit */}
        <div className="flex items-center gap-3">
          {/* Bulk Status Dropdown */}
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="forwareded">Forwareded</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
          </select>

          {/* Submit Button */}
          <button
            className="rounded-xl border border-gray-200 bg-blue-600 text-white px-3 py-2 text-sm font-semibold"
            onClick={handleSubmit}
            disabled={selectedApplicants.length === 0}
          >
            Submit Selected ({selectedApplicants.length})
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full text-sm border ${activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
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
            {filteredApplicants.map((a: any) => (
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

                {/* Status Badge */}
                <td>
                  <span
                    className={`px-2 py-1 rounded font-medium ${statusColors[a.status]}`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplicants.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No applicants found.
          </div>
        )}
      </div>
    </div>
  );
}
