'use client';

import { useState } from 'react';
import CodeEditor from './CodeEditor';

interface TestCase {
  input: string;
  output: string;
}

interface Question {
  id: string;
  question: string;
  topics: string[];
  constraints: string;
  testCases: TestCase[];
  explanation: string;
}

interface CodeModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string, language: string) => void;
}

const CodeModal = ({ question, isOpen, onClose, onSubmit }: CodeModalProps) => {
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(code, language);
    setCode('');
    setLanguage('javascript');
  };

  const handleClose = () => {
    setCode('');
    setLanguage('javascript');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-300 bg-opacity-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-lg font-medium mb-2">{question.question}</h3>
          <div className="text-sm text-gray-600">
            <p><strong>Topics:</strong> {question.topics.join(', ')}</p>
            <p><strong>Constraints:</strong> {question.constraints}</p>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Test Cases:</h4>
            <div className="space-y-2">
              {question.testCases.map((testCase, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                  <div><strong>Input:</strong> {testCase.input}</div>
                  <div><strong>Output:</strong> {testCase.output}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <CodeEditor
              language={language}
              code={code}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              height={320}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Explanation:</strong> {question.explanation}</p>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;