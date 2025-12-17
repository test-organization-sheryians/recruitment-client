import { useQuery } from "@tanstack/react-query";

export const useActiveQuestions = () => {
  return useQuery({
    queryKey: ["active-questions"],

  
    queryFn: async () => {
      return [];
    },


    staleTime: Infinity,
    enabled: false,
  });
};
