import { useGenerateQuestions } from "../hooks/aiTestApi";
import { useStartTest } from "../hooks/useStartsTest";

export const useQuestions = (mode: "resume" | "test") => {
  return mode === "resume" ? useGenerateQuestions() : useStartTest();
};
