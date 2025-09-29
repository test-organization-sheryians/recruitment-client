import api from "@/config/axios";

export const postResume = async (data: string) => {
  const response = await api.post("/api/ai/resume", {
    resume: data
  })
  return response.data;
}