import { useState } from "react";
import { getSearchBlogBySlug } from "@/api/blog/getSearchBlogBySlug";

export function useSearchBlogBySlug() {
  const [loading, setLoading] = useState(false);

  const searchBlog = async (slug: string) => {
    try {
      setLoading(true);
      const blogs = await getSearchBlogBySlug(slug);
      return blogs;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { searchBlog, loading };
}
