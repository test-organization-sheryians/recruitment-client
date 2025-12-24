// src/features/AITest/hooks/useResultTest.ts
import { useMutation } from "@tanstack/react-query";
import { submitTestApi, SubmitPayload } from "@/api";
import Cookies from "js-cookie";
import axios from "axios";

export const useSubmitResult = () => {
  return useMutation({
    mutationKey: ["submitTest"],

    mutationFn: async (payload: SubmitPayload) => {
      const token =
        Cookies.get("access") ||
        Cookies.get("token") ||
        localStorage.getItem("token");

      const attemptId = localStorage.getItem("attemptId");
      const storedEmail = localStorage.getItem("email");

      if (!token) throw new Error("Login required");
      if (!attemptId) throw new Error("Attempt ID not found");

      if (!payload.email && storedEmail) {
        payload.email = storedEmail;
      }

      try {
        const data = await submitTestApi(attemptId, payload);
        console.log("SUBMIT RESPONSE →", data);
        return data;
      } catch (error: unknown) {
        console.error("Submit test error:", error);

        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || "Failed to submit test"
          );
        }

        if (error instanceof Error) {
          throw new Error(error.message);
        }

        throw new Error("Something went wrong while submitting the test");
      }
    },
  });
};
