import { useQuery } from "@tanstack/react-query";

export const useActiveQuestions = () =>
  useQuery({
    queryKey: ["active-questions"],
    queryFn: () => [],
    enabled: false,         // 🚫 do not fetch, we manually set data
    staleTime: 0,
    gcTime: 0,
  });
