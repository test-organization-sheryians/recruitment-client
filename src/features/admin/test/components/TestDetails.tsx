"use client";

import { useState } from "react";
import { useGetTest } from "@/features/admin/test/hooks/useTest";
import AttemptsSection from "./AttemptsSection";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
  status: "passed" | "failed" | "pending" | "Disqualified"; // Added Disqualified
  isPassed?: boolean;
  tabSwitches?: number; // Added this here too
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
  tabSwitches?: number;
}

interface TestDetailsProps {
  testId: string;
  onClose?: () => void;
}


const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "passed":
    case "Graded":
      return (
        <span className="bg-emerald-50 text-emerald-700 border-emerald-200 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border w-fit">
          <CheckCircle size={14}/> Passed
        </span>
      );
    case "Disqualified":
      return (
        <span className="bg-red-100 text-red-700 border-red-200 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border w-fit">
          <AlertTriangle size={14}/> Disqualified
        </span>
      );
    case "failed":
      return (
        <span className="bg-red-50 text-red-700 border-red-200 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border w-fit">
          <XCircle size={14}/> Failed
        </span>
      );
    default:
      return (
        <span className="bg-yellow-50 text-yellow-700 border-yellow-200 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border w-fit">
          Pending
        </span>
      );
  }
};
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[70vw] max-h-[90vh] overflow-y-auto relative">

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
    {attempts.map((a: Attempt) => {
      const statusStyles =
    a.status === "passed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : a.status === "failed"
      ? "bg-red-50 text-red-700 border-red-200"
      : a.status === "Disqualified"
      ? "bg-red-600 text-white border-red-700" // Stand out for cheating
      : "bg-yellow-50 text-yellow-700 border-yellow-200";

  const dotStyles =
    a.status === "passed"
      ? "bg-emerald-500"
      : a.status === "Disqualified"
      ? "bg-white animate-pulse" // White pulse on red background
      : a.status === "failed"
      ? "bg-red-500"
      : "bg-yellow-500";

      return (
        <div
          key={a._id}
          className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">

            {/* NAME */}
            <div>
              <p className="text-[11px] uppercase text-gray-400 font-bold">
                Name
              </p>
              <p className="font-medium text-gray-900">
                {a.user
                  ? `${a.user.firstName} ${a.user.lastName}`
                  : "Unknown User"}
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <p className="text-[11px] uppercase text-gray-400 font-bold">
                Email
              </p>
              <p className="text-gray-600 break-all">{a.email}</p>
            </div>

            {/* PHONE */}
            <div>
              <p className="text-[11px] uppercase text-gray-400 font-bold">
                Phone
              </p>
              <p className="text-gray-700">
                {a.user?.phoneNumber || "N/A"}
              </p>
            </div>

            {/* STATUS */}
<div className="flex flex-col justify-center">
  <p className="text-[11px] uppercase text-gray-400 font-bold mb-1">
    Status
  </p>

  {/* The Badge */}
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border w-fit shadow-sm ${statusStyles}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${dotStyles}`} />
    {a.status}
  </span>

  {/* The Integrity Flag - No more 'as any'! */}
  {a.tabSwitches !== undefined && a.tabSwitches > 0 && (
    <div className="mt-1.5 flex items-center gap-1 text-red-600 font-black text-[10px] uppercase">
      <AlertTriangle size={12} className="shrink-0" />
      <span>{a.tabSwitches} Violations</span>
    </div>
  )}
</div>

          </div>
        </div>
      );
    })}
  </div>
)}


        {/* SAME ATTEMPTS */}
        {activeTab === "attempts" && <AttemptsSection testId={id} />}
      </div>
    </div>
  );
}