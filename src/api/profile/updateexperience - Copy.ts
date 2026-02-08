import api from "@/config/axios";
import { Experience } from "@/types/Experience";

export const updateExperience = async (experienceData: Omit<Experience, 'id'> & { id: string }) => {
  const { id, ...data } = experienceData;
  const response = await api.put(`/api/experience/${id}`, data);
  return response.data;
};