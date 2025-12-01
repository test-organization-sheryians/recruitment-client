import api from "@/config/axios";

export const generateQuestionsAPI = async (resumeText: string) => {
  const res = await api.post(
    "/api/ai/questionset",
    { resumeText }, // request body
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  if (!res.data || !res.data.questions) {
    throw new Error(res.data?.error || "Failed to get questions");
  }

  return res.data.questions;
};
