import api from "@/config/axios";

export const deleteBlog = async (id: string) => {
  const res = await api.delete(`/api/blogs/${id}`);
  return res.data;
};