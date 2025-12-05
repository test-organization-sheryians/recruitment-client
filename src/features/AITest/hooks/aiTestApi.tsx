// src/hooks/AITestHooks.ts

import { useMutation } from "@tanstack/react-query";
import { evaluateAnswersAPI } from "@/api/AITest/evaluteAns";
import { parseResumeAPI } from "@/api/AITest/parseResume.";
import { generateQuestionsAPI } from "@/api/AITest/questionGen";

// ---------- TYPES ----------
export type GenerateQuestionsPayload  = string

export interface EvaluateAnswersPayload {
  questions: string[];
  answers: string[];
}

// ---------- HOOKS ----------

// Parse Resume
export const useParseResume = () => {
  return useMutation({
    mutationKey: ["parseResume"],
    mutationFn: (file: File) => parseResumeAPI(file),
    retry: 0,
  });
};

// Generate Questions
export const useGenerateQuestions = () => {
  return useMutation({
    mutationKey: ["generateQuestions"],
    mutationFn: (payload: GenerateQuestionsPayload) =>
      generateQuestionsAPI(payload), // FULL PAYLOAD
    retry: 0,
  });
};

// Evaluate Answers
export const useEvaluateAnswers = () => {
  return useMutation({
    mutationKey: ["evaluateAnswers"],
    mutationFn: (payload: EvaluateAnswersPayload) =>
      evaluateAnswersAPI(payload), // FULL PAYLOAD
    retry: 0,
  });
};
