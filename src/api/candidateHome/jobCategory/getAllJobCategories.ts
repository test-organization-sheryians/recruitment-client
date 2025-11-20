import api from "@/config/axios";

export const getAllJobCategories = async () => {
  const res = await api.get("/api/job-categories");
  return res.data;
};
