"use client";

import { CheckCircle, ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestSubmittedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-lg border rounded-3xl p-10 max-w-lg w-full text-center">

        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Test Submitted Successfully 
        </h1>

        <p className="text-gray-600 text-md mb-6">
          Your responses have been securely recorded.  
          <br />Thank you for completing the assessment.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-gray-700 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            You may now close this window or return to your dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/tests")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 py-3 rounded-xl text-lg font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            Home <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
