"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { useStartTest } from "@/features/test/hooks/useStartsTest";
import { useTestInfo } from "@/features/test/hooks/testInfo";

import {
  Clock,
  Target,
  Trophy,
  Calendar,
  AlertCircle,
  BookOpen,
  CheckCircle,
} from "lucide-react";

/* ================= PAGE ================= */

export default function StartTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.testId as string;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useStartTest();

  /* 🔥 FETCH TEST INFO */
  const {
    data: test,
    isLoading,
    isError,
  } = useTestInfo(testId);

  /* ================= START TEST ================= */

  const handleStart = () => {
    const token = Cookies.get("access");

    if (!token) {
      router.push("/login");
      return;
    }

    mutate(
      { testId },
      {
        onSuccess: (response: any) => {
          localStorage.setItem("attemptId", response.attemptId);
          localStorage.setItem("email", response.email);
          localStorage.setItem("testId", response.testId);
          localStorage.setItem("startTime", response.startTime);

          const duration = response.questions?.test?.duration ?? 0;
          localStorage.setItem("duration", String(duration));

          const formattedQuestions =
            response.questions?.test?.questions?.map((q: any) => ({
              question: q.question.trim(),
              options: q.options?.length ? q.options : undefined,
              source: "test",
            })) || [];

          queryClient.setQueryData(
            ["active-questions"],
            formattedQuestions
          );

          router.push("/candidate/ai-test/questining");
        },
      }
    );
  };

  /* ================= UI STATES ================= */

  if (isLoading) {
    return (
      <p className="p-10 text-center text-gray-600">
        Loading test details…
      </p>
    );
  }

  if (isError || !test) {
    return (
      <p className="p-10 text-center text-red-500">
        Failed to load test information
      </p>
    );
  }

  /* ================= HELPERS ================= */

  const formatDuration = (m: number) =>
    m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const creatorName = test.createdBy?.name ?? "Unknown";
  const creatorInitials = creatorName.slice(0, 2).toUpperCase();

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-lg border overflow-hidden">
        {/* LEFT SECTION */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-white rounded-full text-xs font-semibold text-blue-700">
              {test.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-green-700">
              <CheckCircle className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-3">{test.title}</h1>
          <p className="text-gray-700 mb-6">{test.summary}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Stat
              icon={<Clock className="w-7 h-7 text-blue-600 mx-auto" />}
              label="Duration"
              value={formatDuration(test.duration)}
            />
            <Stat
              icon={<Target className="w-7 h-7 text-emerald-600 mx-auto" />}
              label="Passing"
              value={`${test.passingScore}%`}
            />
            <Stat
              icon={<Trophy className="w-7 h-7 text-purple-600 mx-auto" />}
              label="Results"
              value={ "Later"}
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {creatorInitials}
            </div> */}

            {/* <div>
              <p className="text-xs text-gray-500">Created by</p>
              <p className="font-semibold">{creatorName}</p>
            </div> */}

            <div className="ml-auto flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs">
                {formatDate(test.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-10 flex flex-col justify-center">
          <div className="flex gap-4 mb-6">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold mb-2">
                Before You Begin
              </h2>
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
              className={`px-10 py-4 text-white font-bold text-lg rounded-xl ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
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

/* ================= SMALL COMPONENT ================= */

const Stat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
    {icon}
    <p className="text-sm text-gray-600 mt-1">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);
