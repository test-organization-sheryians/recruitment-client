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

      queryClient.setQueryData<Job>(
        ["job", jobId],
        (old) => (old ? { ...old, applied: true } : old)
      )

      queryClient.setQueryData<Job[]>(
        ["jobs"],
        (old) =>
          old?.map((job) =>
            job._id === jobId ? { ...job, applied: true } : job
          )
      )

      queryClient.invalidateQueries({ queryKey: ["jobsByCategory"] })

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
