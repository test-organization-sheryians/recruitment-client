import { Skill } from "../../types/skilll";
import api from "@/config/axios";
export interface UpdateSkillPayload {
  id: string;
  name: string;
}

export const updateSkill = async (data: UpdateSkillPayload): Promise<Skill> => {
  const res = await api.put(`/api/skills/${data.id}`, { name: data.name });
  return res.data;
};
