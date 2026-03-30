import api from "@/config/axios";

export const getProducts = async () => {
  const res = await api.get("/api/product");
  return res.data;
};