import api from "@/config/axios";

export const verifyUser = async (userId: string) => {
  const response = await api.post(`/api/auth/update?id=${userId}`, {isVerified:true});
  return response.data;
};