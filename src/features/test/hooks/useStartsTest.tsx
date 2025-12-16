import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { useRouter } from "next/navigation";

export const useStartTest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ testId }: { testId: string }) => api.startTestApi(testId),

    onSuccess: (res: api.StartTestResponse) => {
   
      const enrollments =
        res.questions?.test?.enrollments ||
        res.data?.questions?.test?.enrollments ||
        [];

     
      queryClient.setQueryData(["active-questions"], res.questions?.test?.questions || res.questions);

     
      queryClient.setQueryData(["test-meta"], {
        duration: res.duration ?? 0,
        enrollments,
        email: res.email ?? "",
        attemptId: res.attemptId,
      });

      
      router.push("/candidate/ai-test/questining");
    },
  });
};
