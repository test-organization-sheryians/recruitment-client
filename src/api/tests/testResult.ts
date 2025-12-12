// src/api/submitTestAPI.ts

export interface SubmitPayload {
  testId: string;
  email: string;
  answers: string[];
}

export const submitTestAPI = async ({
  attemptId,
  payload,
}: {
  attemptId: string;
  payload: SubmitPayload;
}) => {
  const token = localStorage.getItem("token");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!token) throw new Error("You must login first!");
  if (!baseUrl) throw new Error("❌ NEXT_PUBLIC_API_BASE_URL missing");

  const res = await fetch(
    `${baseUrl}/api/test-attempts/submit/${attemptId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // testId + email + answers
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("❌ Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Failed to submit test");
  }

  return data;
};
