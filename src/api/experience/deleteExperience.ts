 import api from "@/config/axios";


export const deleteExperience = async (data: { id: string }) => {
  const response = await api.delete(`/api/experience/${data.id}`);
  return response.data;
};

