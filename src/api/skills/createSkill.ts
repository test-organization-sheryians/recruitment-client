 import api from "@/config/axios";
 //import { Skill } from "../../types/skilll";


// export interface CreateSkillPayload {
//   name: string;
// }

// export const createSkill = async (data: string): Promise<Skill> => {
//   const res = await api.post("/api/skills", data);
//   return res.data;
// };


export interface CreateSkillPayload {
  name: string;
}

export const createSkill = async (data: CreateSkillPayload) => {
  const response = await api.post("/api/skills", data);
  return response.data;
};
