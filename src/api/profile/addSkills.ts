import api from "@/config/axios";
import { AddSkillsPayload } from "@/types/profile";

export const addSkills = async (data: AddSkillsPayload) => {
  const response = await api.post("/api/candidate-profile/add-skills",{ skills: data.skills });
  return response.data;
};
