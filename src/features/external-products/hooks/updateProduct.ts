import api from "@/config/axios";
import { CreateProductPayload } from "@/features/external-products/types/product.types";

export const updateExternalProduct = async (
  id: number,
  data: CreateProductPayload
) => {
  const res = await api.put(`https://fakestoreapi.com/products/${id}`, data);
  return res.data;
};