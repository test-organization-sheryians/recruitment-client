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
      setBlog(res.data.data || res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  return { blog, loading, refetch: fetchBlog };
}