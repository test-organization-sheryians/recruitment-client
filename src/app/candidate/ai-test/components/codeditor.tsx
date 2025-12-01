"use client";

import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

export default function CodeEditor() {
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // ❌ Disable paste using browser event (strongest method)
    const pasteHandler = (ev: ClipboardEvent) => {
      if (editor.hasTextFocus()) {
        ev.preventDefault();
      }
    };
    document.addEventListener("paste", pasteHandler, true);

    // ❌ Disable Ctrl+V / Cmd+V / Shift+Insert
    const keyHandler = (ev: KeyboardEvent) => {
      if (!editor.hasTextFocus()) return;

      const isCtrlV = (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "v";
      const isShiftInsert = ev.shiftKey && ev.key === "Insert";

      if (isCtrlV || isShiftInsert) {
        ev.preventDefault();
      }
    };
    document.addEventListener("keydown", keyHandler, true);

    // ❌ Disable right-click paste
    editor.onContextMenu((e) => e.event.preventDefault());

    // Cleanup listeners when editor unmounts
    editor.onDidDispose(() => {
      document.removeEventListener("paste", pasteHandler, true);
      document.removeEventListener("keydown", keyHandler, true);
    });
  };

  return (
    <div className="h-[500px]">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Start typing..."
        theme="vs-dark"
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          autoClosingBrackets: "always",
          autoIndent: "full",
          suggestOnTriggerCharacters: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
