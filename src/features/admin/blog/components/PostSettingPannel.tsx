"use client";

import { useState, useEffect } from "react";
import SparkleButton from "@/components/ui/SparkelButtonBlogcreate";
import HeroImageUploader from "./HeroImageUpload";
import TechStackSelector from "./TanStackSelector";
import { BlogPost } from "@/types/blog";
import { getCategories } from "@/api/category/getCategories";
import { getAllSkills } from "@/api/skills/getAllSkills";
import type { JobCategory } from "@/types/JobCategeory";
import type { Skill } from "@/types/skilll";

interface PostSettingsPanelProps {
  data: BlogPost;
  onUpdate: (updates: Partial<BlogPost>) => void;
  initialTitle?: string;
  onDelete?: () => void;
  isEdit?: boolean;
  onDeleteBlog?: () => void;
}

export default function PostSettingsPanel({
  data,
  onUpdate,
  initialTitle,
  onDelete,
  isEdit,
  onDeleteBlog,
}: PostSettingsPanelProps) {
  // Local state for UI display only (derived from selectedIds)
  const [techNames, setTechNames] = useState<string[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [savedTime, setSavedTime] = useState<Date | null>(new Date());
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // Tech names are managed locally by TechStackSelector
  // Display names are synced via onChange callback, no API fetching needed

  useEffect(() => {
    // Fetch all skills to map IDs to names
    const fetchSkills = async () => {
      try {
        const skills = await getAllSkills();
        setAllSkills(Array.isArray(skills) ? skills : []);
        console.log("✅ Fetched all skills:", skills);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Only auto-generate if slug is empty and title exists
    if (initialTitle && !data.slug) {
      const generated =
        initialTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Math.random().toString(36).substring(2, 6);
      onUpdate({ slug: generated });
    }
  }, [initialTitle]); // Runs whenever the main title changes

  useEffect(() => {
    // Sync tech names when technologies IDs change
    if (
      Array.isArray(data.technologies) &&
      data.technologies.length > 0 &&
      allSkills.length > 0
    ) {
      console.log("📌 Technologies IDs from data:", data.technologies);

      // Map IDs to names
      const names = data.technologies.map((techId: string) => {
        const skill = allSkills.find((s) => s._id === techId);
        return skill?.name || techId;
      });

      console.log("📌 Mapped technology names:", names);
      setTechNames(names);
    } else if (
      !Array.isArray(data.technologies) ||
      data.technologies.length === 0
    ) {
      setTechNames([]);
    }
  }, [data.technologies, allSkills]);

  const generateSlug = () => {
    // Use current title if available, fallback to initialTitle
    const titleToUse = data.title || initialTitle || "blog-post";
    const slug =
      titleToUse
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") + // Remove leading/trailing hyphens
      "-" +
      Date.now().toString(36);
    onUpdate({ slug });
  };

  return (
    <aside className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Post Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage visibility and distribution
        </p>
      </div>

      {/* Hero Image Component - FIRST */}
      <div>
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="text-base">🖼️</span> Featured Image
        </h3>
        <HeroImageUploader
          imageUrl={data.hero.imageUrl}
          caption={data.hero.caption}
          altText={data.hero.altText}
          onChange={(hero: typeof data.hero) => onUpdate({ hero })}
        />
      </div>

      {/* Status Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-600  uppercase tracking-wider mb-2">
          Status
        </h3>
        <select
          value={data.status}
          onChange={(e) => {
            setSavedTime(new Date());
            onUpdate({ status: e.target.value as any });
          }}
          className="w-full border cursor-pointer border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Subtitle Section */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Subtitle
        </h3>
        <input
          value={data.subtitle || ""}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder="Add a short subtitle for the blog"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* URL Slug Section */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          URL Slug
        </h3>
        <div className="flex gap-2">
          <input
            value={data.slug || ""}
            onChange={(e) => onUpdate({ slug: formatSlug(e.target.value) })}
            placeholder="my-awesome-post-slug"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-transparent"
          />
          <SparkleButton onClick={generateSlug} className="px-4 py-2 text-sm">
            Generate
          </SparkleButton>
        </div>
      </div>

      {/* Category Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
          Category
        </h3>
        <select
          value={data.category}
          onChange={(e) => onUpdate({ category: e.target.value })}
          className="w-full border border-slate-300 cursor-pointer rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          disabled={loadingCategories}
        >
          <option value="">Select a category...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tech Stack / Tags Section */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Tags
        </h3>
        <TechStackSelector
          selectedIds={data.technologies}
          selectedNames={techNames}
          onChange={(ids: string[], names: string[]) => {
            onUpdate({ technologies: ids });
            setTechNames(names);
          }}
        />
      </div>

      {/* Delete Button */}
      {isEdit && (
        <button
          onClick={onDeleteBlog}
          className="w-full py-3 text-sm font-semibold cursor-pointer text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-2 bg-white"
        >
          <span>🗑️</span>
          Delete Draft
        </button>
      )}
    </aside>
  );
}
