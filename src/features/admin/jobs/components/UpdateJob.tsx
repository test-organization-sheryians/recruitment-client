"use client"

import { useRouter } from "next/navigation"
import JobForm from "../../categories/components/JobForm"
import { useGetJobById, useUpdateJob } from "@/features/admin/jobs/hooks/useJobApi"





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

  if (!jobId) return null
  if (isLoading) return <p className="p-4">Loading...</p>
  if (isError) return <p className="p-4 text-red-600">Failed to load job.</p>

  return (
    <JobForm
      mode="update"
      initialData={job as unknown as Partial<JobFormData>}
      onSubmit={handleSubmit}
      loading={isPending}
    />
  )
}
