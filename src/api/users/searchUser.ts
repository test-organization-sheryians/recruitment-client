// import api from "@/config/axios"

// export const searchUser = async (query: string) =>{
//     const res = await api.get(`/api/users/search?query=${query}`)
//     return res.data.data
// }
import api from "@/config/axios"
export const searchUser = async (query: string) => {
  if (!query || query.trim() === "") {
    return []; 
  }

  const res = await api.get(`/api/users/search?query=${query}`);
  return res.data.data;
};
