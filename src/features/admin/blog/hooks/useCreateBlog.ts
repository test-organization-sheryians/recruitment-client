"use client";

import { useState } from "react";
import { createBlogPost } from "@/api/blog/createBlogPost";

export function useCreateBlog() {
  const [loading, setLoading] = useState(false);

  const createBlog = async (payload: any) => {
    try {
      setLoading(true);
      const res = await createBlogPost(payload);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBlog,
    loading,
  };
}