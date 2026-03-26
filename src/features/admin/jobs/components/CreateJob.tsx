"use client";

import { useRouter } from "next/navigation";
import { createJob } from "@/api/index";
import JobForm , { JobFormData } from "../../categories/components/JobForm";
import { useState } from "react";

export default function CreateJob({
  onJobCreated,
}: {
  onJobCreated?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

const handleSubmit = async (data: JobFormData) => {
  setLoading(true);
  try {

    const res = await createJob(data as unknown as Record<string, unknown>); 

    if (res.success || res.data) { 
      onJobCreated?.();
      router.refresh();
    }
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setLoading(false);
  }
};
  return <JobForm mode="create" onSubmit={handleSubmit} loading={loading} />;
}
