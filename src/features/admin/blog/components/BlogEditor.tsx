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
        text: "#0f172a",
        background: "#ffffff",
      },
      menu: {
        text: "#0f172a",
        background: "#ffffff",
      },
      tooltip: {
        text: "#0f172a",
        background: "#f1f5f9",
      },
      hovered: {
        text: "#ffffff",
        background: "#2563eb",
      },
      selected: {
        text: "#ffffff",
        background: "#1d4ed8",
      },
      border: "#e2e8f0",
      shadow: "#00000014",
    },
    borderRadius: 10,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  dark: {
    colors: {
      editor: {
        text: "#0f172a",
        background: "#ffffff",
      },
    },
  },
};

interface BlogEditorProps {
  initialContent?: PartialBlock[];
  onChange?: (blocks: PartialBlock[]) => void;
}

export default function BlogEditor({
  initialContent,
  onChange,
}: BlogEditorProps) {
  const [content, setContent] = useState<PartialBlock[]>(initialContent || []);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0
        ? initialContent
        : [
            {
              type: "paragraph",
              content: "",
            },
          ],

    placeholder: "Start writing your blog post here...",

    uploadFile: async (file: File) => {
      try {
        const imageUrl = await uploadFileToS3(file);
        return imageUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload image";
        console.error("❌ Image upload failed:", errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  });

  const slashItems = useMemo(
    () => getDefaultReactSlashMenuItems(editor),
    [editor],
  );

  function filterSuggestionItems(
    items: DefaultReactSuggestionItem[],
    query: string,
  ): DefaultReactSuggestionItem[] {
    return items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const SlashMenuGrid = ({
    items,
    selectedIndex,
    onItemClick,
  }: SuggestionMenuProps<DefaultReactSuggestionItem>) => (
    <div className="w-[340px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="px-2 pb-2 text-xs font-semibold uppercase text-slate-400">
        Add block
      </div>

      <div className="grid grid-cols-2 gap-1">
        {items.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            onClick={() => onItemClick?.(item)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              selectedIndex === index
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className=" w-full  ">
      <div className="w-full ">
        <BlockNoteView
          editor={editor}
          theme={forcedLightTheme}
          className="min-h-[900px] text-md"
          slashMenu={false}
          onChange={() => {
            const blocks = editor.document;
            setContent(blocks);
            onChange?.(blocks);
          }}
        >
          <SuggestionMenuController
            triggerCharacter="/"
            getItems={async (query: string) =>
              filterSuggestionItems(slashItems, query)
            }
            suggestionMenuComponent={SlashMenuGrid}
          />
        </BlockNoteView>

        <input type="hidden" value={JSON.stringify(content)} readOnly />
      </div>
    </div>
  );
}
