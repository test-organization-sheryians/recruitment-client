import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import * as api from "@/api";
import {getCategoriesPaginated} from '@/api/category/getCategoriesPaginated'
import { Job } from "@/types/Job";

export type JobUpdatePayload = Record<string, unknown>;

import {
  getJobsPaginated,
  type BackendPaginatedResponse,
} from "@/api/jobs/getJobsPaginated";


export const useGetJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.getJobs(),
    retry: 1,
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
    mutationFn: (data: JobUpdatePayload) => api.createJob(data),
    retry: 0,
  });
};

export const useUpdateJob = () => {
  return useMutation({
    mutationKey: ["updateJob"],
    mutationFn: ({ id, formData }: { id: string; formData: JobUpdatePayload }) => 
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

    queryFn: () =>
      categoryId ? api.getJobsByCategory(categoryId) : Promise.resolve([]),
    enabled: !!categoryId,
    retry: 0,
  });
};

const DEFAULT_LIMIT = 10;

export const useInfiniteJobsAdmin = (limit: number = DEFAULT_LIMIT) => {
  return useInfiniteQuery<BackendPaginatedResponse<Job>>({
    queryKey: ["admin-jobs", { limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await getJobsPaginated(pageParam as number, limit);
      return res;
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination) return undefined;
      const next = (pagination.currentPage ?? 1) + 1;
      return next <= (pagination.totalPages ?? 0) ? next : undefined;
    },
  });
};


// Fetch categories with pagination (infinite)
export const useGetCategories = (limit: number = DEFAULT_LIMIT) => {
  const q = useInfiniteQuery({
    queryKey: ["categories", { limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getCategoriesPaginated(pageParam as number, limit)
      return res
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage
      if (!pagination) return undefined
      const next = (pagination.currentPage ?? 1) + 1
      return next <= (pagination.totalPages ?? 0) ? next : undefined
    },
    retry: 0,
  })

  const flattened = (q.data?.pages ?? []).flatMap((p: any) => p.data ?? [])

  return {
    ...q,
    data: flattened,
  }
}

// Fetch all skills
export const useGetSkills = () => {
  return useQuery({ 
    queryKey: ["skills"],
    queryFn: () => api.getAllSkills(),
    retry: 0,
  });
}; 
