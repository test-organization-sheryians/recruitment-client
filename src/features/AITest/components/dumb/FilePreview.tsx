import React from "react";
import { FileUp, X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  uploadProgress: number;
  isUploading: boolean;
  onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  uploadProgress,
  isUploading,
  onRemove,
}) => {
  return (
    <div className="border-2 border-[#1270B0] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileUp className="text-blue-500" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        {!isUploading && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isUploading && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-right mt-1 text-gray-600">
            {Math.round(uploadProgress)}% uploaded
          </p>
        </div>
      )}
    </div>
  );
};