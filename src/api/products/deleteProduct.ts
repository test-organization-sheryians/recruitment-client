import api from "@/config/axios";

export const deleteProduc = async (id: string) => {
  console.log("API RECEIVED ID:", id);
  const res = await api.delete(`api/product/delete/${id}` );
  return res.data;
};