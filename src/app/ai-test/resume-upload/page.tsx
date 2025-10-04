"use client";
import { useState } from "react";
import { FileUp } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the ResumeChat component with SSR disabled
const ResumeChat = dynamic(
  () => import('../components/ResumeChat'),
  { ssr: false }
);

const ResumeUpload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [fileUploaded, setFileUploaded] = useState(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setFileUploaded(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setResumeUploaded(true), 500);
        }
      }, 100);
    }
  };

  if (!resumeUploaded) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h2 className="text-4xl font-medium text-center mb-8">Resume Upload</h2>
          
          <div className="w-full">
            <label htmlFor="resume" className="w-full">
              <div className="bg-[#E9EFF7] border-dashed border-3 border-[#1270B0] w-full aspect-5/2 rounded-lg flex flex-col gap-2 items-center justify-center cursor-pointer hover:bg-[#E0E8F0] transition-colors">
                <div>
                  <FileUp size={80} className="text-zinc-500" />
                </div>
                <p className="text-zinc-600">
                  Drag and drop or <span className="text-[#1270B0] font-medium">browse</span> your files
                </p>
                <p className="text-sm text-zinc-500 mt-2">PDF, DOCX, or TXT (max 5MB)</p>
              </div>
            </label>
            <input
              type="file"
              id="resume"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
          </div>

          {resume && (
            <div className="mt-6 border-2 border-[#1270B0] p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">{resume.name}</p>
                <span className="text-sm text-gray-500">{fileUploaded}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-[#4C62ED] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${fileUploaded}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b p-6">
        <h2 className="text-2xl font-semibold">AI Assistant</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <ResumeChat />
      </div>
    </div>
  );
};

export default ResumeUpload;
