import { useMutation } from "@tanstack/react-query";


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

// evalute ans
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
