import axios from "axios";

export const getProducts = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
  );
  return res.data.data;
};