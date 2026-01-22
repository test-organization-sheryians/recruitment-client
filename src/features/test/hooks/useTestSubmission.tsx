import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UseMutationResult } from "@tanstack/react-query";


interface Question {
  question: string;
  source?: "ai" | "test";
  options?: string[];
}

interface CandidateAnswer {
  text?: string;
  code?: string;
}

interface ApiAnswer {
  text: string;
}
interface EvaluateResponse {
  data: {
    score: number;
    percentage: number;
    feedback: string;
  };
}

interface SubmitResponse {
  success: boolean;
}


interface Props {
  questions: Question[];
  answers: CandidateAnswer[];
  step: number;
  activeQuestion: Question | null;
  text: string;
  code: string;
  blocked: boolean;
  secondsLeft: number;
  testDuration: number;
 evaluateMutation: UseMutationResult<
  EvaluateResponse,
  unknown,
  { questions: string[]; answers: string[] }
>;

submitMutation: UseMutationResult<
  SubmitResponse,
  unknown,
  {
    attemptId: string;
    testId: string;
    email: string;
    questions: string[];
    answers: ApiAnswer[];
    score: number;
    percentage: number;
    isPassed: boolean;
    status: string;
    startTime: string;
    endTime: string;
    durationTaken: number;
  }
>;

  setIsSubmitting: (v: boolean) => void;
}

const isMCQ = (q?: Question | null): boolean =>
  Array.isArray(q?.options);


export function useTestSubmission({
  questions,
  answers,
  blocked,
  secondsLeft,
  testDuration,
  evaluateMutation,
  submitMutation,
  setIsSubmitting,
}: Omit<Props,
  "step" | "text" | "code" | "activeQuestion"
>) {
  const router = useRouter();

  const submitTest = useCallback(async () => {
    if (blocked) return;

    const aiQ: string[] = [];
    const aiA: string[] = [];
    const fullAiAns: CandidateAnswer[] = [];
    const tq: string[] = [];
    const ta: ApiAnswer[] = [];

    questions.forEach((q, i) => {
      const ans = answers[i] || {};
      const value = ans.text || ans.code || "";

      if (q.source === "ai") {
        aiQ.push(q.question);
        aiA.push(value);
        fullAiAns.push(ans);
      } else {
        tq.push(q.question);
        ta.push({ text: value });
      }
    });

    if (aiQ.length) {
      const res = await evaluateMutation.mutateAsync({
        questions: aiQ,
        answers: aiA,
      });

      sessionStorage.setItem(
        "resumeResult",
        JSON.stringify({
          questions: aiQ,
          answers: fullAiAns,
          score: res.data.score,
          percentage: res.data.percentage,
          feedback: res.data.feedback,
        })
      );

      setIsSubmitting(false);
      router.push("/candidate/ai-test/result");
      return;
    }

    submitMutation.mutate(
      {
        attemptId: localStorage.getItem("attemptId") ?? "",
        testId: localStorage.getItem("testId") ?? "",
        email: localStorage.getItem("email") ?? "",
        questions: tq,
        answers: ta,
        score: 0,
        percentage: 0,
        isPassed: false,
        status: "Submitted",
        startTime: localStorage.getItem("startTime") ?? "",
        endTime: new Date().toISOString(),
        durationTaken: testDuration * 60 - secondsLeft,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          router.push("/candidate/ai-test/submitted");
        },
        onError: () => setIsSubmitting(false),
      }
    );
  }, [
    blocked,
    answers,
    questions,
    secondsLeft,
    testDuration,
    evaluateMutation,
    submitMutation,
    router,
    setIsSubmitting,
  ]);

  return { submitTest };
}
