"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  X,
  Check,
} from "lucide-react";
import React from "react";

export default function JobDescriptionEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [showLinkUI, setShowLinkUI] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "prosemirror-editor min-h-[250px] p-4 text-sm bg-white dark:bg-gray-800 outline-none focus:outline-none focus:ring-0",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Keep editor in sync with external value
  React.useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const applyLink = () => {
  if (!linkUrl) return;

  const safeUrl =
    linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
      ? linkUrl
      : `https://${linkUrl}`;

  if (editor.state.selection.empty) {
    // 🔥 No text selected → insert link as text
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${safeUrl}" target="_blank">${safeUrl}</a>`)
      .run();
  } else {
    // Text selected → convert into link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: safeUrl, target: "_blank" })
      .run();
  }

  setLinkUrl("");
  setShowLinkUI(false);
};


  return (
    <div className="flex flex-col gap-2 mt-2">
      <label className="text-sm font-bold">Job Description</label>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white dark:bg-gray-900 cursor-pointer">
          <Btn 
          onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={16} />
          </Btn>

          <Btn 
          onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={16} />
          </Btn>

          <Btn 
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List size={16} />
          </Btn>

          <Btn 
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered size={16} />
          </Btn>

          <Btn onClick={() => setShowLinkUI((v) => !v)}>
            <LinkIcon size={16} />
          </Btn>
        </div>

        {/* Link Input */}
        {showLinkUI && (
          <div className="flex items-center gap-2 p-3 border-b bg-gray-50 dark:bg-gray-800">
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL (e.g. https://example.com)"
              className="flex-1 px-3 py-2 rounded-md border text-sm bg-white dark:bg-gray-700 outline-none"
            />

            <button
              type="button"
              onClick={applyLink}
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <Check size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowLinkUI(false);
                setLinkUrl("");
              }}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>

      {/* 🔥 LIST STYLES — IN SAME FILE */}
      <style jsx global>{`
        .prosemirror-editor ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }

        .prosemirror-editor ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }

        .prosemirror-editor li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}

/* ---------- Toolbar Button ---------- */
function Btn({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
  p-2 rounded transition cursor-pointer
  ${active
    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40"
    : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"}
`}

    >
      {children}
    </button>
  );
}
