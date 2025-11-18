import axios from "axios";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

export const getAllSkills = async () => {
  return axios.get("/skills", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSkill = async (id) => {
  return axios.get(`/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createSkill = async (data) => {
  return axios.post("/skills", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateSkill = async ({ id, name }) => {
  return axios.put(`/skills/${id}`, { name }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// export const deleteSkill = async (id) => {
//   return axios.delete(`/skills/${id}`, {
//     headers: { Authorization: `Bearer ${token}` }, //old
//   });
// };

// export const deleteSkill = async (id: string | { id: string }) => {
//   console.log("🔥 API FUNCTION RECEIVED:", id);

//   // If id is inside an object, extract it
//   const finalId = typeof id === "string" ? id : id.id;

//   console.log("🔥 FINAL ID USED:", finalId);

//   const token = localStorage.getItem("token");

//   return axios.delete(`/skills/${finalId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };


export const deleteSkill = async (id) => {
  const realId = typeof id === "string" ? id : id.id;

  console.log("API FUNCTION RECEIVED ID:", realId);

  return axios.delete(`/skills/${realId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

