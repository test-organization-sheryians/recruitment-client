
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Job } from "@/types/Job";
import {
  searchJobsPaginated,
  type BackendPaginatedResponse,
} from "@/api/jobs/getSearchJobsPaginated";

const DEFAULT_LIMIT = 10;

type SearchParams = {
  q: string;
  location: string;
  limit?: number;
};

export const useInfiniteSearchJobs = ({
  q,
  location,
  limit = DEFAULT_LIMIT,
}: SearchParams) => {
  console.log("useInfiniteSearchJobs Params hook check the data (request) ===>:", { q, location, limit });
  return useInfiniteQuery<BackendPaginatedResponse<Job>>({
    queryKey: ["jobsSearch", { q, location, limit }],

    enabled: Boolean(q || location),

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return searchJobsPaginated(
        {
          q,
          location,
        },
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

