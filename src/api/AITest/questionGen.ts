import api from "@/config/axios";

export const generateQuestionsAPI = async (resumeText: string) => {
  const res = await api.post(
    "/api/ai/questionset",
      {resumeText }
  );

  if (!res.data || !res.data.questions) {
    throw new Error(res.data?.error || "Failed to generate questions");
  }

  return res.data.questions;
};
