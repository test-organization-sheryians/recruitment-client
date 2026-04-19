"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Pencil, Trash2 } from "lucide-react";
import { useBlogsAll } from "@/features/admin/blog/hooks/useBlogsAll";
import { useDeleteBlog } from "@/features/admin/blog/hooks/useDeleteBlog";
import { useRef, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchBlogBySlug } from "../hooks/useSearchBlogBySlug";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";

export default function BlogManagement() {
  const router = useRouter();
  const {
    blogs,
    loading: blogsLoading,
    error,
    hasMore,
    loadMore,
    refetch,
  } = useBlogsAll();
  const { deleteBlog } = useDeleteBlog();
  const [slug, setSlug] = useState("");
  const { searchBlog, loading: searchLoading } = useSearchBlogBySlug();
  // const { hasMore, lastBlogRef } = useInfiniteBlogs();
  const [searchedBlog, setSearchedBlog] = useState<any[] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedBlogTitle, setSelectedBlogTitle] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!slug.trim()) {
        setSearchedBlog(null);
        return;
      }

      const results = await searchBlog(slug);
      setSearchedBlog(results);
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, searchBlog]);

  const handleSearch = async () => {
    if (!slug.trim()) {
      setSearchedBlog(null);
      return;
    }

    const blogs = await searchBlog(slug);
    setSearchedBlog(blogs);
  };

  const blogList = useMemo(() => {
    const source = searchedBlog !== null ? searchedBlog : blogs;

    if (!Array.isArray(source)) return [];

    let list = source.map((blog) => ({
      ...blog,
      status: blog.status || (blog.isPublished ? "published" : "draft"),
    }));

    // Apply status filter
    if (statusFilter !== "all") {
      list = list.filter((blog) => blog.status === statusFilter);
    }

    return list;
  }, [blogs, searchedBlog, statusFilter]);

  const publishedCount = useMemo(
    () => blogList.filter((blog) => blog.status === "published").length,
    [blogList],
  );

  const draftCount = useMemo(
    () => blogList.filter((blog) => blog.status === "draft").length,
    [blogList],
  );

  const archivedCount = useMemo(
    () => blogList.filter((blog) => blog.status === "archived").length,
    [blogList],
  );

  const totalBlogs = blogList.length;

  const handleDelete = (blogId: string, title: string) => {
    setSelectedBlogId(blogId);
    setSelectedBlogTitle(title);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlogId) return;

    try {
      await deleteBlog(selectedBlogId);
      await refetch();
      setIsDeleteModalOpen(false);
      setSelectedBlogId(null);
      setSelectedBlogTitle("");
      toast.success("Blog deleted successfully!", {
        duration: 3000,
        position: "top-right",
        icon: "🗑️",
      });
    } catch (err: any) {
      console.error("Failed to delete blog:", err);
      const message = err?.response?.data?.message || "Failed to delete blog";
      toast.error(message, {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedBlogId(null);
    setSelectedBlogTitle("");
  };

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const isSearching = searchedBlog !== null;

        if (
          entries[0].isIntersecting &&
          !searchLoading &&
          hasMore &&
          !isSearching
        ) {
          loadMore();
        }
      },
      { rootMargin: "150px", threshold: 0.01 },
    );

    const el = loadMoreRef.current;
    if (el) observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, [hasMore, searchedBlog, searchLoading, loadMore]);

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600 mt-2">Create and manage blog posts</p>
        </div>

        <Link
          href="/admin/blog/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5 cursor-pointer" />
          Create Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Blogs" value={totalBlogs} />
        <StatCard title="Published" value={publishedCount} color="green" />
        <StatCard title="Drafts" value={draftCount} color="yellow" />
        <StatCard title="Archived" value={archivedCount} color="slate" />
      </div>

      {/* Search + Filter */}
      <div className="rounded-2xl p-3 w-full">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            {/* Icon */}
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            {/* Input */}
            <input
              type="text"
              placeholder="Search blogs slug or subtitle..."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm
                   border border-slate-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all"
            />

            {/* Clear Button */}
            {slug && !searchLoading && (
              <button
                onClick={() => {
                  setSlug("");
                  setSearchedBlog(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2
                     text-slate-400 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>
            )}

            {/* Loading Indicator */}
            {searchLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-400">
                <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden sm:block h-6 w-px bg-slate-200" />

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-zinc-100
                   border border-slate-300 rounded-xl
                   px-4 py-2.5 pr-10 text-sm font-medium text-slate-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Custom dropdown arrow */}
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : blogList.length === 0 && !blogsLoading ? (
          searchedBlog !== null ? (
            <div className="text-center py-12 text-slate-500">
              No blogs found for "{slug}"
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="space-y-3">
            {blogList.map((blog) => (
              <div
                key={blog._id}
                onClick={() => router.push(`/admin/blog/edit/${blog._id}`)}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-slate-100 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all group cursor-pointer"
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-semibold text-slate-900 truncate w-full">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-600 truncate mt-1">
                    {blog.subtitle}
                  </p>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800"
                          : blog.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : blog.status === "archived"
                              ? "bg-slate-100 text-slate-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {blog.status === "published"
                        ? "Published"
                        : blog.status === "draft"
                          ? "Draft"
                          : blog.status === "archived"
                            ? "Archived"
                            : "Unknown"}
                    </span>

                    {blog.readingTime && (
                      <span className="text-xs text-slate-500">
                        📖 {blog.readingTime}
                      </span>
                    )}

                    {isClient && blog.updatedAt && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        ✓ {new Date(blog.updatedAt).toLocaleDateString()}{" "}
                        {new Date(blog.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/admin/blog/edit/${blog._id}`}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>

                  <button
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      blog._id && handleDelete(blog._id, blog.title);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intersection Observer Trigger & Load More Button */}
        <div ref={loadMoreRef} className="pt-6 text-center space-y-4">
          {blogsLoading && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-slate-600">Loading more blogs...</span>
            </div>
          )}

          {!blogsLoading && hasMore && !searchedBlog && (
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Load More
            </button>
          )}

          {!hasMore && <p className="text-slate-400">No more blogs to load</p>}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title={selectedBlogTitle}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
    </div>
  );
}

/* ---------------- helpers (clean UI) ---------------- */

function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return <div className="text-center py-12 text-slate-500">No blogs yet</div>;
}

function StatCard({
  title,
  value,
  color = "blue",
}: {
  title: string;
  value: number;
  color?: "blue" | "green" | "yellow" | "slate";
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6">
      <p className="text-slate-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
