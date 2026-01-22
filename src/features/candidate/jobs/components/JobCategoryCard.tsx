
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useGetProfile } from "../../Profile/hooks/useProfileApi";
import { useEffect, useState } from "react";
import { applyJob } from "@/api/jobApplication/applyJob";
import { useQueryClient } from "@tanstack/react-query";

import JobQuestionsList from "@/features/admin/jobApplicationQuestions/components/jobQuestionList";

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

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const toast = useToast();
  const { data: profile, isLoading: profileLoading} = useGetProfile();
  const [showQuestions, setShowQuestions] = useState(false);
  const queryClient = useQueryClient();
  const [hasQuestions, setHasQuestions] = useState<boolean | null>(null);

  /* 🔒 BODY SCROLL LOCK */
  useEffect(() => {
    if (showQuestions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showQuestions]);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/job-details?id=${job._id}`);
  };

  const categoryName =
    typeof job.category === "object" && job.category?.name
      ? job.category.name
      : null;

  const skillNames =
    job.skills?.map((skill) => skill.name).filter(Boolean) || [];

  const isExpired = job.expiry ? new Date(job.expiry) < new Date() : false;

  const applyDirectly = async () => {
    try {
      await applyJob({
        jobId: job._id,
        resumeUrl: profile?.resumeFile,
        answers: [], // 🔥 NO QUESTIONS
      });

      toast.success("Applied successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch {
      toast.error("Failed to apply");
    }
  };


  const handleApply = () => {
    if (!job._id || isExpired || job.applied) return;

    if (profileLoading) {
      toast.error("Profile is loading. Please wait.");
      return;
    }

    if (!profile?.resumeFile) {
      toast.error("Please upload your resume before applying.");
      return;
    }

    setShowQuestions(true);
  };

  return (
    <>
      {/* JOB CARD */}
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 
                   transition-all duration-200 cursor-pointer group"
      >
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 min-w-0">
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
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full truncate max-w-35">
                  {job.education}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {job.title}
            </h3>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {job.salary && (
                <p className="font-semibold text-gray-800">{job.salary}</p>
              )}
              {job.department && <p>{job.department}</p>}
            </div>

            {skillNames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillNames.slice(0, 5).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0">
            <button
              disabled={isExpired || job.applied}
              onClick={(e) => {
                e.stopPropagation();
                handleApply();
              }}
              className={`px-6 py-2.5 text-white font-medium text-sm rounded-lg ${
                isExpired || job.applied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {job.applied ? "Applied" : isExpired ? "Expired" : "Apply Now"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showQuestions && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          {/* BACKDROP */}
          <div
            className="absolute inset-0"
            onClick={() => setShowQuestions(false)}
          />

          {/* MODAL CONTENT */}
          <div
            className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl
                       max-h-[85vh] overflow-y-auto z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQuestions(false)}
              className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <JobQuestionsList
              jobId={job._id}
              onNoQuestions={async() => {
                setShowQuestions(false);
                  await applyDirectly();
                // yahan direct apply ka logic hoga
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}


