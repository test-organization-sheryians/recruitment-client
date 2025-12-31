import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { AxiosError } from "axios";


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
   const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
       mutationFn: async ({ testId }: { testId: string }) => {
      const res = await api.startTestApi(testId);

      if ( !res.attemptId) {
          throw new Error(
          res.message || "You cannot start this assessment"
        );
      }

      return res;
    },


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

      toast.success("Test started successfully!");
      router.push("/candidate/ai-test/questining");
    },
     onError: (error: unknown) => {
      let msg = "Failed to start test";

      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      toast.error(msg);
    },
  });
};
