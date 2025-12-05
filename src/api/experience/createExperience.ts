import api from "@/config/axios";

export interface CreateExperiencePayload {
 
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}


export const createExperience = async (data: CreateExperiencePayload) => {
  const response = await api.post("/api/experience", data);
  return response.data;
};
