"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/config/axios";

export function useBlogsAll(limit = 10) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  // ---------------- Fetch Blogs ----------------
  const fetchBlogs = useCallback(
    async (pageNumber: number) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError("");

        const skip = (pageNumber - 1) * limit;

        const res = await api.get("/api/blogs/admin", {
          params: {
            page: pageNumber,
            skip,
            limit,
          },
        });

        const newBlogs =
          res.data?.data?.blogs || res.data?.blogs || res.data?.data || [];
        const pagination = res.data?.data?.pagination;

        setBlogs((prev) => {
          const combined = pageNumber === 1 ? newBlogs : [...prev, ...newBlogs];

          // remove duplicates
          const map = new Map();
          combined.forEach((b) => b?._id && map.set(b._id, b));
          return Array.from(map.values());
        });

        // Use hasNext from pagination if available, otherwise check length
        if (pagination) {
          setHasMore(pagination.hasNext ?? false);
        } else {
          setHasMore(newBlogs.length === limit);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs");
        setHasMore(false);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [limit],
  );

  // ---------------- Initial + Pagination ----------------
  useEffect(() => {
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  // ---------------- Load More ----------------
  const loadMore = useCallback(() => {
    if (loading || !hasMore || isFetchingRef.current) return;
    setPage((prev) => prev + 1);
  }, [loading, hasMore]);
  // ---------------- Refetch ----------------
  const refetch = useCallback(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    fetchBlogs(1);
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
