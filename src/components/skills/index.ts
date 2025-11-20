import axios from "axios";
interface UpdateSkillData {
  id: string;
  name: string;
}

const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

export const getAllSkills = async () => {
  return axios.get("/skills", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSkill = async (id : string ) => {
  return axios.get(`/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createSkill = async (data : string ) => {
  return axios.post("/skills", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateSkill = async ({ id, name }: UpdateSkillData) => {
  return axios.put(`/skills/${id}`, { name }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};




export const deleteSkill = async (id : string) => {
  // const realId = typeof id === "string" 

  console.log("API FUNCTION RECEIVED ID:", id);

  return axios.delete(`/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

