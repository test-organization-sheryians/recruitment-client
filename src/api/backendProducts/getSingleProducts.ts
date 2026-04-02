import api from "@/config/axios";

export const getSingleProduct = async (id: string) => {
  const response = await api.get(`/api/products/getSingleProduct/${id}`);
  return response.data;
};
