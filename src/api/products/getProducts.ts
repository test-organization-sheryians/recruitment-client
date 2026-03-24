import axios from "axios";

interface Rating {
  rate: Number;
  count: Number;
}

export interface Products {
  id: Number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export const getProducts = async (): Promise<Products[]> => {
  const response = await axios.get("https://fakestoreapi.com/products");
  return response.data;
};
