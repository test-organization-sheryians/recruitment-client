import api from "@/config/axios";
export const patchProfile = async (userId: string, data: unknown) => {
  const res = await api.patch(`/api/candidate-profile/${userId}`, data);
  return res.data;
};