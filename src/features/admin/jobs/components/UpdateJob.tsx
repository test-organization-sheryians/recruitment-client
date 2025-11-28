"use client";

import { useEffect, useState } from "react";
import { updateJob, getJobs } from "@/api/jobs";
import JobForm from "../../categories/components/JobForm";
import { useRouter } from "next/navigation";
import { Job } from "@/types/Job";

export default function UpdateJob({ jobId, onJobUpdated }: { jobId: string; onJobUpdated?: () => void }) {
  const router = useRouter();
  const [job, setJob] = useState<Job>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJob();
  },);

  const fetchJob = async () => {
    const res = await getJobs(jobId);
    if (res.success) setJob(res.data);
  };

  const handleSubmit = async (data: { [key: string]: string | string[] }) => {
    setLoading(true);

    const formDataObj = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "skills") {
        (value as string[]).forEach((id: string) =>
          formDataObj.append("skills[]", id)
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

  return (
    <JobForm
      mode="update"
      initialData={job as unknown as Partial<JobFormData>}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
