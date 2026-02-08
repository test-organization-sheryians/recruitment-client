import api from "@/config/axios";

export const deleteExperience = async (id: string) => {
  const response = await api.delete(`/api/experience/${id}`);
  return response.data;
};