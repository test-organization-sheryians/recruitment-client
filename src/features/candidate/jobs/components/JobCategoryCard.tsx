"use client";

import { useRouter } from "next/navigation";
import { useApplyJob } from "@/features/applyJobs/hooks/useApplyJob";
import { useToast } from "@/components/ui/Toast";
import { useGetProfile } from "../../Profile/hooks/useProfileApi";
import CandidateProfile from "../../Profile/components/CandidateProfile";


interface Category {
  _id: string;
  name: string;
}

interface Skill {
  _id: string;
  name: string;
}

export interface Job {
  _id: string;
  title: string;
  category?: Category | string;
  requiredExperience?: string;
  education?: string;
  expiry?: string | Date;
  salary?: string;
  department?: string;
  skills?: Skill[];
  applied?: boolean;
}

interface JobCardProps {
  job: Job;

}

export default function JobCard({ job  }: JobCardProps) {
  const router = useRouter();
  const applyJobMutation = useApplyJob();
  const toast = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking "Apply" button
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/job-details?id=${job._id}`);
  };

  // Safely extract category name
  const categoryName =
    typeof job.category === "object" && job.category?.name
      ? job.category.name
      : null;

  // Extract skill names directly (no fetching needed!)
  const skillNames = job.skills?.map((skill) => skill.name).filter(Boolean) || [];

  const isExpired = job.expiry ? new Date(job.expiry) < new Date() : false;

  const { data: profile, isLoading: profileLoading } = useGetProfile();  

 const handleApply = () => {
  if (!job._id || isExpired) return;

  if (profileLoading) {
    toast.error("Profile is loading. Please wait.");
    return;
  }

  if (!profile?.resumeFile) {
    toast.error("Please upload your resume before applying.");
    return;
  }

  // Only call mutation once
  applyJobMutation.mutate(
    {
      jobId: job._id,
      message: "Excited to apply!",
      resumeUrl: profile.resumeFile,
    }
  );
};





  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 
                 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex justify-between items-start gap-6">
        {/* Left: Job Info */}
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600 mb-3">
            {categoryName && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                {categoryName}
              </span>
            )}
            {job.requiredExperience && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                {job.requiredExperience}
              </span>
            )}
            {job.education && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full truncate max-w-[140px]">
                {job.education}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
            {job.title}
          </h3>

          {/* Salary & Department */}
          <div className="text-sm text-gray-600 space-y-1 mb-3">
            {job.salary && <p className="font-semibold text-gray-800">{job.salary}</p>}
            {job.department && <p>{job.department}</p>}
          </div>

          {/* Skills */}
          {skillNames.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skillNames.slice(0, 5).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                >
                  {skill}
                </span>
              ))}
              {skillNames.length > 5 && (
                <span className="px-3 py-1.5 text-xs font-medium text-gray-500">
                  +{skillNames.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Expiry */}
          {job.expiry && (
            <p className="text-xs text-gray-500 mt-4">
              Expires:{" "}
              {new Date(job.expiry).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Right: Apply Button */}
        <div className="shrink-0">
<button
  disabled={isExpired || job.applied || applyJobMutation.isPending}
  onClick={(e) => {
    e.stopPropagation();
    handleApply();
  }}
  className={`px-6 py-2.5 text-white font-medium text-sm rounded-lg ${isExpired? "bg-gray-400 cursor-not-allowed": job.applied? "bg-gray-400 cursor-not-allowed": "bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
  }`}
>
  {job.applied
    ? "Applied"
    : applyJobMutation.isPending
    ? "Applying..."
    : isExpired
    ? "Expired"
    : "Apply Now"}
</button>


        </div>
      </div>
    </div>
  );
}
