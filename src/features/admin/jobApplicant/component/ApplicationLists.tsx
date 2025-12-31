"use client"

import { useState } from "react"
import { useBulkUpdateApplicants, useJobApplicant } from "../hooks/useJobApplicant"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/Toast"

/* ================= TYPES ================= */

type Size = number | string

type ApplicantsListProps = {
  height?: Size
  width?: Size
  className?: string
}

type ApplicantStatus = "applied" | "shortlisted" | "rejected" | "forwarded" | "interview" | "hired"

interface CandidateDetails {
  firstName: string
  lastName: string
  email: string
}

interface JobDetails {
  title: string
  requiredExperience: number
}

interface ApplicantApi {
  _id: string
  candidateDetails: CandidateDetails
  jobDetails: JobDetails
  appliedAt: string
  totalExperienceYears: number
  status: ApplicantStatus
  resumeUrl: string
}

interface ApplicantsApiResponse {
  applicants: ApplicantApi[]
}

interface ApplicantRow {
  id: string
  name: string
  email: string
  role: string
  date: string
  experience: string
  status: ApplicantStatus
  resume: string
}

/* ================= CONSTANTS ================= */

const statusColors: Record<ApplicantStatus, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  forwarded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
}

const tabs: Array<"all" | ApplicantStatus> = [
  "all",
  "applied",
  "shortlisted",
  "rejected",
  "forwarded",
  "interview",
  "hired",
]

const TABLE_GRID = "grid grid-cols-[48px_1.6fr_1.1fr_1fr_1fr_1fr_1fr]"

/* ================= COMPONENT ================= */

export default function ApplicantsList({
  height = 520,
  width = 840,
  className = "",
}: ApplicantsListProps) {
  const h = typeof height === "number" ? `${height}px` : height
  const w = typeof width === "number" ? `${width}px` : width

  const { id } = useParams()

  const { data } = useJobApplicant(id as string) as {
    data?: ApplicantsApiResponse
  }

  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState<ApplicantStatus>("applied")
  const [activeTab, setActiveTab] = useState<"all" | ApplicantStatus>("all")

  const toggleSelect = (appId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(appId) ? prev.filter((x) => x !== appId) : [...prev, appId]
    )
  }

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
      experience: `${a.jobDetails.requiredExperience}`,
      status: a.status,
      resume: a.resumeUrl,
    })) ?? []

  const filteredApplicants: ApplicantRow[] =
    activeTab === "all" ? applicants : applicants.filter((a) => a.status === activeTab)

  /* ================= MUTATION ================= */

  const { mutate, isPending } = useBulkUpdateApplicants()
  const { success, error } = useToast()

  const handleSubmit = () => {
    if (selectedApplicants.length === 0) {
      error("Please select at least one applicant")
      return
    }

    mutate(
      {
        applicationIds: selectedApplicants,
        status: bulkStatus,
      },
      {
        onSuccess: () => {
          success("Applicants status updated successfully")
          setSelectedApplicants([]);
          setActiveTab(bulkStatus);
        },
        onError: () => {
          error("Failed to update applicant status")
        },
      }
    )
  }

  /* ================= UI ================= */

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col overflow-hidden ${className}`}
      style={{ ["--h"]: h, ["--w"]: w } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-lg font-semibold text-gray-900">Applicants Lists</span>

        {selectedApplicants.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as ApplicantStatus)}
              className="border rounded-xl px-2 py-1"
            >
              {tabs
                .filter((t) => t !== "all")
                .map((t) => (
                  <option
                    key={t}
                    value={t}
                  >
                    {t}
                  </option>
                ))}
            </select>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${
                isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "Updating..." : `Submit Selected (${selectedApplicants.length})`}
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

      {/* Table Header */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="sticky top-0 bg-gray-50 border-b">
          <div className={`${TABLE_GRID} px-4 py-3 text-xs font-semibold text-gray-500`}>
            <div className="flex justify-center">Select</div>
            <div className="pl-2">Name</div>
            <div>Role</div>
            <div>Date</div>
            <div>Experience</div>
            <div>Resume</div>
            <div>Status</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {filteredApplicants.map((a) => (
            <div
              key={a.id}
              className={`${TABLE_GRID} px-4 py-3 items-center hover:bg-gray-50 transition`}
            >
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(a.id)}
                  onChange={() => toggleSelect(a.id)}
                  className="h-4 w-4 accent-blue-600"
                />
              </div>

              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-gray-500">{a.email}</p>
              </div>

              <div>{a.role}</div>
              <div>{a.date}</div>
              <div>{a.experience}</div>

              <div>
                <a
                  href={a.resume}
                  target="_blank"
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                >
                  📄 Resume
                </a>
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusColors[a.status]
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">No applicants found.</div>
        )}
      </div>
    </div>
  )
}