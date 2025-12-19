import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/api";
import { Job } from "@/types/Job";
// import { getJobById } from "@/api";

    

export const useGetJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.getJobs(),
    retry: 0,
  });
};


export const useGetJobById = (id?: string) => {
  return useQuery<Job, Error>({
    queryKey: ["job", id],
    queryFn: () => api.getJobById(id!),
    enabled: !!id,
    retry: 0,
  });
};


export const useCreateJob = () => {
  return useMutation({
    mutationKey: ["createJob"],
    mutationFn: (data: FormData) => api.createJob(data),
    retry: 0,
  });
};

export const useUpdateJob = () => {
  return useMutation({
    mutationKey: ["updateJob"],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      api.updateJob(id, formData),
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
// Fetch jobs by category
export const useGetJobsByCategory = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["jobsByCategory", categoryId],

    
    queryFn: () => categoryId ? api.getJobsByCategory(categoryId) : Promise.resolve([]),
    enabled: !!categoryId,
    retry: 0,
  });
};
