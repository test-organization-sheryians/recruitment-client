"use client";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor as MonacoEditor, KeyMod, KeyCode } from "monaco-editor";

interface QuestionAreaProps {
  questionText: string;
  isPending: boolean;
  answerText: string;
  setAnswerText: (value: string) => void;
  answerCode: string;
  setAnswerCode: (value: string) => void;
}

export const QuestionArea: React.FC<QuestionAreaProps> = ({
  questionText,
  isPending,
  answerText,
  setAnswerText,
  answerCode,
  setAnswerCode,
}) => {

  const handleEditorMount: OnMount = (
    editor: MonacoEditor.IStandaloneCodeEditor
  ) => {
    const domNode = editor.getDomNode();
    if (!domNode) return;

    // Disable paste 
    const pasteHandler = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    domNode.addEventListener("paste", pasteHandler);

    editor.addAction({
      id: "disable-paste",
      label: "Disable Paste",
      keybindings: [
        KeyMod.CtrlCmd | KeyCode.KeyV,
        KeyMod.Shift | KeyCode.Insert,
      ],
      contextMenuGroupId: "disable",
      
      run: () => {},
    });
  };

  return (
    <>
    
      <div className="bg-white p-6 rounded-t-xl border border-gray-200 mb-0 shadow-sm">
        <p
          className="text-xl font-medium text-gray-700 no-copy"
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {questionText}
        </p>
      </div>


      <textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        onPaste={(e) => e.preventDefault()}
        rows={8}
        placeholder="Type your answer here..."
        disabled={isPending}
        className="w-full p-4 text-[20px] leading-relaxed border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
          rounded-b-none rounded-t-none"
        style={{ resize: "vertical", minHeight: "150px" }}
      />

      <div className="border border-gray-900 rounded-b-lg">
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={answerCode}
          theme="vs-dark"
          onMount={handleEditorMount}
          onChange={(value) => setAnswerCode(value ?? "")}
          options={{
            fontSize: 20,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            lineNumbers: "on",
            wordWrap: "on",
            smoothScrolling: true,
          }}
        />
      </div>
    </>
  );
};
