import { useQuery } from "@tanstack/react-query";
import { getCandidateAttempts } from "@/api/candidate/getCandidateAttempts";

export const useCandidateAttempts = (testId?: string) => {
  return useQuery({
    queryKey: ["candidate-attempts", testId],
    queryFn: () => getCandidateAttempts(testId!),
    enabled: !!testId,
  });
};
