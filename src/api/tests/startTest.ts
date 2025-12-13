// src/api/tests.ts
import api from "@/config/axios";

export interface StartTestResponse {
  attemptId: string;
  email?: string;
  message?: string;
  questions?: any[];
}

export const startTestApi = async (testId: string): Promise<StartTestResponse> => {
  const res = await api.post("/api/test-attempts/start", { testId });

  console.log("🔥 START TEST RAW RESPONSE →", res.data);

  // Extract attemptId
  let attemptId =
    res.data?.attemptId ||
    res.data?._id ||
    res.data?.data?.attemptId ||
    res.data?.data?._id ||
    res.data?.data?.attempt?._id;

  let email =
    res.data?.email ||
    res.data?.data?.email ||
    res.data?.data?.attempt?.email;

  const questions =
    res.data?.questions ||
    res.data?.data?.questions ||
    res.data?.data?.attempt?.questions;

  if (!attemptId) throw new Error("Attempt ID not found in API response");

  localStorage.setItem("attemptId", attemptId);
  if (email) localStorage.setItem("email", email);
  localStorage.setItem("startTime", new Date().toISOString());


  if (questions) {
    localStorage.setItem("activeQuestions", JSON.stringify(questions));
  }

  return { attemptId, email, message: res.data?.message, questions };
};
