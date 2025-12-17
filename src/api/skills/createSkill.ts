import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios";

interface StartTestPayload {
  testId: string;
}

interface StartTestResponse {
  attemptId: string;
  message?: string;
}

export const useStartTest = () => {
  return useMutation({
    mutationFn: async ({ testId }: StartTestPayload): Promise<StartTestResponse> => {
      try {
        const res = await api.post("/api/test-attempts/start", { testId });

        // backend returns _id → convert to attemptId
        const attemptId = res.data?._id;

        if (!attemptId) {
          throw new Error("Attempt ID not received from server");
        }

        // store in localStorage
        localStorage.setItem("attemptId", attemptId);

        // console.log attempt id (your request)
        console.log("🎯 Attempt Started — ID:", attemptId);

        return {
          attemptId,
          message: res.data?.message,
        };
      } catch (error: any) {
        console.error("Start test error:", error);

        throw new Error(
          error?.response?.data?.message || "Failed to start test"
        );
      }
    },
  });
};
