"use client";

import { useRouter } from "next/navigation";
import { useApplyJob } from "@/features/applyJobs/hooks/useApplyJob";
import { useToast } from "@/components/ui/Toast";
import { useGetProfile } from "../../Profile/hooks/useProfileApi";
import JobIcon from "./jobIcon";


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
  salary?: string | { min: number; max: number; currency: string };
  department?: string;
  skills?: Skill[];
  applied?: boolean;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const applyJobMutation = useApplyJob();
  const toast = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking "Apply" button
    if ((e.target as HTMLElement).closest("button")) return;
    // router.push(`/job-details?id=${job._id}`);
    router.push(`/jobs/${job._id}`);

   console.log("JOB PARAM:", job._id);


  };

  // Safely extract category name
  const categoryName =
    typeof job.category === "object" && job.category?.name
      ? job.category.name
      : null;

  // Extract skill names directly (no fetching needed!)
  const skillNames =
    job.skills?.map((skill) => skill.name).filter(Boolean) || [];

  const isExpired = job.expiry ? new Date(job.expiry) < new Date() : false;

  const { data: profile, isLoading: profileLoading } = useGetProfile();

  // Format salary
  const getSalaryString = () => {
    if (!job.salary) return null;
    if (typeof job.salary === "string") return job.salary;
    if (typeof job.salary === "object" && "min" in job.salary) {
      const { min, max, currency } = job.salary;
      return `${currency}${min}k - ${currency}${max}k`;
    }
    return null;
  };

  const handleApply = () => {
    // ----------------------------------------------
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
    applyJobMutation.mutate({
      jobId: job._id,
      message: "Excited to apply!",
      resumeUrl: profile.resumeFile,
    });
  };

  return (
  
  <div
    onClick={handleCardClick}
    className="bg-white rounded-xl border border-gray-200 px-6 py-5
               hover:shadow-md transition-all duration-200 cursor-pointer"
  >
    <div className="flex items-start justify-between gap-6">
      {/* Left Section */}
      <div className="flex gap-4 flex-1 min-w-0">
        {/* Logo Placeholder */}
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center
                text-red-600 shrink-0">
  <JobIcon
    name={categoryName || job.title}
    className="w-6 h-6"
  />
</div>


        {/* Job Info */}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {job.title}
          </h3>

          {/* Category + Department */}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
            {categoryName && <span>{categoryName}</span>}
            {job.department && <span>• {job.department}</span>}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            {getSalaryString() && (
              <span className="font-medium text-gray-700">
                {getSalaryString()}
              </span>
            )}
            {job.requiredExperience && <span>{job.requiredExperience}</span>}
          </div>

          {/* Skills */}
          {skillNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skillNames.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-full
                             bg-blue-50 text-blue-700"
                >
                  {skill}
                </span>
              ))}
              {skillNames.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{skillNames.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <button
          className="px-4 py-2 text-sm font-medium rounded-lg border
                     border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Details
        </button>

        <button
          disabled={isExpired || job.applied || applyJobMutation.isPending}
          onClick={(e) => {
            e.stopPropagation();
            handleApply();
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${
            isExpired || job.applied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition"
          }`}
        >
          {job.applied
            ? "Applied"
            : applyJobMutation.isPending
            ? "Applying..."
            : isExpired
            ? "Expired"
            : "Apply"}
        </button>
      </div>
    </div>
  </div>
);


}
