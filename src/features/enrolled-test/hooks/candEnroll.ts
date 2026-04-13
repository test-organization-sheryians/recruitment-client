import { useQuery } from "@tanstack/react-query";
import { getCandidateEnrollments } from "@/api/candidate/getCandidateEnrollments";

export const useCandidateEnrollments = (email?: string) => {
  return useQuery({
    queryKey: ["enrolled-tests", email],
    queryFn: () => getCandidateEnrollments(email!),
    enabled: !!email,
  });
};
