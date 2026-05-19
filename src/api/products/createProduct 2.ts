import axios from "axios";

export const createProduct = async (data: any) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
    data
  );
  return res.data;
};