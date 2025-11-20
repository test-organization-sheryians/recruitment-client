import { Bookmark } from "lucide-react";

export default function JobCard({ job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
     
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5 text-xs">
          <span className="font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Type</span>
          <span className="font-medium text-gray-600">Temporary</span>
          <span className="font-medium text-gray-600">Time</span>
          <span className="font-medium text-gray-600">2 years ago</span>
        </div>
          <h2 className="text-sm font-bold mb-0.5 line-clamp-1">{job.title}</h2>

          <div className="space-y-0.5">
            <p className="text-gray-700 font-semibold text-xs">{job.salary}</p>
            <p className="text-gray-600 text-xs">
              {job.department}
            </p>
          </div>

          {/* TAGS */}
          <div className="mt-1 flex gap-0.5 flex-wrap">
            {job.tags?.map((tag) => (
              <span
                key={tag}
                className="px-1 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      
        <div className="flex gap-2 py-10 flex-shrink-0">
          <button className="px-3 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1">
            <Bookmark size={12} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-600"></span>
          </button>

          <button className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-xs">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
