"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import dynamic from "next/dynamic";

const ResumeChat = dynamic(() => import("../components/ResumeChat"), {
  ssr: false,
});

const ResumeUpload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResume(file);

    let val = 0;
    const interval = setInterval(() => {
      val += 5;
      setProgress(val);

      if (val >= 100) {
        clearInterval(interval);
        setTimeout(() => setUploaded(true), 400);
      }
    }, 80);
  };

  /* ---------------- UPLOAD SCREEN ---------------- */
  if (!uploaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl space-y-6">

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-900">
            Upload Your Resume
          </h2>

          {/* Upload Box */}
          <label htmlFor="resume" className="block w-full cursor-pointer">
            <div
              className="
                w-full
                rounded-xl
                border-2 border-dashed border-blue-500
                bg-blue-50
                hover:bg-blue-100
                transition
                flex flex-col items-center justify-center
                gap-3
                py-10 sm:py-14
              "
            >
              <FileUp className="w-10 h-10 sm:w-14 sm:h-14 text-gray-500" />

              <p className="text-sm sm:text-base text-gray-600 text-center">
                Drag & drop or{" "}
                <span className="text-blue-600 font-medium">
                  browse files
                </span>
              </p>

              <p className="text-xs text-gray-400">
                PDF, DOCX, TXT (max 5MB)
              </p>
            </div>
          </label>

          <input
            id="resume"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
          />

          {/* Progress */}
          {resume && (
            <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">

              <div className="flex justify-between text-sm">
                <p className="font-medium truncate max-w-[70%]">
                  {resume.name}
                </p>
                <span className="text-gray-500">{progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- CHAT SCREEN ---------------- */
  return (
    <div className="w-full h-screen flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          AI Resume Assistant
        </h2>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ResumeChat />
      </div>
    </div>
  );
};

export default ResumeUpload;