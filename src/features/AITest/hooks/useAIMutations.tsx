import { postResumeAndGenerateQuestions } from "@/api/AITest";
import { useMutation } from "@tanstack/react-query";

interface GenerateQuestionsParams {
  data: FormData;
  onProgress: (progress: number) => void;
}

const useAIMutations = () => {

  const postResumeAndGenerateQuestionsMutation = useMutation({
    mutationKey: ["postResumeAndGenerateQuestions"],
    mutationFn: async ({ data, onProgress }: GenerateQuestionsParams) => {
      return postResumeAndGenerateQuestions(data, onProgress);
    },
  });

  return {
    postResumeAndGenerateQuestionsMutation,
  };
  
};

export default useAIMutations;
