 import api from "@/config/axios";


export const updateExperience = async (data: any) => {
  const response = await api.patch(`/api/experience/${data.id}`, data);
  return response.data;
};
