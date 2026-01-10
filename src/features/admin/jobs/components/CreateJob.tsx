"use client";

import { useRouter } from "next/navigation";
import { createJob } from "@/api/index";
import JobForm , { JobFormData } from "../../categories/components/JobForm";
import { useState } from "react";
import AddQuestionsModal from "./AddQuestionsModal";

export default function CreateJob({
  onJobCreated,
}: {
  onJobCreated?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

const handleSubmit = async (data: JobFormData) => {
  setLoading(true);
  try {

    const res = await createJob(data as unknown as Record<string, unknown>); 

    if (res.success || res.data) { 
      const jobId = res.data?._id || res.data?.id || null;
      setCreatedJobId(jobId);
      setShowQuestions(true);
      // Defer calling onJobCreated (which closes the parent dialog) until questions are saved/closed
    }
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <JobForm mode="create" onSubmit={handleSubmit} loading={loading} />
      {showQuestions && createdJobId && (
        <AddQuestionsModal
          jobId={createdJobId}
          onClose={() => {
            setShowQuestions(false);
            setCreatedJobId(null);
            onJobCreated?.(); // now refresh parent and close dialog after modal closed
          }}
          onSaved={() => {
            setShowQuestions(false);
            onJobCreated?.(); // refresh parent when questions are saved
          }}
        />
      )}
    </>
  );
}
