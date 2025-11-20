import api from "@/config/axios";
export const getProfile = async () => {
  const res = await api.get(`/api/candidate-profile/get-profile`);
  return res.data;
};