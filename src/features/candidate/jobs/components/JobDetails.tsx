"use client";

import { useParams, useRouter } from "next/navigation";
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
import { getJobQuestions } from "@/api/jobs/jobApplicationQuestion";

import JobHeader from "./JobHeader";
import JobActions from "./JobActions";
import JobMeta from "./JobMeta";
import JobSection from "./JobSection";
import SkillBadge from "./SkillBadge";

import type { SavedJob, Skill } from "@/types/Job";
import ShowDescription from "@/features/job-management/components/ShowDescription";

export default function JobDetails() {
  const params = useParams();
  const jobId = params.jobId as string;

  const toast = useToast();
  const queryClient = useQueryClient();

  /* -------------------- Queries -------------------- */
  const { data: job, isLoading, error } = useGetJobById(jobId);
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const router = useRouter();
  const { data: savedJobs } = useGetSavedJobs();

  /* -------------------- Mutations -------------------- */
  const applyJobMutation = useApplyJob();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  // Helper to support both react-query v4 (`isLoading`) and v5+ (`isPending`)
  const isMutationWorking = (m: any) => !!(m?.isPending ?? m?.isLoading);

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

  /* -------------------- Saved State (TYPE SAFE) -------------------- */
  const isSaved =
    savedJobs?.some((saved: SavedJob) =>
      typeof saved.jobId === "string"
        ? saved.jobId === job._id
        : saved.jobId?._id === job._id,
    ) ?? false;

  /* -------------------- Handlers -------------------- */

  const handleApply = async (jobIdParam?: string) => {
    const targetJobId = jobIdParam ?? job._id;
    if (isExpired || job.applied) return;

    if (profileLoading) {
      toast.error("Profile is loading. Please wait.");
      return;
    }

    if (!profile?.resumeFile) {
      toast.error("Please upload your resume before applying.");
      return;
    }

    try {
      const questions = await getJobQuestions(targetJobId);
      if (!questions || questions.length === 0) {
        applyJobMutation.mutate({
          jobId: targetJobId,
          message: "Excited to apply!",
          resumeUrl: profile.resumeFile,
        });
      } else {
        router.push(`/jobs/${targetJobId}/apply`);
      }
    } catch (err) {
      toast.error("Failed to check job requirements.");
    }
  };

  const handleBookmarkToggle = () => {
    if (isExpired || !job._id) return;
    if (
      isMutationWorking(saveJobMutation) ||
      isMutationWorking(unsaveJobMutation)
    )
      return;

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
  const formatSalary = (): string | undefined => {
    if (!job.salary) return "Not disclosed";

    // If salary is already string or number
    if (typeof job.salary === "string" || typeof job.salary === "number") {
      return String(job.salary);
    }

    // If salary is an object
    const { min, max, currency } = job.salary as {
      min?: number;
      max?: number;
      currency?: string;
    };

    const curr = currency || "INR";

    if (min && max)
      return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}+`;
    if (max) return `Up to ${curr} ${max.toLocaleString()}`;

    return "Not disclosed";
  };

  /* -------------------- Meta Data -------------------- */
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
    {
      label: "Salary",
      value: formatSalary(), // <-- fixed here
    },
    { label: "Department", value: job.department },
    { label: "Education", value: job.education },
    {
      label: "Expiry Date",
      value: job.expiry
        ? new Date(job.expiry).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        : undefined,
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
    <div className="min-h-screen bg-[#F6F6F8] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <JobHeader
          jobId={job._id}
          title={job.title}
          company={
            typeof job.category === "string"
              ? job.category
              : job.category?.name
          }
          location={getLocationString()}
          salary={formatSalary()}
          postedTime={
            job.createdAt
              ? new Date(job.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : undefined
          }
          isSaved={isSaved}
          isExpired={isExpired}
          isApplied={job.applied ?? false}
          onBookmarkClick={handleBookmarkToggle}
          onApplyClick={handleApply}
          isLoadingBookmark={
            isMutationWorking(saveJobMutation) ||
            isMutationWorking(unsaveJobMutation)
          }
          isLoadingApply={isMutationWorking(applyJobMutation)}
        />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm">
                <JobSection title="About the Role">
                  <ShowDescription
                    html={job.description}
                    clamp={6}
                    maxHeight="12rem"
                    className="border-none p-0 text-gray-700 text-sm sm:text-base"
                  />
                </JobSection>
              </div>
            )}

            {/* Skills */}
            {(job.skills ?? []).length > 0 && (
              <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm">
                <SkillBadge skills={job.skills || []} />
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-5">

            {/* Job Meta */}
            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm">
              <JobMeta items={metaItems} />
            </div>

            {/* Talent Card */}
            <div className="bg-blue-600 rounded-lg p-4 sm:p-5 md:p-6 shadow-sm text-white">
              <h3 className="font-semibold sm:font-bold text-base sm:text-lg mb-2">
                Not sure yet?
              </h3>

              <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-blue-100">
                Join our talent community to get notified about similar roles.
              </p>

              <button className="w-full bg-white text-blue-600 font-semibold sm:font-bold py-2 sm:py-2.5 rounded-lg hover:bg-blue-50 transition">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
