 import api from "@/config/axios";


export interface CreateSkillPayload {
  name: string;
}

export const createSkill = async (data: CreateSkillPayload) => {
  const response = await api.post("/api/skills", data);
  return response.data;
};
