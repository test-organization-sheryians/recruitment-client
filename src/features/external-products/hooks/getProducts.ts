import api from "@/config/axios";
import { ExternalProduct } from "@/features/external-products/types/product.types";

export const getExternalProducts = async (): Promise<ExternalProduct[]> => {
  const res = await api.get("https://fakestoreapi.com/products");
  return res.data;
};