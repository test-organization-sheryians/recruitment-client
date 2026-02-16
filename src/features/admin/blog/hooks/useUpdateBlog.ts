"use client";

import { useState } from "react";
import api from "@/config/axios";

export function useUpdateBlog() {
  const [loading, setLoading] = useState(false);

  const updateBlog = async (id: string, payload: any) => {
    try {
      setLoading(true);
      const res = await api.patch(`/api/blogs/${id}`, payload);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return { updateBlog, loading };
}