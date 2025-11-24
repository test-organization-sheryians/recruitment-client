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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

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

  const handleRefresh = useCallback(async () => {
    const response = await refetch();
    if (response.data?.success && Array.isArray(response.data.data)) {
      setJobs(response.data.data);
      setError(null);
    }
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
      {/* Header section */}
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
            onClick={() => setIsCreateDialogOpen(true)}>
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
        <div className="divide-y p-6 divide-gray-100">
          {renderedJobs.map((job) => (
            <div
              key={job._id}
              className="group relative p-6 border-gray-200 border mb-6 rounded-4xl hover:bg-gray-100 shadow-lg transition-colors"
            >
              <div className="flex-1 pe-4">
                <h3 className="text-lg font-medium">{job.title}</h3>

                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {job.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  {job.education && <span><b>Education:</b> {job.education}</span>}
                  {job.requiredExperience && <span><b>Experience:</b> {job.requiredExperience}</span>}
                  {job.skills && job.skills.length > 0 && (
                    <span><b>Skills:</b> {job.skills.map((s) => s.name).join(", ")}</span>
                  )}

                  {job.category && (
                    <span>
                      <b>Category:</b> {Array.isArray(job.category)
                        ? job.category.map((c) => c.name).join(", ")
                        : job.category.name}
                    </span>
                  )}
                </div>

                {job.expiry && (
                  <p className="text-xs text-gray-500 mt-1">
                    <b>Expires on:</b> {new Date(job.expiry).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog open={isUpdateDialogOpen && editingJobId === job._id} onOpenChange={(open) => {
                    if (!open) {
                      setIsUpdateDialogOpen(false);
                      setEditingJobId(null);
                    }
                  }}>
                  <DialogTrigger 
                    className="p-4 text-blue-600 bg-blue-50 hover:bg-blue-200 rounded-full transition-colors"
                    onClick={() => {
                      setIsUpdateDialogOpen(true);
                      setEditingJobId(job._id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </DialogTrigger>
                  <DialogContent className="w-full h-[85vh] mt-2 p-6">
                    <DialogHeader>
                      <DialogTitle>Update Job</DialogTitle>
                      <UpdateJob jobId={job._id} onJobUpdated={handleRefresh} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <DeleteJob jobId={job._id} onJobDeleted={handleRefresh} />
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
