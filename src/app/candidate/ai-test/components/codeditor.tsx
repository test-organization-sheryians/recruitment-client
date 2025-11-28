import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div className="h-[500px]">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Start typing..."
        theme="vs-dark"
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
