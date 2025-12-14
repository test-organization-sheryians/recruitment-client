// src/features/AITest/hooks/useResultTest.ts
import { useMutation } from "@tanstack/react-query";
import { submitTestApi, SubmitPayload } from "@/api";
import Cookies from "js-cookie";

export const useSubmitResult = () => {
  return useMutation({
    mutationKey: ["submitTest"],

    mutationFn: async (payload: SubmitPayload) => {
      // ✅ FIX — get token from cookies first
      const token =
        Cookies.get("access") ||
        Cookies.get("token") ||
        localStorage.getItem("token");

      const attemptId = localStorage.getItem("attemptId");
      const storedEmail = localStorage.getItem("email");

      if (!token) throw new Error("Login required");
      if (!attemptId) throw new Error("Attempt ID not found in localStorage");

      // ensure email is filled
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
