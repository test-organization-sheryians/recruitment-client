
"use client";

import { useState } from "react";
import api from "@/config/axios";

export function useDeleteBlog() {
  const [loading, setLoading] = useState(false);

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/blogs/${id}`);
    } finally {
      setLoading(false);
    }
  };

  return { deleteBlog, loading };
}