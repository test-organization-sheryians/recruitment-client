import api from "@/config/axios";
import { Product } from "@/types/product";

// CREATE PRODUCT only talk to backend
export const createProduct = (data: Omit<Product, "_id">) => {
  return api.post("/api/products/cartData", data);
};
