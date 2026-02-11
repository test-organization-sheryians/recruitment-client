"use client";

import { useState, useEffect } from "react";
import type { PartialBlock } from "@blocknote/core";
import Button from "@/components/Button";
import BlogEditor from "@/features/admin/blog/components/BlogEditor";
import PostSettingsPanel from "./PostSettingPanel";

export default function CreateBlogLayout() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [blogPost, setBlogPost] = useState({
    title: "",
    slug: "",
    subtitle: "",
    readingTime: "0 min read",
    category: "", // Will store ObjectId
    technologies: [] as string[], // Will store ObjectId array
    hero: {
      imageUrl: "",
      caption: "",
      altText: ""
    },
    content: [] as PartialBlock[],
    author: "", // Will store ObjectId
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [] as string[],
      ogImage: ""
    },
    stats: {
      views: 0,
      likes: 0,
      shares: 0
    },
    isPublished: false,
    publishedAt: null as Date | null,
    allowNewsletter: true,
    status: "draft" as "draft" | "published" | "archived"
  });

  // Console log the entire blog post data whenever it changes
  useEffect(() => {
    console.log("=== BLOG POST DATA (JSON) ===");
    console.log(JSON.stringify(blogPost, null, 2));
    console.log("================================");
  }, [blogPost]);

  const handleBlogDataChange = (data: any) => {
    setBlogPost(prev => ({ ...prev, ...data }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlogPost(prev => ({ ...prev, title }));
  };

  const handleContentChange = (blocks: PartialBlock[]) => {
    setBlogPost(prev => ({ ...prev, content: blocks }));
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      // Update blog post to published status
      const publishedBlogPost = {
        ...blogPost,
        status: "published" as const,
        isPublished: true,
        publishedAt: new Date()
      };
      
      setBlogPost(publishedBlogPost);
      
      console.log("Publishing blog post...");
      console.log("Published Blog Post Data:", publishedBlogPost);
      
      // TODO: Add API call here to save the blog post
      // await api.post("/api/blog/create", publishedBlogPost);
      
      console.log("✅ Blog post published successfully!");
      alert("Blog post published successfully!");
    } catch (error) {
      console.error("Failed to publish blog post:", error);
      alert("Failed to publish blog post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-500">
          <button type="button" className="text-blue-600">Posts</button>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Preview
          </Button>
          <Button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wide text-slate-900">Posts / New editorial</div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <input
              value={blogPost.title}
              onChange={handleTitleChange}
              placeholder="Enter post title..."
              className="w-full border-0 p-0 text-3xl font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
              <span>Admin User</span>
              <span>Oct 24, 2023</span>
            </div>
            <p className="mt-4 text-sm text-slate-700">
              This is where your story begins. Highlight text to format it, or use the menu to add new sections.
            </p>
          </div>
          <BlogEditor
            initialContent={blogPost.content}
            onChange={handleContentChange}
          />
        </div>
        <PostSettingsPanel onChange={handleBlogDataChange} initialTitle={blogPost.title} />
      </div>
    </div>
  );
}