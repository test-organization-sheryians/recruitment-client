
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";


export const parseResumeAPI = async (file: File) => {
  const res = await fetch("/api/parse-resume", {
    method: "POST",
    body: file,
  }); //ihihihhihihi

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "PDF parsing failed");

  return data.text; 
};

// generate que
export const generateQuestionsAPI = async (resumeText: string) => {
  const token = Cookies.get("access");
  const res = await fetch("http://localhost:9000/api/ai/questionset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify({ resumeText }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (res.status === 401 || (data && (data.error === "Invalid or expired token." || data.message === "Invalid or expired token."))) {
    // Optionally, you can clear the token here: localStorage.removeItem("token");
    throw new Error("Invalid or expired token. Please login again.");
  }

  if (!res.ok || !data.success) {
    throw new Error(data.error || data.message || "Failed to get questions");
  }

  if (!data.questions) {
    throw new Error("No questions returned from server.");
  }

  return data.questions; // returns array of objects
};

// evalute ans
export const evaluateAnswersAPI = async ({
  questions,
  answers,
}: {
  questions: string[];
  answers: string[];
}) => {
  const token = Cookies.get("access");
  const res = await fetch("http://localhost:9000/api/ai/evaluateset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify({ questions, answers }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to evaluate answers");

  return data;
};



 //Parse Resume
export const useParseResume = () =>
  useMutation({
    mutationFn: parseResumeAPI,
  });

// generate question
export const useGenerateQuestions = () =>
  useMutation({
    mutationFn: generateQuestionsAPI,
  });

// evaluate answers
export const useEvaluateAnswers = () =>
  useMutation({
    mutationFn: evaluateAnswersAPI,
  });
