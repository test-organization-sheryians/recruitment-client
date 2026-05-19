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
  onWithdrawClick?: () => void;
  isLoadingBookmark?: boolean;
  isLoadingApply?: boolean;
  isLoadingWithdraw?: boolean;
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
  onWithdrawClick,
  isLoadingBookmark = false,
  isLoadingApply = false,
  isLoadingWithdraw = false,
}: JobHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header with Logo and Title - No Background */}
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
          {logo ? (
            <img
              src={logo}
              alt={company || "Company"}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Title, Company, Location */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

          {/* Company Name and Location in same row */}
          <div className="flex items-center gap-4 text-gray-600">
            {/* Company Name */}
            {company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">{company}</span>
              </div>
            )}

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posted Time & Action Buttons - White Background */}
      {/* Salary + Posted + Buttons */}
      <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            {/* Salary */}

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Salary Range
              </p>
              <p className="text-lg font-bold text-blue-600">
                {salary || "Not disclosed"}
              </p>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-gray-200" />

            {/* Posted */}
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Posted
              </p>
              <p className="text-base font-semibold text-gray-900">
                {postedTime || "2 hours ago"}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex items-center gap-3">
            {onBookmarkClick && (
              <button
                onClick={onBookmarkClick}
                disabled={isExpired || isLoadingBookmark}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
                {isLoadingBookmark ? "Saving..." : isSaved ? "Saved" : "Save"}
              </button>
            )}

            {onApplyClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isApplied && onWithdrawClick) {
                    onWithdrawClick();
                  } else if (!isApplied) {
                    onApplyClick(jobId);
                  }
                }}
                disabled={isExpired || isLoadingApply || isLoadingWithdraw}
                className={`rounded-lg px-6 py-2.5 font-semibold transition ${
                  isExpired
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : isApplied
                      ? "bg-red-600 text-white cursor-pointer hover:bg-red-700"
                      : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                }`}
              >
                {isApplied
                  ? isLoadingWithdraw
                    ? "Withdrawing..."
                    : "Withdraw"
                  : isLoadingApply
                    ? "Applying..."
                    : isExpired
                      ? "Expired"
                      : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
