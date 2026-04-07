import axios from "axios";

export const deleteProduct = async (id: string) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`
  );
};