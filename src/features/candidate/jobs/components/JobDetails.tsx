"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import JobQuestionsList from "@/features/admin/jobApplicationQuestions/components/jobQuestionList";

import { useGetJobById } from "@/features/admin/jobs/hooks/useJobApi";
import {
  useSaveJob,
  useUnsaveJob,
  useGetSavedJobs,
} from "@/features/candidate/jobs/hooks";

import { useToast } from "@/components/ui/Toast";
import { useGetProfile } from "../../Profile/hooks/useProfileApi";

import type { SavedJob, Skill } from "@/types/Job";
import { useGetJobQuestions } from "@/features/admin/jobApplicationQuestions/hooks/useGetJobQuestions";
import { applyJob } from "@/api/jobApplication/applyJob";

export default function JobDetails() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;


  const toast = useToast();
  const queryClient = useQueryClient();

  const [showQuestions, setShowQuestions] = useState(false);

  const saveJobMutation = useSaveJob();
const unsaveJobMutation = useUnsaveJob();


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

  /* -------------------- Queries -------------------- */
  const { data: job, isLoading, error, refetch } = useGetJobById(jobId);
const {
  data: questions,
  isLoading: questionsLoading,
} = useGetJobQuestions(jobId);


  const { data: profile } = useGetProfile();
  const { data: savedJobs } = useGetSavedJobs();

  /* -------------------- Guards -------------------- */
  if (isLoading) {
    return (
      <p className="mt-10 text-center text-gray-500">Fetching job details...</p>
    );
  }

  if (error || !job) {
    return (
      <p className="mt-10 text-center text-red-500">
        Failed to load job details
      </p>
    );
  }

  const isExpired = job.expiry ? new Date(job.expiry) < new Date() : false;

  /* -------------------- Saved State -------------------- */
  const isSaved =
    savedJobs?.some((saved: SavedJob) =>
      typeof saved.jobId === "string"
        ? saved.jobId === job._id
        : saved.jobId?._id === job._id,
    ) ?? false;

  /* -------------------- Handlers -------------------- */
 const applyDirectly = async () => {
  try {
    await applyJob({
      jobId: job._id,
      resumeUrl: profile?.resumeFile,
      answers: [],
    });

    toast.success("Job applied successfully");
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    await handleRefreshAfterApply();
  } catch {
    toast.error("Failed to apply");
  }
};


 const handleApply = async () => {
  if (isExpired || job.applied) return;

  if (!profile?.resumeFile) {
    toast.error("Please upload your resume before applying.");
    return;
  }

  if (questionsLoading) {
    toast.loading("Checking job questions...");
    return;
  }

  try {
    if (!questions || questions.length === 0) {
      await applyDirectly();
      await handleRefreshAfterApply();
      return;
    }

    setShowQuestions(true);
  } catch {
    toast.error("Failed to apply");
  }
};


  const handleBookmarkToggle = () => {
  if (isExpired || !job._id) return;

  if (!isSaved) {
    saveJobMutation.mutate(job._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      },
    });
  } else {
    unsaveJobMutation.mutate(job._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      },
    });
  }
};

  const handleRefreshAfterApply = async () => {
    await refetch(); // 🔁 job details refetch
    router.refresh(); // 🔁 Next.js cache refresh
    setShowQuestions(false); // ❌ close popup
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="relative w-full max-w-2xl space-y-6 rounded-2xl bg-white p-6 shadow-lg">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="mt-6 text-2xl font-bold">{job.title}</h1>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleBookmarkToggle}
            className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
          >
            <Bookmark
              size={20}
              className={
                isSaved ? "fill-blue-600 text-blue-600" : "text-gray-600"
              }
            />
          </button>

          <button
            onClick={handleApply}
            disabled={isExpired || job.applied}
            className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white ${
              isExpired || job.applied
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {job.applied ? "Applied" : isExpired ? "Expired" : "Apply Now"}
          </button>
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-sm text-gray-600">{job.description}</p>
        )}

        {/* 🔥 MODAL YAHAN */}
        {showQuestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* 👇 Sirf isi box ko scrollable banao */}
            <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">

  {/* HEADER */}
  <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
    <h2 className="text-lg font-semibold text-gray-900">
      Pre-Application Questions
    </h2>

    <button
      onClick={() => setShowQuestions(false)}
      className="rounded-full p-2 hover:bg-gray-100 transition"
    >
      ❌
    </button>
  </div>

  {/* BODY */}
  <div className="flex-1 overflow-y-auto px-6 py-6">
    <JobQuestionsList
      jobId={job._id}
      onSuccess={async () => {
        toast.success("Applied successfully");
        await handleRefreshAfterApply();
      }}
    />
  </div>
</div>

          </div>
        )}
      </div>
    </div>
  );
}
