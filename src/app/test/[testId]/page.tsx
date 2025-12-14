"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useStartTest } from "@/features/test/hooks/useStartsTest";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import {
  Clock,
  Target,
  Trophy,
  Calendar,
  AlertCircle,
  BookOpen,
  CheckCircle,
} from "lucide-react";

interface TestQuestion {
  question: string;
  options?: string[];
}

interface StartTestResponse {
  attemptId: string;
  email: string;
  testId: string;
  startTime: string;
  questions: {
    test: {
      questions: TestQuestion[];
      duration?: number;
    };
  };
}

export default function StartTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.testId as string;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useStartTest();

  const handleStart = () => {
    const token = Cookies.get("access");

    if (!token) {
      router.push("/login"); 
      return;
    }

    localStorage.setItem("testId", testId);

    mutate(
      { testId },
      {
        onSuccess: (data: unknown, variables: { testId: string }) => {
          const response = data as StartTestResponse;

          localStorage.setItem("attemptId", response.attemptId);
          localStorage.setItem("email", response.email);
          localStorage.setItem("testId", response.testId);
          localStorage.setItem("startTime", response.startTime);

          const duration = response.questions?.test?.duration ?? 0;
          localStorage.setItem("duration", String(duration));

          const formattedQuestions =
            response.questions?.test?.questions?.map((q) => ({
              question: q.question.trim(),
              options: q.options ?? null,
              source: "test",
            })) || [];

          queryClient.setQueryData(["active-questions"], formattedQuestions);

          router.push("/candidate/ai-test/questining");
        },

        onError: () => {
          
        },
      }
    );
  };

  const test = {
    title: "Full-Stack Developer Assessment 2025",
    summary:
      "This exam evaluates your skills in React, Node.js, MongoDB, TypeScript & problem-solving.",
    category: "Technical Interview",
    duration: 90,
    passingScore: 75,
    showResults: true,
    createdBy: { name: "Sarah Johnson" },
    createdAt: "2025-03-15T10:30:00.000Z",
    prompt:
      "You have 90 minutes to complete this test. Timer will not pause. Auto-saving is enabled.",
  };

  const formatDuration = (m: number) =>
    m >= 60 ? `1h ${m - 60}m` : `${m}m`;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-lg border overflow-hidden">
        
        {/* LEFT SECTION */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-white rounded-full text-xs font-semibold text-blue-700">
                {test.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-green-700">
                <CheckCircle className="w-3.5 h-3.5" /> Active
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {test.title}
            </h1>
            <p className="text-gray-700 mb-6">{test.summary}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Clock className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDuration(test.duration)}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Target className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Passing</p>
                <p className="text-lg font-bold text-gray-900">
                  {test.passingScore}%
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Trophy className="w-7 h-7 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Results</p>
                <p className="text-lg font-bold text-gray-900">
                  {test.showResults ? "Instant" : "Later"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {test.createdBy.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <p className="text-xs text-gray-500">Created by</p>
                <p className="font-semibold">{test.createdBy.name}</p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-xs">{formatDate(test.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-10 flex flex-col justify-center">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Before You Begin</h2>
              <p className="text-gray-700">{test.prompt}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
            <div className="flex gap-4">
              <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Stable internet connection</li>
                <li>• Laptop/Desktop recommended</li>
                <li>• Do not refresh page</li>
                <li>• Auto-save active</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStart}
              disabled={isPending}
              className={`inline-flex items-center gap-3 px-10 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-1"
              }`}
            >
              {isPending ? "Starting..." : "Start Assessment →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
