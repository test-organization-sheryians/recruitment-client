import api from "@/config/axios"

export const getClientById = async (id: string) => {
  const res = await api.get(`/api/client/${id}`)
  return res.data
}