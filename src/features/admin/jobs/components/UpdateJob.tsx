"use client"

import { useRouter } from "next/navigation"
import JobForm from "../../categories/components/JobForm"
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
  requiredExperience: number
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
      initialData={{
        ...job,
        // Convert to number to satisfy the JobForm interface
        requiredExperience: job?.requiredExperience ? Number(job.requiredExperience) : 0,
        
        // Safety check for skills if your API returns objects instead of IDs
        skills: Array.isArray(job?.skills) 
          ? job.skills.map((s: any) => typeof s === "string" ? s : s._id)
          : []
      } as any} // Using 'as any' here bypasses the Partial mismatch temporarily
      onSubmit={handleSubmit}
      loading={isPending}
    />
  );
}
