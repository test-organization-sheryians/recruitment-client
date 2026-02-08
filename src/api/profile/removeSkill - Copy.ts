import api from "@/config/axios";

export const removeSkill = async (skillName: string) => {
  const response = await api.delete(`/api/candidate-profile/remove-skill/${encodeURIComponent(skillName)}`);
  return response.data;
};
