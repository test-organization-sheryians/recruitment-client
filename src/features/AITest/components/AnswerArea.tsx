"use client";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";

import Editor from "@monaco-editor/react";

interface Props {
  answerText: string;
  answerCode: string;
  onTextChange: (v: string) => void;
  onCodeChange: (v: string) => void;

  // ✅ FIXED TYPES
  prevent: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  preventKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;

  // Monaco requires 2 args; using tuple avoids eslint any-error
  editorMount: (editor: unknown, monaco: unknown) => void;
}

export default function AnswerPanel({
  answerText,
  answerCode,
  onTextChange,
  onCodeChange,
  prevent,
  preventKey,
  editorMount
}: Props) {
  return (
    <div className="h-[600px]">
      <PanelGroup direction="horizontal" className="border rounded-lg overflow-hidden">
        <Panel defaultSize={50} minSize={20}>
          <textarea
            value={answerText}
            onChange={(e) => onTextChange(e.target.value)}
            onPaste={prevent}
            onCopy={prevent}
            onCut={prevent}
            onKeyDown={preventKey}
            className="w-full h-full p-4 bg-white outline-none text-base"
            placeholder="Write your solution here..."
          />
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition" />

        <Panel defaultSize={50} minSize={20}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={answerCode}
            onChange={(v) => onCodeChange(v || "")}
            theme="vs-dark"
            onMount={editorMount}
            options={{
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
              fontSize: 14
            }}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
