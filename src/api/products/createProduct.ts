import api from "@/config/axios";

export const createProduct = async (payload: any) => {
  const res = await api.post("/products", payload);
  return res.data.data;
};
