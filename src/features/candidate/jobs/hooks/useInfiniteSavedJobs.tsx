import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getSavedJobsPaginated,
  type BackendPaginatedResponse,
} from "@/api/jobs/getSavedJobsPaginated";
import type { SavedJob } from "@/types/Job";

const DEFAULT_LIMIT = 10;

export const useInfiniteSavedJobs = (limit: number = DEFAULT_LIMIT) => {
  return useInfiniteQuery<BackendPaginatedResponse<SavedJob>>({
    queryKey: ["saved-jobs", { limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await getSavedJobsPaginated(pageParam as number, limit);
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
