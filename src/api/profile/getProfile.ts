import api from "@/config/axios";
export const getProfile = async () => {
  const url = '/api/candidate-profile/get-profile';
  const res = await api.get(url);
  return res.data;
};