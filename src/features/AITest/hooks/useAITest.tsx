import { postResumeAndGenerateQuestions } from '@/api/AITest/postResumeAndGenerateQuestions';
import { reportViolationAPI, ViolationPayload } from '@/api/AITest/testViolation';
import { useMutation } from '@tanstack/react-query';

interface GenerateQuestionsParams {
  data: FormData;
  onProgress: (progress: number) => void;
}

const useAITest = () => {
  const postResumeAndGenerateQuestionsMutation = useMutation({
    mutationKey: ["postResumeAndGenerateQuestions"],
    mutationFn: async ({ data, onProgress }: GenerateQuestionsParams) => {
      return postResumeAndGenerateQuestions(data, onProgress);
    },
  });

  const reportViolationMutation = useMutation({
    mutationKey: ['reportViolation'],
    mutationFn: async (payload : ViolationPayload) => reportViolationAPI(payload),
    onSuccess: (data)=>{
      console.log("Violation Reported!", data)
    },
  });


  return {
    postResumeAndGenerateQuestionsMutation,
    reportViolationMutation,
  };
}

export default useAITest
