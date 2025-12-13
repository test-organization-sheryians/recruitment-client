import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios";

interface StartTestPayload {
  testId: string;
}

interface StartTestResponse {
  attemptId: string;
  email: string;
}

export const useStartTest = () => {
  return useMutation({
    mutationFn: async ({ testId }: StartTestPayload): Promise<StartTestResponse> => {
      const res = await api.post("/api/test-attempts/start", { testId });

      console.log(
        "FULL START RESPONSE →",
        JSON.stringify(res.data, null, 2)
      );

      let attemptId = undefined;
      let email = undefined;

      // --------------------------------------------
      // TRY ALL POSSIBLE BACKEND RESPONSE STRUCTURES
      // --------------------------------------------

      // #1 → { attemptId, email }
      if (res.data?.attemptId) attemptId = res.data.attemptId;
      if (res.data?.email) email = res.data.email;

      // #2 → { data: { attemptId, email } }
      if (res.data?.data?.attemptId) attemptId = res.data.data.attemptId;
      if (res.data?.data?.email) email = res.data.data.email;

      // #3 → { data: { attempt: { _id, email } } }
      if (res.data?.data?.attempt?._id) attemptId = res.data.data.attempt._id;
      if (res.data?.data?.attempt?.email) email = res.data.data.attempt.email;

      // #4 → { data: { _id, email } }
      if (res.data?.data?._id) attemptId = res.data.data._id;
      if (res.data?.data?.email) email = res.data.data.email;

      // --------------------------------------------

      if (!attemptId) {
        console.error("❌ Could not extract attemptId. API response is:");
        console.error(res.data);
        throw new Error("Failed to read attemptId from API response");
      }

      // Save to localStorage
      localStorage.setItem("attemptId", attemptId);
      if (email) localStorage.setItem("email", email);

      return {
        attemptId,
        email: email ?? "",
      };
    },
  });
};
