import { useMutation } from "@tanstack/react-query";

export const useStartTest = () => {
  return useMutation({
    mutationFn: async ({ testId }: { testId: string }) => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // <-- corrected name

      if (!baseUrl) {
        console.error("❌ Env variable NEXT_PUBLIC_API_BASE_URL missing");
        throw new Error("Missing environment variable");
      }

      const res = await fetch(`${baseUrl}/api/test-attempts/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ testId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => {});
        throw new Error(err?.message || "Failed to start test");
      }

      return res.json();
    },
  });
};
