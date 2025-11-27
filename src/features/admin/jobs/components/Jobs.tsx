"use client";

import { useEffect, useState, useCallback } from "react";
import { useGetJobs } from "@/features/admin/jobs/hooks/useJobApi";
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
import useClientInfiniteScroll from "@/features/admin/jobs/hooks/useClientInfiniteScroll";
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
  const { data, isLoading, error: fetchError, refetch } = useGetJobs();
  const [visibleJobs, setVisibleJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.success) {
      setAllJobs(data.data);
      setVisibleJobs(data.data.slice(0, 10));
      setError(null);
    } else if (fetchError) {
      setError("Failed to load jobs");
    }
  }, [data, fetchError]);

  const loadMore = () => {
    if (isLoadingMore) return;

    const current = visibleJobs.length;

    if (current >= allJobs.length) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const next10 = allJobs.slice(current, current + 10);
      setVisibleJobs((prev) => [...prev, ...next10]);
      setIsLoadingMore(false);
    }, 2000);
  };

  const loaderRef = useClientInfiniteScroll({
    onLoadMore: loadMore,
    enabled: !isLoadingMore,
  });

  const handleRefresh = useCallback(async () => {
    const response = await refetch();
    if (response.data?.success) {
      setAllJobs(response.data.data);
      setVisibleJobs(response.data.data.slice(0, 10));
      setError(null);
    }
    router.refresh();
    setIsCreateDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setEditingJobId(null);
  }, [refetch, router]);

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
            {visibleJobs.length} jobs shown
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

      {visibleJobs.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
            {visibleJobs.map((job) => (
              <div
                key={job._id}
                className="group relative bg-white hover:bg-zinc-100 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1"
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
                        <span className="text-gray-600">{job.education}</span>
                      </div>
                    )}

                    {job.requiredExperience && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600">
                          {job.requiredExperience}
                        </span>
                      </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
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
                    )}

                    {job.category && (
                      <div className="text-sm text-gray-600">
                        {Array.isArray(job.category)
                          ? job.category.map((c) => c.name).join(", ")
                          : job.category.name}
                      </div>
                    )}
                  </div>

                  {job.expiry && (
                    <div className="mt-4 pt-3 border-t text-sm text-gray-500">
                      Expires:{" "}
                      {new Date(job.expiry).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isLoadingMore && (
            <div className="w-full flex justify-center py-6">
              <div className="h-14 w-14 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          {!isLoadingMore && visibleJobs.length < allJobs.length && (
            <div ref={loaderRef} className="py-8 text-center text-gray-500">
              Scroll to load more...
            </div>
          )}
        </div>
      ) : (
        <p className="p-10 text-center text-gray-500">No jobs available</p>
      )}
    </div>
  );
}
