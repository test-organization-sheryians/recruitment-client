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

      // 🔥 Important: handle structure correctly
      const blogsArray =
        res.data?.data?.docs ||   // if pagination
        res.data?.data?.blogs ||  // if wrapped
        res.data?.data ||         // if direct
        [];

      setBlogs(Array.isArray(blogsArray) ? blogsArray : []);
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