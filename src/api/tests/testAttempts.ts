// src/api/testAttempts.ts
import api from "@/config/axios";
// import { Answer } from "../../features/test/hooks/useResultTest"; // REMOVED IMPORT causing export error

// FIX: Define the Answer interface here, based on the required type (TextAnswer/Answer requires text: string)
export interface Answer {
    text: string;
}

export interface SubmitPayload {
  testId: string;
  score: number;
  percentage: number;
   attemptId: string; 
  email: string;
  isPassed: boolean;
  status: string;
  startTime: string;
  endTime: string;
  durationTaken: number;
  questions: string[];
  answers: Answer[]; // Now correctly uses the defined Answer interface
}

export const submitTestApi = async (attemptId: string, payload: SubmitPayload) => {
  const res = await api.patch(`/api/test-attempts/submit/${attemptId}`, {
    testId: payload.testId,
    email: payload.email,
    score: payload.score,
    percentage: payload.percentage,
    isPassed: payload.isPassed,
    status: payload.status,
    startTime: payload.startTime,
    endTime: payload.endTime,
    durationTaken: payload.durationTaken,
    questions: payload.questions,
    answers: payload.answers,
  });

  return res.data;
};