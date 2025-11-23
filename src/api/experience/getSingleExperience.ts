 import api from "@/config/axios";

export const getSingleExperience = async (data: any) => {
  const response = await api.get(`/api/experience/${data.id}`, data);
  return response.data;
};
