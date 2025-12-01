import api from "@/config/axios";

export const updateProfile = async (data: string[]) => {
  const response = await api.patch("/api/candidate-profile/update-profile", {skills:data});
  return response.data;
};
