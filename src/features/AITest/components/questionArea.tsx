"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor as MonacoEditor, KeyMod, KeyCode } from "monaco-editor";

interface QuestionAreaProps {
  questionText: string;
  isPending: boolean;
  answerText: string;
  setAnswerText: (value: string) => void;
  answerCode: string;
  setAnswerCode: (value: string) => void;
  testId: string,
  initialSwitchCount: number; // Fetch this from your initial test API
  isBlocked: boolean;
}

export const QuestionArea: React.FC<QuestionAreaProps> = ({
  questionText,
  isPending,
  answerText,
  setAnswerText,
  answerCode,
  setAnswerCode,
  testId = "defaut-test",
  initialSwitchCount= 0, 
  isBlocked,
}) => {

const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = (
    editor: MonacoEditor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;

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

      run: () => { },
    });
  };

   useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.updateOptions({
      readOnly: isBlocked,
      domReadOnly: isBlocked,
    });
  }, [isBlocked]);

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


     {/* 3. Disable Textarea using isBlocked */}
      <textarea
        disabled={isBlocked}
        value={answerText}
        onChange={(e) =>
          !isBlocked && setAnswerText(e.target.value)
        }
        onPaste={(e) => e.preventDefault()}
        rows={16}
        placeholder="Type your answer here..."
        className={`w-full p-4 text-[20px] border border-gray-300 ${
          isBlocked ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={{ resize: "vertical", minHeight: "250px" }}
      />

      <div className="border border-gray-900 rounded-b-lg">
        <Editor
          height="80vh"
          defaultLanguage="javascript"
          value={answerCode}
          theme="vs-dark"
          onMount={handleEditorMount}
          onChange={(value) =>
            !isBlocked && setAnswerCode(value ?? "")
          }
          options={{
            placeholder: "JavaScript Code",
            fontSize: 20,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
    </>
  );
};
