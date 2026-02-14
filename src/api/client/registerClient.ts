import api from "@/config/axios"

export const registerClient = async (data: any) => {
  console.log("Base URL:", api.defaults.baseURL)
  const res = await api.post("/api/client/register", data)
  return res.data
}
