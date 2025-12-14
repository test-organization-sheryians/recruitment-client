
import api from "@/config/axios";

export interface StartTestResponse {
  attemptId: string;
  testId: string;
  email?: string;
  duration?: number;
  startTime: string;          
  message?: string;
  questions?: any[];
}

export const startTestApi = async (
  testIdFromRoute: string
): Promise<StartTestResponse> => {
  const res = await api.post("/api/test-attempts/start", {
    testId: testIdFromRoute,
  });

  console.log("res →", res.data);


  const testId =
    res.data?.testId ||
    res.data?.data?.testId ||
    testIdFromRoute;

 
  const duration =
    res.data?.questions?.test?.duration ??
    res.data?.data?.questions?.test?.duration;


  const attemptId =
    res.data?.attemptId ||
    res.data?._id ||
    res.data?.data?.attemptId ||
    res.data?.data?._id ||
    res.data?.data?.attempt?._id;

  const email =
    res.data?.email ||
    res.data?.data?.email ||
    res.data?.data?.attempt?.email;

  const questions =
    res.data?.questions ||
    res.data?.data?.questions ||
    res.data?.data?.attempt?.questions;

  const startTime =
    res.data?.startTime ||
    res.data?.data?.startTime ||
    new Date().toISOString(); 


  if (!attemptId) {
    throw new Error("Attempt ID not found in API response");
  }

  if (!testId) {
    throw new Error("Test ID not found in API response");
  }


  localStorage.setItem("attemptId", attemptId);
  localStorage.setItem("testId", testId);
  localStorage.setItem("startTime", startTime);

  if (email) localStorage.setItem("email", email);
  if (duration) localStorage.setItem("duration", String(duration));
  if (questions) {
    localStorage.setItem("activeQuestions", JSON.stringify(questions));
  }

  return {
    attemptId,
    testId,
    email,
    duration,
    startTime,         
    message: res.data?.message,
    questions,
  };
};
