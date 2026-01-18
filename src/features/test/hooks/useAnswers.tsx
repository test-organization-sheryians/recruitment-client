import { useEffect, useState } from "react";

interface Question {
  options?: string[];
}

interface CandidateAnswer {
  text?: string;
  code?: string;
}

const isMCQ = (q: Question | null | undefined): q is Question =>
  Array.isArray(q?.options);

export function useAnswers(
  activeQuestion: Question | null,
  step: number
) {
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);
  const [text, setText] = useState(""); 
  const [code, setCode] = useState("");

  // 🔁 Sync text/code when step changes
  useEffect(() => {
    const prev = answers[step];
    setText(prev?.text ?? "");
    setCode(prev?.code ?? "");
  }, [step, answers]);

 // 📦 build current answer safely
  const buildAnswer = (): CandidateAnswer =>
    isMCQ(activeQuestion) ? { text } : { text, code };

  // 💾 commit answer
  const saveAnswer = () => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = buildAnswer();
      return next;
    });
  };
;

   // 🧠 derived helpers
  const currentAnswer = buildAnswer();
  const savedAnswer = answers[step];

  const hasSavedAnswer =
    Boolean(savedAnswer?.text?.trim()) ||
    Boolean(savedAnswer?.code?.trim());

  const isDirty =
    (savedAnswer?.text ?? "") !== text ||
    (savedAnswer?.code ?? "") !== code;

  return {
    answers,

    // editor state
    text,
    setText,
    code,
    setCode,

    // actions
    saveAnswer,

    // helpers
    currentAnswer,
    hasSavedAnswer,
    isDirty,
  };
}
