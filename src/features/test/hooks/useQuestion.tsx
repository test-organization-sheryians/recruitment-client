import { useEffect, useState } from "react";

interface Question {
  question: string;
  options?: string[];
  source?: "ai" | "test";
}

export function useTestQuestions(rqQuestions?: Question[]) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (rqQuestions?.length) {
      setQuestions(rqQuestions);
      localStorage.setItem("activeQuestions", JSON.stringify(rqQuestions));
      return;
    }

    const stored = localStorage.getItem("activeQuestions");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
  }, [rqQuestions]);

  return {
    questions,
    loaded: questions.length > 0,
    total: questions.length,
  };
}

