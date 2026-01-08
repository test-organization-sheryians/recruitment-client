import api from "@/config/axios";

export const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data;
};
