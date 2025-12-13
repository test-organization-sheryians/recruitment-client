// useStartTest.ts
import { useMutation } from "@tanstack/react-query";

export const useStartTest = () => {
  return useMutation({
    mutationFn: async ({ testId }: { testId: string }) => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${baseUrl}/api/test-attempts/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testId }), // ONLY TESTID NOW
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to start test");

      return data; // contains attemptId
    },
  });
};
