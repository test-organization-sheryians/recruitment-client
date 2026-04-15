import { Bookmark } from "lucide-react";

interface JobActionsProps {
  isSaved: boolean;
  isExpired: boolean;
  isApplied: boolean;
  onBookmarkClick: () => void;
  onApplyClick: () => void;
  onWithdrawClick?: () => void;
  isLoadingBookmark?: boolean;
  isLoadingApply?: boolean;
  isLoadingWithdraw?: boolean;
}

export default function JobActions({
  isSaved,
  isExpired,
  isApplied,
  onBookmarkClick,
  onApplyClick,
  onWithdrawClick,
  isLoadingBookmark = false,
  isLoadingApply = false,
  isLoadingWithdraw = false,
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
        onClick={() => {
          if (isApplied && onWithdrawClick) {
            onWithdrawClick();
          } else if (!isApplied) {
            onApplyClick();
          }
        }}
        disabled={isExpired || (isApplied ? isLoadingWithdraw : isLoadingApply)}
        className={`flex-1 rounded-lg px-8 py-3 font-semibold transition-all ${
          isExpired
            ? "cursor-not-allowed bg-gray-400 text-white"
            : isApplied
            ? "bg-red-600 text-white cursor-pointer hover:bg-red-700"
            : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
        }`}
      >
        {isExpired 
          ? "Expired" 
          : isApplied 
            ? isLoadingWithdraw 
              ? "Withdrawing..." 
              : "Withdraw Application"
            : isLoadingApply 
              ? "Applying..." 
              : "Apply Now"
        }
      </button>
    </div>
  );
}
