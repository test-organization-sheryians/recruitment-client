"use client";

import { useMemo, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  type DefaultReactSuggestionItem,
  type SuggestionMenuProps,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { uploadFileToS3 } from "@/lib/uploadFile";
import toast from "react-hot-toast";

const forcedLightTheme = {
  light: {
    colors: {
      editor: {
        text: "#000000",
        background: "#ffffff",
      },
      menu: {
        text: "#111518",
        background: "#ffffff",
      },
      tooltip: {
        text: "#111518",
        background: "#f0f0f0",
      },
      hovered: {
        text: "#ffffff",
        background: "#138aec",
      },
      selected: {
        text: "#ffffff",
        background: "#0e6fc4",
      },
      disabled: {
        text: "#9ca3af",
        background: "#f3f4f6",
      },
      shadow: "#0000001a",
      border: "#dbe1e6",
    },
    borderRadius: 6,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  dark: {
    colors: {
      editor: {
        text: "#000000",
        background: "#ffffff",
      },
    },
  },
} satisfies Parameters<typeof BlockNoteView>[0]["theme"];

interface BlogEditorProps {
  initialContent?: PartialBlock[];
  onChange?: (blocks: PartialBlock[]) => void;
}

export default function BlogEditor({
  initialContent,
  onChange,
}: BlogEditorProps) {
  const [content, setContent] = useState<PartialBlock[]>(
    initialContent || []
  );

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0
        ? initialContent
        : [
            {
              type: "paragraph",
              content: "Start writing your blog post here...",
            },
          ],
    uploadFile: async (file: File) => {
      try {
        const imageUrl = await uploadFileToS3(file);
        return imageUrl;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
        console.error("❌ Image upload failed:", errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  });

  const slashItems = useMemo(
    () => getDefaultReactSlashMenuItems(editor),
    [editor]
  );

  function filterSuggestionItems(items: DefaultReactSuggestionItem[], query: string): DefaultReactSuggestionItem[] {
    return items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  const SlashMenuGrid = ({
    items,
    selectedIndex,
    onItemClick,
  }: SuggestionMenuProps<DefaultReactSuggestionItem>) => (
    <div className="w-[320px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
      <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Add block
      </div>
      <div className="grid grid-cols-2 gap-1">
        {items.map((item: DefaultReactSuggestionItem, index: number) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            onClick={() => onItemClick?.(item)}
            className={`flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium transition ${
              selectedIndex === index
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="text-slate-400">{item.icon}</span>
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ minHeight: "520px" }}
    >
      <BlockNoteView
        editor={editor}
        theme={forcedLightTheme}
        className="p-6"
        style={{ minHeight: "520px" }}
        slashMenu={false}
        onChange={() => {
          const blocks = editor.document;
          setContent(blocks);
          console.log("=== BLOG CONTENT DATA (JSON) ===");
          console.log(JSON.stringify(blocks, null, 2));
          console.log("===============================");
          onChange?.(blocks);
        }}
      >
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query: string) => 
            // Use the built-in utility for better performance and fuzzy matching
            filterSuggestionItems(slashItems, query) 
          }
          suggestionMenuComponent={SlashMenuGrid}
        />
      </BlockNoteView>
      <div className="absolute bottom-3 right-4 text-xs text-slate-400 pointer-events-none">
        Drag blocks to reorder
      </div>
      <input type="hidden" value={JSON.stringify(content)} readOnly />
    </div>
  );
}




