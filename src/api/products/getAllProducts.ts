import api from "@/config/axios";

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data.data; // backend: { success, data }
};
