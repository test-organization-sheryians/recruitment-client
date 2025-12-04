"use client";

import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor as MonacoEditor } from "monaco-editor";

export default function CodeEditor() {
  // FIX: useRef typed properly (no any)
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  // FIX: removed unused `monaco`
  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Disable paste (browser-level)
    const pasteHandler = (ev: ClipboardEvent) => {
      if (editor.hasTextFocus()) {
        ev.preventDefault();
      }
    };
    document.addEventListener("paste", pasteHandler, true);

    // Disable Ctrl+V, Cmd+V, Shift+Insert
    const keyHandler = (ev: KeyboardEvent) => {
      if (!editor.hasTextFocus()) return;

      const isCtrlV =
        (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "v";
      const isShiftInsert = ev.shiftKey && ev.key === "Insert";

      if (isCtrlV || isShiftInsert) {
        ev.preventDefault();
      }
    };
    document.addEventListener("keydown", keyHandler, true);

    // Disable right-click paste
    editor.onContextMenu((e) => e.event.preventDefault());

    // Cleanup listeners
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
