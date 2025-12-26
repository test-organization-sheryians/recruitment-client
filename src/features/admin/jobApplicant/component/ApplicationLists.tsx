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
  | "forwareded"
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
  forwareded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
};

const tabs: Array<"all" | ApplicantStatus> = [
  "all",
  "applied",
  "shortlisted",
  "rejected",
  "forwareded",
  "interview",
  "hired",
];

// Reusable 3-dots Icon Component
const ThreeDotsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-gray-500 hover:text-gray-800"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM17.25 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

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
  
  // NEW: State to track which action menu is open
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const toggleSelect = (appId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(appId)
        ? prev.filter((x) => x !== appId)
        : [...prev, appId]
    );
  };

  const handleScheduleInterview = (applicantId: string) => {
    // Add your logic here to open a modal or navigate
    console.log("Schedule interview for:", applicantId);
    setActiveActionId(null); // Close menu after clicking
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

  // MODIFIED: Added 0.5fr at the end of the grid definition
  const gridClass = "grid grid-cols-[0.4fr_1.6fr_1.1fr_1fr_1fr_1fr_1fr_0.5fr]";

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col overflow-hidden ${className}`}
      style={{ ["--h"]: h, ["--w"]: w } as React.CSSProperties}
      // Close menu if clicking anywhere else in the container
      onClick={() => setActiveActionId(null)} 
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-lg font-semibold text-gray-900">
          Applicants Lists
        </span>

        {selectedApplicants.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={bulkStatus}
              onChange={(e) =>
                setBulkStatus(e.target.value as ApplicantStatus)
              }
              className="border rounded-xl px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {tabs
                .filter((t) => t !== "all")
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>

            <button
              onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
              }}
              disabled={isPending}
              className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${
                isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending
                ? "Updating..."
                : `Submit Selected (${selectedApplicants.length})`}
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
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
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 pb-20"> {/* Added pb-20 to allow scroll for dropdown */}
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b z-10">
            <tr className={`${gridClass} px-4 py-3 text-xs font-semibold text-gray-500`}>
              <th className="text-center">Select</th>
              <th>Name</th>
              <th>Role</th>
              <th>Date</th>
              <th>Experience</th>
              <th>Resume</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredApplicants.map((a) => (
              <tr
                key={a.id}
                className={`${gridClass} px-4 py-3 items-center hover:bg-gray-50 transition`}
              >
                <td className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                    className="h-4 w-4 accent-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.email}</p>
                </td>

                <td>{a.role}</td>
                <td>{a.date}</td>
                <td>{a.experience}</td>

                <td>
                  <a
                    href={a.resume}
                    target="_blank"
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
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

                {/* NEW ACTION COLUMN */}
                <td className="relative flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click or container click
                      setActiveActionId(activeActionId === a.id ? null : a.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 transition"
                  >
                    <ThreeDotsIcon />
                  </button>

                  {/* DROPDOWN MENU */}
                  {activeActionId === a.id && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleInterview(a.id);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                      >
                        Schedule Interview
                      </button>
                      {/* You can add more options here like 'Reject' or 'View Profile' */}
                    </div>
                  )}
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