"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/api/blog/getblogs"; // Corrected the import path
import type { BlogPost } from "@/types/blog";

export function useBlogsAll() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
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