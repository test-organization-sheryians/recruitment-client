"use client"

import { useRouter } from "next/navigation"
import {
  ChevronDown,
  FileQuestionMark,
  FileText,
  Pencil,
  Settings,
  Share2,
  Skull,
  Trash,
} from "lucide-react"

import type { Job } from "@/types/Job"
import JobEditButton from "../ui/JobEditButton"
import JobQuestionsButton from "../ui/JobQuestionsButton"
import JobShareButton from "../ui/JobShareButton"
import JobDeleteButton from "../ui/JobDeleteButton"
import ScreeningQuestions from "./ScreeningQuestion"
import DeletejobTest from "./DeletejobTest"

/* ================= TYPES ================= */

type Status = "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"

interface Props {
  job: Job
  isOpen: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
   onShare: () => void
}

/* ================= COMPONENT ================= */

export default function JobCard({ job, isOpen, onToggle, onEdit, onDelete,onShare }: Props) {
  const router = useRouter()

  const status: Status = (job.status?.toUpperCase() as Status) || "ACTIVE"

  const visibleSkills = job.skills?.slice(0, 4) ?? []
  const extraSkills = job.skills?.slice(4) ?? []

  const statusStyles = (value: Status) => {
    switch (value) {
      case "ACTIVE":
        return "bg-green-100 text-green-700"
      case "INTERVIEWING":
        return "bg-blue-100 text-blue-700"
      case "DRAFT":
        return "bg-gray-200 text-gray-700"
      case "FILLED":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  return (
    <div
      className={`${
        isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      } flex flex-col rounded-xl border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-[#1a1e2e] shadow-sm overflow-hidden transition-all duration-300`}
    >
      {/* HEADER ROW */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-gray-50 rounded-xl cursor-pointer"
      >
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold tracking-wide ${statusStyles(
                status
              )}`}
            >
              {status}
            </span>
          </div>
          <p className="text-[#616889] dark:text-gray-400 text-sm mt-1">
            {typeof job.category === "string" ? job.category : job.category?.name || "General"} •{" "}
            {job.createdAt ? `Posted ${new Date(job.createdAt).toLocaleDateString()}` : "Recently"}
          </p>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{job.applicantsCount ?? 0}</p>
            <p className="text-xs uppercase text-gray-500">Applicants</p>
          </div>

          <span
            className={`text-2xl text-blue-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown />
          </span>
        </div>
      </button>

      <hr />

      {/* EXPANDED */}
      {isOpen && (
        <div className="px-6 pb-6 pt-4 bg-gray-50 rounded-b-xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-1 text-sm font-bold text-gray-900">
                <Skull
                  size={18}
                  className="text-blue-600"
                />
                Required Skills
              </h4>

              <div className="flex flex-wrap gap-2 mt-2 items-center">
                {visibleSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-white border text-xs font-semibold"
                  >
                    {typeof s === "string" ? s : s.name}
                  </span>
                ))}
                {extraSkills.length > 0 && (
                  <span className="text-blue-600 text-xs font-bold cursor-pointer">
                    +{extraSkills.length} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <FileText
                  size={18}
                  className="text-blue-600"
                />
                Job Description
              </h4>
              <div className="mt-2 bg-white border rounded-lg p-4 text-sm text-gray-600 leading-relaxed">
                {job.description || "No description provided."}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
              <Settings
                size={18}
                className="text-blue-600"
              />
              Management Actions
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <JobEditButton
                jobId={job._id}
                onUpdated={onDelete}
              />

              <JobQuestionsButton jobId={job._id}/>

              <JobShareButton onClick={onShare} />

              <JobDeleteButton
                jobId={job._id}
                jobTitle={job.title}
                onDeleted={onDelete}
              />
              {/* <DeletejobTest jobId={job._id} jobTitle={job.title} /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
