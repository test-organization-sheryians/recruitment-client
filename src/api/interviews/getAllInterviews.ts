import api from "@/config/axios/index";

export const getAllInterviews = async () => {
  const response = await api.get("/api/interviews/all");
  return response.data;
};

