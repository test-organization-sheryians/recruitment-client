"use client";

import React from "react";
import { Test } from "@/types/Test";
import { Clock, CheckCircle, Calendar, ArrowLeft, Award } from "lucide-react";
import Link from "next/link";

interface Props {
  test: Test;
}

const SingleTestDetail = ({ test }: Props) => {
  const attempt = test.attempt;

  const renderStatus = () => {
    if (!attempt) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Enrolled · Not Started
        </span>
      );
    }

    if (attempt.status === "Started") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
          Test In Progress
        </span>
      );
    }

    if (attempt.status === "Graded") {
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            attempt.isPassed
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {attempt.isPassed ? "Passed" : "Failed"}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tests"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Tests
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-8 border-b">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {test.title}
              </h1>
              {renderStatus()}
            </div>

            <p className="text-gray-600">
              {test.summury || "No summary available."}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x bg-gray-50">
            <div className="p-6 text-center">
              <Clock className="mx-auto mb-2 text-blue-500" />
              <div className="font-bold">
                {test.duration > 1000 ? "Unlimited" : test.duration} min
              </div>
            </div>

            <div className="p-6 text-center">
              <CheckCircle className="mx-auto mb-2 text-green-500" />
              <div className="font-bold">{test.passingScore}%</div>
            </div>

            <div className="p-6 text-center">
              <Calendar className="mx-auto mb-2 text-orange-500" />
              <div className="font-bold">
                {new Date(test.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* RESULT SECTION */}
          {attempt?.status === "Graded" && test.showResults && (
            <div className="p-8 border-t bg-green-50">
              <h3 className="flex items-center gap-2 text-lg font-bold mb-2">
                <Award /> Test Result
              </h3>
              <p>
                Score: <b>{attempt.score}</b>
              </p>
              <p>
                Percentage: <b>{attempt.percentage}%</b>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleTestDetail;
