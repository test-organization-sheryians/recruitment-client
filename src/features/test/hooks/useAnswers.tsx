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
  step: number,
  persistedAnswers : CandidateAnswer[],
) {
const [text, setText] = useState("");
const [code, setCode] = useState("");

useEffect(() => {
  const prev = persistedAnswers?.[step];
  setText(prev?.text ?? "");
  setCode(prev?.code ?? "");
}, [step, persistedAnswers]);


   // 🧠 derived helpers
const savedAnswer = persistedAnswers?.[step];

const isDirty =
  (savedAnswer?.text ?? "") !== text ||
  (savedAnswer?.code ?? "") !== code;

const hasSavedAnswer =
  Boolean(savedAnswer?.text?.trim()) ||
  Boolean(savedAnswer?.code?.trim());


  return {

    // editor state
    text,
    setText,
    code,
    setCode,

    // helpers
    isDirty,
    hasSavedAnswer,
  };
}
