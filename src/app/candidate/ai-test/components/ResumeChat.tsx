'use client';

import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isQuestion?: boolean;
}

const FileUpload = ({ onFileChange }: { onFileChange: (file: File) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100 w-fit">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-blue-500" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" 
            clipRule="evenodd" 
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-900">{file?.name || 'No file chosen'}</p>
          <p className="text-xs text-gray-500">{file ? `${(file.size / 1024).toFixed(0)} KB` : 'PDF, DOCX, TXT (max 5MB)'}</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
        >
          {file ? 'Change' : 'Browse'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
        />
      </div>
    </div>
  );
};

export default function ResumeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Review my resume & prepare the question curated from my resume.',
      sender: 'user',
    },
    {
      id: '2',
      text: 'These are the 3 curated questions from your resume:',
      sender: 'ai',
    },
  ]);
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const handleFileUpload = (file: File) => {
    setResumeFile(file);
    // Here you would typically handle the file upload to your server
    console.log('File uploaded:', file.name);
  };
  const [inputValue, setInputValue] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [code, setCode] = useState('');

  const questions = [
    'How to implement RazorPay?',
    'How to implement authentication?',
    'How to optimize React performance?',
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! How can I assist you further?',
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    setCurrentQuestion(question);
    setShowCodeModal(true);
  };

  const handleCodeSubmit = () => {
    // Handle code submission
    console.log('Code submitted:', code);
    setShowCodeModal(false);
    setCode('');
  };

  // Avatar component
  const Avatar = ({ isAI = false }: { isAI?: boolean }) => (
    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isAI ? 'bg-purple-100' : 'bg-blue-100'}`}>
      {isAI ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10a1 1 0 01-1.64 0l-7-10A1 1 0 014 7h4V2a1 1 0 011.3-.954z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-120px)]">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            {message.sender === 'ai' ? (
              // AI Message
              <div className="flex items-start gap-3">
                <Avatar isAI />
                <div className="flex-1">
                  <div className="text-gray-800 max-w-[80%]">
                    <p className="font-medium">{message.text}</p>
                  </div>
                  
                  {message.id === '2' && (
                    <div className="mt-4 space-y-3 flex flex-col items-start w-[50%]">
                      {questions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                          className="w-full text-left p-3 bg-[#ebf0f8] text-black rounded-md border border-blue-200 hover:bg-[#d9e0eb] transition-colors flex items-start gap-3"
                        >
                          <span className="font-medium text-black">{index + 1}.</span>
                          <span className="text-left">{question}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // User Message
              <div className="flex items-start justify-end gap-3">
                <div className="flex flex-col items-end max-w-[80%]">
                  <div className="bg-[#d9e8ff] text-black rounded-lg p-3 rounded-br-none">
                    <p>{message.text}</p>
                    {message.id === '1' && (
                      <FileUpload onFileChange={handleFileUpload} />
                    )}
                  </div>
                </div>
                <Avatar />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white sticky bottom-0">
        <div className="flex justify-center">
          <div className="flex w-full max-w-2xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#ebf0f8]"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium">{currentQuestion}</h3>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-2 font-mono text-sm border rounded"
                placeholder="Write your code here..."
              />
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCodeModal(false);
                  setCode('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCodeSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
