import { Building2, MapPin, Bookmark } from "lucide-react";

interface JobHeaderProps {
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
  onApplyClick?: () => void;
  isLoadingBookmark?: boolean;
  isLoadingApply?: boolean;
}

export default function JobHeader({
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
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Posted Time */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">
              Posted
            </p>
            <p className="text-base font-bold text-gray-900">{postedTime || "2 hours ago"}</p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            {onBookmarkClick && (
              <button
                onClick={onBookmarkClick}
                disabled={isExpired || isLoadingBookmark}
                className="flex items-center justify-center gap-2 rounded-lg border-1 border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold whitespace-nowrap"
              >
                <Bookmark
                  size={18}
                  className={`${isSaved ? "fill-current" : ""} font-bold`}
                  strokeWidth={3}
                />
                <span>{isLoadingBookmark ? "Saving..." : "Save Job"}</span>
              </button>
            )}

            {onApplyClick && (
              <button
                onClick={onApplyClick}
                disabled={isExpired || isApplied || isLoadingApply}
                className={`rounded-lg px-8 py-3 font-semibold transition-all whitespace-nowrap ${
                  isExpired || isApplied
                    ? "cursor-not-allowed bg-gray-400 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isApplied ? "Applied" : isLoadingApply ? "Applying..." : isExpired ? "Expired" : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
