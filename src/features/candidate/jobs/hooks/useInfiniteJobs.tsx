import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getJobsPaginated,
  type BackendPaginatedResponse,
} from "@/api/jobs/getJobsPaginated";
import { getJobsByCategoryPaginated } from "@/api/jobs/getJobsByCategoryPaginated";
import { searchJobsPaginated } from "@/api/jobs/getSearchJobsPaginated";
import type { Job } from "@/types/Job";

const DEFAULT_LIMIT = 10;

/* ---------------- ALL JOBS ---------------- */

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

/* ---------------- JOBS BY CATEGORY ---------------- */

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

/* ---------------- SEARCH + FILTERS ---------------- */

interface SearchJobsParams {
  q?: string;
  location?: string;
  jobType?: string[];
  experience?: string[];
  minSalary?: number;
  maxSalary?: number;

  category?: string;
  limit?: number;
}

export const useInfiniteSearchJobs = ({
  q = "",
  location = "",
  jobType = [],
  experience = [],
  minSalary,
  maxSalary,
  category,

  limit = DEFAULT_LIMIT,
}: SearchJobsParams) => {
  return useInfiniteQuery<BackendPaginatedResponse<Job>>({
    queryKey: [
      "searchJobs",
      q,
      location,
      jobType.join(","),      // ✅ FIX
      experience.join(","),   // ✅ FIX
      minSalary ?? "",
      maxSalary ?? "",
      category ?? "",
     
      limit,
    ],
  enabled: Boolean(
  q ||
  location ||
  jobType.length ||
  experience.length ||
  minSalary !== 0 ||
  maxSalary !== 10000000 ||
  category
),

    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return searchJobsPaginated(
        { q, location, jobType, experience, minSalary, maxSalary,category},
        pageParam as number,
        limit
      );
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination) return undefined;
      const next = (pagination.currentPage ?? 1) + 1;
      return next <= (pagination.totalPages ?? 0) ? next : undefined;
    },
  });
};
