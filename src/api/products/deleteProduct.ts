import api from "@/config/axios";

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/api/products/delete/${id}`);
  return res.data;
};
