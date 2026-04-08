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
import { ChevronRight, FileText, Plus } from "lucide-react";
import DeleteModal from "./DeleteModal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      return toast.error("Title is required", {
        duration: 3000,
        position: "top-right",
      });
    }

    if (!postToSave.category) {
      return toast.error("Please select a category of the blog", {
        duration: 3000,
        position: "top-right",
      });
    }

    if (!postToSave.hero?.imageUrl) {
      return toast.error(" Please upload the featured image ", {
        duration: 3000,
        position: "top-right",
      });
    }

    try {
      const payload = isEdit
        ? buildUpdatePayload(postToSave)
        : buildCreatePayload(postToSave);

      console.log("📤 Final Payload:", payload);
      console.log("📤 Payload technologies:", payload.technologies);

      const successMsg =
        status === "published"
          ? "Blog published successfully! 🎉"
          : status === "archived"
            ? "Blog archived successfully 📦"
            : "Draft saved!";

      if (isEdit && blogId) {
        await updateBlog(blogId, payload);
        toast.success(successMsg, { duration: 3000, position: "top-right" });
      } else {
        await createBlog(payload);
        toast.success(successMsg, { duration: 3000, position: "top-right" });
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      let msg =
        err?.response?.data?.message || err?.message || "Operation failed";

      // Convert API error messages to user-friendly messages
      if (msg.includes("hero.imageUrl")) {
        msg = "Please upload the featured image";
      } else if (msg.includes("category")) {
        msg = "Please select a category";
      } else if (msg.includes("title")) {
        msg = "Title is required";
      } else if (msg.includes("content")) {
        msg = "Please add some content to your blog";
      }

      console.error("❌ Save error:", err);
      toast.error(msg, { duration: 3000, position: "top-right" });
    }
  };

  const handleDeleteBlog = async () => {
    try {
      await deleteAPI(blogId!);
      toast.success("Blog deleted successfully! 🗑️", {
        duration: 3000,
        position: "top-right",
      });
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete blog";
      toast.error(msg, { duration: 3000, position: "top-right" });
    }
  };

  const handleSaveDraft = () => savePost("draft");
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

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
      <header className="sticky top-0 z-50 backdrop-blur-md px-8 py-4 flex justify-between items-center bg-white/90 shadow-sm border-b border-slate-200">
        <div className="flex flex-col gap-3">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/blog"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Posts</span>
            </Link>

            <ChevronRight className="w-4 h-4 text-slate-400" />

            <span className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-900 bg-slate-100 rounded-md">
              {isEdit ? "Edit Blog" : "Create New"}
            </span>
          </nav>

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            {isEdit ? "Edit Editorial" : "Create New Post"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : isArchived
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full mr-2 bg-current" />
            {blogPost.status?.toUpperCase()}
          </span>

          {/* Save Draft - Only show if status is draft */}
          {isDraft && (
            <button
              disabled={isBusy}
              onClick={handleSaveDraft}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                !isBusy
                  ? "text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-200"
                  : "text-slate-400 bg-slate-50 cursor-not-allowed opacity-50 border border-slate-100"
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
              className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all ${
                !isBusy
                  ? "text-white bg-blue-600 hover:bg-blue-700 cursor-pointer border border-blue-600 hover:shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50 border border-slate-200"
              }`}
            >
              {isBusy ? "Saving..." : "Publish"}
            </button>
          )}

          {/* Archive - Only show if status is archived */}
          {isArchived && (
            <button
              disabled={isBusy}
              onClick={handleArchive}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                !isBusy
                  ? "text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-200"
                  : "text-slate-400 bg-slate-50 cursor-not-allowed opacity-50 border border-slate-100"
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
              onDeleteBlog={handleOpenDeleteModal}
            />
          </div>
        </aside>
      </main>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title={blogPost.title}
        onConfirm={handleDeleteBlog}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
