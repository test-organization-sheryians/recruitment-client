import * as api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateInterviewPayload, InterviewStatus } from "@/types/applicant";

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

export const useCreateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInterviewPayload) =>
      api.createInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
    retry: 0,
  });
};

export const useMyScheduleInterviews = () => {
  return useQuery({
    queryKey: ["myInterviews"],
    queryFn: api.getMyScheduleInterviews,
    retry: 0,
  });
};

export const useAllInterviews = () => {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: api.getAllInterviews,
    retry: 0,
  });
};

export const useInterviewsByJob = (jobId: string) => {
  return useQuery({
    queryKey: ["interviewsByJob", jobId],
    queryFn: () => api.getInterviewByJobId(jobId),
    enabled: !!jobId,
    retry: 0,
  });
};

export const useUpdateInterviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: InterviewStatus }) =>
      api.updateInterviewStatus(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
    retry: 0,
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteInterview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
    retry: 0,
  });
};