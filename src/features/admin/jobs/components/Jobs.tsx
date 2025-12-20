"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useInfiniteJobsAdmin } from "@/features/admin/jobs/hooks/useJobApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateJob from "./CreateJob";
import DeleteJob from "./DeleteJob";
import UpdateJob from "./UpdateJob";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
}
interface Category {
  _id: string;
  name: string;
}
interface Job {
  _id: string;
  title: string;
  description: string;
  education: string;
  requiredExperience?: string;
  skills?: Skill[];
  expiry?: string;
  category?: Category | Category[];
  client?: { _id: string; email?: string };
}

export default function Jobs() {
  const router = useRouter();
  const {
    data: jobPages,
    isLoading,
    error: fetchError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobsAdmin();

  const jobs = (jobPages?.pages ?? []).flatMap((p) => p.data ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Infinite scroll sentinel
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (fetchError) {
      setError("Failed to load jobs");
    } else {
      setError(null);
    }
  }, [fetchError]);

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

  const handleRefresh = useCallback(async () => {
    await refetch();
    router.refresh();

    setIsCreateDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setEditingJobId(null);
  }, [refetch, router]);

  const renderedJobs = useMemo(() => jobs, [jobs]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-600">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
          <p className="text-sm text-gray-500">
            {renderedJobs.length} {renderedJobs.length === 1 ? "job" : "jobs"}{" "}
            found
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            className="px-2 py-2 text-gray-600 rounded-md hover:bg-gray-200 hover:text-white text-sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusIcon className="w-7 h-7 text-primary cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="w-full h-[99vh]">
            <DialogHeader className="w-full h-full">
              <DialogTitle>Create a Job</DialogTitle>
            </DialogHeader>
            <CreateJob onJobCreated={handleRefresh} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs section */}
      {renderedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
          {renderedJobs.map((job) => (
            <div
              key={job._id}
              className="group relative bg-white hover:bg-zinc-100  rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog
                      open={isUpdateDialogOpen && editingJobId === job._id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsUpdateDialogOpen(false);
                          setEditingJobId(null);
                        }
                      }}
                    >
                      <DialogTrigger
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        onClick={() => {
                          setIsUpdateDialogOpen(true);
                          setEditingJobId(job._id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-9 w-9 p-1 "
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </DialogTrigger>
                      <DialogContent className="w-full h-[99vh] mt-2 p-6">
                        <DialogHeader>
                          <DialogTitle>Update Job</DialogTitle>
                          <UpdateJob
                            jobId={job._id}
                            onJobUpdated={handleRefresh}
                          />
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <DeleteJob jobId={job._id} onJobDeleted={handleRefresh} />
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {job.education && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="text-gray-600">{job.education}</span>
                    </div>
                  )}

                  {job.requiredExperience && (
                    <div className="flex items-center text-sm">
                      <svg
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 16h.01"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {job.requiredExperience}
                      </span>
                    </div>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {job.category && (
                    <div className="flex items-center text-sm mt-3">
                      <svg
                        className="h-4 w-4 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {Array.isArray(job.category)
                          ? job.category.map((c) => c.name).join(", ")
                          : job.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {job.expiry && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Expires:{" "}
                        {new Date(job.expiry).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={loadMoreRef} className="col-span-full h-1" />

          {/* Loading indicator */}
          {isFetchingNextPage && (
            <div className="col-span-full p-4 text-center text-sm text-gray-500">
              Loading more jobs...
            </div>
          )}
        </div>
      ) : (
        <p className="p-10 text-center text-gray-500">No jobs available</p>
      )}
    </div>
  );
}
