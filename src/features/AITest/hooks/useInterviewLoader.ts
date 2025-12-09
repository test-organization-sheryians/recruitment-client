"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface Question {
  id: string;
  question: string;
}

export default function useInterviewLoader() {
  const router = useRouter();

  const query = useQuery<Question[]>({
    queryKey: ["interview-questions"],
    queryFn: async () => {
      const stored = localStorage.getItem("interviewQuestions");

      if (!stored) {
        router.push("/candidate/resume-upload");
        throw new Error("No interview questions found");
      }

      return JSON.parse(stored);
    },
    staleTime: 0,
    gcTime: 0,
  });

  return {
    questions: query.data || [],
    loaded: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
