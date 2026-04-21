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
  const { data: profile, isLoading: profileLoading } = useGetProfile();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/jobs/${job._id}`);
  };

  const categoryName =
    typeof job.category === "object" && job.category?.name
      ? job.category.name
      : null;

  const skillNames =
    job.skills?.map((skill) => skill.name).filter(Boolean) || [];

  const isExpired = job.expiry ? new Date(job.expiry) < new Date() : false;

  const getSalaryString = () => {
    if (!job.salary) return null;
    if (typeof job.salary === "string") return job.salary;
    if ("min" in job.salary) {
      return `${job.salary.currency}${job.salary.min}k - ${job.salary.currency}${job.salary.max}k`;
    }
    return null;
  };

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

    applyJobMutation.mutate({
      jobId: job._id,
      message: "Excited to apply!",
      resumeUrl: profile.resumeFile,
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        bg-white
        rounded-xl
        border border-gray-200
        p-4 sm:p-5 md:p-6
        hover:shadow-md
        transition-all duration-200
        cursor-pointer
      "
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">

        {/* LEFT */}
        <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <JobIcon
              name={categoryName || job.title}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
              {job.title}
            </h3>

            {/* Category */}
            <div className="flex flex-wrap gap-1 text-xs sm:text-sm text-gray-500 mt-1">
              {categoryName && <span>{categoryName}</span>}
              {job.department && <span>• {job.department}</span>}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs sm:text-sm text-gray-500">
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
                {skillNames.slice(0, 2).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-[11px] sm:text-xs rounded-full bg-blue-50 text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
                {skillNames.length > 2 && (
                  <span className="text-[11px] sm:text-xs text-gray-500">
                    +{skillNames.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
          <button
            className="
              flex-1 md:flex-none
              px-4 sm:px-5
              py-2
              text-sm
              rounded-lg
              border border-gray-300
              text-gray-700
              hover:bg-gray-100
            "
          >
            Details
          </button>

          <button
            disabled={isExpired || job.applied || applyJobMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleApply();
            }}
            className={`
              flex-1 md:flex-none
              px-4 sm:px-5
              py-2
              text-sm
              rounded-lg
              text-white
              ${isExpired || job.applied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
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