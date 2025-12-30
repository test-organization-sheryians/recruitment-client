import api from "@/config/axios";

/*export const getAllUsers = async () => {
  const res = await api.get("/api/users/allUser");

  // backend returns:
  // { success: true, data: users }
  return res.data.data; 
};*/
// frontend
export const getAllUsers = async (query?: string) => {
  const res = await api.get("/api/users/allUser", {
    params: { query }, // yeh match kare backend ke req.query se
  });

  return res.data.data;
};

