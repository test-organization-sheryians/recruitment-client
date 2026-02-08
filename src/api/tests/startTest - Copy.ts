import axios, { AxiosError } from "axios";
import api from "@/config/axios";

/* ================= TYPES ================= */

export interface TestQuestion {
  question: string;
  options?: string[];
  source?: "ai" | "test";
  [key: string]: unknown;
}

export interface StartTestResponse {
  attemptId: string;
  testId: string;
  email?: string;
  duration?: number;
  startTime: string;
  message?: string;
  questions?: TestQuestion[];
}

/* ================= API ================= */

export const startTestApi = async (
  testIdFromRoute: string
): Promise<StartTestResponse> => {
  try {
    const res = await api.post("/api/test-attempts/start", {
      testId: testIdFromRoute,
    });

    const raw = res.data;

    const attemptId =
      raw?.attemptId ||
      raw?._id ||
      raw?.data?.attemptId ||
      raw?.data?._id ||
      raw?.data?.attempt?._id;

    const testId =
      raw?.testId ||
      raw?.data?.testId ||
      testIdFromRoute;

    const email =
      raw?.email ||
      raw?.data?.email ||
      raw?.data?.attempt?.email;

    const duration =
      raw?.questions?.test?.duration ??
      raw?.data?.questions?.test?.duration ??
      0;

    const startTime =
      raw?.startTime ||
      raw?.data?.startTime ||
      new Date().toISOString();

    const questions: TestQuestion[] =
      raw?.questions?.test?.questions ||
      raw?.data?.questions?.test?.questions ||
      raw?.questions ||
      raw?.data?.questions ||
      [];

    if (!attemptId) throw new Error("Attempt ID not found");
    if (!testId) throw new Error("Test ID not found");

    /* ================= SIDE EFFECTS ================= */

    localStorage.setItem("attemptId", attemptId);
    localStorage.setItem("testId", testId);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("duration", String(duration));
    if (email) localStorage.setItem("email", email);
    localStorage.setItem("activeQuestions", JSON.stringify(questions));

    return {
      attemptId,
      testId,
      email,
      duration,
      startTime,
      message: raw?.message,
      questions,
    };

  } catch (err: unknown) {
  
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message?: string }>;
  

      if (axiosError.response?.status === 409) {
        throw new Error(
          axiosError.response.data?.message ||
          "Test already started"
        );
      }
    }
    throw err;
  }
};
