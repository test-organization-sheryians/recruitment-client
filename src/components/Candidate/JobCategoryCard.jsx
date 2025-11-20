<<<<<<< HEAD
import { Bookmark } from "lucide-react";
=======
import { Download } from "lucide-react";
import { useGetAllJobRoles } from "@/features/candidate-home/hooks/useRoleAndCategory";
>>>>>>> e00c2f339d810844a830e362fec286150ae68ae6

export default function JobCard({ job }) {
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError
  } = useGetAllJobRoles();

  if (rolesLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
     
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
<<<<<<< HEAD
        <div className="flex items-center justify-between mb-0.5 text-xs">
          <span className="font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Type</span>
          <span className="font-medium text-gray-600">Temporary</span>
          <span className="font-medium text-gray-600">Time</span>
          <span className="font-medium text-gray-600">2 years ago</span>
        </div>
          <h2 className="text-sm font-bold mb-0.5 line-clamp-1">{job.title}</h2>
=======
          <div className="flex items-center gap-1.5 mb-0.5 text-xs">
            <span className="font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Type</span>
            <span className="font-medium text-gray-600">Temporary</span>
            <span className="font-medium text-gray-600">Time</span>
            <span className="font-medium text-gray-600">2 years ago</span>
          </div>

          <h2 className="text-sm font-bold mb-0.5">{job.title}</h2>
>>>>>>> e00c2f339d810844a830e362fec286150ae68ae6

          <div className="space-y-0.5">
            <p className="text-gray-700 font-semibold text-xs">{job.salary}</p>
            <p className="text-gray-600 text-xs">
              {department}
            </p>
          </div>

          {/* TAGS */}
          <div className="mt-1 flex gap-0.5 flex-wrap">
            {rolesLoading && <span className="text-xs text-gray-400 mr-2">Loading roles...</span>}
            {rolesError && <span className="text-xs text-red-500 mr-2">Failed to load roles</span>}
            {tags?.map((tag) => (
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

<<<<<<< HEAD
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-xs">
            Apply
=======
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs"
            disabled={rolesLoading}
          >
            Apply Now
>>>>>>> e00c2f339d810844a830e362fec286150ae68ae6
          </button>
        </div>
      </div>
    </div>
  );
}
