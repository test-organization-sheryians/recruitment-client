import { useQuery } from "@tanstack/react-query";

export const useActiveQuestions = () =>
  useQuery({
    queryKey: ["active-questions"],
    queryFn: () => [],
    enabled: false,        
    staleTime: 0,
    gcTime: 0,
  });
