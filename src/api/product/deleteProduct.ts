import api from "@/config/axios";

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/api/product/${id}`);
  return res.data;
};