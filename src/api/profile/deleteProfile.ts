import api from "@/config/axios";
export const deleteProfile = async (userId: string) => {
  const res = await api.delete(`/api/candidate-profile/${userId}`);
  return res.data;
};