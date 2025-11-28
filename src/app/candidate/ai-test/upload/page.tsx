// app/candidate/test/resume/page.tsx or similar
'use client';

import { useState, useCallback, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  useParseResume,
  useGenerateQuestions,
} from "../features/hooks/aiTestApi";

// --- UI Components (Simplified Tailwind-inspired styling based on image) ---

const FileUploadArea: React.FC<{ 
    fileName: string | null; 
    isUploading: boolean; 
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void; 
    onRemove: () => void; 
    // Button handlers moved here for initial state rendering
    onAnalyzeClick: () => void; 
    isDisabled: boolean; 
}> = ({ fileName, isUploading, onFileSelect, onRemove, onAnalyzeClick, isDisabled }) => (
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
                <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-teal-500 mb-4 transition-transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
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
            <button 
                onClick={onAnalyzeClick} 
                disabled={isDisabled}
                className={`mt-6 w-full py-3 text-lg font-semibold text-white rounded-lg shadow-md transition duration-300 
                    ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}
                `}
            >
                {isUploading ? 'Analyzing Resume...' : 'Analyze & Start Interview'}
            </button>
        </div>
        
        <p className="text-center mt-4 text-sm text-gray-400">
            Upload your resume, and our AI will analyze your experience to generate 6 personalized interview questions.
        </p>
    </div>
);

const PrimaryButton: React.FC<{ 
    onClick: () => void; 
    disabled: boolean; 
    children: React.ReactNode; 
}> = ({ onClick, disabled, children }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`mt-6 w-full py-3 text-lg font-semibold text-white rounded-lg shadow-md transition duration-300 
            ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}
        `}
    >
        {children}
    </button>
);
// ------------------------------------

export default function ResumeUploadPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const parseResume = useParseResume();
    const generateQuestions = useGenerateQuestions();

    const isProcessing = parseResume.isPending || generateQuestions.isPending;
    const fileName = file ? file.name : null;

    // --- Core Logic (Unchanged as per requirement) ---
    const handleProcessResume = async () => {
        if (!file) {
            console.log("❌ No file selected!");
            return;
        }

        try {
            console.log("📥 Sending file to parseResume hook...");
            const resumeText = await parseResume.mutateAsync(file);

            console.log("🚀 Sending resumeText to generateQuestions API...");
            const generatedQuestions = await generateQuestions.mutateAsync(resumeText);

            if (Array.isArray(generatedQuestions)) {
                setQuestions(generatedQuestions);
                localStorage.setItem("interviewQuestions", JSON.stringify(generatedQuestions));
                console.log(`✅ Analysis complete! ${generatedQuestions.length} questions generated.`);
            } else {
                 console.error("❌ ERROR: generateQuestions did NOT return an array.");
            }

        } catch (error: any) {
            console.error("🔥 ERROR in handleProcessResume():", error);
        }
    };
    
    // --- UI Handlers ---

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
        setQuestions([]); // Clear questions if a new file is selected
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        setQuestions([]); // Clear questions on remove
    };
    
    const handleStartInterview = () => {
        router.push("/candidate/ai-test/questining");
    };

    // --- Render ---

    return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">AI Interview Simulator</h1>
                <p className="text-md text-gray-500">Resume Deep Dive</p>
            </div>
            
            {questions.length === 0 && (
                /* 1. Show Upload Dashboard (Initial State, Processing, or Error) */
                <>
                    <FileUploadArea
                        fileName={fileName}
                        isUploading={isProcessing}
                        onFileSelect={handleFileChange}
                        onRemove={handleRemoveFile}
                        onAnalyzeClick={handleProcessResume} // Trigger core logic from this component
                        isDisabled={!file || isProcessing}
                    />
                    {/* Status Messages */}
                    <div className="mt-4 text-center">
                        {(parseResume.isError || generateQuestions.isError) && (
                            <p className="text-red-600 font-semibold text-sm">
                                ❌ Error: Failed to process resume or generate questions.
                            </p>
                        )}
                    </div>
                </>
            )}

            {questions.length > 0 && (
                /* 2. Show Question Preview Dashboard (Success State) */
                <div className="max-w-xl mx-auto">
                    <div className="mt-8 p-6 bg-teal-50 border-l-4 border-teal-600 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-teal-800 mb-4">✅ Analysis Complete! {questions.length} Questions Generated</h3>
                        
                        <div className="space-y-3">
                            {questions.map((q: any, i: number) => (
                                <p key={i} className="text-sm text-gray-700">
                                    <span className="font-bold">{i + 1}.</span> {q?.question}
                                </p>
                            ))}
                        </div>
                    </div>
                    
                    {/* Button to Start Interview */}
                    <div className="text-center">
                        <PrimaryButton onClick={handleStartInterview} disabled={isProcessing}>
                            Start Interview
                        </PrimaryButton>
                    </div>
                </div>
            )}
        </div>
    );
}