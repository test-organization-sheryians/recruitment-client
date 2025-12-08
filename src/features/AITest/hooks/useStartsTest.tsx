// useStartTest.ts
import { useMutation } from "@tanstack/react-query";

export const useStartTest = () => {
  return useMutation({
    mutationFn: async ({ testId }: { testId: string }) => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      console.log(" Base URL:", baseUrl);
      console.log(" testId Going:", testId);
      console.log(" token:", token);

      if (!token) {
        throw new Error("You must login first!");
      }

      if (!baseUrl) {
        throw new Error("❌ NEXT_PUBLIC_API_BASE_URL missing");
      }

      const res = await fetch(`${baseUrl}/api/test-attempts/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // always send formatted bearer
        },
        body: JSON.stringify({ testId }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("❌ Invalid server response");
      }

      console.log("📩 Backend Response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to start test");
      }

      return data;
    },
  });
};
