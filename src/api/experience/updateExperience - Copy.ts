 import api from "@/config/axios";
 import { ExperienceItem } from "@/types/ExperienceItem ";
 import { UpdateExperienceVariables } from "@/features/candidate/experience/hooks/useExperienceApi";

export const updateExperience = async (
  data: UpdateExperienceVariables
): Promise<ExperienceItem> => {
  const { id, ...payload } = data;
  const response = await api.patch(`/api/experience/${id}`, payload);
  return response.data;
};
