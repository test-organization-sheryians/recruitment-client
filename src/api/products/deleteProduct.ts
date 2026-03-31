import api from "@/config/axios";

export const deleteProduct = async (productId: string) => {
  const response = await api.delete(`api/products/${productId}`);
  return response.data;
};
