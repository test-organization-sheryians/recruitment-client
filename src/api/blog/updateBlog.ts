import api from "@/config/axios";
import type { BlogPost } from "@/types/blog";

export const updateBlog = async (
  id: string,
  payload: Partial<BlogPost>
) => {
  const res = await api.patch(`/api/blogs/${id}`, payload);
  return res.data;
};