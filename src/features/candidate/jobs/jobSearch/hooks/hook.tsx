import { useQuery } from "@tanstack/react-query";
import * as api from "@/api";


export const useSearchJobs = (q: string, location: string) => {
  return useQuery({
    queryKey: ["search-jobs", q, location],
    queryFn: () => api.searchJob({ q, location }),
    enabled: !!q || !!location, 
  });
};