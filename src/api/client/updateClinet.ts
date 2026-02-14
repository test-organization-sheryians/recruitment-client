import api from "@/config/axios"

export const updateClinet = async (id: string,data:string) => {
  const res = await api.put(`/api/client/updateclient/${id}`)
  return res.data
}