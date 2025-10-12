"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface CodeEditorProps {
  language: string;
  code: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  height?: number;
  storageKey?: string;
}

const CodeEditor = ({
  language,
  code,
  onCodeChange,
  onLanguageChange,
  height = 256,
  storageKey,
}: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const languageConfigs = {
    javascript: {
      placeholder: "// Write your JavaScript code here",
      extension: "js",
    },
    python: { placeholder: "# Write your Python code here", extension: "py" },
    java: { placeholder: "// Write your Java code here", extension: "java" },
    cpp: { placeholder: "// Write your C++ code here", extension: "cpp" },
  };

  useEffect(() => {
    if (storageKey && code !== "") {
      localStorage.setItem(`${storageKey}_code`, code);
      localStorage.setItem(`${storageKey}_language`, language);
    }
  }, [code, language, storageKey]);

  useEffect(() => {
    if (storageKey) {
      const savedCode = localStorage.getItem(`${storageKey}_code`);
      const savedLanguage = localStorage.getItem(`${storageKey}_language`);

      if (savedCode) {
        onCodeChange(savedCode);
      }
      if (savedLanguage) {
        onLanguageChange(savedLanguage);
      }
    }
  }, [storageKey, onCodeChange, onLanguageChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onCodeChange(newCode);

    const lines = newCode.split("\n").length || 1;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      onCodeChange(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const lines = code.split("\n").length || 1;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  return (
    <div className="rounded-lg border border-gray-300 bg-[#0d1117] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            solution.
            {languageConfigs[language as keyof typeof languageConfigs]
              ?.extension || "txt"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-xs bg-gray-800 text-gray-300 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div
        className="relative flex font-mono text-sm"
        style={{ height: `${height}px` }}
      >
        <div
          ref={lineNumbersRef}
          className="flex-none py-3 px-3 text-right text-gray-500 bg-gray-900 select-none border-r border-gray-700 overflow-hidden"
          style={{
            lineHeight: "1.5",
            minWidth: "50px",
          }}
        >
          {lineNumbers.map((lineNumber) => (
            <div
              key={lineNumber}
              className="text-gray-500 pr-2"
              style={{ lineHeight: "1.5" }}
            >
              {lineNumber}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder={
              languageConfigs[language as keyof typeof languageConfigs]
                ?.placeholder
            }
            className="absolute inset-0 w-full h-full py-3 px-3 text-neutral-300 bg-transparent caret-white resize-none outline-none whitespace-pre overflow-auto"
            spellCheck="false"
            style={{
              lineHeight: "1.5",
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              tabSize: 2,
            }}
          />

          <pre
            ref={preRef}
            className="py-3 px-3 h-full overflow-auto bg-[#0d1117] pointer-events-none"
            style={{ lineHeight: "1.5" }}
          >
            <code
              className={`language-${language} block whitespace-pre`}
              dangerouslySetInnerHTML={{
                __html: code
                  ? hljs.highlight(code, { language }).value
                  : `<span class="text-gray-500">${
                      languageConfigs[language as keyof typeof languageConfigs]
                        ?.placeholder
                    }</span>`,
              }}
            />
          </pre>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400 flex justify-between">
        <span>
          Line: {code.split("\n").length}, Column:{" "}
          {code.split("\n").pop()?.length || 0}
        </span>
        <span>{language.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default CodeEditor;
