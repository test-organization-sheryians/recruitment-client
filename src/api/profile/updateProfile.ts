import api from "@/config/axios";

export const updateProfile = async (data: { resumeFile?: string | null; skills?: string[] | null }) => {
  const response = await api.patch("/api/candidate-profile/update-profile", data);
  return response.data;
};
