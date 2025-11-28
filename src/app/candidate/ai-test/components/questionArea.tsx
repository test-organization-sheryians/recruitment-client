import React from "react";
import Editor from "@monaco-editor/react";

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
}) => (
  <>
    
    <div className="bg-white p-6 rounded-t-xl border border-gray-200 mb-0 shadow-sm">
      <p className="text-xl font-medium text-gray-700">{questionText}</p>
    </div>

    
<textarea
  value={answerText}
  onChange={(e) => setAnswerText(e.target.value)}
  rows={8}  // ← bigger height
  placeholder="Type your explanation or general answer here..."
  disabled={isPending}
  className="w-full p-4 text-[20px] leading-relaxed border border-gray-300 
             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
             rounded-b-none rounded-t-none"
  style={{ resize: "vertical", minHeight: "150px" }}  
/>


 
    <div className="border border-gray-900 rounded-b-lg mt-0">
    <Editor
  height="400px"  
  defaultLanguage="javascript"
  value={answerCode}
  theme="vs-dark"
  onChange={(value) => setAnswerCode(value || "")}
  options={{
    fontSize: 20,              
    minimap: { enabled: false }, 
    automaticLayout: true,
    scrollBeyondLastLine: false,
    tabSize: 2,
    lineNumbers: "on",
    wordWrap: "on",             
    smoothScrolling: true,
  
    contextmenu: true,
  }}
  className="rounded-lg"
/>

    </div>
  </>
);