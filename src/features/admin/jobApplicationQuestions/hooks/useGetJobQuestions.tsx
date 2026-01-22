import { useQuery } from "@tanstack/react-query";
import { getJobQuestions } from "@/api/jobs/jobApplicationQuestion";

export const useGetJobQuestions = (jobId: string) => {
  return useQuery({
    queryKey: ["job-questions", jobId],
    queryFn: () => getJobQuestions(jobId),
    enabled: !!jobId, // jobId na ho toh query run nahi hogi
  });
};
