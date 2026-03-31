import api from "@/config/axios";
import axios from "axios";

export interface Products {
  _id: string;
  title: string;
  price: {
    amount: number;
    currency: String;
  };
  description: string;
  image: string;
}

export const getProducts = async (): Promise<Products[]> => {
  const response = await api.get("api/products");
  return response.data.data.products;
};
