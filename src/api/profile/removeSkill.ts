import api from "@/config/axios";

export const removeSkill = async (skillName: string) => {
  const response = await api.delete(`/api/candidate/remove-skill/${skillName}`);
  return response.data;
};
