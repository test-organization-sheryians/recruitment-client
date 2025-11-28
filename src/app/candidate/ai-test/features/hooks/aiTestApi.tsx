import { useMutation } from "@tanstack/react-query";

//
// 1️⃣ RAW API FUNCTIONS
//

// Parse PDF API
export const parseResumeAPI = async (file: File) => {
  const res = await fetch("/api/parse-resume", {
    method: "POST",
    body: file,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "PDF parsing failed");

  return data.text; // return extracted text
};

// Generate Questions API
export const generateQuestionsAPI = async (resumeText: string) => {
  const res = await fetch("http://localhost:9000/api/ai/questionset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ resumeText }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to get questions");

  return data.questions; // returns array of objects
};

// Evaluate Answers API
export const evaluateAnswersAPI = async ({
  questions,
  answers,
}: {
  questions: string[];
  answers: string[];
}) => {
  const res = await fetch("http://localhost:9000/api/ai/evaluateset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ questions, answers }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to evaluate answers");

  return data;
};

//
// 2️⃣ TANSTACK QUERY HOOKS
//

// 🔵 Parse Resume Hook
export const useParseResume = () =>
  useMutation({
    mutationFn: parseResumeAPI,
  });

// 🟢 Generate Questions Hook
export const useGenerateQuestions = () =>
  useMutation({
    mutationFn: generateQuestionsAPI,
  });

// 🔴 Evaluate Answers Hook
export const useEvaluateAnswers = () =>
  useMutation({
    mutationFn: evaluateAnswersAPI,
  });
