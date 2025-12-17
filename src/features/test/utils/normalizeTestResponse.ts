// utils/normalizeTestResponse.ts

export interface NormalizedQuestion {
  question: string;
  options?: string[];
  correct?: number;
  difficulty?: string;
  explanation?: string;
}

export const normalizeTestResponse = (res: any) => {
  const rawQuestions = res?.questions?.test?.questions;

  if (!Array.isArray(rawQuestions)) {
    console.error("❌ Questions array missing or invalid", res);
    return [];
  }

  return rawQuestions.map((q: any) => ({
    question: q.question,

    options: Array.isArray(q.options) ? q.options : [],

    // 🔥 IMPORTANT FIX
    correct:
      typeof q.correct === "number"
        ? q.correct
        : typeof q.correctAnswer === "number"
        ? q.correctAnswer
        : undefined,

    difficulty: q.difficulty ?? "intermediate",

    explanation: q.explanation ?? undefined,
  }));
};
