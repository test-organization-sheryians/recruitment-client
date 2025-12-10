// useSubmitResult.ts
import { useMutation } from "@tanstack/react-query";

export const useSubmitResult = () => {
  return useMutation({
    mutationFn: async ({
      attemptId,
      answers,
    }: {
      attemptId: string;
      answers: any; // array or object received from frontend
    }) => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      console.log("📌 Base URL:", baseUrl);
      console.log("📌 attemptId Going:", attemptId);
      console.log("📌 token:", token);
      console.log("📌 answers submitting:", answers);

      if (!token) {
        throw new Error("You must login first!");
      }

      if (!baseUrl) {
        throw new Error("❌ NEXT_PUBLIC_API_BASE_URL missing");
      }

      const res = await fetch(
        `${baseUrl}/api/test-attempts/submit/${attemptId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("❌ Invalid server response");
      }

      console.log("📩 Backend Submit Response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit test");
      }

      return data;
    },
  });
};
   