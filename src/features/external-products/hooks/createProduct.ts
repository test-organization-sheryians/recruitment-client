import api from "@/config/axios";
import { CreateProductPayload } from "@/features/external-products/types/product.types";

export const createExternalProduct = async (data: CreateProductPayload) => {
  const res = await api.post("https://fakestoreapi.com/products", data);
  return res.data;
};