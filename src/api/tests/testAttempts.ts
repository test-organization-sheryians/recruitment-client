import api from "@/config/axios";

export const startTestApi = async (testId: string) => {
  const response = await api.post("/test/start", { testId });
  return response.data;
};
