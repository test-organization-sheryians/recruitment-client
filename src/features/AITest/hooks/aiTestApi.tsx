import { evaluateAnswersAPI } from "@/api/AITest/evaluteAns";
import { parseResumeAPI } from "@/api/AITest/parseResume.";
import { generateQuestionsAPI } from "@/api/AITest/questionGen";
import { useMutation } from "@tanstack/react-query";


// export const parseResumeAPI = async (file: File) => {
//   const res = await fetch("/api/parse-resume", {
//     method: "POST",
//     body: file,
//   }); //ihihihhihihi

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "PDF parsing failed");

//   return data.text; 
// };

// // generate que
// export const generateQuestionsAPI = async (resumeText: string) => {
//   const res = await fetch("http://localhost:9000/api/ai/questionset", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     body: JSON.stringify({ resumeText }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Failed to get questions");

//   return data.questions; // returns array of objects
// };

// // evalute ans
// export const evaluateAnswersAPI = async ({
//   questions,
//   answers,
// }: {
//   questions: string[];
//   answers: string[];
// }) => {
//   const res = await fetch("http://localhost:9000/api/ai/evaluateset", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     body: JSON.stringify({ questions, answers }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Failed to evaluate answers");

//   return data;
// };



//  //Parse Resume
// export const useParseResume = () =>
//   useMutation({
//     mutationFn: parseResumeAPI,
//   });

// // generate question
// export const useGenerateQuestions = () =>
//   useMutation({
//     mutationFn: generateQuestionsAPI,
//   });

// // evaluate answers
// export const useEvaluateAnswers = () =>
//   useMutation({
//     mutationFn: evaluateAnswersAPI,
//   });




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
    mutationFn: (resumeData: any) => generateQuestionsAPI(resumeData),
    retry: 0,
  });
};

// Evaluate Answers
export const useEvaluateAnswers = () => {
  return useMutation({
    mutationKey: ["evaluateAnswers"],
    mutationFn: (answersPayload: any) => evaluateAnswersAPI(answersPayload),
    retry: 0,
  });
};
