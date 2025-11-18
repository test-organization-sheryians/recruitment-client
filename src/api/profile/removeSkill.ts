import api from "@/config/axios";
export const removeSkill = async (userId: string, skillId: string) => {
  const res = await api.delete(
    `/api/candidate-profile/${userId}/skills/${skillId}`
  );
  return res.data;
};