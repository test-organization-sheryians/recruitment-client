"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyJob } from "@/api/jobApplication/applyJob";
import { useToast } from "@/components/ui/Toast";
import { AxiosError } from "axios";

export function useApplyJob() {
  const toast = useToast();
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: applyJob,
    onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["jobs"] });

      toast.success(data.message || "Application submitted!");
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
