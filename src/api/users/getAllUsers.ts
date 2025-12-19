import api from "@/config/axios";
import { User } from "@/features/admin/users/hooks/useUser";

export const getAllUsers = async (searchQuery = ""):  Promise<User[]> => {
  const res = await api.get("/api/users/allUser", {
    params: { query: searchQuery }, // sends ?query=p@p.com
  });
  return res.data.data;
};