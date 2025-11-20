import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/api/jobs";

    

export const useGetJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.getJobs(),
    retry: 0,
  });
};

export const useCreateJob = (data: FormData) => {
  return useMutation({
    mutationKey: ["createJob"],
    mutationFn: (data: any) => api.createJob(data),
    retry: 0,
  });
};

export const useUpdateJob = () => {
  return useMutation({
    mutationKey: ["updateJob"],
    mutationFn: (id: string, data: any) => api.updateJob(id, data),
    retry: 0,
  });
};

export const useDeleteJob = () => {
  return useMutation({
    mutationKey: ["deleteJob"],
    mutationFn: (id: string) => api.deleteJob(id),
    retry: 0,
  });
};
