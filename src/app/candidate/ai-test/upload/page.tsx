"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useParseResume,
  useGenerateQuestions,
} from "@/features/AITest/hooks/aiTestApi";

import { FileUploadArea } from "@/features/AITest/components/fileUploadArea";
import { PrimaryButton } from "@/features/AITest/components/button";

export default function ResumeUploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState([]);

  const parseResume = useParseResume();
  const generateQuestions = useGenerateQuestions();

  const handleProcessResume = async () => {
    if (!file) return;

    try {
      const text = await parseResume.mutateAsync(file);
      const generated = await generateQuestions.mutateAsync(text);

      const tagged = generated.map((q: any) => ({
        question: q.question,
        source: "ai",
      }));

      setQuestions(tagged);
      queryClient.setQueryData(["active-questions"], tagged);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = () => router.push("/candidate/ai-test/questining");

  return (
    <div>
      <PrimaryButton onClick={handleStart}>Start Interview</PrimaryButton>
    </div>
  );
}
