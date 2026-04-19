import api from "@/config/axios";
import type { BlogPost } from "@/types/blog";

export const createBlogPost = async (payload: BlogPost) => {
  const res = await api.post("/api/blogs", payload);
  return res.data;
};