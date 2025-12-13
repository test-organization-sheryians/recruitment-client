import React, { ChangeEvent } from "react";
import { PrimaryButton } from "../components/button"; // Adjust path as necessary

interface FileUploadAreaProps {
    fileName: string | null;
    isUploading: boolean;
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    onAnalyzeClick: () => void;
    isDisabled: boolean;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
    fileName,
    isUploading,
    onFileSelect,
    onRemove,
    onAnalyzeClick,
    isDisabled,
}) => (
    <div className="max-w-xl mx-auto">
        {/* Upload Box */}
        <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <input
                type="file"
                id="file-upload"
                accept=".pdf,.docx"
                onChange={onFileSelect}
                className="hidden"
                disabled={isUploading}
            />
            <label
                htmlFor="file-upload"
                className={`cursor-pointer block ${isUploading ? 'opacity-60' : 'hover:bg-gray-100'}`}
            >
                <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-blue-500 mb-4 transition-transform hover:scale-105">
                    <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                    Upload Resume (PDF, DOCX)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    or drag and drop your file here
                </p>
            </label>

            {fileName && (
                <div className="mt-6 flex items-center justify-center space-x-2 p-2 bg-white border border-gray-200 rounded-lg">
                    <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-3a1 1 0 100 2h2a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-sm text-gray-800">{fileName}</span>
                    <button
                        onClick={onRemove}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        disabled={isUploading}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>

        {/* Analyze Button */}
        <div className="text-center">
            <PrimaryButton
                onClick={onAnalyzeClick}
                disabled={isDisabled}
            >
                {isUploading ? 'Analyzing Resume...' : 'Analyze & Start Interview'}
            </PrimaryButton>
        </div>

        <p className="text-center mt-4 text-sm text-gray-400">
            Upload your resume, and our AI will analyze your experience to generate 6 personalized interview questions.
        </p>
    </div>
);