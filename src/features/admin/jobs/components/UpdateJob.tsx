"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import JobForm from "../../categories/components/JobForm"
import AddQuestionsModal from "./AddQuestionsModal";
import { getJobQuestions } from "@/api/jobs/addJobQuestions";
import type { JobQuestion, ApiResponse } from "@/types/JobQuestion";
import { useGetJobById, useUpdateJob } from "@/features/admin/jobs/hooks/useJobApi"

// interface Skill {
//   _id: string
//   name: string
// }

// interface Category {
//   _id: string
//   name: string
// }

interface Location {
  city: string;
  state: string;
  pincode: string;
  country: string
}


interface JobFormData {
  _id?: string
  title: string
  description: string
  education: string
  requiredExperience: string
  category: string
  skills: string[]
  expiry: string
  clientId: string
  location: Location
}

export default function UpdateJob({
  jobId,
  onJobUpdated,
}: {
  jobId: string
  onJobUpdated?: () => void
}) {
  const router = useRouter()

  // Fetch single job by ID
  const { data: job, isLoading, isError } = useGetJobById(jobId)

  // 🔥 Mutation using your centralized "useUpdateJob"
  const { mutate: updateJob, isPending } = useUpdateJob()

  const handleSubmit = async (data: JobFormData): Promise<void> => {

    return new Promise((resolve, reject) => {
      updateJob(
        { id: jobId, formData: data as unknown as Record<string, unknown> },
        {
          onSuccess: (res) => {
            if (res.success) {
              onJobUpdated?.()
              router.refresh()
              resolve()
            } else {
              reject(new Error("Failed to update job"))
            }
          },
          onError: (error) => {
            console.error("Error updating job:", error)
            reject(error)
          },
        }
      )
    })
  }

  // Questions modal state
  const [showQuestions, setShowQuestions] = useState(false);
  const [initialQuestions, setInitialQuestions] = useState<JobQuestion[] | undefined>(undefined);

  const openQuestions = async () => {
    try {
      const res = await getJobQuestions(jobId) as ApiResponse<JobQuestion[]>;
      setInitialQuestions(res?.data || []);
    } catch (err) {
      console.error("Failed to load questions", err);
      setInitialQuestions([]);
    }
    setShowQuestions(true);
  };

  if (!jobId) return null
  if (isLoading) return <p className="p-4">Loading...</p>
  if (isError) return <p className="p-4 text-red-600">Failed to load job.</p>

  return (
    <>
      <JobForm
        mode="update"
        initialData={job as unknown as Partial<JobFormData>}
        onSubmit={handleSubmit}
        loading={isPending}
        extraAction={
          <button
            type="button"
            onClick={openQuestions}
            className="group flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all text-gray-700"
          >
            Manage Questions
          </button>
        }
      />
      {showQuestions && (
        <AddQuestionsModal
          jobId={jobId}
          initialQuestions={initialQuestions}
          onClose={() => setShowQuestions(false)}
          onSaved={() => { setShowQuestions(false); onJobUpdated?.(); router.refresh(); }}
        />
      )}
    </>
  )
}
