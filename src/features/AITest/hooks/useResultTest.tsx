import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios";

export interface TextAnswer {
  text: string;
  code?: string;
}

export type Answer = string | TextAnswer;

export interface SubmitPayload {
  testId: string;
  score: number;
  percentage: number;
  isPassed: boolean;
  status: string;
  startTime: string;
  endTime: string;
  durationTaken: number;
  questions: string[];
  answers: Answer[];
}

export const useSubmitResult = () => {
  return useMutation({
    mutationFn: async (payload: SubmitPayload) => {
      const token = localStorage.getItem("token");
      const attemptId = localStorage.getItem("attemptId");

      if (!token) throw new Error("Login required");
      if (!attemptId) throw new Error("Attempt ID not found in localStorage");

      try {
        const res = await api.patch(`/api/test-attempts/submit/${attemptId}`, {
          testId: payload.testId,
          score: payload.score,
          percentage: payload.percentage,
          isPassed: payload.isPassed,
          status: payload.status,
          startTime: payload.startTime,
          endTime: payload.endTime,
          durationTaken: payload.durationTaken,
          questions: payload.questions,
          answers: payload.answers,
        });

        console.log("SUBMISSION RESPONSE →", res.data);

        return res.data;
      } catch (error: any) {
        console.error("Submit test error:", error);

        throw new Error(
          error?.response?.data?.message || "Failed to submit test"
        );
      }
    },
  });
};
