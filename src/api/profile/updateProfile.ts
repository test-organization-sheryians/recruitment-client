import api from "@/config/axios";

export const updateProfile = async (data: any) => {
  const response = await api.patch("/api/candidate/update-profile", data);
  return response.data;
};
