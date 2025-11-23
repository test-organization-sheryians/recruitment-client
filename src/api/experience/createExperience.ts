import api from "@/config/axios";
import { ExperienceItem } from "@/types/ExperienceItem ";

export interface CreateExperiencePayload {
  candidateId: string;   // ✅ ADD THIS
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
