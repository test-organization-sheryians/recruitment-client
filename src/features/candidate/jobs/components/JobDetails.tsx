"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useGetJobById } from "@/features/admin/jobs/hooks/useJobApi";
import { useApplyJob } from "@/features/applyJobs/hooks/useApplyJob";
import {
  useSaveJob,
  useUnsaveJob,
  useGetSavedJobs,
} from "@/features/candidate/jobs/hooks";

import { useToast } from "@/components/ui/Toast";
import { useGetProfile } from "../../Profile/hooks/useProfileApi";

import type { SavedJob, Skill } from "@/types/Job";

export default function JobDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id") ?? undefined;

  const toast = useToast();
  const queryClient = useQueryClient();

  /* -------------------- Queries -------------------- */
  const { data: job, isLoading, error } = useGetJobById(jobId);
  const { data: profile } = useGetProfile();
  const { data: savedJobs } = useGetSavedJobs();

  /* -------------------- Mutations -------------------- */
  const applyJobMutation = useApplyJob();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  /* -------------------- Guards -------------------- */
  if (isLoading) {
    return (
      <p className="mt-10 text-center text-gray-500">
        Fetching job details...
      </p>
    );
  }

  if (error || !job) {
    return (
      <p className="mt-10 text-center text-red-500">
        Failed to load job details
      </p>
    );
  }

  const isExpired = job.expiry
    ? new Date(job.expiry) < new Date()
    : false;

  /* -------------------- Saved State (TYPE SAFE) -------------------- */
  const isSaved =
    savedJobs?.some((saved: SavedJob) =>
      typeof saved.jobId === "string"
        ? saved.jobId === job._id
        : saved.jobId?._id === job._id
    ) ?? false;

  /* -------------------- Handlers -------------------- */
  const handleApply = () => {
    if (isExpired || job.applied) return;

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

  const handleBookmarkToggle = () => {
    if (isExpired || !job._id) return;
    if (saveJobMutation.isPending || unsaveJobMutation.isPending) return;

    if (!isSaved) {
      saveJobMutation.mutate(job._id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
        },
        onError: (err: unknown) => {
          if ((err as { status?: number })?.status !== 409) {
            toast.error("Failed to save job");
          }
        },
      });
    } else {
      unsaveJobMutation.mutate(job._id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
        },
        onError: () => toast.error("Failed to remove saved job"),
      });
    }
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

        {/* Title */}
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
                isSaved
                  ? "fill-blue-600 text-blue-600"
                  : "text-gray-600"
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
            {job.applied
              ? "Applied"
              : isExpired
              ? "Expired"
              : "Apply Now"}
          </button>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          {job.category && (
            <p>
              <strong>Category:</strong>{" "}
              {typeof job.category === "string"
                ? job.category
                : job.category.name}
            </p>
          )}
          {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
          {job.department && (
            <p><strong>Department:</strong> {job.department}</p>
          )}
          {job.requiredExperience && (
            <p><strong>Experience:</strong> {job.requiredExperience}</p>
          )}
          {job.education && (
            <p><strong>Education:</strong> {job.education}</p>
          )}
          {job.expiry && (
            <p>
              <strong>Expiry:</strong>{" "}
              {new Date(job.expiry).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div>
            <h2 className="mb-1 font-semibold text-gray-800">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {job.description}
            </p>
          </div>
        )}

        {/* Skills */}
        {(job.skills ?? []).length > 0 && (
          <div>
            <h2 className="mb-2 font-semibold text-gray-800">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills!.map((skill: Skill | string, index: number) => (
                <span
                  key={index}
                  className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-700"
                >
                  {typeof skill === "string" ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
