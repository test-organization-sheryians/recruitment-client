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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        <JobQuestionList
          jobId={jobId}
          jobDetails={data}
          onBack={() => router.back()}
          onSuccess={() => router.push("/jobs")}
        />
      </div>
    </div>
  );
}

