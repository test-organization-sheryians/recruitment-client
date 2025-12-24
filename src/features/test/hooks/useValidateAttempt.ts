import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios";


interface TestQuestion {
  question: string;
  options?: string[];
}

export interface StartTestResponse {
  isValid: boolean;
  attemptId?: string;
  email?: string;
  duration?: number;
  enrollments?: { email: string }[];
  questions?: TestQuestion[];
  reason?: string;
}


export const useStartTest = () => {
  return useMutation<StartTestResponse, Error, { testId: string }>({
    mutationFn: async ({ testId }) => {
      const res = await api.post("/api/test-attempts/start", { testId });
      return res.data;
    },
  });
};
