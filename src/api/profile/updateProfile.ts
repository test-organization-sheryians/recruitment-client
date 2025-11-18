import api from "@/config/axios";
export const updateProfile = async (userId: string, data: unknown) => {
  const res = await api.put(`/api/candidate-profile/${userId}`, data);
  return res.data;
};