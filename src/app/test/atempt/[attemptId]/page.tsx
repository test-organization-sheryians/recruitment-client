"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AttemptTestPage() {
  const { attemptId } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number | null }>({});

  // Load stored data
  useEffect(() => {
    const storedQuestions = localStorage.getItem("currentTestQuestions");
    const storedDuration = localStorage.getItem("currentTestDuration");

    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
    if (storedDuration) {
      const totalSeconds = Number(storedDuration) * 60;
      setDuration(totalSeconds);
      setTimeLeft(totalSeconds);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    setResponses({ ...responses, [qIndex]: optionIndex });
  };

  const handleSubmit = () => {
    console.log("📨 Final Answers:", responses);

    alert("Test Submitted!");
    // TODO: send to backend -> evaluate & save
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Assessment In Progress</h1>
        <div className="text-xl font-semibold text-red-500">
          ⏳ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q: any, index: number) => (
          <div key={index} className="p-4 bg-white shadow rounded">
            <h2 className="font-semibold text-lg">
              {index + 1}. {q.question}
            </h2>

            <div className="mt-3 space-y-2">
              {q.options.map((opt: string, oIdx: number) => (
                <label
                  key={oIdx}
                 // className={`block p-2 border rounded cursor-pointer ${
                  //   responses[index] === oIdx
                  //     ? "bg-blue-100 border-blue-400"
                  //     : "hover:bg-gray-100"
                  // }`}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    className="mr-2"
                    checked={responses[index] === oIdx}
                    onChange={() => handleOptionSelect(index, oIdx)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Btn */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
         // className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
