// src/hooks/useStartTest.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";





export const useStartTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["startTest"],

    mutationFn: async ({ testId }: { testId: string }) => {
      return await api.startTestApi(testId);
    },

    onSuccess: (res) => {
      if (res.questions) {
        
        queryClient.setQueryData(["active-questions"], res.questions);
      }

      console.log("👉 Questions cached:", res.questions);
    },
  });
};
