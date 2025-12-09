"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useParseResume,
  useGenerateQuestions,
} from "../../../../features/AITest/hooks/aiTestApi";

import { FileUploadArea } from "../../../../features/AITest/components/fileUploadArea";
import { PrimaryButton } from "../../../../features/AITest/components/button";

interface Question {
  question: string;
}

export default function ResumeUploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const parseResume = useParseResume();
  const generateQuestions = useGenerateQuestions();

  const isProcessing = parseResume.isPending || generateQuestions.isPending;
  const fileName = file ? file.name : null;

  /** =========================================
   *   PROCESS RESUME → GENERATE QUESTIONS
   * ========================================= */
  const handleProcessResume = async () => {
    if (!file) return;

    try {
      const resumeText = await parseResume.mutateAsync(file);
      const generatedQuestions = await generateQuestions.mutateAsync(resumeText);

      if (Array.isArray(generatedQuestions)) {
        setQuestions(generatedQuestions);

        /** 🧠 Store in ONE key ONLY */
        queryClient.setQueryData(["active-questions"], generatedQuestions);

        console.log(`🎯 ${generatedQuestions.length} AI interview questions ready`);
      }

    } catch (error) {
      console.error("❌ Resume processing failed:", error);
    }
  };

  /** =========================================
   *   ON FILE SELECT → RESET QUESTIONS
   * ========================================= */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setQuestions([]);

    /** 🧹 Clear old interview data completely */
    queryClient.removeQueries({ queryKey: ["active-questions"] });
  };

  /** =========================================
   *   REMOVE FILE → CLEAR EVERYTHING
   * ========================================= */
  const handleRemoveFile = () => {
    setFile(null);
    setQuestions([]);

    queryClient.removeQueries({ queryKey: ["active-questions"] });
  };

  /** =========================================
   *   START INTERVIEW →
   *   active-questions already set, just start
   * ========================================= */
  const handleStartInterview = () => {
    router.push("/candidate/ai-test/questining");
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Interview Simulator
        </h1>
        <p className="text-sm text-gray-500 -mt-1">Resume Deep Dive</p>
      </div>

      {questions.length === 0 ? (
        <FileUploadArea
          fileName={fileName}
          isUploading={isProcessing}
          onFileSelect={handleFileChange}
          onRemove={handleRemoveFile}
          onAnalyzeClick={handleProcessResume}
          isDisabled={!file || isProcessing}
        />
      ) : (
        <div>
          <div className="mt-6 p-5 bg-teal-50 border-l-4 border-teal-600 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-teal-800 mb-3">
              {questions.length} Questions Generated 🎯
            </h3>
            <div className="space-y-2.5">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 bg-white border rounded-md hover:bg-gray-50"
                >
                  <span className="font-bold">{i + 1}.</span>
                  <p className="text-sm text-gray-700">{q.question.trim()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <PrimaryButton onClick={handleStartInterview}>
              Start Interview
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
