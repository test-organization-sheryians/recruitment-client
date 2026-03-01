import { useState, useCallback } from "react";
import { getSearchBlogBySlug } from "@/api/blog/getSearchBlogBySlug";

export function useSearchBlogBySlug() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBlog = useCallback(async (slug: string) => {
    if (!slug.trim()) return [];

    try {
      setLoading(true);
      setError("");

      const blogs = await getSearchBlogBySlug(slug.trim());
      return blogs;
    } catch (err) {
      console.error(err);
      setError("Failed to search blogs");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchBlog, loading, error };
}
