import { useEffect, useState, useRef, useCallback } from "react";
import api from "@/config/axios";
import type { BlogPost } from "@/types/blog";

const LIMIT = 10;

export function useBlogsAll() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFetchingRef.current || !hasMore) return;

    const fetchBlogs = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        const skip = (page - 1) * LIMIT;

        const res = await api.get(`/api/blogs`, {
          params: { skip, limit: LIMIT },
        });

        const newBlogs = res.data?.data?.blogs || [];

        setBlogs((prev) => {
          const blogIds = new Set(prev.map((b: BlogPost) => b._id));
          const uniqueNewBlogs = newBlogs.filter(
            (b: BlogPost) => !blogIds.has(b._id),
          );
          return [...prev, ...uniqueNewBlogs];
        });

        if (newBlogs.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchBlogs();
  }, [page, hasMore]);

  const loadMore = useCallback(() => {
    if (isFetchingRef.current || loading || !hasMore) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 200);
  }, [loading, hasMore]);

  const refetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isFetchingRef.current = false;
    setBlogs([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    blogs,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
