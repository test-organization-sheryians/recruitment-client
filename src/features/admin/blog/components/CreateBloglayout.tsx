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
      setBlogPost({
        ...blog,

        // ✅ Always string
        category:
          typeof blog.category === "object"
            ? blog.category?._id
            : blog.category || "",

        content: Array.isArray(blog.content)
          ? blog.content
          : blog.content?.blocks || [],
      });
    }
  }, [isEdit, blog]);

  const handleBlogDataChange = useCallback((data: any) => {
    setBlogPost((prev: any) => ({ ...prev, ...data }));
  }, []);

  const normalizeCategory = (cat: any) => {
    if (!cat) return "";
    return typeof cat === "object" ? cat._id : cat;
  };

  const buildCreatePayload = (post: any) => ({
    title: post.title,
    subtitle: post.subtitle || "",
    slug: post.slug,
    category: normalizeCategory(post.category),
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
    category: [normalizeCategory(post.category)],
    isPublished: post.status === "published",
  });

  console.log("Update payload:", buildUpdatePayload(blogPost));

  const savePost = async (status: "draft" | "published" | "archived") => {
    const postToSave = {
      ...blogPost,
      status,
    };

    console.log("Saving status:", status);

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

      console.log("Final Payload:", payload);

      if (isEdit && blogId) {
        await updateBlog(blogId, payload);
        toast.success(
          status === "published"
            ? "Blog published successfully!"
            : "Draft saved!",
        );
      } else {
        await createBlog(payload);
        toast.success(
          status === "published"
            ? "Blog published successfully!"
            : "Draft saved!",
        );
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Operation failed";
      toast.error(msg);
    }
  };

  const handleSaveDraft = () => savePost("draft");

  const handlePublish = () => savePost("published");

  const handleArchive = () => savePost("archived"); // optional future use

  if (isEdit && blogLoading)
    return (
      <div className="p-20 text-center text-slate-400">
        Loading editorial...
      </div>
    );

  const isBusy = isPublishing || isUpdating || isDeleting;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md px-8 py-3 rounded-lg flex justify-between items-center bg-white/80 shadow-sm">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-[11px] font-sm text-slate-400 uppercase tracking-wider ">
            <span>Posts</span>
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
          {/* Save Draft */}
          <button
            disabled={isBusy}
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            Save Draft
          </button>

          {/* Publish / Update */}
          <button
            disabled={isBusy}
            onClick={handlePublish}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            {isBusy ? "Processing..." : isEdit ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1.5fr_320px] max-w-[1800px] gap-3">
        {/* Main Editor Section */}
        <div className="min-w-0 h-[calc(100vh-130px)] overflow-y-auto">
          <div className="rounded-2xl shadow-lg overflow-hidden px-2 lg:px-2 py-2 lg:py-5">
            <div className="">
              <textarea
                value={blogPost.title}
                onChange={(e) => {
                  setBlogPost({ ...blogPost, title: e.target.value });
                  // Auto-resize
                  if (e.target) {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }
                }}
                placeholder="Enter post title..."
                className="w-full resize-none text-3xl font-extrabold text-slate-900 placeholder-slate-300 bg-white px-3 py-3 rounded-xl outline-none border-none leading-tight tracking-tight focus:ring-0 min-h-[78px]"
                style={{
                  boxShadow: "none",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                }}
                rows={1}
                maxLength={200}
              />
            </div>
            <div className="pt-6 ">
              {blogPost.content.length > 0 || !isEdit ? (
                <BlogEditor
                  key={
                    isEdit ? `edit-${blogId}-${blogPost.content.length}` : "new"
                  }
                  initialContent={blogPost.content}
                  onChange={(blocks) =>
                    setBlogPost((p: any) => ({ ...p, content: blocks }))
                  }
                />
              ) : (
                <div className="py-32 text-center text-slate-300">
                  <p className="text-sm">Loading editor content...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <aside className="relative h-[calc(100vh-120px)]">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-4 md:p-6 xl:p-7 w-full max-w-[360px] mx-auto h-full overflow-y-auto">
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
          </div>
        </aside>
      </main>
    </div>
  );
}
