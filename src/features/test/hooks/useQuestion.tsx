import { useEffect, useState } from "react";

interface Question {
  question: string;
  options?: string[];
  source?: "ai" | "test";
}

export function useTestQuestions(rqQuestions: Question[] | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
      if (loaded) return;

    if (Array.isArray(rqQuestions) && rqQuestions.length) {
      setQuestions(rqQuestions);
      setLoaded(true); // 🔑 reset safely
      return;
    }
  const stored = localStorage.getItem("activeQuestions");
    if (!stored) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setQuestions(parsed);
      }
    } catch {
      setQuestions([]);
    } finally {
      setLoaded(true);
    }
  }, [rqQuestions, loaded]);

  return {
    questions,
    loaded,
    total: questions.length,
  };
}
