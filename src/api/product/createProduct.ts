import api from "@/config/axios";

export const createProduct = async (product: {
  name: string;
  price: number;
  category: string;
}) => {
  const res = await api.post("/api/product", product);
  return res.data;
};