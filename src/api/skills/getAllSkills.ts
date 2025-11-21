import api from "@/config/axios";
import { Skill } from "../../types/skilll";

export const getAllSkills = async (): Promise<Skill[]> => {
  const res = await api.get("/api/skills");
  return res.data.data;
};
