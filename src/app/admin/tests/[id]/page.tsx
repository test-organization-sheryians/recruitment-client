"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestDetails({ params }: any) {
  const { id } = params;
  const router = useRouter();

  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);

  // -------------------- DUMMY DATA --------------------
  const dummyTest = {
    id,
    title: "JavaScript Basics Test",
    summury: "This is a dummy test summary for testing UI.",
    duration: 30,
  };

  const dummyAttempts = [
    {
      _id: "1",
      email: { name: "John Doe", email: "john@example.com" },
      score: 18,
      percentage: 60,
      isPassed: true,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 20 * 60000).toISOString(),
      durationTaken: 20,
    },
    {
      _id: "2",
      email: { name: "Aman Patel", email: "aman@example.com" },
      score: 10,
      percentage: 33,
      isPassed: false,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 25 * 60000).toISOString(),
      durationTaken: 25,
    },
  ];

  // -----------------------------------------------------

  useEffect(() => {
    async function fetchData() {
      try {
        const [attemptRes, testRes] = await Promise.all([
          fetch(`/api/testAttempts/${id}`),
          fetch(`/api/tests/${id}`),
        ]);

        const attemptsData = await attemptRes.json();
        const testData = await testRes.json();

        setAttempts(attemptsData.length ? attemptsData : dummyAttempts);
        setTest(testData?.title ? testData : dummyTest);

        setLoading(false);
      } catch (err) {
        console.log("API error → using dummy data");
        setAttempts(dummyAttempts);
        setTest(dummyTest);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 text-lg font-medium">
        Loading...
      </p>
    );

  // ---- HEADER CALCULATIONS ----
  const totalStudents = attempts.length;
  const passedStudents = attempts.filter((a) => a.isPassed).length;
  const passPercentage =
    totalStudents > 0
      ? Math.round((passedStudents / totalStudents) * 100)
      : 0;

  const avgDuration =
    totalStudents > 0
      ? (
          attempts.reduce((sum, a) => sum + (a.durationTaken || 0), 0) /
          totalStudents
        ).toFixed(1)
      : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ---------------- HEADER CARD ---------------- */}
      <div className="bg-white border shadow-lg rounded-2xl p-6 space-y-4 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6 text-gray-600 hover:text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{test?.title}</h1>
        <p className="text-gray-600">{test?.summury}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{totalStudents}</h3>
            <p className="text-sm text-gray-600">Students Attempted</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{passPercentage}%</h3>
            <p className="text-sm text-gray-600">Pass Percentage</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{avgDuration} min</h3>
            <p className="text-sm text-gray-600">Avg Duration</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <h3 className="text-xl font-bold">{test?.duration} min</h3>
            <p className="text-sm text-gray-600">Test Duration</p>
          </div>
        </div>
      </div>

      {/* ---------------- ATTEMPTS LIST ---------------- */}
      <div className="space-y-4">
        {attempts.map((a) => (
          <div
            key={a._id}
            className="border shadow-md rounded-2xl p-4 bg-white"
          >
            <div className="grid grid-cols-2 gap-4">

              <p>
                <b>Name:</b> {a.email?.name || "N/A"}
              </p>

              <p>
                <b>Email:</b> {a.email?.email || "N/A"}
              </p>

              <p>
                <b>Score:</b> {a.score}
              </p>

              <p>
                <b>Percentage:</b> {a.percentage}%
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  className={`ml-1 px-2 py-1 rounded text-white text-sm ${
                    a.isPassed ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {a.isPassed ? "Passed" : "Failed"}
                </span>
              </p>

              <p>
                <b>Started:</b> {new Date(a.startTime).toLocaleString()}
              </p>

              <p>
                <b>Ended:</b>{" "}
                {a.endTime ? new Date(a.endTime).toLocaleString() : "—"}
              </p>

              <p>
                <b>Duration Taken:</b> {a.durationTaken} mins
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
