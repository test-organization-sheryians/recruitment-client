import api from "@/config/axios";

export const getAllUsers = async () => {
  const res = await api.get("/api/users/allUser");

  // backend returns:
  // { success: true, data: users }
  return res.data.data; 
};
