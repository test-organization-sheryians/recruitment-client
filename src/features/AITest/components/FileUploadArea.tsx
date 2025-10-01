import React from "react";
import { Upload } from "lucide-react";

interface FileUploadAreaProps {
  isUploading: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  inputId: string;
  onFileChange: (file: File | undefined) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isUploading,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  inputId,
  onFileChange,
}) => {
  return (
    <div className="w-full">
      <div
        className={`bg-[#E9EFF7] border-dashed border-3 ${
          isDragging ? "border-[#4C62ED] bg-[#e0e9f7]" : "border-[#1270B0]"
        } rounded-lg p-8 text-center cursor-pointer transition-colors`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-white rounded-full">
            <Upload size={24} className="text-[#1270B0]" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag & drop your resume</p>
            <p className="text-sm text-zinc-500 mt-1">
              or <span className="text-[#1270B0] font-medium">browse</span> to
              upload
              <br />
              <span className="text-xs">(PDF, DOC, DOCX up to 5MB)</span>
            </p>
          </div>
        </div>
        <input
          id={inputId}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => onFileChange(e.target.files?.[0])}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
