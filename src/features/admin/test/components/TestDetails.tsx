"use client";

import React, { useState } from "react";
import { useGetTest } from "@/features/admin/test/hooks/useTest";
import AttemptsSection from "./AttemptsSection";

// Define proper TypeScript interfaces
interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface Enrollment {
  _id: string;
  email: string;
  status: "passed" | "failed" | "pending" | string;
  isPassed?: boolean;
}

interface Test {
  _id: string;
  title: string;
  summury: string;
  duration: number;
  passingScore: number;
  enrollments: Enrollment[];
  enrolledUsers: User[];
}

interface Attempt extends Enrollment {
  user?: User;
}

interface TestDetailsProps {
  testId: string;
  onClose: () => void;
}

export default function TestDetails({ testId, onClose }: TestDetailsProps) {
  const id = testId;

  const [activeTab, setActiveTab] = useState<"enrollments" | "attempts">(
    "enrollments"
  );

  const { data: test, isLoading } = useGetTest(id);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        Test not found.
      </div>
    );
  }

  const testData = test as Test;
  
  const attempts: Attempt[] = testData.enrollments.map((enroll: Enrollment) => {
    const user = testData.enrolledUsers.find((u: User) => u.email === enroll.email);
    return { ...enroll, user };
  });

  const totalStudents = attempts.length;

  const passedStudents = attempts.filter(
    (a: Attempt) => a.status === "passed" || a.isPassed
  ).length;

  const passPercentage =
    totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[950px] max-h-[90vh] overflow-y-auto relative">

        {/* SAME CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          ✕
        </button>

        {/* SAME HEADER */}
        <h1 className="text-3xl font-bold">{testData.title}</h1>
        <p className="text-gray-600">{testData.summury}</p>

        {/* SAME STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{totalStudents}</h3>
            <p className="text-sm text-gray-600">Students Enrolled</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{passPercentage}%</h3>
            <p className="text-sm text-gray-600">Pass Rate</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{testData.duration} min</h3>
            <p className="text-sm text-gray-600">Test Duration</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{testData.passingScore}</h3>
            <p className="text-sm text-gray-600">Passing Score</p>
          </div>
        </div>

        {/* SAME TABS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setActiveTab("enrollments")}
            className={`px-5 py-2 rounded-lg border ${
              activeTab === "enrollments" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            Enrollments
          </button>

          <button
            onClick={() => setActiveTab("attempts")}
            className={`px-5 py-2 rounded-lg border ${
              activeTab === "attempts" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            Attempts
          </button>
        </div>

        {/* SAME ENROLLMENTS */}
        {activeTab === "enrollments" && (
          <div className="space-y-4 mt-4">
            {attempts.map((a: Attempt) => (
              <div key={a._id} className="border shadow-md rounded-2xl p-4 bg-white">
                <div className="grid grid-cols-2 gap-3">

                  <p><b>Name:</b> {a.user ? `${a.user.firstName} ${a.user.lastName}` : "Unknown User"}</p>
                  <p><b>Email:</b> {a.email}</p>
                  <p><b>Phone:</b> {a.user?.phoneNumber || "N/A"}</p>

                  <p
                  className="flex items-center gap-2 "
                  ><b>Status:</b>
                  
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium border
                        ${
                          a.status === "passed"
                            ? "bg-green-50 text-green-700 border-green-400"
                            : a.status === "failed"
                            ? "bg-red-50 text-red-700 border-red-400"
                            : "bg-yellow-50 text-yellow-700 border-yellow-400"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full 
                          ${
                            a.status === "passed"
                              ? "bg-green-600"
                              : a.status === "failed"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          }`}
                      ></span>

                      {a.status}
                    </span>
                  </p>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* SAME ATTEMPTS */}
        {activeTab === "attempts" && <AttemptsSection testId={id} />}
      </div>
    </div>
  );
}