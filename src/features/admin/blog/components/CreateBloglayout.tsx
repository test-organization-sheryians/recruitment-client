"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import type { PartialBlock } from "@blocknote/core";
import Button from "@/components/Button";
import PostSettingsPanel from "../components/PostSettingPannel";
import toast from "react-hot-toast";
import { useCreateBlog } from "@/features/admin/blog/hooks/useCreateBlog";
import { useUpdateBlog } from "@/features/admin/blog/hooks/useUpdateBlog";
import { useDeleteBlog } from "@/features/admin/blog/hooks/useDeleteBlog";
import { useBlog } from "@/features/admin/blog/hooks/useBlog";
import Link from "next/link";

const BlogEditor = dynamic(
  () => import("@/features/admin/blog/components/BlogEditor"),
  { ssr: false },
);

export default function CreateBlogLayout() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string | undefined;
  const isEdit = useMemo(() => Boolean(blogId), [blogId]);

  const { createBlog, loading: isPublishing } = useCreateBlog();
  const { updateBlog, loading: isUpdating } = useUpdateBlog();
  const { deleteBlog: deleteAPI, loading: isDeleting } = useDeleteBlog();
  const { blog, loading: blogLoading } = useBlog(blogId || "");

  const [blogPost, setBlogPost] = useState<any>({
    title: "",
    slug: "",
    category: "",
    technologies: [],
    hero: { imageUrl: "", caption: "", altText: "" },
    content: [],
    status: "draft",
  });

  useEffect(() => {
    if (isEdit && blog) {
      const normalizedTechs = Array.isArray(blog.technologies)
        ? blog.technologies.map((tech: any) =>
            typeof tech === "object" ? tech._id : tech,
          )
        : [];

      console.log("🔄 Loading blog for edit:", blog._id);
      console.log("📝 Raw technologies:", blog.technologies);
      console.log("✅ Normalized technologies:", normalizedTechs);

      setBlogPost({
        ...blog,

        // Category → always id
        category:
          typeof blog.category === "object"
            ? blog.category?._id
            : blog.category || "",

        // ✅ Technologies → convert to id array
        technologies: normalizedTechs,

        // Content fix
        content: Array.isArray(blog.content)
          ? blog.content
          : blog.content?.blocks || [],
      });
    }
  }, [isEdit, blog]);

  const handleBlogDataChange = useCallback((data: any) => {
    setBlogPost((prev: any) => ({ ...prev, ...data }));
  }, []);

  function normalizeCategory(category: any): string {
    if (!category) return "";
    if (typeof category === "string") return category;
    if (category._id) return category._id;
    if (category.value) return category.value;
    return String(category);
  }

  const buildCreatePayload = (post: any) => ({
    title: post.title,
    subtitle: post.subtitle || "",
    slug: formatSlug(post.slug || post.title),

    category: normalizeCategory(post.category), // string

    technologies: post.technologies || [],
    hero: post.hero,
    content: { blocks: post.content },
    status: post.status,
    isPublished: post.status === "published",
  });

  const buildUpdatePayload = (post: any) => ({
    title: post.title,
    subtitle: post.subtitle || "",
    hero: post.hero,
    content: { blocks: post.content },

    // IMPORTANT
    category: [normalizeCategory(post.category)],

    technologies: post.technologies || [],
    status: post.status,
    isPublished: post.status === "published",
  });

  console.log("Update payload:", buildUpdatePayload(blogPost));

  const savePost = async (status: "draft" | "published" | "archived") => {
    const postToSave = {
      ...blogPost,
      status,
    };

    console.log("💾 Saving status:", status);
    console.log("📌 Technologies to save:", postToSave.technologies);

    if (!postToSave.title?.trim()) {
      return toast.error("Title is required");
    }

    if (!postToSave.category) {
      return toast.error("Category is required");
    }

    try {
      const payload = isEdit
        ? buildUpdatePayload(postToSave)
        : buildCreatePayload(postToSave);

      console.log("📤 Final Payload:", payload);
      console.log("📤 Payload technologies:", payload.technologies);

      if (isEdit && blogId) {
        await updateBlog(blogId, payload);
        toast.success(
          status === "published"
            ? "Blog published successfully!"
            : status === "archived"
              ? "Blog archived!"
              : "Draft saved!",
        );
      } else {
        await createBlog(payload);
        toast.success(
          status === "published"
            ? "Blog published successfully!"
            : status === "archived"
              ? "Blog archived!"
              : "Draft saved!",
        );
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Operation failed";
      console.error("❌ Save error:", err);
      toast.error(msg);
    }
  };

  const handleSaveDraft = () => savePost("draft");

  const handlePublish = () => savePost("published");

  const handleArchive = () => savePost("archived");

  if (isEdit && blogLoading)
    return (
      <div className="p-20 text-center text-slate-400">
        Loading editorial...
      </div>
    );
  const isBusy = isPublishing || isUpdating || isDeleting;
  const isDraft = blogPost.status === "draft";
  const isPublished = blogPost.status === "published";
  const isArchived = blogPost.status === "archived";

  function formatSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // spaces → hyphen
      .replace(/-+/g, "-"); // multiple hyphens
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md px-8 py-3 rounded-lg flex justify-between items-center bg-white/80 shadow-sm">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-[11px] font-sm uppercase tracking-wider">
            <Link
              href="/admin/blog"
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              Posts
            </Link>

            <span className="text-slate-300">/</span>

            <span className="text-slate-600">
              {isEdit ? "Edit Blog" : "New Editorial"}
            </span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            {isEdit ? "Edit Editorial" : "Create New Post"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isPublished
                ? "bg-green-100 text-green-700"
                : isArchived
                  ? "bg-slate-200 text-slate-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {blogPost.status?.toUpperCase()}
          </span>

          {/* Save Draft - Only show if status is draft */}
          {isDraft && (
            <button
              disabled={isBusy}
              onClick={handleSaveDraft}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                !isBusy
                  ? "text-slate-600 hover:bg-slate-100 cursor-pointer"
                  : "text-slate-300 cursor-not-allowed opacity-50"
              }`}
            >
              Save Draft
            </button>
          )}

          {/* Publish - Only show if status is published */}
          {isPublished && (
            <button
              disabled={isBusy}
              onClick={handlePublish}
              className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition ${
                !isBusy
                  ? "text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50"
              }`}
            >
              {isBusy ? "Saving..." : "Update & Publish"}
            </button>
          )}

          {/* Archive - Only show if status is archived */}
          {isArchived && (
            <button
              disabled={isBusy}
              onClick={handleArchive}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                !isBusy
                  ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                  : "text-slate-400 cursor-not-allowed opacity-50"
              }`}
            >
              Archive
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1.4fr_340px] max-w-[1800px] gap-4">
        {/* Main Editor Section */}
        <div className="min-w-0 h-full overflow-y-auto pr-2">
          <div className="rounded-2xl shadow-sm bg-white px-3 py-5 overflow-visible">
            {/* Title */}
            <textarea
              value={blogPost.title}
              onChange={(e) => {
                setBlogPost({ ...blogPost, title: e.target.value });
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              placeholder="Enter post title..."
              className="w-full resize-none text-3xl font-extrabold text-slate-900 placeholder-slate-300 bg-white px-3 py-3 rounded-xl outline-none border-none leading-tight tracking-tight min-h-[78px]"
              rows={1}
              maxLength={200}
            />

            <div className="pt-6">
              <BlogEditor
                key={
                  isEdit ? `edit-${blogId}-${blogPost.content.length}` : "new"
                }
                initialContent={blogPost.content}
                onChange={(blocks) =>
                  setBlogPost((p: any) => ({ ...p, content: blocks }))
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <aside className="h-full overflow-hidden">
          <div className="h-full rounded-2xl bg-white shadow-sm border border-slate-200 p-5 overflow-y-auto">
            <PostSettingsPanel
              data={blogPost}
              onUpdate={handleBlogDataChange}
              initialTitle={blogPost.title}
              isEdit={isEdit}
              onDeleteBlog={() => {
                if (confirm("Delete permanently?")) {
                  deleteAPI(blogId!).then(() => {
                    router.push("/admin/blog");
                    router.refresh();
                  });
                }
              }}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
