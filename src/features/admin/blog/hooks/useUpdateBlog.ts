"use client";

import { useState } from "react";
import api from "@/config/axios";

export function useUpdateBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBlog = async (id: string, payload: any) => {
    try {
      setLoading(true);
      console.log("UPDATE BLOG PAYLOAD:", payload);
      setError(null);

      const res = await api.patch(`/api/blogs/update/${id}`, payload);
      console.log("Update response:", res.data);
      return res.data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to update blog";
      console.error("Update error:", errorMsg, err?.response?.data);
      setError(errorMsg);
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  return { updateBlog, loading, error };
}
