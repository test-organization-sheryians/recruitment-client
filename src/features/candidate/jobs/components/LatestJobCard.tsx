"use client";

import { MapPin, Clock } from "lucide-react";
import JobIcon from "./jobIcon";

interface LatestJobCardProps {
  jobId: string;
  title: string;
  company: string;
  location?: string;
  salary?: {
    currency?: string;
    min?: number;
    max?: number;
  };
  postedAt?: string;
  skills?: string[];
  applied?: boolean;
  onDetails: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export default function LatestJobCard({
  jobId,
  title,
  company,
  location = "Remote",
  salary,
  postedAt,
  skills = [],
  applied = false,
  onDetails,
  onApply,
}: LatestJobCardProps) {
  const visibleSkills = skills.slice(0, 3);
  const extraSkills = skills.length - visibleSkills.length;

  return (
    <div
      className="
        bg-white
        rounded-xl
        p-4 sm:p-5 md:p-6
        flex flex-col md:flex-row md:justify-between
        border
        gap-4 md:gap-6
        hover:shadow-md
        transition-all duration-200
      "
    >
      {/* LEFT */}
      <div className="flex gap-3 sm:gap-4">
        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
          <JobIcon name={title} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-700" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold md:font-bold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>

          <p className="text-sm sm:text-base font-medium md:font-bold text-gray-700 mt-0.5">
            {company}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {location}
            </span>

            {salary?.min != null && salary?.max != null && (
              <span className="flex items-center gap-1">
                💰 {salary.currency ?? "₹"} {salary.min} - {salary.max}
              </span>
            )}

            {postedAt && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {postedAt}
              </span>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {visibleSkills.map((skill, index) => (
              <span
                key={skill}
                className={`px-3 py-1 text-[11px] sm:text-xs rounded-full ${index === 0
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "bg-gray-100 text-gray-700 font-semibold"
                  }`}
              >
                {skill}
              </span>
            ))}

            {extraSkills > 0 && (
              <span className="px-3 py-1 text-[11px] sm:text-xs rounded-full bg-gray-100 text-gray-600">
                +{extraSkills}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-row md:flex-col gap-2 sm:gap-3 md:justify-center w-full md:w-auto">
        <button
          onClick={() => onDetails(jobId)}
          className="
            flex-1 md:flex-none
            px-4 sm:px-6 md:px-8
            py-2.5 sm:py-3
            border border-blue-600
            text-sm sm:text-base
            text-blue-600
            rounded-lg
            font-semibold
            hover:bg-blue-50
            transition
          "
        >
          Details
        </button>

        <button
          disabled={applied}
          onClick={(e) => {
            e.stopPropagation();
            onApply(jobId);
          }}
          className={`
            flex-1 md:flex-none
            px-4 sm:px-6 md:px-8
            py-2.5 sm:py-3
            rounded-lg
            text-sm sm:text-base
            font-semibold
            transition
            ${applied
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}