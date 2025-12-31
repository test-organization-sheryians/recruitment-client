"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useStartTest } from "@/features/test/hooks/useStartsTest";
import { 
  Clock, Target, Trophy, Calendar, AlertCircle, BookOpen, CheckCircle 
} from "lucide-react";
import axios from "axios";

const StartTestPage: React.FC = () => {
  const router = useRouter();
  const { mutate, isPending } = useStartTest();

  const test = {
    _id: "64f8a1b2c9d1e2f3a4b5c6d7",
    title: "Full-Stack Developer Assessment 2025",
    summary:
      "This comprehensive exam evaluates your proficiency in modern web development...",
    category: "Technical Interview",
    duration: 90,
    passingScore: 75,
    showResults: true,
    createdBy: { name: "Sarah Johnson" },
    createdAt: "2025-03-15T10:30:00.000Z",
    prompt:
      "You have 90 minutes to complete this assessment. Once started, the timer cannot be paused.",
  };

  const handleStart = () => {
    mutate({ testId: test._id }, {
      onSuccess: (data) => {
        // data.attemptId will come from backend
        router.push(`/test/${data.attemptId}`);
      },
     onError: (error: unknown) => {
  let message = "Failed to start test. Please try again.";

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  alert(message);
},
    });
  };

  const formatDuration = (mins: number) =>
    mins >= 60 ? `1h ${mins - 60}m` : `${mins}m`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="px-4 py-1 bg-white text-blue-700 rounded-full text-xs font-semibold">
                {test.category}
              </span>
              <span className="text-xs font-medium text-green-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Active
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {test.title}
            </h1>
            <p className="text-sm text-gray-700 mb-8">{test.summary}</p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-white rounded-xl p-4 text-center">
                <Clock className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Duration</p>
                <p className="text-lg font-bold">{formatDuration(test.duration)}</p>
              </div>

              <div className="bg-white rounded-xl p-4 text-center">
                <Target className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Passing</p>
                <p className="text-lg font-bold">{test.passingScore}%</p>
              </div>

              <div className="bg-white rounded-xl p-4 text-center">
                <Trophy className="w-7 h-7 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Results</p>
                <p className="text-lg font-bold">
                  {test.showResults ? "Instant" : "Later"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                SJ
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

        {/* RIGHT SIDE */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Before You Begin</h2>
              <p className="text-sm text-gray-700">{test.prompt}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-gray-700 mb-10">
            <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
            • Stable internet<br />
            • Use laptop recommended<br />
            • Do not refresh page<br />
            • Answers auto-save
          </div>

          <div className="text-center">
            <button
              onClick={handleStart}
              disabled={isPending}
              className={`inline-flex items-center gap-3 px-10 py-4 text-lg font-bold rounded-xl text-white transition-all shadow-lg ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              {isPending ? "Starting..." : "Start Assessment →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTestPage;
