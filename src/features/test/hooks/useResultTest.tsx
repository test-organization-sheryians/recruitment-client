// src/features/AITest/hooks/useResultTest.ts
import { useMutation } from "@tanstack/react-query";
import { submitTestApi, SubmitPayload } from "@/api";

export const useSubmitResult = () => {
  return useMutation({
    mutationKey: ["submitTest"],

    mutationFn: async (payload: SubmitPayload) => {
      const token = localStorage.getItem("token");
      const attemptId = localStorage.getItem("attemptId");
      const storedEmail = localStorage.getItem("email");

      if (!token) throw new Error("Login required");
      if (!attemptId) throw new Error("Attempt ID not found in localStorage");

      if (!payload.email && storedEmail) {
        payload.email = storedEmail;
      }

      try {
        const data = await submitTestApi(attemptId, payload);
        console.log("SUBMIT RESPONSE →", data);
        return data;
      } catch (error: any) {
        console.error("Submit test error:", error);
        throw new Error(
          error?.response?.data?.message || "Failed to submit test"
        );
      }
    },
  });
};
