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
  const jobId = variables.jobId;
  toast.success(data.message || "Application submitted!");

  
  queryClient.setQueryData(
    ["job", jobId],
    (old: any) => (old ? { ...old, applied: true } : old)
  );

//change applied status in all jobs lists in the cache
  queryClient.setQueriesData(
    {
      predicate: (query) => {
        const key = query.queryKey[0];
        return (
          key === "jobs" ||
          key === "jobsByCategory" ||
          key === "jobsSearch"
        );
      },
    },
    (old: any) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((job: any) =>
            job._id === jobId
              ? { ...job, applied: true }
              : job
          ),
        })),
      };
    }
  );
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
