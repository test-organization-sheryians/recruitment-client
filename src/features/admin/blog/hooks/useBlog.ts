"use client";

import { useEffect, useState } from "react";
import api from "@/config/axios";

export function useBlog(id: string) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/blogs/${id}`);
      const blogData = res.data.data || res.data;
      console.log("✅ Fetched blog data:", blogData);
      console.log("📌 Technologies from response:", blogData?.technologies);
      setBlog(blogData);
    } catch (err) {
      console.error("❌ Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  return { blog, loading, refetch: fetchBlog };
}
