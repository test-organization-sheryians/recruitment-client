"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { applyJob } from "@/api/jobApplication/applyJob"
import { useToast } from "@/components/ui/Toast"
import { AxiosError } from "axios"
import { Job } from "@/types/Job"

export function useApplyJob() {
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: applyJob,

    onSuccess: (data, variables) => {
      toast.success(data.message || "Application submitted!")

      const jobId = variables.jobId

      // ✅ 1. Update job detail cache
      queryClient.setQueryData<Job>(
        ["job", jobId],
        (old) => (old ? { ...old, applied: true } : old)
      )

      // ✅ 2. Update ALL jobs list cache
      queryClient.setQueryData<Job[]>(
        ["jobs"],
        (old) =>
          old?.map((job) =>
            job._id === jobId ? { ...job, applied: true } : job
          )
      )

      // ✅ 3. Update category-based job lists (SAFE)
      queryClient.invalidateQueries({ queryKey: ["jobsByCategory"] })

      // ✅ 4. Background refetch for safety
      queryClient.invalidateQueries({ queryKey: ["job", jobId] })
    },

    onError: (error: unknown) => {
      let msg = "Failed to apply"

      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || msg
      }

      toast.error(msg)
    },
  })
}
