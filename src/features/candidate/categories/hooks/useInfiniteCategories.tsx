import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getCategoriesPaginated,
  type BackendPaginatedResponse,
  type CategoryItem,
} from "@/api/category/getCategoriesPaginated";

const DEFAULT_LIMIT = 20;

export const useInfiniteJobCategories = (limit: number = DEFAULT_LIMIT) => {
  return useInfiniteQuery<BackendPaginatedResponse<CategoryItem>>({
    queryKey: ["jobCategories", { limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await getCategoriesPaginated(pageParam as number, limit);
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
