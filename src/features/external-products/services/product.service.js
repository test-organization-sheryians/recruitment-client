import { fetchExternalProducts } from "@/api/external-products/product.api";

export const getExternalProducts = async () => {
  return await fetchExternalProducts();
};