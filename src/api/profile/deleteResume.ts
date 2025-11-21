import api from "@/config/axios";

export const deleteResume = async () => {
  const response = await api.delete("/api/candidate-profile/delete-resume");
  return response.data;
};
