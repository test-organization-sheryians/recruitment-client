"use client";

import React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function JobDescriptionEditor({ value, onChange }: Props) {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const isInitialized = React.useRef(false); // 🔥 KEY FIX

  /* ---------- set initial HTML ONLY ONCE ---------- */
  React.useEffect(() => {
    if (!editorRef.current) return;

    if (!isInitialized.current) {
      editorRef.current.innerHTML = value || "";
      isInitialized.current = true;
    }
  }, [value]);

  /* ---------- formatting helper ---------- */
  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      <label className="text-sm font-bold">Job Description</label>

      {/* ================= Toolbar ================= */}
      <div className="flex items-center gap-1 p-2 bg-white dark:bg-gray-900 border border-b-0 border-[#dbdde6] dark:border-gray-700 rounded-t-lg">
        <ToolbarButton onMouseDown={() => exec("bold")}>
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton onMouseDown={() => exec("italic")}>
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton onMouseDown={() => exec("underline")}>
          <Underline size={16} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

        <ToolbarButton onMouseDown={() => exec("insertUnorderedList")}>
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton onMouseDown={() => exec("insertOrderedList")}>
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

        <ToolbarButton
          onMouseDown={() => {
            editorRef.current?.focus();

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
              alert("Select text to add link");
              return;
            }

            const range = selection.getRangeAt(0);
            const selectedText = range.toString().trim();
            if (!selectedText) {
              alert("Select text to add link");
              return;
            }

            const url = prompt("Enter link URL");
            if (!url) return;

            // Create link HTML
            const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;

            // Replace selected text with link
            range.deleteContents();
            const fragment = range.createContextualFragment(linkHTML);
            range.insertNode(fragment);

            // Trigger onChange
            onChange(editorRef.current?.innerHTML || "");
          }}
        >
          <LinkIcon size={16} />
        </ToolbarButton>
      </div>

      {/* ================= Editor ================= */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Describe the role, responsibilities, and requirements..."
        className="rich-editor min-h-[300px] p-4 border rounded-b-lg bg-white dark:bg-gray-800 outline-none text-sm"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}

/* ================= Toolbar Button ================= */

function ToolbarButton({
  onMouseDown,
  children,
}: {
  onMouseDown: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // 🔥 SUPER IMPORTANT
        onMouseDown();
      }}
      className="
        p-2
        rounded-md
        hover:bg-gray-100
        dark:hover:bg-gray-800
        transition
        flex items-center justify-center
      "
    >
      {children}
    </button>
  );
}
