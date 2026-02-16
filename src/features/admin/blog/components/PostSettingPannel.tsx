"use client";

import { useState, useEffect } from "react";
import SparkleButton from "@/components/ui/SparkelButtonBlogcreate";
import HeroImageUploader from "./HeroImageUpload";
import TechStackSelector from "./TanStackSelector";
import { BlogPost } from "@/types/blog";

interface PostSettingsPanelProps {
  data: BlogPost;
  onUpdate: (updates: Partial<BlogPost>) => void;
  initialTitle?: string; // Keep this if you want auto-slug generation logic
  onDelete?: () => void; // Optional callback when post is deleted
}

export default function PostSettingsPanel({ data, onUpdate, initialTitle, onDelete }: PostSettingsPanelProps) {
  // Local state for UI display only (derived from selectedIds)
  const [techNames, setTechNames] = useState<string[]>([]);

  // Tech names are managed locally by TechStackSelector
  // Display names are synced via onChange callback, no API fetching needed

  useEffect(() => {
    // Only auto-generate if slug is empty and title exists
    if (initialTitle && !data.slug) {
      const generated = initialTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
      onUpdate({ slug: generated });
    }
  }, [initialTitle]); // Runs whenever the main title changes

  const generateSlug = () => {
    // Use current title if available, fallback to initialTitle
    const titleToUse = data.title || initialTitle || "blog-post";
    const slug = titleToUse
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      + "-" 
      + Date.now().toString(36);
    onUpdate({ slug });
  };

  
  return (
    <aside className="space-y-4">
      {/* Meta Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex justify-between border-b pb-3 mb-5">
          <h3 className="font-semibold text-sm text-slate-900">Post Settings</h3>
          <span className={`text-xs uppercase px-3 py-1 rounded-full font-medium ${
            data.status === 'published' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {data.status}
          </span>
        </div>

        {/* Status & Category Row */}
        <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b">
          <div>
            <label htmlFor="status" className="text-xs font-semibold text-slate-600 block mb-2">Status</label>
            <select 
              id="status"
              value={data.status} 
              onChange={(e) => onUpdate({ status: e.target.value as any, isPublished: e.target.value === 'published' })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="text-xs font-semibold text-slate-600 block mb-2">Category</label>
            <select 
              id="category"
              value={data.category} 
              onChange={(e) => onUpdate({ category: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category...</option>
              <option value="tech">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>
        </div>

        {/* Slug Section */}
        <div className="mb-5 pb-5 border-b">
          <label htmlFor="slug" className="text-xs font-semibold text-slate-600 block mb-2">URL Slug</label>
          <p className="text-xs text-slate-500 mb-2">Used in the post URL (auto-generated from title)</p>
          <div className="flex gap-2">
            <input
              id="slug"
              value={data.slug} 
              onChange={(e) => onUpdate({ slug: e.target.value })} 
              placeholder="my-awesome-post-slug"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SparkleButton onClick={generateSlug} className="text-xs px-3 py-2 whitespace-nowrap">
              Generate
            </SparkleButton>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-5 pb-5 border-b">
          <label className="text-xs font-semibold text-slate-600 block mb-3">Technologies & Tools</label>
          <TechStackSelector 
            selectedIds={data.technologies}
            selectedNames={techNames} 
            onChange={(ids: string[], names: string[]) => {
              onUpdate({ technologies: ids });
              setTechNames(names);
            }}
          />
        </div>


      </div>

      {/* Hero Image Component */}
      <HeroImageUploader 
        imageUrl={data.hero.imageUrl}
        caption={data.hero.caption}
        altText={data.hero.altText}
        onChange={(hero: typeof data.hero) => onUpdate({ hero })}
      />
    </aside>
  );
}
