import { Skill } from "../../types/skilll"; 
import axios from "axios";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

export const getAllSkills = async () => {
  return axios.get("/skills", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSkill = async (id : string) => {
  return axios.get(`/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



export const createSkill = async (data: Skill) => {
  return axios.post("/skills", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// export const createSkill = async (data ) => {
//   return axios.post("/skills", data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const updateSkill = async ({ id, name }) => {
//   return axios.put(`/skills/${id}`, { name }, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

export const updateSkill = async ({ id, name }: { id: string; name: string }) => {
  return axios.put(`/skills/${id}`, { name }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



export const deleteSkill = async (id: string) => {
  return axios.delete(`/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// export const deleteSkill = async (id : string ) => {
//   const realId = typeof id === "string" ? id : id.id;

//   console.log("API FUNCTION RECEIVED ID:", realId);

//   return axios.delete(`/skills/${realId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

