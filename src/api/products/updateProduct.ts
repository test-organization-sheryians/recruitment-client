import axios from "axios";

export const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
    data
  );
  return res.data;
};