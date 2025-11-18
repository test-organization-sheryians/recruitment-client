import API from "./axiosInstance";

export const getAllSkills = () => API.get("/skills");
export const createSkill = (data) => API.post("/skills", data);
export const deleteSkill = (id) => API.delete(`/skills/${id}`);
