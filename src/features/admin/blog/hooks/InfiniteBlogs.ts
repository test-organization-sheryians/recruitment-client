// import { useState, useEffect, useRef, useCallback } from "react";
// import api from "@/config/axios";
// import type { BlogPost } from "@/types/blog";

// const LIMIT = 10;

// export function useInfiniteBlogs() {
//   const [blogs, setBlogs] = useState<BlogPost[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const observer = useRef<IntersectionObserver | null>(null);

//   // Fetch blogs
//   const fetchBlogs = async (pageNumber: number) => {
//     if (loading) return;

//     setLoading(true);
//     try {
//       const res = await api.get(`/blogs?page=${pageNumber}&limit=${LIMIT}`);
//       const newBlogs = res.data.blogs;

//       setBlogs((prev) => [...prev, ...newBlogs]);

//       if (newBlogs.length < LIMIT) {
//         setHasMore(false); // No more data
//       }
//     } catch (error) {
//       console.error("Error fetching blogs", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchBlogs(page);
//   }, [page]);

//   // Observer for last element
//   const lastBlogRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prev) => prev + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   return {
//   blogs,
//   loading,
//   hasMore,
//   lastBlogRef,
// };
// }