import { useQuery } from "@tanstack/react-query";
import * as api from "@/api";

// export const useSearchJobs = (query: string) => {
//   return useQuery({
//     queryKey: ["search-jobs", query],
//     queryFn: () => api.searchJob(query),
//     enabled: query.trim().length > 0, // prevents empty API call
//   });
// };
export const useSearchJobs = (q: string, location: string) => {
  return useQuery({
    queryKey: ["search-jobs", q, location],
    queryFn: () => api.searchJob({ q, location }),
    enabled: !!q || !!location, // optional
  });
};