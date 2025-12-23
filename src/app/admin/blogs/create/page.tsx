"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Smile,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  List,
  ListOrdered,
  Copy,
  CalendarClock,
  SendHorizontal,
  Eye,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------- Type Definitions ---------------------------- */

type BlogStatus = "draft" | "published";

type BlogBlock =
  | { type: "paragraph"; value: string }
  | { type: "image"; value: string };

interface BlogFormState {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string[];
  readTime: string; // e.g., "6 min"
  status: BlogStatus;
  content: BlogBlock[];
}

/* --------------------------------- Helpers -------------------------------- */

const slugify = (input: string) => {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return cleaned;
};

const initialState: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  coverImageUrl: "",
  tags: [],
  readTime: "",
  status: "draft",
  content: [{ type: "paragraph", value: "" }],
};

/* ----------------------------- CreateBlogPage ------------------------------ */

export default function CreateBlogPage() {
  const [form, setForm] = useState<BlogFormState>(initialState);
  const [activeBlock, setActiveBlock] = useState<number>(0);
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [linkUrlInput, setLinkUrlInput] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState<string>("");

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  // simple undo/redo stacks
  const historyRef = useRef<BlogFormState[]>([]);
  const futureRef = useRef<BlogFormState[]>([]);

  // refs for each paragraph textarea to handle selection insertions
  const textAreaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const pushHistory = useCallback((next: BlogFormState) => {
    historyRef.current.push(next);
    // clear future stack on normal change
    futureRef.current = [];
  }, []);

  // keep slug in sync when title changes, unless user edited slug manually later
  const handleTitleChange = (value: string) => {
    const auto = slugify(value);
    const next = { ...form, title: value, slug: auto };
    setForm(next);
    pushHistory(next);
  };

  const handleSlugChange = (value: string) => {
    const next = { ...form, slug: value };
    setForm(next);
    pushHistory(next);
  };

  const handleSimpleField = (
    key: keyof Pick<BlogFormState, "excerpt" | "coverImageUrl" | "readTime">,
    value: string
  ) => {
    const next = { ...form, [key]: value };
    setForm(next);
    pushHistory(next);
  };

  const handleStatusChange = (value: BlogStatus) => {
    const next = { ...form, status: value };
    setForm(next);
    pushHistory(next);
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const next = { ...form, tags };
    setForm(next);
    pushHistory(next);
  };

  const setBlockValue = (index: number, value: string) => {
    const nextBlocks = form.content.map((b, i) =>
      i === index ? { ...b, value } : b
    );
    const next = { ...form, content: nextBlocks };
    setForm(next);
    pushHistory(next);
  };

  const addParagraph = () => {
    const next: BlogFormState = {
      ...form,
      content: [...form.content, { type: "paragraph" as const, value: "" }],
    };
    setForm(next);
    pushHistory(next);
    setActiveBlock(form.content.length);
  };

  const addImageBlock = (url?: string) => {
    const finalUrl = url ?? imageUrlInput.trim();
    if (!finalUrl) return;
    const next: BlogFormState = {
      ...form,
      content: [...form.content, { type: "image" as const, value: finalUrl }],
    };
    setForm(next);
    pushHistory(next);
    setImageUrlInput("");
    setActiveBlock(form.content.length);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      handleSimpleField("coverImageUrl", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleContentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const next: BlogFormState = {
        ...form,
        content: [...form.content, { type: "image" as const, value: dataUrl }],
      };
      setForm(next);
      pushHistory(next);
      setImageUrlInput("");
      setActiveBlock(form.content.length);
    };
    reader.readAsDataURL(file);
  };

  const removeBlock = (index: number) => {
    const next = {
      ...form,
      content: form.content.filter((_, i) => i !== index),
    };
    setForm(next);
    pushHistory(next);
    if (activeBlock === index) setActiveBlock(Math.max(0, index - 1));
  };

  /* ---------------------------- Formatting Actions --------------------------- */

  const applyWrapping = (index: number, prefix: string, suffix = prefix) => {
    const ta = textAreaRefs.current[index];
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const current = form.content[index];
    if (current?.type !== "paragraph") return;
    const value = current.value || "";
    const sel = value.slice(start, end) || "";
    const before = value.slice(0, start);
    const after = value.slice(end);
    const nextValue = `${before}${prefix}${sel}${suffix}${after}`;
    setBlockValue(index, nextValue);
    // restore caret
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + prefix.length;
      ta.selectionEnd = end + prefix.length;
    });
  };

  const insertAtCaret = (index: number, insertText: string) => {
    const ta = textAreaRefs.current[index];
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const current = form.content[index];
    if (current?.type !== "paragraph") return;
    const value = current.value || "";
    const before = value.slice(0, start);
    const after = value.slice(end);
    const nextValue = `${before}${insertText}${after}`;
    setBlockValue(index, nextValue);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insertText.length;
      ta.selectionStart = pos;
      ta.selectionEnd = pos;
    });
  };

  const insertLink = (index: number, url: string) => {
    if (!url) return;
    applyWrapping(
      index,
      `<a href="${url}" target="_blank" rel="noopener noreferrer">`,
      "</a>"
    );
    setLinkUrlInput("");
  };

  const makeList = (index: number, ordered = false) => {
    const current = form.content[index];
    if (current?.type !== "paragraph") return;
    const lines = (current.value || "").split(/\n/);
    const nextValue = lines
      .map((l, i) => (ordered ? `${i + 1}. ${l}` : `- ${l}`))
      .join("\n");
    setBlockValue(index, nextValue);
  };

  const undoChange = () => {
    const history = historyRef.current;
    if (history.length < 2) return;
    const current = history.pop(); // remove current snapshot
    if (!current) return;
    futureRef.current.push(current);
    const prev = history[history.length - 1];
    setForm(prev);
  };

  const redoChange = () => {
    const future = futureRef.current;
    if (!future.length) return;
    const next = future.pop()!;
    historyRef.current.push(next);
    setForm(next);
  };

  useEffect(() => {
    // seed initial snapshot
    historyRef.current = [initialState];
  }, []);

  /* --------------------------------- Submit -------------------------------- */

  const blogPayload = useMemo(() => form, [form]);

  const handleCopyText = async () => {
    const text = form.content
      .map((b) => (b.type === "paragraph" ? b.value : `![image](${b.value})`))
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Clipboard write failed", e);
    }
  };

  const handlePostNow = () => {
    console.log({ blog: blogPayload });
  };

  /* --------------------------------- Render -------------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create Blog</h1>
          <p className="text-sm text-gray-500">
            Compose and publish a new blog post
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyText}>
            <Copy className="mr-2" /> {copied ? "Copied!" : "Copy text"}
          </Button>
          <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-2" /> Preview
          </Button>
          <Button
            variant="destructive"
            onClick={() => console.log("Schedule clicked", blogPayload)}
          >
            <CalendarClock className="mr-2" /> Schedule
          </Button>
          <Button onClick={handlePostNow}>
            <SendHorizontal className="mr-2" /> Post now
          </Button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Blog Title</label>
            <Input
              placeholder="A compelling title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <Input
              placeholder="auto-generated"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Excerpt</label>
            <textarea
              placeholder="Short summary of the article"
              value={form.excerpt}
              onChange={(e) => handleSimpleField("excerpt", e.target.value)}
              rows={3}
              className={cn(
                "mt-1 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
                "placeholder:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Cover Image</label>
            <div className="mt-1 flex gap-2">
              <input
                type="file"
                ref={coverImageInputRef}
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => coverImageInputRef.current?.click()}
                className="shrink-0"
              >
                <Upload className="mr-2 h-4 w-4" />
                {form.coverImageUrl ? "Change Image" : "Upload Image"}
              </Button>
              {form.coverImageUrl && (
                <div className="relative flex-1">
                  <img
                    src={form.coverImageUrl}
                    alt="Cover preview"
                    className="h-10 w-auto rounded border object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">
              Tags (comma-separated)
            </label>
            <Input
              placeholder="nextjs, typescript, tailwind"
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Read Time</label>
            <Input
              placeholder="6 min"
              value={form.readTime}
              onChange={(e) => handleSimpleField("readTime", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleStatusChange(e.target.value as BlogStatus)}
              className={cn(
                "mt-1 w-full border border-input rounded-md px-3 py-2 bg-white",
                "focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              )}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 border rounded-md bg-background p-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Bold"
              onClick={() => applyWrapping(activeBlock, "<b>", "</b>")}
            >
              <Bold />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Italic"
              onClick={() => applyWrapping(activeBlock, "<i>", "</i>")}
            >
              <Italic />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Underline"
              onClick={() => applyWrapping(activeBlock, "<u>", "</u>")}
            >
              <Underline />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Strike"
              onClick={() => applyWrapping(activeBlock, "<s>", "</s>")}
            >
              <Strikethrough />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Emoji"
                onClick={() => setEmojiOpen((o) => !o)}
              >
                <Smile />
              </Button>
              {emojiOpen && (
                <div className="absolute z-10 mt-2 w-44 rounded-md border bg-white p-2 shadow-sm">
                  <div className="grid grid-cols-6 gap-1 text-xl">
                    {[
                      "😀",
                      "😁",
                      "😂",
                      "😊",
                      "😍",
                      "🤔",
                      "😎",
                      "👍",
                      "🔥",
                      "✨",
                      "🎉",
                      "❤️",
                    ].map((emj) => (
                      <button
                        key={emj}
                        className="rounded hover:bg-accent"
                        onClick={() => {
                          insertAtCaret(activeBlock, emj);
                          setEmojiOpen(false);
                        }}
                        type="button"
                      >
                        {emj}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Image URL"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="h-9 w-48"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => addImageBlock()}
              >
                <ImageIcon className="mr-2" /> URL
              </Button>
              <input
                type="file"
                ref={contentImageInputRef}
                accept="image/*"
                onChange={handleContentImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => contentImageInputRef.current?.click()}
              >
                <Upload className="mr-2" /> Upload
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="https://link"
                value={linkUrlInput}
                onChange={(e) => setLinkUrlInput(e.target.value)}
                className="h-9 w-44"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertLink(activeBlock, linkUrlInput)}
              >
                <LinkIcon className="mr-2" /> Link
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Undo"
              onClick={undoChange}
            >
              <Undo />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Redo"
              onClick={redoChange}
            >
              <Redo />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Bulleted List"
              onClick={() => makeList(activeBlock, false)}
            >
              <List />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Numbered List"
              onClick={() => makeList(activeBlock, true)}
            >
              <ListOrdered />
            </Button>

            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={addParagraph}>
                Add paragraph
              </Button>
            </div>
          </div>

          {/* Editor Blocks */}
          <div className="space-y-4">
            {form.content.map((block, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-md border p-3",
                  activeBlock === idx ? "ring-2 ring-ring/50" : ""
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">
                    {block.type === "paragraph" ? "Paragraph" : "Image"}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBlock(idx)}
                  >
                    Remove
                  </Button>
                </div>

                {block.type === "paragraph" ? (
                  <textarea
                    ref={(el) => {
                      textAreaRefs.current[idx] = el;
                    }}
                    value={block.value}
                    onFocus={() => setActiveBlock(idx)}
                    onChange={(e) => setBlockValue(idx, e.target.value)}
                    rows={8}
                    placeholder="Write here..."
                    className={cn(
                      "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
                      "placeholder:text-muted-foreground",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    )}
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <img
                      src={block.value}
                      alt="cover"
                      className="max-h-64 rounded-md border object-cover"
                    />
                    <Input
                      value={block.value}
                      onChange={(e) => setBlockValue(idx, e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setPreviewOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
              {/* Preview Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Blog Preview</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewOpen(false)}
                >
                  <X />
                </Button>
              </div>

              {/* Preview Content */}
              <div className="p-8">
                {/* Cover Image */}
                {form.coverImageUrl && (
                  <img
                    src={form.coverImageUrl}
                    alt={form.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  {form.status === "published" && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md">
                      Published
                    </span>
                  )}
                  {form.status === "draft" && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      Draft
                    </span>
                  )}
                  {form.readTime && <span>📖 {form.readTime}</span>}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4">
                  {form.title || "Untitled Blog"}
                </h1>

                {/* Slug */}
                {form.slug && (
                  <p className="text-sm text-gray-500 mb-4 font-mono">
                    /{form.slug}
                  </p>
                )}

                {/* Excerpt */}
                {form.excerpt && (
                  <p className="text-lg text-gray-600 italic mb-6 border-l-4 border-blue-500 pl-4">
                    {form.excerpt}
                  </p>
                )}

                {/* Tags */}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {form.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <hr className="my-6" />

                {/* Content Blocks */}
                <div className="space-y-4">
                  {form.content.map((block, idx) => (
                    <div key={idx}>
                      {block.type === "paragraph" ? (
                        <div
                          className="prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: block.value.replace(/\n/g, "<br />"),
                          }}
                        />
                      ) : (
                        <img
                          src={block.value}
                          alt={`Content ${idx}`}
                          className="w-full rounded-lg border"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
