"use client";

import { useParams, useRouter } from "next/navigation";
import JobQuestionList from "@/features/candidate/jobApplicationQuestions/components/jobQuestionList";
import { useGetJobById } from "@/features/admin/jobs/hooks/useJobApi";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params?.jobId as string;

  const { data, isLoading, isError } = useGetJobById(jobId);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Job not found</div>;

  // ⭐ after this line → data is guaranteed Job
  return (
    <JobQuestionList
      jobId={jobId}
      jobDetails={data}
      onBack={() => router.back()}
       onSuccess={() => router.push("/candidate/jobs")} 
    />
  );
}
