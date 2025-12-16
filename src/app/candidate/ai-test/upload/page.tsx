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


interface GeneratedQuestion {
  question: string;
}


interface Question {
  question: string;
  source?: string;
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

  const handleProcessResume = async () => {
    if (!file) return;

    try {
      console.log("Parsing resume...");
      const resumeText = await parseResume.mutateAsync(file);

      console.log("Generating questions from resume...");
      const generated = await generateQuestions.mutateAsync(resumeText);

      if (Array.isArray(generated)) {
      const aiQuestions = generated.map((q: GeneratedQuestion) => ({
  question: q.question.trim(),
  source: "ai",
}));


        setQuestions(aiQuestions);

        queryClient.setQueryData(["active-questions"], aiQuestions);

      
        localStorage.setItem("interviewQuestions", JSON.stringify(aiQuestions));

        console.log("Resume Questions Saved:", aiQuestions);
      } else {
        console.error("ERROR: generateQuestions did not return an array");
      }
    } catch (error) {
      console.error("ERROR during processing:", error);
    }
  };

  /** FILE SELECTED */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setQuestions([]);

    /** Remove old questions */
    queryClient.removeQueries({ queryKey: ["active-questions"] });
  };

  /** REMOVE FILE */
  const handleRemoveFile = () => {
    setFile(null);
    setQuestions([]);
    queryClient.removeQueries({ queryKey: ["active-questions"] });
  };

  /** START INTERVIEW → GO TO QUESTION PAGE */
  const handleStartInterview = () => {
    router.push("/candidate/ai-test/questining");
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Interview Simulator</h1>
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
        </>
      ) : (
        <div className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow">
          <h3 className=" font-semibold text-blue-800 mb-3">
            {questions.length} Questions Generated 
          </h3>

          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={i} className="p-2 text-sm bg-white border rounded-md">
                <strong>{i + 1}.</strong> {q.question}
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <PrimaryButton onClick={handleStartInterview} disabled={false}>
  Start Interview
</PrimaryButton>

          </div>
        </div>
      )}
    </div>
  );
}
