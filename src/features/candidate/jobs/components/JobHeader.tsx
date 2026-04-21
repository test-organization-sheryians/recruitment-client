"use client";

import { Building2, MapPin, Bookmark } from "lucide-react";

interface JobHeaderProps {
  jobId: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  postedTime?: string;
  logo?: string;
  isSaved?: boolean;
  isExpired?: boolean;
  isApplied?: boolean;
  onBookmarkClick?: () => void;
  onApplyClick?: (jobId: string) => void;
  isLoadingBookmark?: boolean;
  isLoadingApply?: boolean;
}

export default function JobHeader({
  jobId,
  title,
  company,
  location,
  salary,
  postedTime,
  logo,
  isSaved = false,
  isExpired = false,
  isApplied = false,
  onBookmarkClick,
  onApplyClick,
  isLoadingBookmark = false,
  isLoadingApply = false,
}: JobHeaderProps) {
  return (
    <div className="space-y-4 sm:space-y-6">

      {/* HEADER */}
      <div className="flex items-start gap-3 sm:gap-4">

        {/* Logo */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
          {logo ? (
            <img
              src={logo}
              alt={company || "Company"}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          )}
        </div>

        {/* TITLE + INFO */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600 text-xs sm:text-sm">
            {company && (
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{company}</span>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INFO + ACTIONS */}
      <div className="bg-white rounded-xl p-4 sm:p-5 md:px-6 md:py-4 shadow-sm border border-gray-100">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LEFT */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">

            {/* Salary */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase">
                Salary
              </p>
              <p className="text-base sm:text-lg font-bold text-blue-600">
                {salary || "Not disclosed"}
              </p>
            </div>

            {/* Divider (hidden on mobile) */}
            <div className="hidden md:block h-10 w-px bg-gray-200" />

            {/* Posted */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase">
                Posted
              </p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {postedTime || "Recently"}
              </p>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-row sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">

            {onBookmarkClick && (
              <button
                onClick={onBookmarkClick}
                disabled={isExpired || isLoadingBookmark}
                className="
                  flex-1 md:flex-none
                  flex items-center justify-center gap-2
                  rounded-lg
                  border border-gray-300
                  px-3 sm:px-5
                  py-2 sm:py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  transition
                "
              >
                <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
                {isLoadingBookmark ? "Saving..." : isSaved ? "Saved" : "Save"}
              </button>
            )}

            {onApplyClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyClick(jobId);
                }}
                disabled={isExpired || isApplied || isLoadingApply}
                className={`
                  flex-1 md:flex-none
                  rounded-lg
                  px-4 sm:px-6
                  py-2 sm:py-2.5
                  text-sm sm:text-base
                  font-semibold
                  transition
                  ${isExpired || isApplied
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                `}
              >
                {isApplied
                  ? "Applied"
                  : isLoadingApply
                    ? "Applying..."
                    : isExpired
                      ? "Expired"
                      : "Apply"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}