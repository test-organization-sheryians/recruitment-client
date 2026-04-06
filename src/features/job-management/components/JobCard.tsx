"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  FileQuestionMark,
  FileText,
  Pencil,
  Settings,
  Share2,
  Skull,
  Trash,
  BadgeIndianRupee,
} from "lucide-react";

import type { Job } from "@/types/Job";
import JobEditButton from "../ui/JobEditButton";
import JobQuestionsButton from "../ui/JobQuestionsButton";
import JobShareButton from "../ui/JobShareButton";
import JobDeleteButton from "../ui/JobDeleteButton";
import ScreeningQuestions from "./ScreeningQuestion";
import DeletejobTest from "./DeletejobTest";
import { useState } from "react";
import ShowDescription from "./ShowDescription";

/* ================= TYPES ================= */

type Status = "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED";

interface Props {
  job: Job;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

/* ================= COMPONENT ================= */

export default function JobCard({
  job,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onShare,
}: Props) {
  const router = useRouter();

  const [showAllSkills, setShowAllSkills] = useState(false);
  const status: Status = (job.status?.toUpperCase() as Status) || "ACTIVE";

  const allSkills = job.skills ?? [];

  const visibleSkills = showAllSkills ? allSkills : allSkills.slice(0, 4);

  const extraSkills = allSkills.length - 4;

  const statusStyles = (value: Status) => {
    switch (value) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INTERVIEWING":
        return "bg-blue-100 text-blue-700";
      case "DRAFT":
        return "bg-gray-200 text-gray-700";
      case "FILLED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div
      className={`${
        isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
      } flex flex-col rounded-xl border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-[#1a1e2e] shadow-sm overflow-hidden transition-all duration-300`}
    >
      {/* HEADER ROW */}
      <div
        onClick={onToggle}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 sm:px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl cursor-pointer"
      >
        <div className="w-full">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words">
              {job.title}
            </h3>

            <span
              className={`shrink-0 px-2.5 py-0.5 rounded text-xs font-bold tracking-wide ${statusStyles(
                status,
              )}`}
            >
              {status}
            </span>
          </div>
          <p className="text-[#616889] dark:text-gray-400 text-sm mt-1">
            {typeof job.category === "string"
              ? job.category
              : job.category?.name || "General"}{" "}
            •{" "}
            {job.createdAt
              ? `Posted ${new Date(job.createdAt).toLocaleDateString()}`
              : "Recently"}
          </p>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
          <div
            className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 sm:p-3 rounded-lg z-48"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/applicants/${job._id}`);
            }}
          >
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {job.applicantsCount ?? 0}
            </p>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
              Applicants
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
            aria-expanded={isOpen}
            aria-label="Toggle job details"
          >
            <span
              className={`text-2xl text-blue-600 dark:text-blue-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              <ChevronDown />
            </span>
          </button>
        </div>
      </div>

      <hr />

      {/* EXPANDED */}
      {isOpen && (
        <div className="px-6 pb-6 pt-4 bg-gray-50 rounded-b-xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-1 text-sm font-bold text-gray-900">
                <Skull size={18} className="text-blue-600" />
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
                {!showAllSkills && extraSkills > 0 && (
                  <span
                    className="text-blue-600 text-xs font-bold hover:underline cursor-pointer"
                    onClick={() => setShowAllSkills(true)}
                  >
                    +{extraSkills} more
                  </span>
                )}

                {showAllSkills && (
                  <span
                    className="text-blue-600 text-xs font-bold hover:underline cursor-pointer"
                    onClick={() => setShowAllSkills(false)}
                  >
                    Show less
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <FileText size={18} className="text-blue-600" />
                Job Description
              </h4>
              <ShowDescription
                html={job.description}
                scrollable
                maxHeight="12rem"
              />
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <BadgeIndianRupee size={18} className="text-blue-600" />
                Salary
              </h4>

              {job.salary && typeof job.salary === "object" ? (
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  <span className="px-3 py-1.5 rounded-full bg-white border text-xs font-semibold">
                    {(job.salary as any)?.min?.toLocaleString() || "0"} -{" "}
                    {(job.salary as any)?.max?.toLocaleString() || "0"}{" "}
                    {(job.salary as any)?.currency || "INR"}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-2">Not specified</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
              <Settings size={18} className="text-blue-600" />
              Management Actions
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <JobEditButton jobId={job._id} onUpdated={onDelete} />
              <JobQuestionsButton jobId={job._id} />
              <JobShareButton onClick={onShare} />
              <JobDeleteButton
                jobId={job._id}
                jobTitle={job.title}
                onDeleted={onDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
