import { Bookmark } from "lucide-react";

export default function JobCard({ job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow">

      <div className="flex justify-between items-start gap-2">

        {/* Left Content */}
        <div className="flex-1">

          {/* Top small labels */}
          <div className="flex items-center justify-between mb-1 text-[10px] sm:text-xs">
            <span className="font-medium text-gray-600 bg-gray-100 px-1 py-0.5 rounded">Type</span>
            <span className="font-medium text-gray-600">Temporary</span>
            <span className="font-medium text-gray-600">Time</span>
            <span className="font-medium text-gray-600">2 years ago</span>
          </div>

          <h2 className="text-sm sm:text-base font-bold mb-0.5 line-clamp-1">
            {job.title}
          </h2>

          <div className="space-y-0.5">
            <p className="text-gray-700 font-semibold text-xs sm:text-sm">{job.salary}</p>
            <p className="text-gray-600 text-xs sm:text-sm">{job.department}</p>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-1 sm:gap-2 py-4 sm:py-10 flex-shrink-0">

          {/* Save */}
          <button className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1">
            <Bookmark size={12} className="text-gray-600" />
          </button>

          {/* Apply */}
          <button className="px-3 sm:px-4 py-1.5 bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors font-medium text-xs sm:text-sm">
            Apply
          </button>

        </div>
      </div>
    </div>
  );
}
