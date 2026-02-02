"use client";

import { useParams } from "next/navigation";
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

import JobHeader from "./JobHeader";
import JobActions from "./JobActions";
import JobMeta from "./JobMeta";
import JobSection from "./JobSection";
import SkillBadge from "./SkillBadge";

import type { SavedJob, Skill } from "@/types/Job";

export default function JobDetails() {
  const params = useParams();
  const jobId = params.jobId as string;


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

  /* -------------------- Meta Data -------------------- */
  const metaItems = [
    {
      label: "Job Type",
      value: job.jobType ?? "Not specified",
    },
    {
      label: "Experience Level",
      value: job.requiredExperience,
    },
    { label: "Salary", value: job.salary ? String(job.salary) : undefined },
    { label: "Department", value: job.department },
    { label: "Education", value: job.education },
    {
      label: "Date Posted",
      value: job.expiry ? new Date(job.expiry).toLocaleDateString() : undefined,
    },
  ];

  /* -------------------- Format Location -------------------- */
  const getLocationString = (): string | undefined => {
  
  if (!job.location) {
    return job.isRemote ? "Remote" : job.department;

  }

  const parts: string[] = [];

  if (job.location.city) parts.push(job.location.city);
  if (job.location.state) parts.push(job.location.state);

  if (parts.length === 0) {
    return job.isRemote ? "Remote" : job.department;
  }

  const locationStr = parts.join(", ");
  return job.isRemote ? `${locationStr} (Remote)` : locationStr;
};

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-[#F6F6F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with integrated action buttons */}
        <JobHeader
          title={job.title}
          company={typeof job.category === "string" ? job.category : job.category?.name}
          location={getLocationString()}
          salary={job.salary ? String(job.salary) : undefined}
          postedTime="2 hours ago"
          isSaved={isSaved}
          isExpired={isExpired}
          isApplied={job.applied ?? false}
          onBookmarkClick={handleBookmarkToggle}
          onApplyClick={handleApply}
          isLoadingBookmark={
            saveJobMutation.isPending || unsaveJobMutation.isPending
          }
          isLoadingApply={applyJobMutation.isPending}
        />

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <JobSection title="About the Role">
                  <p className="text-gray-700 leading-relaxed">
                    {job.description}
                  </p>
                </JobSection>
              </div>
            )}

            {/* Skills */}
            {(job.skills ?? []).length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <SkillBadge skills={job.skills || []} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Job Overview Card */}
            <JobMeta items={metaItems} />

            {/* About the Company Card */}
            {/* Talent Community Card */}
          </div>
        </div>
      </div>
    </div>
  );
}
