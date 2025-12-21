"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";

import { useUnsaveJob } from "@/features/candidate/jobs/hooks";
import { useInfiniteSavedJobs } from "@/features/candidate/jobs/hooks/useInfiniteSavedJobs";
import { SavedJob } from "@/types/Job";

export default function SavedJobsPage() {
  const router = useRouter();

  const {
    data: savedJobsPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSavedJobs();

  const savedJobs = (savedJobsPages?.pages ?? []).flatMap((p) => p.data ?? []);

  const { mutate: unsaveJob, isPending } = useUnsaveJob();

  // Infinite scroll sentinel
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* -------------------- States -------------------- */
  if (isLoading) {
    return (
      <p className="mt-10 text-center text-gray-500">Loading saved jobs...</p>
    );
  }

  if (isError) {
    return (
      <p className="mt-10 text-center text-red-500">
        Failed to load saved jobs
      </p>
    );
  }

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl space-y-6 rounded-2xl bg-white p-6 shadow">
          <Header onBack={() => router.back()} />
          <p className="py-12 text-center text-gray-500">
            You have not saved any jobs yet.
          </p>
        </div>
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6 rounded-2xl bg-white p-6 shadow">
        <Header onBack={() => router.back()} />

        <div className="grid gap-4">
          {savedJobs.map((savedJob: SavedJob) => {
            const { _id, jobId } = savedJob;

            if (!jobId) return null;

            return (
              <div
                key={_id}
                className="rounded-xl border bg-white p-5 transition hover:shadow"
              >
                {/* Title + Unsave */}
                <div className="flex items-start justify-between">
                  <h2
                    onClick={() => router.push(`/job-details?id=${jobId._id}`)}
                    className="cursor-pointer text-lg font-semibold text-gray-900"
                  >
                    {jobId.title}
                  </h2>

                  <Bookmark
                    size={20}
                    className="cursor-pointer fill-red-500 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPending) {
                        unsaveJob(jobId._id);
                      }
                    }}
                  />
                </div>

                {/* Description */}
                {jobId.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                    {jobId.description}
                  </p>
                )}

                {/* Expiry */}
                {jobId.expiry && (
                  <p className="mt-3 text-sm text-gray-500">
                    ⏳ Expires on{" "}
                    <span className="font-medium">
                      {new Date(jobId.expiry).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            );
          })}

          {/* Infinite scroll sentinel */}
          <div ref={loadMoreRef} className="h-1" />

          {/* Loading indicator */}
          {isFetchingNextPage && (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading more saved jobs...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Header -------------------- */
function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h1 className="flex items-center gap-2 text-xl font-bold">
        <Bookmark size={20} className="fill-blue-600 text-blue-600" />
        Saved Jobs
      </h1>
    </div>
  );
}
