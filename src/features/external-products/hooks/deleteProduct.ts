import api from "@/config/axios";

export const deleteExternalProduct = async (id: number) => {
  const res = await api.delete(`https://fakestoreapi.com/products/${id}`);
  return res.data;
};