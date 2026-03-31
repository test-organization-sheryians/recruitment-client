import api from "@/config/axios";

export const updateProduct = async ({
  productId,
  data,
}: {
  productId: string;
  data: object;
}) => {
  const response = await api.put(`api/products/${productId}`, data);
  return response.data;
};
