'use client';

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  useParseResume,
  useGenerateQuestions,
} from "../../../../features/AITest/hooks/aiTestApi";

import { FileUploadArea } from "../components/fileUploadArea";
import { PrimaryButton } from "../components/button";

interface Question {
    question: string;
}

export default function ResumeUploadPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const parseResume = useParseResume();
    const generateQuestions = useGenerateQuestions();

    const isProcessing = parseResume.isPending || generateQuestions.isPending;
    const fileName = file ? file.name : null;

    const handleProcessResume = async () => {
        if (!file) {
            console.log("❌ No file selected!");
            return;
        }

        try {
            console.log("📥 Sending file to parseResume hook...");
            const resumeText = await parseResume.mutateAsync(file);

            console.log("🚀 Sending resumeText to generateQuestions API...");
            const generatedQuestions = await generateQuestions.mutateAsync(resumeText) as Question[];

            if (Array.isArray(generatedQuestions)) {
                setQuestions(generatedQuestions);
                localStorage.setItem("interviewQuestions", JSON.stringify(generatedQuestions));
                console.log(`✅ Analysis complete! ${generatedQuestions.length} questions generated.`);
            } else {
                console.error("❌ ERROR: generateQuestions did NOT return an array.");
            }

        } catch (error) {
            console.error("🔥 ERROR in handleProcessResume():", error);
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
        setQuestions([]);
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        setQuestions([]);
    };
    
    const handleStartInterview = () => {
        router.push("/candidate/ai-test/questining");
    };

    return  (
  <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800 leading-tight">AI Interview Simulator</h1>
      <p className="text-sm text-gray-500 -mt-1">Resume Deep Dive</p>
    </div>

    {questions.length === 0 ? (
      <>
        <FileUploadArea
          fileName={fileName}
          isUploading={isProcessing}
          onFileSelect={handleFileChange}
          onRemove={handleRemoveFile}
          onAnalyzeClick={handleProcessResume}
          isDisabled={!file || isProcessing}
        />

        <div className="mt-3 text-center">
          {(parseResume.isError || generateQuestions.isError) && (
            <p className="text-red-600 font-semibold text-sm">
              ❌ Error: Failed to process resume or generate questions.
            </p>
          )}
        </div>
      </>
    ) : (
      <div className="max-w-xl mx-auto">
        <div className="mt-6 p-5 bg-teal-50 border-l-4 border-teal-600 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-teal-800 mb-3">
            ✅ Analysis Complete – {questions.length} Questions Generated
          </h3>

          <div className="space-y-2.5 text-left">
            {questions.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition"
              >
                <span className="font-bold text-gray-700">{i + 1}.</span>
                <p className="text-sm text-gray-700 leading-snug">{q.question.trim()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <PrimaryButton onClick={handleStartInterview} disabled={isProcessing}>
            Start Interview
          </PrimaryButton>
        </div>
      </div>
    )}
  </div>
);

}
