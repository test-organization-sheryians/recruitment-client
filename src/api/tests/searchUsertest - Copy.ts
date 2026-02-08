import api from "@/config/axios";

export const searchUserTest = async (query: string) => {
  const response = await api.get("/api/users/search?searchQuery=" + query);
  console.log(response.data);
  return response.data; 
};
