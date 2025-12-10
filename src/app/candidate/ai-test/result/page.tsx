"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const data = sessionStorage.getItem("evaluationResult");
    if (data) {
      try {
        setResult(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse result:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] to-[#F6F7FB] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] to-[#F6F7FB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No evaluation results found</p>
          <button
            onClick={() => router.push("/ai-test")}
            className="px-6 py-2 bg-[#1E47FF] text-white rounded-lg hover:bg-[#375FFF]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] to-[#F6F7FB] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#1E47FF] mb-6">Evaluation Results</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <pre className="overflow-auto text-sm max-h-[80vh]">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>

        <button
          onClick={() => router.push("/ai-test")}
          className="mt-6 px-6 py-2 bg-[#1E47FF] text-white rounded-lg hover:bg-[#375FFF]"
        >
          Take Another Test
        </button>
      </div>
    </div>
  );
}