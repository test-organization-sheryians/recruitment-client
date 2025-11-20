import api from "@/config/axios";
import { Skill } from "../../types/skilll";

export const getSkill = async (id: string): Promise<Skill> => {
  const res = await api.get(`/api/skills/${id}`);
  return res.data;
};
