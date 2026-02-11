"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState, useEffect } from "react";
import axios from "axios";
import api from "@/config/axios";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { searchSkill } from "@/api/skills/searchSkill";
import type { Skill } from "@/types/skilll";

interface PostSettingsPanelProps {
  onChange?: (payload: {
    slug: string;
    subtitle: string;
    category: string;
    technologies: string[];
    hero: {
      imageUrl: string;
      caption: string;
      altText: string;
    };
    status: "draft" | "published" | "archived";
    isPublished: boolean;
  }) => void;
  initialTitle?: string;
}

export default function PostSettingsPanel({ onChange, initialTitle = "" }: PostSettingsPanelProps) {
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [category, setCategory] = useState("Technology");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [heroImage, setHeroImage] = useState("");
  const [heroCaption, setHeroCaption] = useState("");
  const [heroAltText, setHeroAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [technologyInput, setTechnologyInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    console.log("=== POST SETTINGS DATA (JSON) ===");
    console.log(
      JSON.stringify(
        {
          slug,
          subtitle,
          status,
          category,
          technologies,
          hero: {
            imageUrl: heroImage,
            caption: heroCaption,
            altText: heroAltText,
          },
        },
        null,
        2
      )
    );
    console.log("================================");
  }, [slug, subtitle, status, category, technologies, heroImage, heroCaption, heroAltText]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const uniqueSuffix = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const generateUniqueSlug = (value: string) => {
    const base = slugify(value);
    if (!base) return "";
    return `${base}-${uniqueSuffix()}`;
  };

  // Auto-generate slug when component receives initial title
  useState(() => {
    if (initialTitle && !slug) {
      const generatedSlug = generateUniqueSlug(initialTitle);
      setSlug(generatedSlug);
      notify({ slug: generatedSlug });
    }
  });

  const notify = (payload?: Partial<{
    slug: string;
    subtitle: string;
    category: string;
    technologies: string[];
    hero: { imageUrl: string; caption: string; altText: string };
    status: "draft" | "published" ;
    isPublished: boolean;
  }>) => {
    if (onChange) {
      onChange({
        slug,
        subtitle,
        category,
        technologies,
        hero: {
          imageUrl: heroImage,
          caption: heroCaption,
          altText: heroAltText
        },
        status,
        isPublished: status === "published",
        ...payload,
      });
    }
  };

  const fallbackToBase64 = (fallbackFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      setHeroImage(base64Url);
      notify({
        hero: { imageUrl: base64Url, caption: heroCaption, altText: heroAltText }
      });

      console.log("✅ Hero image stored as base64 (fallback)");
      console.log("%c========== HERO IMAGE URL (Click to open) ==========", "color: orange; font-weight: bold; font-size: 14px;");
      console.log(base64Url);
      console.log("%c===================================================", "color: orange; font-weight: bold;");
      console.log("Hero Object:", { imageUrl: base64Url, caption: heroCaption, altText: heroAltText });
      console.log("=== HERO IMAGE UPLOAD END ===");
    };
    reader.readAsDataURL(fallbackFile);
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);

      const fileDetails = {
        fileName: `blog-${Date.now()}-${file.name}`,
        contentType: file.type,
      };

      console.log("=== HERO IMAGE UPLOAD START ===");
      console.log("File Name:", file.name);
      console.log("File Size:", `${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log("File Type:", file.type);
      console.log("Generated File Name:", fileDetails.fileName);
      console.log("Uploading to S3...");

      try {
        // Step 1: Get presigned URL from backend
        const response = await api.post<string>("/api/aws/presignedurl-s3", fileDetails, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const presignedUrl = response.data;

        if (!presignedUrl) {
          throw new Error("No presigned URL received from server");
        }

        console.log("Presigned URL received:", presignedUrl);

        // Step 2: Upload file to S3 using presigned URL
        await axios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // Step 3: Construct the public S3 URL
        const imageUrl = `https://sherihunt.s3.ap-south-1.amazonaws.com/uploads/${encodeURIComponent(fileDetails.fileName)}`;

        setHeroImage(imageUrl);
        notify({
          hero: { imageUrl, caption: heroCaption, altText: heroAltText }
        });

        console.log("✅ Hero image uploaded successfully!");
        console.log("%c========== HERO IMAGE URL (Click to open) ==========", "color: green; font-weight: bold; font-size: 14px;");
        console.log(imageUrl);
        console.log("%c===================================================", "color: green; font-weight: bold;");
        console.log("Hero Object:", { imageUrl, caption: heroCaption, altText: heroAltText });
        console.log("=== HERO IMAGE UPLOAD END ===");
        return;
      } catch (s3Error) {
        console.warn("S3 upload failed, using base64 fallback:", s3Error);
        fallbackToBase64(file);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      let errorMessage = "Failed to upload image";

      if (axios.isAxiosError(error)) {
        errorMessage += `: ${error.response?.data?.message || error.message}`;
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    uploadImage(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadImage(file);
    } else {
      alert("Please drop a valid image file");
    }
  };

  const addTechnology = (value: string) => {
    const nextTech = value.trim();
    if (!nextTech) return;
    if (technologies.some((tech) => tech.toLowerCase() === nextTech.toLowerCase())) return;
    const nextTechnologies = [...technologies, nextTech];
    setTechnologies(nextTechnologies);
    notify({ technologies: nextTechnologies });
    setTechnologyInput("");
  };

  const removeTechnology = (value: string) => {
    const nextTechnologies = technologies.filter((tech) => tech !== value);
    setTechnologies(nextTechnologies);
    notify({ technologies: nextTechnologies });
  };

  const handleTechnologyKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology(technologyInput);
    }
  };

  // Search for skills when user types
  useEffect(() => {
    const searchSkills = async () => {
      if (technologyInput.trim().length > 0) {
        try {
          const results = await searchSkill(technologyInput);
          setSkillSuggestions(results || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error searching skills:", error);
          setSkillSuggestions([]);
        }
      } else {
        setSkillSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(searchSkills, 300);
    return () => clearTimeout(debounce);
  }, [technologyInput]);

  const selectSkillFromSuggestion = (skill: Skill) => {
    if (technologies.includes(skill.name)) return;
    if (selectedSkillIds.includes(skill._id)) return;
    
    const nextTechnologies = [...technologies, skill.name];
    const nextSkillIds = [...selectedSkillIds, skill._id];
    
    setTechnologies(nextTechnologies);
    setSelectedSkillIds(nextSkillIds);
    notify({ technologies: nextSkillIds }); // Send skill IDs to parent
    setTechnologyInput("");
    setShowSuggestions(false);
  };

  const statusStyles: Record<"draft" | "published" | "archived", string> = {
    draft: "bg-amber-50 text-amber-700",
    published: "bg-emerald-50 text-emerald-600",
    archived: "bg-slate-100 text-slate-600",
  };

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Post settings</div>
            <p className="text-xs text-slate-400">Manage visibility and distribution</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
        <div className="space-y-3 pt-4">
          <div>
            <label className="text-xs font-semibold text-slate-600">Slug</label>
            <div className="mt-2 flex gap-2">
              <input
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  notify({ slug: event.target.value });
                }}
                placeholder="post-slug"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <Button
                type="button"
                onClick={() => {
                  const nextSlug = generateUniqueSlug(initialTitle || "post");
                  setSlug(nextSlug);
                  notify({ slug: nextSlug });
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap"
              >
                Make unique
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Auto-generated with a unique suffix to avoid duplicates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Status</label>
              <select
                value={status}
                onChange={(event) => {
                  const value = event.target.value as "draft" | "published" | "archived";
                  setStatus(value);
                  notify({ status: value, isPublished: value === "published" });
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Category</label>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  notify({ category: event.target.value });
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Company">Company</option>
                <option value="Recruitment">Recruitment</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Subtitle</label>
            <textarea
              value={subtitle}
              onChange={(event) => {
                setSubtitle(event.target.value);
                notify({ subtitle: event.target.value });
              }}
              placeholder="Short subtitle for the post"
              rows={2}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          {category === "Technology" && (
            <div>
              <label className="text-xs font-semibold text-slate-600">Technology Tags</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    {tech}
                    <span className="text-[10px]">×</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 relative">
                <div className="flex gap-2">
                  <Input
                    value={technologyInput}
                    onChange={(event) => setTechnologyInput(event.target.value)}
                    onKeyDown={handleTechnologyKeyDown}
                    onFocus={() => technologyInput && setShowSuggestions(true)}
                    placeholder="Search and add technology..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={() => addTechnology(technologyInput)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Add
                  </Button>
                </div>
                {showSuggestions && skillSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-auto">
                    {skillSuggestions.map((skill) => (
                      <button
                        key={skill._id}
                        type="button"
                        onClick={() => selectSkillFromSuggestion(skill)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between"
                      >
                        <span>{skill.name}</span>
                        {technologies.includes(skill.name) && (
                          <span className="text-xs text-blue-600">✓ Added</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Hero Image</div>
        <p className="mb-4 text-xs text-slate-400">Main image shown on the post and social previews.</p>
        {heroImage ? (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={heroImage}
                alt={heroAltText || "Hero"}
                className="h-40 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setHeroImage("");
                  setHeroCaption("");
                  setHeroAltText("");
                  notify({ 
                    hero: { imageUrl: "", caption: "", altText: "" }
                  });
                }}
                className="absolute top-2 right-2 rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
            <div>
              <Input
                value={heroCaption}
                onChange={(event) => {
                  setHeroCaption(event.target.value);
                  notify({ hero: { imageUrl: heroImage, caption: event.target.value, altText: heroAltText } });
                }}
                placeholder="Image caption"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Input
                value={heroAltText}
                onChange={(event) => {
                  setHeroAltText(event.target.value);
                  notify({ hero: { imageUrl: heroImage, caption: heroCaption, altText: event.target.value } });
                }}
                placeholder="Alt text for accessibility"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 cursor-pointer hover:border-slate-400 hover:bg-slate-100 transition"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <span className="text-base">🖼️</span>
                <span>Drag & drop or click to upload</span>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {!heroImage && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload image"}
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
        <button
          type="button"
          className="w-full rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
        >
          Delete draft
        </button>
      </div>
    </aside>
  );
}

