import api from "@/config/axios";

export const evaluateAnswersAPI = async ({
  questions,
  answers,
}: {
  questions: string[];
  answers: string[];
}) => {

  const res = await api.post("/api/ai/evaluateset",  JSON.stringify({ questions, answers }));
  const data = res
  // if (!res) throw new Error(data.error || "Failed to evaluate answers");

  return data;
};





