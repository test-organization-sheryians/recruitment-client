import api from "@/config/axios";

export const searchJobTitles = async (q: string): Promise<string[]> => {
  const res = await api.get("/api/jobs/suggestions", { params: { q } });
  return res.data.data; // string[]
};