import { useQuery } from "@tanstack/react-query";
import * as api from "@/api";
import { Interview } from "@/types/Interview";

export const useGetAllInterviews = () => {
  return useQuery({
    queryKey: ["interviews", "all"],
    queryFn: () => api.getAllInterviews(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};