import { useQuery } from "@tanstack/react-query";

export const useActiveQuestions = () => {
  return useQuery({
    queryKey: ["active-questions"],

    queryFn: async () => {
      const res = await fetch("/api/active-questions", {
        credentials: "include",
      });
      return res.json();
    },
    enabled: true,
    staleTime: Infinity,
  });
};
