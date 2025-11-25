// api/experience.ts
import api from "@/config/axios";

export const getCandidateExperience = async (candidateId: string) => {
  const response = await api.get(`/api/experience/candidate/${candidateId}`);
  return response.data;
};
