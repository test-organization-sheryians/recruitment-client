import { useQuery } from "@tanstack/react-query";
import { getTestDetails } from "@/api/tests/getTestDetails";
import { getUserAttempts } from "@/api/tests/getUserAttempts";
import { getUserEnrollments } from "@/api/tests/getUserEnrollments";
import { Test, Enrollment } from "@/types/Test"; // ✅ Import Enrollment

export const useCandidateAttempts = (userId: string) => {
  return useQuery({
    queryKey: ["candidate", "attempts", userId],
    queryFn: () => getUserAttempts(userId),
    enabled: !!userId,
  });
};

export const useCandidateTestDetail = (testId: string) => {
  return useQuery<Test>({
    queryKey: ["test", "detail", testId],
    queryFn: () => getTestDetails(testId),
    enabled: !!testId,
  });
};

// ✅ Updated to use Enrollment[]
export const useCandidateEnrollments = (email: string) => {
  return useQuery<Enrollment[]>({
    queryKey: ["candidate", "enrollments", email],
    queryFn: () => getUserEnrollments(email),
    enabled: !!email,
  });
};