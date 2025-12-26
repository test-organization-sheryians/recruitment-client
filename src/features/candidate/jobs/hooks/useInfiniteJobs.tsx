import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getJobsPaginated,
  type BackendPaginatedResponse,
} from "@/api/jobs/getJobsPaginated";
import { getJobsByCategoryPaginated } from "@/api/jobs/getJobsByCategoryPaginated";
import type { Job } from "@/types/Job";

const DEFAULT_LIMIT = 10;

export const useInfiniteJobs = (limit: number = DEFAULT_LIMIT) => {
  return useInfiniteQuery<BackendPaginatedResponse<Job>>({
    queryKey: ["jobs", { limit }],
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

export const useInfiniteJobsByCategory = (
  categoryId: string | null,
  limit: number = DEFAULT_LIMIT
) => {
  return useInfiniteQuery<BackendPaginatedResponse<Job>>({
    queryKey: ["jobsByCategory", { categoryId, limit }],
    enabled: !!categoryId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await getJobsByCategoryPaginated(
        categoryId!,
        pageParam as number,
        limit
      );
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
