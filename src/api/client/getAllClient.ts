import api from "@/config/axios"

export const getClients = async () => {
  const res = await api.get("/api/client/getallclients")
  return res.data
}