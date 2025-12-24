"use client";

import { useState } from "react";
import { useBulkUpdateApplicants, useJobApplicant } from "../hooks/useJobApplicant";
import { useParams } from "next/navigation";
import api from "@/config/axios";
import { useToast } from "@/components/ui/Toast";

type Size = number | string;

type ApplicantsListProps = {
  height?: Size;
  width?: Size;
  className?: string;
};

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  forwareded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
};

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
  const { data } = useJobApplicant(id as string);

  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("applied");
  const [activeTab, setActiveTab] = useState("all");

  const toggleSelect = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
      status: a.status.toLowerCase(),
      resume: a.resumeUrl,
    })) || [];

  const filteredApplicants =
    activeTab === "all"
      ? applicants
      : applicants.filter((a: any) => a.status === activeTab);

  const { mutate, isPending, isError } = useBulkUpdateApplicants();
  const { success, error } = useToast();

  const handleSubmit = () => {
    if (selectedApplicants.length === 0) {
      error("Please select at least one applicant");
      return;
    }

    mutate(
      {
        applicationIds: selectedApplicants,
        status: bulkStatus,
      },
      {
        onSuccess: () => {
          success("Applicants status updated successfully");
          setSelectedApplicants([]);
        },
        onError: () => {
          error("Failed to update applicant status");
        },
      }
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col overflow-hidden ${className}`}
      style={{ ["--h"]: h, ["--w"]: w } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-lg font-semibold text-gray-900">
          Applicants Lists
        </span>

        {/* Bulk Status + Submit */}
        <div className="flex items-center gap-3">
          {selectedApplicants.length > 0 && (
            <>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="border rounded-xl px-2 py-1"
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="forwareded">Forwareded</option>
                <option value="interview">Interview</option>
                <option value="hired">Hired</option>
              </select>

              <button
                className={`rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-white ${
                  isPending
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending
                  ? "Updating..."
                  : `Submit Selected (${selectedApplicants.length})`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr className="grid grid-cols-[0.4fr_1.6fr_1.1fr_1fr_1fr_1fr_1fr] px-4 py-3 text-xs font-semibold text-gray-500">
              <th className="text-center">Select</th>
              <th>Name</th>
              <th>Role</th>
              <th>Date</th>
              <th>Experience</th>
              <th>Resume</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredApplicants.map((a: any) => (
              <tr
                key={a.id}
                className="grid grid-cols-[0.4fr_1.6fr_1.1fr_1fr_1fr_1fr_1fr] px-4 py-3 items-center hover:bg-gray-50 transition"
              >
                <td className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                    className="h-4 w-4 accent-blue-600"
                  />
                </td>

                <td>
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.email}</p>
                </td>

                <td>{a.role}</td>
                <td>{a.date}</td>
                <td>{a.experience}</td>

                <td>
                  <a
                    href={a.resume}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
                  >
                    📄 Resume
                  </a>
                </td>

                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[a.status]}`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplicants.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No applicants found.
          </div>
        )}
      </div>
    </div>
  );
}
