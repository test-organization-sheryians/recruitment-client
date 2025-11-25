"use client";

import { useRouter } from "next/navigation";
import { createJob } from "@/api/jobs";
import JobForm from "../../categories/components/JobForm";
import { useState } from "react";

export default function CreateJob({
  onJobCreated,
}: {
  onJobCreated?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

    const res = await createJob(formDataObj);
    setLoading(false);

    if (res.success) {
      onJobCreated?.();
      router.refresh();
    }
  };

  return <JobForm mode="create" onSubmit={handleSubmit} loading={loading} />;
}
