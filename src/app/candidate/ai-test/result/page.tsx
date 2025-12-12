"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("resumeResult");
    if (!raw) return router.push("/candidate/ai-test");

    setData(JSON.parse(raw));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-4">AI Resume Interview Result</h2>

      <p className="text-lg font-bold">Score: {data.score}</p>
      <p className="text-lg font-bold mb-4">Percentage: {data.percentage}%</p>

      <pre className="bg-black text-white p-4 rounded">
{JSON.stringify(
  {
    questions: data.questions,
    answers: data.answers,
  },
  null,
  2
)}
      </pre>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          sessionStorage.removeItem("resumeResult");
          router.push("/candidate/ai-test");
        }}
      >
        Done
      </button>
    </div>
  );
}
