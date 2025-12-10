"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTest } from "@/features/admin/test/hooks/useTest";
import AttemptsSection from "./AttemptsSection";

export default function TestDetails({ params }: any) {

  const { id } = params;
  const router = useRouter();

  // ✅ TAB STATE
  const [activeTab, setActiveTab] = useState<"enrollments" | "attempts">(
    "enrollments"
  );

  // ---------------- FETCH TEST ----------------
  const { data: test, isLoading } = useGetTest(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center text-red-600 font-medium p-6">
        Test not found.
      </div>
    );
  }

  // ---------------- MAP ENROLLMENTS WITH USERS ----------------
  const attempts = test.enrollments.map((enroll: any) => {
    const user = test.enrolledUsers.find(
      (u: any) => u.email === enroll.email
    );
    return { ...enroll, user };
  });


  const totalStudents = attempts.length;

  const passedStudents = attempts.filter(
    (a: any) => a.status === "passed" || a.isPassed
  ).length;

  const passPercentage =
    totalStudents > 0
      ? Math.round((passedStudents / totalStudents) * 100)
      : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">


      <div className="bg-white border shadow-lg rounded-2xl p-6 space-y-4 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold">{test.title}</h1>
        <p className="text-gray-600">{test.summury}</p>

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
            <h3 className="text-xl font-bold">{test.duration} min</h3>
            <p className="text-sm text-gray-600">Test Duration</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{test.passingScore}</h3>
            <p className="text-sm text-gray-600">Passing Score</p>
          </div>
        </div>
      </div>

      
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab("enrollments")}
          className={`px-5 py-2 rounded-lg border ${
            activeTab === "enrollments"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          Enrollments
        </button>

        <button
          onClick={() => setActiveTab("attempts")}
          className={`px-5 py-2 rounded-lg border ${
            activeTab === "attempts"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          Attempts
        </button>
      </div>

      
      {activeTab === "enrollments" && (
        <div className="space-y-4">
          {attempts.map((a: any) => (
            <div
              key={a._id}
              className="border shadow-md rounded-2xl p-4 bg-white"
            >
              <div className="grid grid-cols-2 gap-4">

                <p>
                  <b>Name:</b>{" "}
                  {a.user
                    ? `${a.user.firstName} ${a.user.lastName}`
                    : "Unknown User"}
                </p>

                <p>
                  <b>Email:</b> {a.email}
                </p>

                <p>
                  <b>Phone:</b> {a.user?.phoneNumber || "N/A"}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      a.status === "passed"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </p>

                <p>
                  <b>Created:</b>{" "}
                  {new Date(a.createdAt).toLocaleString()}
                </p>

                <p>
                  <b>Updated:</b>{" "}
                  {new Date(a.updatedAt).toLocaleString()}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}

      
      {activeTab === "attempts" && <AttemptsSection testId={id} />}

    </div>
  );
}
