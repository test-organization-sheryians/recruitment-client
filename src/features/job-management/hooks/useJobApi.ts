import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import * as api from "@/api";
import {getCategoriesPaginated} from '@/api/category/getCategoriesPaginated'


const DEFAULT_LIMIT = 10;
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
