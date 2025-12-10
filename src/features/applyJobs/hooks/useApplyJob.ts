"use client";

import { useMutation } from "@tanstack/react-query";
import { applyJob } from "@/api/jobApplication/applyJob";
import { useToast } from "@/components/ui/Toast";

export function useApplyJob() {
  const toast = useToast();

  return useMutation({
    mutationFn: applyJob,
    onSuccess: (data) => {
      toast.success(data.message || "Application submitted!");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to apply";
      toast.error(msg);
    },
  });
}
