"use client"

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query"
import {
  applyJob,
  type ApplyJobVariables,
  type ApplyJobResponse,
} from "@/api/jobApplication/applyJob"
import { useToast } from "@/components/ui/Toast"
import { AxiosError } from "axios"
import { Job } from "@/types/Job"

/**
 * Shape of one page returned by jobs infinite query
 */
type JobsPage = {
  data: Job[]
}

export function useApplyJob() {
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation<ApplyJobResponse, unknown, ApplyJobVariables>({
    mutationFn: applyJob,

    onSuccess: (data, variables) => {
      const jobId = variables.jobId
      toast.success(data.message || "Application submitted!")

      // Update single job cache
      queryClient.setQueryData<Job>(
        ["job", jobId],
        (oldJob) => (oldJob ? { ...oldJob, applied: true } : oldJob)
      )

      // Update all job lists (infinite queries)
      queryClient.setQueriesData<InfiniteData<JobsPage>>(
        {
          predicate: (query) => {
            const key = query.queryKey[0]
            return (
              key === "jobs" ||
              key === "jobsByCategory" ||
              key === "jobsSearch"
            )
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((job) =>
                job._id === jobId
                  ? { ...job, applied: true }
                  : job
              ),
            })),
          }
        }
      )
    },

    onError: (error) => {
      let msg = "Failed to apply"

      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || msg
      }

      toast.error(msg)
    },
  })
}
