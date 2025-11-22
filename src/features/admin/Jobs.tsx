"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useGetJobs } from "@/features/auth/hooks/useJobApi";
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
  const { data, isLoading, error: fetchError, refetch } = useGetJobs();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    if (data.success && Array.isArray(data.data)) {
      setJobs(data.data);
      setError(null);
    } else {
      setJobs([]);
      setError("No jobs found");
    }

    if (fetchError) {
      setError("Failed to load jobs");
    }
  }, [data, fetchError]);

  const closeAllDialogs = () => {
    document
      .querySelectorAll("[role='dialog']")
      .forEach((d) => d.setAttribute("aria-hidden", "true"));
  };

  const handleRefresh = useCallback(async () => {
    closeAllDialogs();

    const response = await refetch();
    if (response.data?.success && Array.isArray(response.data.data)) {
      setJobs(response.data.data);
      setError(null);
    }

    router.refresh();
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
      {/* Header section */}
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Job Listings</h2>
          <p className="text-sm text-gray-500">
            {renderedJobs.length} {renderedJobs.length === 1 ? "job" : "jobs"}{" "}
            found
          </p>
        </div>

        <Dialog>
          <DialogTrigger className="p-2 hover:bg-gray-100 rounded-md">
            <PlusIcon className="w-7 h-7 text-primary cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="w-full h-[85vh] mt-2 p-6">
            <DialogHeader>
              <DialogTitle>Create a Job</DialogTitle>
            </DialogHeader>

            <CreateJob onJobCreated={handleRefresh} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs section */}
      {renderedJobs.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {renderedJobs.map((job) => (
            <div
              key={job._id}
              className="p-6 flex justify-between hover:bg-gray-50"
            >
              <div className="flex-1 pe-4">
                <h3 className="text-lg font-medium">{job.title}</h3>

                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {job.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  {job.education && <>🎓 {job.education}</>}
                  {job.requiredExperience && <>💼 {job.requiredExperience}</>}
                  {job.skills && job.skills.length > 0 && (
                    <>🛠️ {job.skills.map((s) => s.name).join(", ")}</>
                  )}

                  {job.category && (
                    <>
                      📁{" "}
                      {Array.isArray(job.category)
                        ? job.category.map((c) => c.name).join(", ")
                        : job.category.name}
                    </>
                  )}
                </div>

                {job.expiry && (
                  <p className="text-xs text-gray-400 mt-1">
                    Expires: {new Date(job.expiry).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                {/* Edit jobs */}
                <Dialog>
                  <DialogTrigger className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm cursor-pointer">
                    Edit
                  </DialogTrigger>
                  <DialogContent className="w-full h-[96vh] mt-2 p-6">
                    <DialogHeader>
                      <DialogTitle>Edit Job: {job.title}</DialogTitle>
                    </DialogHeader>
                    <UpdateJob jobId={job._id} onJobUpdated={handleRefresh} />
                  </DialogContent>
                </Dialog>

                {/* Delete jobs */}
                <Dialog>
                  <DialogTrigger className="px-3 py-1 bg-red-500 text-white rounded-md text-sm cursor-pointer">
                    Delete
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>

                    <DeleteJob
                      jobId={job._id}
                      jobTitle={job.title}
                      onJobDeleted={handleRefresh}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-10 text-center text-gray-500">No jobs available</p>
      )}
    </div>
  );
}
