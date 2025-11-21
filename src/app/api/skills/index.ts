import API from "@/config/axios";
//import { ZlibReset } from "zlib";

export const getAllSkills = () => API.get("/skills");
export const createSkill = (data  : string) => {
  return API.post("/skills", data);
};
export const deleteSkill = (id : string) => API.delete(`/skills/${id}`);
