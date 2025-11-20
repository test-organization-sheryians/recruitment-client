import api from "@/config/axios";
export const addSkills = async ( userId, skills) => {
  const res = await api.post(`/api/candidate-profile/add-skills`, {
    userId,
    skills,
  });
  return res.data;
};