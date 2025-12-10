"use client";

import { useRouter } from "next/navigation";
import JobForm from "../../categories/components/JobForm";
import { useGetJob, useUpdateJob } from "@/features/admin/jobs/hooks/useJobApi";

interface Skill {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface JobFormData {
  _id?: string;
  title: string;
  description: string;
  education: string;
  requiredExperience: string;
  category: Category;
  skills: Skill[];
  expiry: string;
  clientId: string;
}

export default function UpdateJob({
  jobId,
  onJobUpdated,
}: {
  jobId: string;
  onJobUpdated?: () => void;
}) {
  const router = useRouter();

  // Fetch single job by ID
  const { data: job, isLoading, isError } = useGetJob(jobId);

  // 🔥 Mutation using your centralized "useUpdateJob"
  const { mutate: updateJob, isPending } = useUpdateJob();

  const handleSubmit = async (data: { [key: string]: string | string[] }): Promise<void> => {
    const formDataObj = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "skills") {
        (value as string[]).forEach((id) =>
          formDataObj.append("skills[]", id)
        );
      } else {
        formDataObj.append(key, value as string);
      }
    });
    return new Promise((resolve, reject) => {
      updateJob(
        { id: jobId, formData: formDataObj },
        {
          onSuccess: (res) => {
            if (res.success) {
              onJobUpdated?.();
              router.refresh();
              resolve();
            } else {
              reject(new Error('Failed to update job'));
            }
          },
          onError: (error ) => {
            console.error('Error updating job:', error);
            reject(error);
          },
        }
      );
    });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-600">Failed to load job.</p>;

  return (
    <JobForm
      mode="update"
      initialData={job as Partial<JobFormData>}
      onSubmit={handleSubmit}
      loading={isPending}
    />
  );
}
