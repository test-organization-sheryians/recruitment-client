import api from "@/config/axios";

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
};
