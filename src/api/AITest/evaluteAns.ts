import api from "@/config/axios";

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
