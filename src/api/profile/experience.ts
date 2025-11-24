import api from "@/config/axios";
import { Experience } from "@/types/Experience";

interface ApiError extends Error {
  response?: {
    data: {
      message?: string;
    };
  };
}
export const getExperiences = async (id: string): Promise<Experience[]> => {
  try {
    const response = await api.get<Experience[]>(`/api/experience/candidate/${id}`);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.response?.data?.message || 'Failed to fetch experiences');
  }
};
export const createExperience = async (data: Omit<Experience, 'id'>): Promise<Experience> => {
  try {
    const response = await api.post<Experience>("/api/experience", data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.response?.data?.message || 'Failed to create experience');
  }
};

export const updateExperience = async (data: Experience): Promise<Experience> => {
  if (!data._id) {
    throw new Error("Experience ID is required for update");
  }
  const { _id, ...updateData } = data;
  
  try {
    const response = await api.put<Experience>(`/api/experience/${_id}`, updateData);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.response?.data?.message || 'Failed to update experience');
  }
};
export const deleteExperience = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("Experience ID is required for deletion");
  }
  
  try {
    await api.delete(`/api/experience/${id}`);
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.response?.data?.message || 'Failed to delete experience');
  }
};

export const experienceApi = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};