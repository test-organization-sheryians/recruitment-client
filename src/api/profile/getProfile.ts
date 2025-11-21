import api from "@/config/axios";
export const getProfile = async (userId: string) => {
  const res = await api.get(`/api/candidate-profile/get-profile`);
  return res.data;
};