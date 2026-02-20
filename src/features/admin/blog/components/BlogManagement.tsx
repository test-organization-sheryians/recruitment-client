"use client";

import Link from "next/link";
import { Plus, BookOpen, Pencil, Trash2 } from "lucide-react";
import { useBlogsAll } from "@/features/admin/blog/hooks/useBlogsAll";
import { useDeleteBlog } from "@/features/admin/blog/hooks/useDeleteBlog";

export default function BlogManagement() {
  const { blogs, loading, error, refetch } = useBlogsAll();
  const { deleteBlog } = useDeleteBlog();

  const blogList = Array.isArray(blogs)
    ? blogs.map((blog) => ({
        ...blog,
        status: blog.status || (blog.isPublished ? "published" : "draft"),
      }))
    : [];

  const publishedCount = blogList.filter(
    (blog) => blog.status === "published",
  ).length;

  const draftCount = blogList.filter((blog) => blog.status === "draft").length;

  const totalBlogs = blogList.length;

  const handleDelete = async (blogId: string, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteBlog(blogId);
        await refetch();
        alert("Blog deleted successfully!");
      } catch (err) {
        console.error("Failed to delete blog:", err);
        alert("Failed to delete blog");
      }
    }
  };

  return (
    <div className="space-y-6 m-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600 mt-2">Create and manage blog posts</p>
        </div>

        <Link
          href="/admin/blog/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Blogs" value={totalBlogs} />
        <StatCard title="Published" value={publishedCount} color="green" />
        <StatCard title="Drafts" value={draftCount} color="yellow" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : blogList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {blogList.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
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

                    {blog.updatedAt && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <span>✓</span>{" "}
                        {new Date(blog.updatedAt).toLocaleDateString()}{" "}
                        {new Date(blog.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/blog/edit/${blog._id}`}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>

                  <button
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                    onClick={() =>
                      blog._id && handleDelete(blog._id, blog.title)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  color?: "blue" | "green" | "yellow";
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <p className="text-slate-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
