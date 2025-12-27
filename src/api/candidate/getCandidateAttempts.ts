import api from "@/config/axios";
import { TestAttempt } from "@/types/Enrollment";

export const getCandidateAttempts = async (testId: string): Promise<TestAttempt[]> => {
  const res = await api.get(`/api/test-attempts/candidate/${testId}`);
  return res.data.data;
};
