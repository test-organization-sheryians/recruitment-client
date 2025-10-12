"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  onFileChange: (file: File) => void;
  className?: string;
}

const FileUpload = ({ onFileChange, className = "" }: FileUploadProps) => {
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
    <div className={`mt-2 ${className}`}>
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
          <p className="text-sm font-medium text-gray-900">
            {file?.name || "No file chosen"}
          </p>
          <p className="text-xs text-gray-500">
            {file
              ? `${(file.size / 1024).toFixed(0)} KB`
              : "PDF, DOCX, TXT (max 5MB)"}
          </p>
        </div>
        {/*  <button
          onClick={() => fileInputRef.current?.click()}
          className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
        >
          {file ? 'Change' : 'Browse'}
        </button> */}
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

export default FileUpload;
