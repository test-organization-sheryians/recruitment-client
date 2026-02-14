import api from "@/config/axios";

export const updateProduct = async (data: any) => {
  const { id, ...payload } = data;

  const res = await api.put(`/api/products/update/${id}`, payload);
  return res.data;
};
