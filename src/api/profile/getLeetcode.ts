import api from "@/config/axios";

export const getLeetcode = async ({ user }: { user: string }) => {
  const response = await api.get(`/api/candidate-profile/getLeetcodeDetails/${user}`,{
    withCredentials: false 
  })
  return response.data;
};