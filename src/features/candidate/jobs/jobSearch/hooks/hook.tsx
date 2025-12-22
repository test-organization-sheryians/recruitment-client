import { useQuery } from "@tanstack/react-query";
import * as api from "@/api";
import { PaginatedJobsResponse } from "@/types/Job";


export const useSearchJobs = (q: string, location: string, page: number,
  limit = 2) => {
  return useQuery<PaginatedJobsResponse>({
    queryKey: ["search-jobs", q, location,page],
    queryFn: () => api.searchJob({ q, location,page,limit }),
    enabled: !!q || !!location, 
    retry:0,
     placeholderData: (previousData) => previousData,
  });
};