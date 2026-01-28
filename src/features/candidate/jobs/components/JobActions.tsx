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
    <div className="flex items-center justify-between gap-3 mb-6">
      <button
        onClick={onBookmarkClick}
        disabled={isExpired || isLoadingBookmark}
        className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        <Bookmark
          size={20}
          className={isSaved ? "fill-blue-600 text-blue-600" : "text-gray-600"}
        />
        <span className="text-base">Save Job</span>
      </button>

      <button
        onClick={onApplyClick}
        disabled={isExpired || isApplied || isLoadingApply}
        className={`rounded-lg px-8 py-2.5 text-base font-bold text-white transition-colors ${
          isExpired || isApplied
            ? "cursor-not-allowed bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isApplied ? "Applied" : isExpired ? "Expired" : "Apply Now"}
      </button>
    </div>
  );
}
