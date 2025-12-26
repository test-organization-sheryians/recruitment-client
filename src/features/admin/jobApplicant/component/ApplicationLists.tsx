"use client";

import { useState } from "react";
import {
  useBulkUpdateApplicants,
  useJobApplicant,
} from "../hooks/useJobApplicant";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

/* ================= TYPES ================= */

type Size = number | string;

type ApplicantsListProps = {
  height?: Size;
  width?: Size;
  className?: string;
};

type ApplicantStatus =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "forwarded"
  | "interview"
  | "hired";

interface CandidateDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface JobDetails {
  title: string;
  requiredExperience: number;
}

interface ApplicantApi {
  _id: string;
  candidateDetails: CandidateDetails;
  jobDetails: JobDetails;
  appliedAt: string;
  totalExperienceYears: number;
  status: ApplicantStatus;
  resumeUrl: string;
}

interface ApplicantsApiResponse {
  applicants: ApplicantApi[];
}

interface ApplicantRow {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: ApplicantStatus;
  resume: string;
}

/* ================= CONSTANTS ================= */

const statusColors: Record<ApplicantStatus, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  forwarded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
};

const tabs: Array<"all" | ApplicantStatus> = [
  "all",
  "applied",
  "shortlisted",
  "rejected",
  "forwarded",
  "interview",
  "hired",
];

/* ================= COMPONENT ================= */

export default function ApplicantsList({
  height = 520,
  width = 840,
  className = "",
}: ApplicantsListProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  const w = typeof width === "number" ? `${width}px` : width;

  const { id } = useParams();

  const { data } = useJobApplicant(id as string) as {
    data?: ApplicantsApiResponse;
  };

  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ApplicantStatus>("applied");
  const [activeTab, setActiveTab] = useState<"all" | ApplicantStatus>("all");

  const toggleSelect = (appId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(appId)
        ? prev.filter((x) => x !== appId)
        : [...prev, appId]
    );
  };

  /* ================= DATA MAPPING ================= */

  const applicants: ApplicantRow[] =
    data?.applicants?.map((a) => ({
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
      status: a.status,
      resume: a.resumeUrl,
    })) ?? [];

  const filteredApplicants: ApplicantRow[] =
    activeTab === "all"
      ? applicants
      : applicants.filter((a) => a.status === activeTab);

  /* ================= MUTATION ================= */

  const { mutate, isPending } = useBulkUpdateApplicants();
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

  /* ================= UI ================= */

  return (
  <div
    className={`bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col ${className}`}
    style={
      {
        "--h": h,
        "--w": w,
      } as React.CSSProperties
    }
  >
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <h2 className="text-lg font-bold text-gray-900">
        Applicants List
      </h2>

      {selectedApplicants.length > 0 && (
        <div className="flex items-center gap-3">
          <select
            value={bulkStatus}
            onChange={(e) =>
              setBulkStatus(e.target.value as ApplicantStatus)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tabs
              .filter((t) => t !== "all")
              .map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isPending
              ? "Updating..."
              : `Update (${selectedApplicants.length})`}
          </button>
        </div>
      )}
    </div>

    {/* Tabs */}
    <div className="flex gap-2 mb-4 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
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
  <table className="w-full text-sm table-fixed">
    {/* Header */}
    <thead className="sticky top-0 bg-gray-50 border-b">
      <tr className="text-xs font-semibold text-gray-500">
        <th className="w-14 px-4 py-4 text-center">Select</th>
        <th className="px-4 py-4 text-left">Name</th>
        <th className="px-4 py-4 text-left">Role</th>
        <th className="px-4 py-4 text-left">Date</th>
        <th className="px-4 py-4 text-left">Experience</th>
        <th className="px-4 py-4 text-left">Resume</th>
        <th className="px-4 py-4 text-left">Status</th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="divide-y">
      {filteredApplicants.map((a) => (
        <tr
          key={a.id}
          className="hover:bg-gray-50 transition align-middle"
        >
          {/* Checkbox */}
          <td className="w-14 px-4 py-4 text-center">
            <input
              type="checkbox"
              checked={selectedApplicants.includes(a.id)}
              onChange={() => toggleSelect(a.id)}
              className="h-4 w-4 accent-blue-600"
            />
          </td>

          {/* Name */}
          <td className="px-4 py-4">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {a.name}
              </span>
              <span className="text-xs text-gray-500">
                {a.email}
              </span>
            </div>
          </td>

          <td className="px-4 py-4 text-gray-700">{a.role}</td>
          <td className="px-4 py-4 text-gray-600">{a.date}</td>
          <td className="px-4 py-4 text-gray-600">{a.experience}</td>

          {/* Resume */}
          <td className="px-4 py-4">
            <a
              href={a.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100"
            >
              📄 View
            </a>
          </td>

          {/* Status */}
          <td className="px-4 py-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[a.status]}`}
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