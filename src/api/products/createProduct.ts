import api from "@/config/axios";

export const createProduct = async (data: object) => {
  const response = await api.post("api/products", data);
  return response.data;
};
