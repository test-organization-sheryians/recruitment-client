import { useQuery } from "@tanstack/react-query";
import { getUserAttempts } from "@/api/tests/getUserAttempts";
import { getUserEnrollments } from "@/api/tests/getUserEnrollments";
import { Enrollment } from "@/types/Test";

export const useCandidateAttempts = (userId: string) => {
  return useQuery({
    queryKey: ["candidate", "attempts", userId],
    queryFn: () => getUserAttempts(userId),
    enabled: !!userId,
  });
};

// ❌ Removed useCandidateTestDetail (No longer needed)

export const useCandidateEnrollments = (email: string) => {
  return useQuery<Enrollment[]>({
    queryKey: ["candidate", "enrollments", email],
    queryFn: () => getUserEnrollments(email),
    enabled: !!email,
  });
};