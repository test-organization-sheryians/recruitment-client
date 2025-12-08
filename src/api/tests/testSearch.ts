import api from "@/config/axios";

export const testSearch = async (data : string) => {
    console.log(data)
  const response = await api.get("/api/users/search",{
    params:{searchQuery:data}
  });
  return response.data?.data ?? [];
}
