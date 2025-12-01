
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
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:9000";
  const token = Cookies.get("access");

  const url = `${base.replace(/\/$/, "")}/api/ai/questionset`;

  // If there's no client-accessible token, use credentials include so the server-set httpOnly cookie is sent.
  const useCredentials = !token;

  if (token) console.debug("generateQuestionsAPI: using client token:", token);
  else console.debug("generateQuestionsAPI: no client token, sending credentials to include httpOnly cookie");

  const res = await fetch(url, {
    method: "POST",
    credentials: useCredentials ? "include" : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ resumeText }),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  const body = (data as { message?: string; error?: string; questions?: unknown });

  if (!res.ok) {
    // Log server details to help debug 401s
    console.debug("generateQuestionsAPI: server responded", res.status, body);

    if (res.status === 401) {
      throw new Error(body?.message || body?.error || "Unauthorized (401). Token invalid or expired.");
    }

    throw new Error(body?.error || body?.message || `Failed to get questions (status ${res.status})`);
  }
  if (!body || !body.questions) {
    throw new Error("No questions returned from server.");
  }

  return body.questions as unknown[]; // returns array of objects
};

// evalute ans
export const evaluateAnswersAPI = async ({
  questions,
  answers,
}: {
  questions: string[];
  answers: string[];
}) => {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:9000";
  const token = Cookies.get("access");
  const url = `${base.replace(/\/$/, "")}/api/ai/evaluateset`;
  const useCredentials = !token;

  if (token) console.debug("evaluateAnswersAPI: using client token:", token);
  else console.debug("evaluateAnswersAPI: no client token, sending credentials to include httpOnly cookie");

  const res = await fetch(url, {
    method: "POST",
    credentials: useCredentials ? "include" : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ questions, answers }),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  const body = data as { message?: string; error?: string; evaluations?: unknown; total?: unknown };

  if (!res.ok) {
    console.debug("evaluateAnswersAPI: server responded", res.status, body);
    if (res.status === 401) {
      throw new Error(body?.message || body?.error || "Unauthorized (401). Token invalid or expired.");
    }
    throw new Error(body?.error || body?.message || `Failed to evaluate answers (status ${res.status})`);
  }

  return body;
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
