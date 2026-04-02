import api from "@/config/axios";

export const deleteProduct=async (data:{id: string}) => {
    await api.delete(`/api/products/deleteProduct/${data.id}`);
  }