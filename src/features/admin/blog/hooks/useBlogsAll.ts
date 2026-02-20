import { useEffect, useState } from "react";
import api from "@/config/axios";
import type { BlogPost } from "@/types/blog";

export function useBlogsAll() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/blogs");

      console.log("BLOG LIST RESPONSE:", res.data);

   
      const blogsArray = res.data?.data?.blogs || [];

   setBlogs(blogsArray);
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs,
  };
}