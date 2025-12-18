import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { useRouter } from "next/navigation";


interface TestQuestion {
  question: string;
  options?: string[];
}

interface NestedTest {
  questions?: TestQuestion[];
  enrollments?: number;
}

interface QuestionsWithTest {
  test?: NestedTest;
}

interface WrappedResponse {
  questions?: QuestionsWithTest | TestQuestion[];
  data?: {
    questions?: QuestionsWithTest;
  };
  duration?: number;
  email?: string;
  attemptId: string;
}


const hasTestBlock = (
  questions?: QuestionsWithTest | TestQuestion[]
): questions is QuestionsWithTest =>
  typeof questions === "object" &&
  !!questions &&
  "test" in questions;

const isWrapped = (
  res: WrappedResponse
): res is WrappedResponse & { data: { questions?: QuestionsWithTest } } =>
  typeof res === "object" && !!res && "data" in res;


export const useStartTest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ testId }: { testId: string }) =>
      api.startTestApi(testId),

    onSuccess: (res: api.StartTestResponse | WrappedResponse) => {

      const enrollments = hasTestBlock(res.questions)
        ? res.questions.test?.enrollments
        : isWrapped(res)
        ? res.data?.questions?.test?.enrollments
        : undefined;


      const activeQuestions = hasTestBlock(res.questions)
        ? res.questions.test?.questions
        : res.questions;

      queryClient.setQueryData(
        ["active-questions"],
        activeQuestions
      );


      queryClient.setQueryData(["test-meta"], {
        duration: res.duration ?? 0,
        enrollments: enrollments ?? [],
        email: res.email ?? "",
        attemptId: res.attemptId,
      });


      router.push("/candidate/ai-test/questining");
    },
  });
};
