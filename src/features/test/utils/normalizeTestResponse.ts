
export interface NormalizedQuestion {
  question: string;
  options?: string[];
  correct?: number;
  difficulty?: string;
  explanation?: string;
}


interface RawQuestion {
  question?: unknown;
  options?: unknown;
  correct?: unknown;
  correctAnswer?: unknown;
  difficulty?: unknown;
  explanation?: unknown;
}

interface RawResponse {
  questions?: {
    test?: {
      questions?: unknown;
    };
  };
}


export const normalizeTestResponse = (res: unknown): NormalizedQuestion[] => {
  const response = res as RawResponse;

  const rawQuestions = response?.questions?.test?.questions;

  if (!Array.isArray(rawQuestions)) {
    console.error("❌ Questions array missing or invalid", res);
    return [];
  }

  return rawQuestions.map((q): NormalizedQuestion => {
    const rq = q as RawQuestion;

    return {
      question: typeof rq.question === "string" ? rq.question : "",

      options: Array.isArray(rq.options)
        ? rq.options.filter((o): o is string => typeof o === "string")
        : [],

      correct:
        typeof rq.correct === "number"
          ? rq.correct
          : typeof rq.correctAnswer === "number"
          ? rq.correctAnswer
          : undefined,

      difficulty:
        typeof rq.difficulty === "string"
          ? rq.difficulty
          : "intermediate",

      explanation:
        typeof rq.explanation === "string"
          ? rq.explanation
          : undefined,
    };
  });
};
