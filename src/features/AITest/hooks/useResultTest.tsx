import { useMutation } from "@tanstack/react-query";

export interface TextAnswer {
  text: string;
  code?: string;
}

export type Answer = string | TextAnswer;

export interface SubmitPayload {
  attemptId: string;
  testId: string;
  email: string;
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!token) throw new Error("Login required");
      if (!baseUrl) throw new Error("API base URL missing");

      const res = await fetch(
        `${baseUrl}/api/test-attempts/submit/${payload.attemptId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            testId: payload.testId,
            email: payload.email,
            score: payload.score,
            percentage: payload.percentage,
            isPassed: payload.isPassed,
            status: payload.status,
            startTime: payload.startTime,
            endTime: payload.endTime,
            durationTaken: payload.durationTaken,
            questions: payload.questions,
            answers: payload.answers,
          }),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit test");
      }

      return data;
    },
  });
};
