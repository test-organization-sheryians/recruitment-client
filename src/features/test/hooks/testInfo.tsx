import { useQuery } from "@tanstack/react-query";
import * as api from "@/api";
import type { TestInfo } from "@/api";

export const useTestInfo = (testId: string) => {
  return useQuery({
    queryKey: ["test-info", testId],
    queryFn: () => api.getTestInfoApi(testId),
    enabled: Boolean(testId),
    staleTime: 5 * 60 * 1000,

    select: (res) => res.data as TestInfo,
  });
};
