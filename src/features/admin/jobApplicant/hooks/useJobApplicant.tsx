import * as api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useJobApplicant = (id: string) => {
    return useQuery({
        queryKey: ["jobApplicant", id],
        queryFn: () => api.getAllApplicant(id),
        enabled: !!id,
        retry: 0,
    });
};

export const useBulkUpdateApplicants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: api.BulkUpdatePayload) =>
      api.bulkUpdateData(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobApplicant"],
      });
    },

    retry: 0,
  });
}

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: api.ScheduleInterviewPayload) =>
      api.scheduleInterview(payload),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobApplicant"],
      });
    },
  });
};

// ✅ ADD THIS HOOK
export const useJobInterviews = (jobId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["jobInterviews", jobId],
    queryFn: () => api.getInterviewsByJobId(jobId), // Now this exists!
    enabled: !!jobId && enabled,
    retry: 1,
  });
};