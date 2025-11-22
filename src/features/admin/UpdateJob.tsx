"use client";

import { useEffect, useState } from "react";
import { updateJob, getJobs } from "@/api/jobs";
import JobForm from "../admin/categories/components/JobForm";
import { useRouter } from "next/navigation";

export default function UpdateJob({ jobId, onJobUpdated }: any) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    const res = await getJobs(jobId);
    if (res.success) setJob(res.data);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);

    const formDataObj = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "skills") {
        (value as string[]).forEach((id: string) =>
          formDataObj.append("skills", id)
        );
      } else {
        formDataObj.append(key, value as string);
      }
    });

    const res = await updateJob(jobId, formDataObj);
    setLoading(false);

    if (res.success) {
      onJobUpdated?.();
      router.refresh();
    }
  };

  if (!job) return <p className="p-4">Loading...</p>;

  return (
    <JobForm
      mode="update"
      initialData={job}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
