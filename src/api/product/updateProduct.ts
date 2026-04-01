import api from "@/config/axios";

export const updateProduct = async (
  id: string,
  product: {
    name?: string;
    price?: number;
    category?: string;
  }
) => {
  const res = await api.put(`/api/product/${id}`, product);
  return res.data;
};