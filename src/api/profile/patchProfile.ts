import api from "@/config/axios";
export const patchProfile = async (userId: string, data: any) => {
  const res = await api.patch(`/api/candidate-profile/${userId}`, data);
  return res.data;
};