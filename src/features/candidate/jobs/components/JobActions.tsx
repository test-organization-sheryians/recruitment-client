import { Bookmark } from "lucide-react";

interface JobActionsProps {
  isSaved: boolean;
  isExpired: boolean;
  isApplied: boolean;
  onBookmarkClick: () => void;
  onApplyClick: () => void;
  isLoadingBookmark?: boolean;
  isLoadingApply?: boolean;
}

export default function JobActions({
  isSaved,
  isExpired,
  isApplied,
  onBookmarkClick,
  onApplyClick,
  isLoadingBookmark = false,
  isLoadingApply = false,
}: JobActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBookmarkClick}
        disabled={isExpired || isLoadingBookmark}
        className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        <Bookmark
          size={18}
          className={isSaved ? "fill-current" : ""}
        />
        <span>{isLoadingBookmark ? "Saving..." : "Save Job"}</span>
      </button>

      <button
        onClick={onApplyClick}
        disabled={isExpired || isApplied || isLoadingApply}
        className={`flex-1 rounded-lg px-8 py-3 font-semibold transition-all ${
          isExpired || isApplied
            ? "cursor-not-allowed bg-gray-400 text-white"
            : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
        }`}
      >
        {isApplied ? "Applied" : isLoadingApply ? "Applying..." : isExpired ? "Expired" : "Apply Now"}
      </button>
    </div>
  );
}
