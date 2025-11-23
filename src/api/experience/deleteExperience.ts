 import api from "@/config/axios";


export const deleteExperience = async (data: any) => {
  const response = await api.delete(`/api/experience/${data.id}`, data);
  return response.data;
};
