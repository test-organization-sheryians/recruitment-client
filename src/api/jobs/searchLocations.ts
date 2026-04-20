import api from "@/config/axios";

export const searchLocations = async (q: string): Promise<string[]> => {
  const res = await api.get("/api/jobs/location-suggestions", { params: { q } });
  return res.data.data; // string[]
};